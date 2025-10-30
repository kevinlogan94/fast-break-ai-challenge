'use server';

// Server Actions for event operations
// Learning: These run on the server, not the client
// Similar to Nuxt's server/api/ directory

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getEvents() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function getEventById(id: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching event:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function createEvent(eventData: {
  title: string;
  sport: string;
  status: string;
  event_date: string;
  event_time: string;
  venue: string;
  home_team: string;
  away_team: string;
  description?: string;
  max_capacity?: number;
}) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data, error } = await supabase
    .from('events')
    .insert([{
      ...eventData,
      created_by: user.id,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    return { success: false, error: error.message };
  }

  // Revalidate the dashboard page to show new data
  revalidatePath('/dashboard');

  return { success: true, data };
}

export async function updateEvent(id: string, eventData: {
  title: string;
  sport: string;
  status: string;
  event_date: string;
  event_time: string;
  venue: string;
  home_team: string;
  away_team: string;
  home_score?: number | null;
  away_score?: number | null;
  description?: string;
  attendees?: number;
  max_capacity?: number;
}) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('events')
    .update(eventData)
    .eq('id', id);

  if (error) {
    console.error('Error updating event:', error);
    return { success: false, error: error.message };
  }

  // Revalidate the dashboard page
  revalidatePath('/dashboard');

  return { success: true };
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting event:', error);
    return { success: false, error: error.message };
  }

  // Revalidate the dashboard page
  revalidatePath('/dashboard');

  return { success: true };
}
