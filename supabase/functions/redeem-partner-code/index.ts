import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { code } = await req.json();
    if (!code || typeof code !== "string") {
      return json({ error: "Code manquant" }, 400);
    }
    const normalized = code.trim().toUpperCase();

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Non authentifié" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await anonClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Non authentifié" }, 401);
    const user = userData.user;

    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false },
    });

    // 1. Fetch code
    const { data: partnerCode, error: codeErr } = await admin
      .from("partner_codes")
      .select("*")
      .eq("code", normalized)
      .maybeSingle();

    if (codeErr || !partnerCode) return json({ error: "Code invalide" }, 404);
    if (!partnerCode.is_active) return json({ error: "Code désactivé" }, 400);
    if (partnerCode.expires_at && new Date(partnerCode.expires_at) < new Date()) {
      return json({ error: "Code expiré" }, 400);
    }
    if (partnerCode.max_uses && partnerCode.used_count >= partnerCode.max_uses) {
      return json({ error: "Ce code a atteint sa limite d'utilisations" }, 400);
    }

    // 2. Prevent double redemption
    const { data: existing } = await admin
      .from("code_redemptions")
      .select("id")
      .eq("code_id", partnerCode.id)
      .eq("user_id", user.id)
      .maybeSingle();
    if (existing) return json({ error: "Vous avez déjà utilisé ce code" }, 400);

    // 3. Grant premium
    const grantedUntil = new Date();
    grantedUntil.setMonth(grantedUntil.getMonth() + (partnerCode.duration_months || 6));

    // Extend if user already has premium expiring later
    const { data: profile } = await admin
      .from("profiles")
      .select("premium_expires_at, has_premium")
      .eq("user_id", user.id)
      .single();

    let finalUntil = grantedUntil;
    if (profile?.premium_expires_at && new Date(profile.premium_expires_at) > grantedUntil) {
      finalUntil = new Date(profile.premium_expires_at);
    }

    const { error: updateErr } = await admin
      .from("profiles")
      .update({ has_premium: true, premium_expires_at: finalUntil.toISOString() })
      .eq("user_id", user.id);
    if (updateErr) throw updateErr;

    // 4. Record redemption + increment counter
    await admin.from("code_redemptions").insert({
      code_id: partnerCode.id,
      user_id: user.id,
      granted_until: finalUntil.toISOString(),
    });
    await admin
      .from("partner_codes")
      .update({ used_count: partnerCode.used_count + 1 })
      .eq("id", partnerCode.id);

    return json({
      success: true,
      partner_name: partnerCode.partner_name,
      months: partnerCode.duration_months,
      expires_at: finalUntil.toISOString(),
    });
  } catch (e) {
    console.error("[redeem-partner-code]", e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
