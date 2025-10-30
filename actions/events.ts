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
      .select(`
        *,
        event_venues (
          venues (*)
        )
      `)
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
  venue_ids?: string[]; // Array of venue IDs
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

    // Extract venue_ids before inserting
    const { venue_ids, ...eventDataWithoutVenueIds } = eventData;

    const { data, error } = await supabase
      .from('events')
      .insert([{
        ...eventDataWithoutVenueIds,
        created_by: user.id,
      }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // If venue_ids provided, create event_venues relationships
    if (venue_ids && venue_ids.length > 0) {
      const eventVenues = venue_ids.map(venueId => ({
        event_id: data.id,
        venue_id: venueId,
      }));

      const { error: venueError } = await supabase
        .from('event_venues')
        .insert(eventVenues);

      if (venueError) {
        console.error('Error linking venues:', venueError);
        // Don't throw - event is created, just log the error
      }
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
  venue_ids?: string[]; // Array of venue IDs
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

    // Extract venue_ids before updating
    const { venue_ids, ...eventDataWithoutVenueIds } = eventData;

    const { error } = await supabase
      .from('events')
      .update(eventDataWithoutVenueIds)
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    // If venue_ids provided, update event_venues relationships
    if (venue_ids !== undefined) {
      // Delete existing relationships
      await supabase
        .from('event_venues')
        .delete()
        .eq('event_id', id);

      // Insert new relationships
      if (venue_ids.length > 0) {
        const eventVenues = venue_ids.map(venueId => ({
          event_id: id,
          venue_id: venueId,
        }));

        const { error: venueError } = await supabase
          .from('event_venues')
          .insert(eventVenues);

        if (venueError) {
          console.error('Error updating venues:', venueError);
        }
      }
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
