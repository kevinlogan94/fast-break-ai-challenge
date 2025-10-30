'use server';

// Server Actions for event operations
// Learning: These run on the server, not the client
// Similar to Nuxt's server/api/ directory

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { safeAction, type ActionResponse } from '@/lib/action-helpers';

export async function getEvents(): Promise<ActionResponse<any[]>> {
  return safeAction(async () => {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  });
}

export async function getEventById(id: string): Promise<ActionResponse<any>> {
  return safeAction(async () => {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  });
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
}): Promise<ActionResponse<any>> {
  return safeAction(async () => {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('Not authenticated');
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
      throw new Error(error.message);
    }

    // Revalidate the dashboard page to show new data
    revalidatePath('/dashboard');

    return data;
  });
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
}): Promise<ActionResponse<void>> {
  return safeAction(async () => {
    const supabase = await createClient();

    const { error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    // Revalidate the dashboard page
    revalidatePath('/dashboard');
  });
}

export async function deleteEvent(id: string): Promise<ActionResponse<void>> {
  return safeAction(async () => {
    const supabase = await createClient();

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    // Revalidate the dashboard page
    revalidatePath('/dashboard');
  });
}
