import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Streak Freeze Price ID - Replace with actual live price ID
const STREAK_FREEZE_PRICE_ID = Deno.env.get("STREAK_FREEZE_PRICE_ID") || "price_streak_freeze";

const logStep = (step: string, details?: Record<string, unknown>) => {
  const sanitized = details ? Object.fromEntries(
    Object.entries(details).map(([key, value]) => {
      if (key === 'email') return [key, '[redacted]'];
      if (key === 'userId' || key === 'customerId' || key === 'sessionId') {
        return [key, typeof value === 'string' ? value.slice(0, 8) + '...' : value];
      }
      return [key, value];
    })
  ) : undefined;
  const detailsStr = sanitized ? ` - ${JSON.stringify(sanitized)}` : '';
  console.log(`[STREAK-FREEZE] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id });

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    // Check if a Stripe customer exists for this email
    let customerId: string | undefined;
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing Stripe customer", { hasCustomer: true });
    }

    // Create checkout session for streak freeze (one-time payment)
    const origin = req.headers.get("origin") || "https://lovable.dev";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        product_type: "streak_freeze",
      },
      line_items: [
        {
          price: STREAK_FREEZE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/dashboard?streak_restored=true`,
      cancel_url: `${origin}/dashboard?streak_cancelled=true`,
    });

    logStep("Checkout session created", { hasUrl: !!session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
