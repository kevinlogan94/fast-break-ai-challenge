-- Create events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Event details
  title TEXT NOT NULL,
  sport TEXT NOT NULL CHECK (sport IN ('Basketball', 'Football', 'Soccer', 'Baseball', 'Tennis')),
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'live', 'completed')),
  
  -- Date and time
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  
  -- Location
  venue TEXT NOT NULL,
  
  -- Teams
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  
  -- Scores (nullable for upcoming events)
  home_score INTEGER,
  away_score INTEGER,
  
  -- Additional info
  description TEXT,
  attendees INTEGER DEFAULT 0,
  max_capacity INTEGER,
  
  -- User who created it (optional - for future features)
  created_by UUID REFERENCES auth.users(id)
);

-- Create indexes for faster queries
CREATE INDEX events_status_idx ON events(status);
CREATE INDEX events_sport_idx ON events(sport);
CREATE INDEX events_date_idx ON events(event_date);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policy: Anyone can read events
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (true);

-- Create policy: Authenticated users can insert events
CREATE POLICY "Authenticated users can insert events"
  ON events FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy: Users can update their own events
CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  USING (auth.uid() = created_by);

-- Create policy: Users can delete their own events
CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE
  USING (auth.uid() = created_by);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();