// Core types for the Fastbreak Event Dashboard

export type SportType = 'Basketball' | 'Football' | 'Soccer' | 'Baseball' | 'Tennis';

export type EventStatus = 'upcoming' | 'live' | 'completed';

export interface Event {
  id: string;
  title: string;
  sport: SportType;
  status: EventStatus;
  date: string;
  time: string;
  venue: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  description?: string;
  attendees?: number;
  maxCapacity?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  favoriteTeams: string[];
}
