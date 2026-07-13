import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

// Public endpoint — Stripe calls it without a JWT. Signature verification below
// is the authentication mechanism, so do NOT require Supabase auth.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const log = (step: string, details?: unknown) => {
  const suffix = details ? ` ${JSON.stringify(details)}` : "";
  console.log(`[stripe-webhook] ${step}${suffix}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey || !webhookSecret) {
    log("missing config", { hasStripe: !!stripeKey, hasWebhook: !!webhookSecret });
    return new Response("Server not configured", { status: 500, headers: corsHeaders });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400, headers: corsHeaders });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch (err) {
    log("invalid signature", { message: (err as Error).message });
    return new Response("Invalid signature", { status: 400, headers: corsHeaders });
  }

  log("event received", { type: event.type, id: event.id });

  // Service role — we're server-to-server, bypass RLS to update the profile.
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status !== "paid") {
        log("session not paid, skipping", { id: session.id, status: session.payment_status });
        return new Response(JSON.stringify({ received: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      // Prefer metadata.user_id (set in create-payment). Fall back to email lookup.
      let userId = session.metadata?.user_id ?? null;

      if (!userId) {
        const email =
          session.customer_details?.email ||
          session.customer_email ||
          null;
        if (email) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("user_id")
            .eq("email", email)
            .maybeSingle();
          userId = profile?.user_id ?? null;
        }
      }

      if (!userId) {
        log("no user match, cannot activate premium", { session_id: session.id });
        // Return 200 so Stripe doesn't retry forever — nothing we can do.
        return new Response(JSON.stringify({ received: true, matched: false }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      // Upsert purchase row (create-payment may have inserted a pending one).
      const { data: existing } = await supabase
        .from("user_purchases")
        .select("id")
        .eq("stripe_session_id", session.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("user_purchases")
          .update({ status: "completed" })
          .eq("id", existing.id);
      } else {
        await supabase.from("user_purchases").insert({
          user_id: userId,
          stripe_session_id: session.id,
          status: "completed",
        });
      }

      await supabase
        .from("profiles")
        .update({ has_premium: true })
        .eq("user_id", userId);

      log("premium activated", { userId, session_id: session.id });
    } else {
      log("ignored event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    log("handler error", { message: (err as Error).message });
    // 500 → Stripe will retry
    return new Response(JSON.stringify({ error: "Handler failure" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
