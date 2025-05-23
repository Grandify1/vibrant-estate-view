
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Get the request body
    const { email, password, first_name, last_name, company_id } = await req.json();
    
    if (!email || !password) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email und Passwort sind erforderlich' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    // Create the user in auth.users
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        first_name,
        last_name,
        email,
        email_verified: true
      }
    });
    
    if (authError) {
      throw authError;
    }
    
    // Get the created user's ID
    const userId = authData.user.id;
    
    // Create the profile in the profiles table
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .insert({
        id: userId,
        first_name,
        last_name,
        company_id: company_id || null
      });
      
    if (profileError) {
      // If profile creation fails, try to delete the auth user to maintain consistency
      await supabaseClient.auth.admin.deleteUser(userId);
      throw profileError;
    }
    
    return new Response(
      JSON.stringify({ success: true, message: 'Benutzer erfolgreich erstellt', user_id: userId }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
