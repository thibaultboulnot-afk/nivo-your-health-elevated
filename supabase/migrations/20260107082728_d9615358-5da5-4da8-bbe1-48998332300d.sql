-- Create webhook_events table for idempotency protection
CREATE TABLE IF NOT EXISTS public.webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for cleanup queries
CREATE INDEX idx_webhook_events_processed_at ON public.webhook_events(processed_at);

-- Enable RLS (no policies needed - only service role accesses this)
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Comment for documentation
COMMENT ON TABLE public.webhook_events IS 'Tracks processed Stripe webhook events for idempotency. Events older than 30 days can be safely deleted.';