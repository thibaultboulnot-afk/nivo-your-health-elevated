import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Product definitions
const PRODUCTS = [
  {
    name: "NIVO Lifetime Founder",
    description: "Accès à vie à NIVO PRO - Édition Fondateur",
    metadata: { type: "lifetime" },
    price: {
      unit_amount: 14900, // 149€
      currency: "eur",
    }
  },
  {
    name: "NIVO Streak Freeze",
    description: "Module de Réparation Temporel - Restaure votre série",
    metadata: { type: "streak_freeze" },
    price: {
      unit_amount: 299, // 2.99€
      currency: "eur",
    }
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    const results = [];

    for (const productDef of PRODUCTS) {
      // Check if product already exists by name
      const existingProducts = await stripe.products.search({
        query: `name:'${productDef.name}'`,
        limit: 1,
      });

      let product: Stripe.Product;
      let price: Stripe.Price;

      if (existingProducts.data.length > 0) {
        product = existingProducts.data[0];
        console.log(`[INIT] Product already exists: ${product.name} (${product.id})`);
        
        // Get the active price
        const prices = await stripe.prices.list({
          product: product.id,
          active: true,
          limit: 1,
        });
        
        if (prices.data.length > 0) {
          price = prices.data[0];
        } else {
          // Create price if none exists
          price = await stripe.prices.create({
            product: product.id,
            unit_amount: productDef.price.unit_amount,
            currency: productDef.price.currency,
          });
        }
      } else {
        // Create new product
        product = await stripe.products.create({
          name: productDef.name,
          description: productDef.description,
          metadata: productDef.metadata,
        });
        console.log(`[INIT] Created product: ${product.name} (${product.id})`);

        // Create price for the product
        price = await stripe.prices.create({
          product: product.id,
          unit_amount: productDef.price.unit_amount,
          currency: productDef.price.currency,
        });
        console.log(`[INIT] Created price: ${price.id}`);
      }

      results.push({
        type: productDef.metadata.type,
        product_id: product.id,
        price_id: price.id,
        amount: productDef.price.unit_amount,
        currency: productDef.price.currency,
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      products: results 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[INIT] Error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
