// Core types for the Fastbreak Event Dashboard

export type SportType = 'Basketball' | 'Football' | 'Soccer' | 'Baseball' | 'Tennis';

export type EventStatus = 'upcoming' | 'live' | 'completed';

export interface Venue {
  id: string;
  name: string;
  city: string;
  state?: string;
  country: string;
  capacity?: number;
  created_at?: string;
}

export interface Event {
  id: string;
  title: string;
  sport: SportType;
  status: EventStatus;
  date: string;
  time: string;
  venues?: Venue[]; // Array of venues for the event
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
