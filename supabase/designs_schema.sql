-- Create designs table
CREATE TABLE IF NOT EXISTS designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES usage(user_id) ON DELETE CASCADE,
  original_image TEXT,
  generated_image TEXT NOT NULL,
  prompt TEXT,
  room_type TEXT,
  style TEXT,
  palette TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_designs_user_id ON designs(user_id);
CREATE INDEX IF NOT EXISTS idx_designs_created_at ON designs(created_at DESC);

-- Create trigger for auto-updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_designs_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER designs_update_timestamp
BEFORE UPDATE ON designs
FOR EACH ROW
EXECUTE FUNCTION update_designs_timestamp();

-- RLS Policy: Users can only view their own designs (if RLS is enabled)
-- Note: Currently disabled for development
ALTER TABLE designs DISABLE ROW LEVEL SECURITY;
