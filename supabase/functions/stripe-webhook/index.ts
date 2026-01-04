import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

// Sanitized logging - never log full emails or user IDs
const logStep = (step: string, details?: Record<string, unknown>) => {
  const sanitized = details ? Object.fromEntries(
    Object.entries(details).map(([key, value]) => {
      if (key === 'email' || key === 'customerEmail') {
        return [key, typeof value === 'string' ? '[redacted]' : value];
      }
      if (key === 'userId' || key === 'customerId' || key === 'sessionId' || key === 'subscriptionId') {
        return [key, typeof value === 'string' ? value.slice(0, 8) + '...' : value];
      }
      return [key, value];
    })
  ) : undefined;
  const detailsStr = sanitized ? ` - ${JSON.stringify(sanitized)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

// Simple email format validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

serve(async (req) => {
  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SIGNING_SECRET");

    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    if (!endpointSecret) throw new Error("STRIPE_WEBHOOK_SIGNING_SECRET is not set");

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("No stripe-signature header");
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
      logStep("Event verified", { type: event.type });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logStep("Signature verification failed");
      return new Response(`Webhook signature verification failed: ${message}`, { status: 400 });
    }

    // Create admin Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Handle checkout session completed - subscription or one-time payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      logStep("Checkout session completed", { 
        sessionId: session.id,
        hasClientRef: !!session.client_reference_id,
        mode: session.mode
      });

      const userId = session.client_reference_id;
      const customerEmail = session.customer_email || session.customer_details?.email;
      const customerId = session.customer as string;

      let targetUserId = userId;

      // If no userId, try to find user by email
      if (!targetUserId && customerEmail) {
        if (!isValidEmail(customerEmail)) {
          logStep("Invalid email format, skipping email lookup");
          return new Response(JSON.stringify({ received: true }), { status: 200 });
        }

        logStep("No userId, searching by email");
        const { data: users } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("email", customerEmail)
          .limit(1);

        if (users && users.length > 0) {
          targetUserId = users[0].id;
          logStep("Found user by email", { userId: targetUserId });
        }
      }

      if (!targetUserId) {
        logStep("No user found to update for");
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      // Handle LIFETIME / One-time payment
      if (session.mode === 'payment') {
        logStep("Processing lifetime/one-time payment");
        
        // Update profiles with lifetime access
        const { error: profileError } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_tier: 'lifetime',
            is_lifetime: true,
            subscription_start_date: new Date().toISOString(),
          })
          .eq("id", targetUserId);

        if (profileError) {
          logStep("Error updating profile for lifetime", { error: profileError.message });
        } else {
          logStep("Profile updated with lifetime access");
        }

        // Update subscriptions table for lifetime
        const { error: subError } = await supabaseAdmin
          .from("subscriptions")
          .upsert({
            user_id: targetUserId,
            status: 'lifetime',
            stripe_customer_id: customerId,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });

        if (subError) {
          logStep("Error updating subscriptions for lifetime", { error: subError.message });
        } else {
          logStep("Subscriptions table updated for lifetime");
        }

        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      // Handle subscription checkout
      if (session.mode === 'subscription') {
        const subscriptionId = session.subscription as string;
        
        // Get subscription details for period info
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price.id;
        
        // Determine tier based on price interval
        const interval = subscription.items.data[0]?.price.recurring?.interval;
        const subscriptionTier = interval === 'year' ? 'pro_yearly' : 'pro_monthly';

        // Update profiles with subscription info and start date
        const { error: profileError } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_tier: subscriptionTier,
            subscription_start_date: new Date().toISOString(),
            is_lifetime: false,
          })
          .eq("id", targetUserId);

        if (profileError) {
          logStep("Error updating profile subscription", { error: profileError.message });
        } else {
          logStep("Profile subscription updated", { tier: subscriptionTier });
        }

        // Update subscriptions table
        const { error: subError } = await supabaseAdmin
          .from("subscriptions")
          .upsert({
            user_id: targetUserId,
            status: 'active',
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });

        if (subError) {
          logStep("Error updating subscriptions table", { error: subError.message });
        } else {
          logStep("Subscriptions table updated", { subscriptionId });
        }
      }
    }

    // Handle subscription updates (plan changes)
    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      logStep("Subscription updated", { subscriptionId: subscription.id, status: subscription.status });

      const { data: subRecord } = await supabaseAdmin
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_subscription_id", subscription.id)
        .maybeSingle();

      if (subRecord?.user_id) {
        const interval = subscription.items.data[0]?.price.recurring?.interval;
        const subscriptionTier = interval === 'year' ? 'pro_yearly' : 'pro_monthly';

        await supabaseAdmin
          .from("profiles")
          .update({ subscription_tier: subscriptionTier })
          .eq("id", subRecord.user_id);

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: subscription.status === 'active' ? 'active' : subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        logStep("Subscription record updated");
      }
    }

    // Handle subscription cancellation
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      logStep("Subscription deleted", { subscriptionId: subscription.id });

      const { data: subRecord } = await supabaseAdmin
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_subscription_id", subscription.id)
        .maybeSingle();

      if (subRecord?.user_id) {
        await supabaseAdmin
          .from("profiles")
          .update({ 
            subscription_tier: 'free',
            // Keep subscription_start_date for historical purposes
          })
          .eq("id", subRecord.user_id);

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        logStep("Subscription canceled and user downgraded to free");
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
  }
});
