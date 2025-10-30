-- Seed venues data
INSERT INTO venues (name, city, state, country, capacity) VALUES
  ('Madison Square Garden', 'New York', 'NY', 'USA', 20789),
  ('Crypto.com Arena', 'Los Angeles', 'CA', 'USA', 19068),
  ('TD Garden', 'Boston', 'MA', 'USA', 19156),
  ('United Center', 'Chicago', 'IL', 'USA', 20917),
  ('American Airlines Center', 'Dallas', 'TX', 'USA', 19200),
  ('Chase Center', 'San Francisco', 'CA', 'USA', 18064),
  ('Barclays Center', 'Brooklyn', 'NY', 'USA', 17732),
  ('Wells Fargo Center', 'Philadelphia', 'PA', 'USA', 20478),
  ('State Farm Arena', 'Atlanta', 'GA', 'USA', 18118),
  ('Ball Arena', 'Denver', 'CO', 'USA', 19520),
  ('Target Center', 'Minneapolis', 'MN', 'USA', 18978),
  ('Smoothie King Center', 'New Orleans', 'LA', 'USA', 16867),
  ('FedExForum', 'Memphis', 'TN', 'USA', 17794),
  ('Little Caesars Arena', 'Detroit', 'MI', 'USA', 20332),
  ('Scotiabank Arena', 'Toronto', 'ON', 'Canada', 19800),
  ('Capital One Arena', 'Washington', 'DC', 'USA', 20356),
  ('Paycom Center', 'Oklahoma City', 'OK', 'USA', 18203),
  ('Moda Center', 'Portland', 'OR', 'USA', 19393),
  ('Golden 1 Center', 'Sacramento', 'CA', 'USA', 17608),
  ('Footprint Center', 'Phoenix', 'AZ', 'USA', 18055),
  ('AT&T Center', 'San Antonio', 'TX', 'USA', 18418),
  ('Vivint Arena', 'Salt Lake City', 'UT', 'USA', 18306),
  ('Rocket Mortgage FieldHouse', 'Cleveland', 'OH', 'USA', 19432),
  ('Gainbridge Fieldhouse', 'Indianapolis', 'IN', 'USA', 17923),
  ('Spectrum Center', 'Charlotte', 'NC', 'USA', 19077),
  ('Fiserv Forum', 'Milwaukee', 'WI', 'USA', 17341),
  ('Kaseya Center', 'Miami', 'FL', 'USA', 19600),
  ('Frost Bank Center', 'San Antonio', 'TX', 'USA', 18418);

-- Add non-NBA stadiums used in sample events (safe to re-run)
INSERT INTO venues (name, city, state, country, capacity) VALUES
  ('Gillette Stadium', 'Foxborough', 'MA', 'USA', 65878),
  ('Santiago Bernabéu', 'Madrid', NULL, 'Spain', 81044),
  ('Yankee Stadium', 'New York', 'NY', 'USA', 47309),
  ('Arthur Ashe Stadium', 'New York', 'NY', 'USA', 23771),
  ('AT&T Stadium', 'Arlington', 'TX', 'USA', 80000),
  ('Old Trafford', 'Manchester', NULL, 'UK', 74879)
ON CONFLICT (name) DO NOTHING;

-- Seed sample events data (no legacy venue column)
INSERT INTO events (title, sport, status, event_date, event_time, home_team, away_team, home_score, away_score, description, attendees, max_capacity)
VALUES
  ('Lakers vs Warriors', 'Basketball', 'live', '2025-10-29', '19:30', 'Lakers', 'Warriors', 98, 95, 'Western Conference showdown', 18997, 19000),
  ('Patriots vs Chiefs', 'Football', 'upcoming', '2025-10-30', '20:15', 'Patriots', 'Chiefs', NULL, NULL, 'AFC Championship rematch', 0, 65878),
  ('Real Madrid vs Barcelona', 'Soccer', 'upcoming', '2025-10-31', '15:00', 'Real Madrid', 'Barcelona', NULL, NULL, 'El Clásico - La Liga', 81044, 81044),
  ('Yankees vs Red Sox', 'Baseball', 'completed', '2025-10-28', '19:05', 'Yankees', 'Red Sox', 7, 4, 'AL East rivalry game', 47309, 47309),
  ('Celtics vs Heat', 'Basketball', 'upcoming', '2025-10-30', '19:00', 'Celtics', 'Heat', NULL, NULL, 'Eastern Conference matchup', 15234, 19156),
  ('Federer vs Nadal Exhibition', 'Tennis', 'upcoming', '2025-11-01', '14:00', 'Federer', 'Nadal', NULL, NULL, 'Legends exhibition match', 23771, 23771),
  ('Cowboys vs Eagles', 'Football', 'live', '2025-10-29', '20:20', 'Cowboys', 'Eagles', 21, 17, 'NFC East division game', 80000, 80000),
  ('Manchester United vs Liverpool', 'Soccer', 'completed', '2025-10-27', '16:30', 'Manchester United', 'Liverpool', 2, 2, 'Premier League classic', 74879, 74879);

-- Link events to venues (event_venues relationships)
-- Note: This assumes the events and venues were inserted in order and uses their IDs
INSERT INTO event_venues (event_id, venue_id)
SELECT e.id, v.id
FROM events e
JOIN venues v ON v.name = 'Crypto.com Arena'
WHERE e.title = 'Lakers vs Warriors';

INSERT INTO event_venues (event_id, venue_id)
SELECT e.id, v.id
FROM events e
JOIN venues v ON v.name = 'TD Garden'
WHERE e.title = 'Celtics vs Heat';

INSERT INTO event_venues (event_id, venue_id)
SELECT e.id, v.id
FROM events e
JOIN venues v ON v.name = 'AT&T Stadium'
WHERE e.title = 'Cowboys vs Eagles';

-- Link the rest of the seeded events
INSERT INTO event_venues (event_id, venue_id)
SELECT e.id, v.id
FROM events e
JOIN venues v ON v.name = 'Gillette Stadium'
WHERE e.title = 'Patriots vs Chiefs';

INSERT INTO event_venues (event_id, venue_id)
SELECT e.id, v.id
FROM events e
JOIN venues v ON v.name = 'Santiago Bernabéu'
WHERE e.title = 'Real Madrid vs Barcelona';

INSERT INTO event_venues (event_id, venue_id)
SELECT e.id, v.id
FROM events e
JOIN venues v ON v.name = 'Yankee Stadium'
WHERE e.title = 'Yankees vs Red Sox';

INSERT INTO event_venues (event_id, venue_id)
SELECT e.id, v.id
FROM events e
JOIN venues v ON v.name = 'Arthur Ashe Stadium'
WHERE e.title = 'Federer vs Nadal Exhibition';

INSERT INTO event_venues (event_id, venue_id)
SELECT e.id, v.id
FROM events e
JOIN venues v ON v.name = 'Old Trafford'
WHERE e.title = 'Manchester United vs Liverpool';
