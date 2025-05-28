
-- Enable the pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a cron job that runs every 4 minutes
-- This will call the auto-keepalive function every 4 minutes
SELECT cron.schedule(
    'auto-keepalive-job',
    '*/4 * * * *',  -- Every 4 minutes
    $$
    SELECT 
      net.http_post(
        url := 'https://kmzlkfwxeghvlgtilzjh.supabase.co/functions/v1/auto-keepalive',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}',
        body := '{}'
      ) as response;
    $$
);

-- You can check the status of cron jobs with:
-- SELECT * FROM cron.job;

-- To remove the job if needed:
-- SELECT cron.unschedule('auto-keepalive-job');
