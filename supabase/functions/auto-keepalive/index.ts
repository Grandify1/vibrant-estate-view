
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
    console.log(`🤖 Auto Keep-Alive ping starting at ${new Date().toISOString()}`);
    
    const startTime = Date.now();
    
    // Single ping to the Replit server
    const response = await fetch(`${REPLIT_URL}/health`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Supabase-AutoKeepAlive/1.0',
        'Accept': 'application/json',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(30000), // 30 seconds timeout
    });
    
    const responseTime = Date.now() - startTime;
    const timestamp = new Date().toISOString();
    
    let responseData = null;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = await response.text();
    }
    
    const result = {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      responseTime: `${responseTime}ms`,
      timestamp,
      url: `${REPLIT_URL}/health`,
      response: responseData
    };
    
    if (response.ok) {
      console.log(`✅ [${timestamp}] Keep-Alive successful - ${responseTime}ms`);
    } else {
      console.log(`❌ [${timestamp}] Keep-Alive failed - Status: ${response.status}`);
    }
    
    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error('❌ Auto Keep-Alive error:', error.message);
    
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
