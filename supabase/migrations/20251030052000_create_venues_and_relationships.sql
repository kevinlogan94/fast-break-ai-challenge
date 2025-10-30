-- Create venues table with predefined venues
CREATE TABLE venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  state TEXT,
  country TEXT NOT NULL DEFAULT 'USA',
  capacity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create junction table for many-to-many relationship
CREATE TABLE event_venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(event_id, venue_id) -- Prevent duplicate venue assignments
);

-- Create indexes for faster queries
CREATE INDEX event_venues_event_id_idx ON event_venues(event_id);
CREATE INDEX event_venues_venue_id_idx ON event_venues(venue_id);
CREATE INDEX venues_name_idx ON venues(name);

-- Enable Row Level Security
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_venues ENABLE ROW LEVEL SECURITY;

-- Venues policies: Everyone can read
CREATE POLICY "Venues are viewable by everyone"
  ON venues FOR SELECT
  USING (true);

-- Event_venues policies: Everyone can read
CREATE POLICY "Event venues are viewable by everyone"
  ON event_venues FOR SELECT
  USING (true);

-- Event_venues policies: Authenticated users can insert
CREATE POLICY "Authenticated users can assign venues to events"
  ON event_venues FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Event_venues policies: Users can delete their event's venue assignments
CREATE POLICY "Users can remove venues from their events"
  ON event_venues FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_venues.event_id
      AND events.created_by = auth.uid()
    )
  );

