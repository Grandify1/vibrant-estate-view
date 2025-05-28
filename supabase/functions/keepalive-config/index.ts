
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Keep-Alive Konfiguration
const CONFIG = {
  replit_url: 'https://ihre-repl-url.replit.dev',
  ping_interval: 240000, // 4 Minuten in ms
  max_retries: 3,
  timeout: 30000, // 30 Sekunden timeout
  endpoints: ['/health', '/ping', '/status'],
  user_agent: 'Supabase-KeepAlive-Lovable/1.0'
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    const { method } = req;
    
    if (method === 'GET') {
      // Return current configuration
      return new Response(
        JSON.stringify({
          success: true,
          config: CONFIG,
          info: {
            description: 'Keep-Alive System für Lovable.com → Replit',
            interval_minutes: CONFIG.ping_interval / 60000,
            endpoints: CONFIG.endpoints.map(ep => `${CONFIG.replit_url}${ep}`)
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
    
    if (method === 'POST') {
      // Trigger manual keep-alive
      const results = [];
      
      for (const endpoint of CONFIG.endpoints) {
        try {
          const startTime = Date.now();
          const response = await fetch(`${CONFIG.replit_url}${endpoint}`, {
            method: 'GET',
            headers: {
              'User-Agent': CONFIG.user_agent,
              'Accept': 'application/json',
            },
            signal: AbortSignal.timeout(CONFIG.timeout)
          });
          
          const responseTime = Date.now() - startTime;
          
          results.push({
            endpoint,
            success: response.ok,
            status: response.status,
            responseTime: `${responseTime}ms`,
            timestamp: new Date().toISOString()
          });
          
        } catch (error) {
          results.push({
            endpoint,
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
          });
        }
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          manual_ping: true,
          results
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }
    
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405,
      }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
