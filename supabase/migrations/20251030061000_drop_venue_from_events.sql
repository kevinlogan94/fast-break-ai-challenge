-- Drop legacy venue text column from events
ALTER TABLE events DROP COLUMN IF EXISTS venue;
