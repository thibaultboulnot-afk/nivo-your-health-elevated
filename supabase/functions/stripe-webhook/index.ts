import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
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
      logStep("Signature verification failed", { error: message });
      return new Response(`Webhook signature verification failed: ${message}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      logStep("Checkout session completed", { 
        sessionId: session.id,
        customerEmail: session.customer_email,
        clientReferenceId: session.client_reference_id,
        metadata: session.metadata
      });

      const programId = session.metadata?.programId;
      const userId = session.client_reference_id;
      const customerEmail = session.customer_email || session.customer_details?.email;

      if (!programId) {
        logStep("No programId in metadata, skipping");
        return new Response(JSON.stringify({ received: true }), { status: 200 });
      }

      // Create admin Supabase client
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
      );

      let targetUserId = userId;

      // If no userId, try to find user by email
      if (!targetUserId && customerEmail) {
        logStep("No userId, searching by email", { email: customerEmail });
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

      if (targetUserId) {
        // Check if progression exists
        const { data: existingProgression } = await supabaseAdmin
          .from("user_progression")
          .select("id")
          .eq("user_id", targetUserId)
          .eq("program_id", programId)
          .single();

        if (existingProgression) {
          // Update existing progression
          const { error: updateError } = await supabaseAdmin
            .from("user_progression")
            .update({ unlocked: true })
            .eq("user_id", targetUserId)
            .eq("program_id", programId);

          if (updateError) {
            logStep("Error updating progression", { error: updateError.message });
          } else {
            logStep("Progression unlocked", { userId: targetUserId, programId });
          }
        } else {
          // Insert new progression
          const { error: insertError } = await supabaseAdmin
            .from("user_progression")
            .insert({
              user_id: targetUserId,
              program_id: programId,
              unlocked: true,
              current_day: 1,
              streak_count: 0
            });

          if (insertError) {
            logStep("Error inserting progression", { error: insertError.message });
          } else {
            logStep("New progression created", { userId: targetUserId, programId });
          }
        }
      } else {
        logStep("No user found to unlock program for", { customerEmail });
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
