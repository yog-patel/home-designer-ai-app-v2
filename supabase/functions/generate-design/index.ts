import "https://deno.land/x/cors/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, content-type, apikey",
};

serve(async (req: any) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, imageUrl, prompt, roomType, style, palette, negativePrompt } = await req.json();

    if (!userId || !imageUrl || !prompt) {
      return new Response(
        JSON.stringify({ error: "Missing userId, imageUrl, or prompt" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const replicateApiKey = Deno.env.get("REPLICATE_API_KEY");
    if (!replicateApiKey) {
      return new Response(
        JSON.stringify({ error: "Replicate API key not configured" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Step 1: Create prediction on Replicate
    const createResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${replicateApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "06d6fae3b75ab68a28cd2900afa6033166910dd09fd9751047043a5bbb4c184b",
        input: {
          image: imageUrl,
          prompt: prompt,
          negative_prompt: negativePrompt || "blurry, distorted, ugly, low quality, artifacts",
          num_inference_steps: 25,
          guidance_scale: 7.0,
          control_scale: 1.0,
        },
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      console.error("Replicate error:", error);
      return new Response(
        JSON.stringify({ error: `Replicate API error: ${createResponse.status}` }),
        { status: 500, headers: corsHeaders }
      );
    }

    const prediction = await createResponse.json();
    const predictionId = prediction.id;

    // Step 2: Poll for completion
    let completed = false;
    let output: any = null;
    let attempts = 0;
    const maxAttempts = 120; // 2-minute timeout

    while (!completed && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${predictionId}`,
        {
          headers: {
            "Authorization": `Token ${replicateApiKey}`,
          },
        }
      );

      const status = await statusResponse.json();

      if (status.status === "succeeded") {
        // Handle different output formats
        if (Array.isArray(status.output)) {
          output = status.output[0];
        } else if (typeof status.output === 'string') {
          output = status.output;
        } else if (status.output?.image) {
          output = status.output.image;
        } else {
          output = status.output;
        }
        console.log("Generated output:", output);
        completed = true;
      } else if (status.status === "failed") {
        return new Response(
          JSON.stringify({ error: status.error || "Generation failed" }),
          { status: 400, headers: corsHeaders }
        );
      }

      attempts++;
    }

    if (!completed) {
      return new Response(
        JSON.stringify({ error: "Generation timeout - took too long" }),
        { status: 408, headers: corsHeaders }
      );
    }

    if (!output) {
      return new Response(
        JSON.stringify({ error: "No output generated" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Step 3: Save design to database
    const { data: design, error: insertError } = await supabase
      .from("designs")
      .insert([{
        user_id: userId,
        original_image: imageUrl,
        generated_image: output,
        prompt: prompt,
        room_type: roomType,
        style: style,
        palette: palette,
      }])
      .select()
      .single();

    if (insertError) {
      console.error("Database error:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save design" }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        designId: design.id,
        imageUrl: output,
        design: design,
      }),
      { 
        status: 200, 
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: corsHeaders }
    );
  }
});
