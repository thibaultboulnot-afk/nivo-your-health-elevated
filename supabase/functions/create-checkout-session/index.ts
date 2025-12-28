import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Mapping des programmes vers leurs price IDs Stripe
const PROGRAM_PRICE_IDS: Record<string, string> = {
  RAPID_PATCH: "price_1ShEYJJZ4N5U4jZs7OB0pPLh",
  SYSTEM_REBOOT: "price_1ShEiXJZ4N5U4jZsv9PBnuPg",
  ARCHITECT_MODE: "price_1ShEjwJZ4N5U4jZsAeT4acHR",
};

// Sanitized logging - never log full emails or user IDs
const logStep = (step: string, details?: Record<string, unknown>) => {
  const sanitized = details ? Object.fromEntries(
    Object.entries(details).map(([key, value]) => {
      if (key === 'email') {
        return [key, '[redacted]'];
      }
      if (key === 'userId' || key === 'customerId' || key === 'sessionId') {
        return [key, typeof value === 'string' ? value.slice(0, 8) + '...' : value];
      }
      return [key, value];
    })
  ) : undefined;
  const detailsStr = sanitized ? ` - ${JSON.stringify(sanitized)}` : '';
  console.log(`[CREATE-CHECKOUT-SESSION] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    // Parse request body
    const { programId } = await req.json();
    logStep("Request body parsed", { programId });

    if (!programId || !PROGRAM_PRICE_IDS[programId]) {
      throw new Error(`Invalid program ID: ${programId}`);
    }

    const priceId = PROGRAM_PRICE_IDS[programId];
    logStep("Price ID resolved", { priceId });

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Try to get authenticated user (optional - supports guest checkout)
    const authHeader = req.headers.get("Authorization");
    let userEmail: string | undefined;
    let userId: string | undefined;
    let customerId: string | undefined;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      if (data.user) {
        userId = data.user.id;
        userEmail = data.user.email;
        logStep("User authenticated", { hasUser: true });
      }
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    // Check if a Stripe customer exists for this email
    if (userEmail) {
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Found existing Stripe customer", { hasCustomer: true });
      }
    }

    // Create a one-time payment session
    const origin = req.headers.get("origin") || "https://lovable.dev";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      client_reference_id: userId, // Link session to user for webhook
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&program=${programId}`,
      cancel_url: `${origin}/checkout?plan=${programId}`,
      metadata: {
        programId,
      },
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
