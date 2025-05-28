
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
  
  // Diese Function wird automatisch von Supabase Cron ausgeführt
  try {
    console.log(`🤖 Auto Keep-Alive starting at ${new Date().toISOString()}`);
    
    // Endloser Loop mit 4-Minuten Intervall
    while (true) {
      try {
        const startTime = Date.now();
        
        // Ping the Replit server
        const response = await fetch(`${REPLIT_URL}/health`, {
          method: 'GET',
          headers: {
            'User-Agent': 'Supabase-AutoKeepAlive/1.0',
            'Accept': 'application/json',
          },
        });
        
        const responseTime = Date.now() - startTime;
        const timestamp = new Date().toISOString();
        
        if (response.ok) {
          console.log(`✅ [${timestamp}] Keep-Alive successful - ${responseTime}ms`);
        } else {
          console.log(`❌ [${timestamp}] Keep-Alive failed - Status: ${response.status}`);
        }
        
        // Warte 4 Minuten (240000 ms)
        await new Promise(resolve => setTimeout(resolve, 240000));
        
      } catch (pingError) {
        console.error(`❌ Ping error: ${pingError.message}`);
        // Bei Fehler trotzdem weiter versuchen
        await new Promise(resolve => setTimeout(resolve, 240000));
      }
    }
    
  } catch (error) {
    console.error('❌ Auto Keep-Alive fatal error:', error.message);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
