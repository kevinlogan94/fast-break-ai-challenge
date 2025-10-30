-- Seed sample events data
INSERT INTO events (title, sport, status, event_date, event_time, venue, home_team, away_team, home_score, away_score, description, attendees, max_capacity)
VALUES
  ('Lakers vs Warriors', 'Basketball', 'live', '2025-10-29', '19:30', 'Crypto.com Arena', 'Lakers', 'Warriors', 98, 95, 'Western Conference showdown', 18997, 19000),
  ('Patriots vs Chiefs', 'Football', 'upcoming', '2025-10-30', '20:15', 'Gillette Stadium', 'Patriots', 'Chiefs', NULL, NULL, 'AFC Championship rematch', 0, 65878),
  ('Real Madrid vs Barcelona', 'Soccer', 'upcoming', '2025-10-31', '15:00', 'Santiago Bernabéu', 'Real Madrid', 'Barcelona', NULL, NULL, 'El Clásico - La Liga', 81044, 81044),
  ('Yankees vs Red Sox', 'Baseball', 'completed', '2025-10-28', '19:05', 'Yankee Stadium', 'Yankees', 'Red Sox', 7, 4, 'AL East rivalry game', 47309, 47309),
  ('Celtics vs Heat', 'Basketball', 'upcoming', '2025-10-30', '19:00', 'TD Garden', 'Celtics', 'Heat', NULL, NULL, 'Eastern Conference matchup', 15234, 19156),
  ('Federer vs Nadal Exhibition', 'Tennis', 'upcoming', '2025-11-01', '14:00', 'Arthur Ashe Stadium', 'Federer', 'Nadal', NULL, NULL, 'Legends exhibition match', 23771, 23771),
  ('Cowboys vs Eagles', 'Football', 'live', '2025-10-29', '20:20', 'AT&T Stadium', 'Cowboys', 'Eagles', 21, 17, 'NFC East division game', 80000, 80000),
  ('Manchester United vs Liverpool', 'Soccer', 'completed', '2025-10-27', '16:30', 'Old Trafford', 'Manchester United', 'Liverpool', 2, 2, 'Premier League classic', 74879, 74879);
