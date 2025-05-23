
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
    const { user_id } = await req.json();
    
    if (!user_id) {
      return new Response(
        JSON.stringify({ success: false, message: 'User ID ist erforderlich' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }
    
    // Delete the profile first (should cascade delete with RLS policies)
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .delete()
      .eq('id', user_id);
    
    // Delete the auth user
    const { error: authError } = await supabaseClient.auth.admin.deleteUser(user_id);
    
    if (authError) {
      throw authError;
    }
    
    return new Response(
      JSON.stringify({ success: true, message: 'Benutzer erfolgreich gelöscht' }),
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
