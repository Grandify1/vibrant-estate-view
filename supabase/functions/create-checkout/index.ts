
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { plan, coupon_code } = await req.json();
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.log("No authorization header found");
      // For now, continue without user - we'll use a default email
    }

    let user = null;
    let userEmail = "guest@example.com"; // Default for non-authenticated users

    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        user = data.user;
        if (user?.email) {
          userEmail = user.email;
        }
        console.log("User authenticated:", user?.email);
      } catch (authError) {
        console.log("Auth error, proceeding as guest:", authError);
      }
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Plan pricing
    const planPricing = {
      starter: { amount: 1900, name: "Starter Paket" }, // €19.00 in cents
      professional: { amount: 3900, name: "Professional Paket" }, // €39.00 in cents
    };

    const selectedPlan = planPricing[plan as keyof typeof planPricing];
    if (!selectedPlan) {
      throw new Error("Invalid plan selected");
    }

    // Check if customer exists
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { 
              name: selectedPlan.name,
              description: `ImmoUpload ${selectedPlan.name} - Monatliches Abonnement`
            },
            unit_amount: selectedPlan.amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/auth?tab=register&plan=${plan}&payment=success`,
      cancel_url: `${req.headers.get("origin")}/payment?plan=${plan}`,
      metadata: {
        plan: plan,
        coupon_code: coupon_code || "",
        user_id: user?.id || "guest",
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
