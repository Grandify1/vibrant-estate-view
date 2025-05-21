
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CompanyData {
  name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  logo?: string | null;
}

interface RequestBody {
  companyData: CompanyData;
  userId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get request body
    const body: RequestBody = await req.json();
    const { companyData, userId } = body;

    if (!userId || !companyData.name) {
      return new Response(
        JSON.stringify({ 
          error: "Benutzer-ID und Unternehmensname sind erforderlich" 
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Insert new company
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({
        name: companyData.name,
        address: companyData.address,
        phone: companyData.phone,
        email: companyData.email,
        logo: companyData.logo,
      })
      .select()
      .single();

    if (companyError) {
      console.error("Fehler beim Erstellen des Unternehmens:", companyError);
      return new Response(
        JSON.stringify({ error: companyError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Update user profile with company_id
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ company_id: company.id })
      .eq("id", userId);

    if (profileError) {
      console.error("Fehler beim Aktualisieren des Profils:", profileError);
      return new Response(
        JSON.stringify({ 
          company, 
          profileError: profileError.message,
          warning: "Unternehmen erstellt, aber Verknüpfung fehlgeschlagen" 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ company, success: true }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unerwarteter Fehler:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
