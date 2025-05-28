
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Your Replit URL - update this with your actual URL
const REPLIT_URL = 'https://ihre-repl-url.replit.dev';

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    console.log(`🔄 Keep-Alive ping to ${REPLIT_URL}/health`);
    
    // Ping the Replit server
    const response = await fetch(`${REPLIT_URL}/health`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Supabase-KeepAlive/1.0',
        'Accept': 'application/json',
      },
    });
    
    const responseTime = Date.now();
    const status = response.status;
    const statusText = response.statusText;
    
    let responseData = null;
    try {
      responseData = await response.text();
    } catch (e) {
      responseData = 'No response body';
    }
    
    const result = {
      success: response.ok,
      status,
      statusText,
      responseTime: `${Date.now() - responseTime}ms`,
      timestamp: new Date().toISOString(),
      url: `${REPLIT_URL}/health`,
      response: responseData
    };
    
    if (response.ok) {
      console.log(`✅ Keep-Alive successful - Status: ${status}`);
    } else {
      console.log(`❌ Keep-Alive failed - Status: ${status} ${statusText}`);
    }
    
    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error('❌ Keep-Alive error:', error.message);
    
    const errorResult = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      url: `${REPLIT_URL}/health`
    };
    
    return new Response(
      JSON.stringify(errorResult),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
