import "https://deno.land/x/cors/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, content-type, apikey",
};

serve(async (req: any) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, action } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing userId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Try to get existing usage record
    let { data: usage, error: selectError } = await supabase
      .from("usage")
      .select("*")
      .eq("user_id", userId)
      .single();

    // If no record exists, create one
    if (selectError && selectError.code === "PGRST116") {
      const { data: newUsage, error: insertError } = await supabase
        .from("usage")
        .insert([{
          user_id: userId,
          designs_generated: 0,
          is_premium: false,
        }])
        .select()
        .single();

      if (insertError) {
        console.error("Insert error:", insertError);
        return new Response(
          JSON.stringify({ error: "Failed to create user record" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      usage = newUsage;
    } else if (selectError) {
      console.error("Select error:", selectError);
      return new Response(
        JSON.stringify({ error: "Database error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle check action
    if (action === "check") {
      const isPremium = usage?.is_premium && 
        (!usage?.premium_expires_at || new Date(usage.premium_expires_at) > new Date());

      const designsGenerated = usage?.designs_generated || 0;
      const allowed = isPremium || designsGenerated < 3;

      return new Response(
        JSON.stringify({
          allowed,
          reason: allowed ? "ok" : "free_tier_exhausted",
          designs_generated: designsGenerated,
          remaining: Math.max(0, 3 - designsGenerated),
          is_premium: isPremium,
        }),
        { 
          status: allowed ? 200 : 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Handle increment action
    if (action === "increment") {
      const newCount = (usage?.designs_generated || 0) + 1;
      
      const { error: updateError } = await supabase
        .from("usage")
        .update({ designs_generated: newCount })
        .eq("user_id", userId);

      if (updateError) {
        console.error("Update error:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update usage" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          designs_generated: newCount,
          remaining: Math.max(0, 3 - newCount),
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Unknown action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
