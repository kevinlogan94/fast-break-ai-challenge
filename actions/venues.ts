'use server';

import { createClient } from '@/lib/supabase/server';

export async function getVenues() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching venues:', error);
    return { success: false, error: error.message, data: null };
  }

  return { success: true, data, error: null };
}

export async function getEventVenues(eventId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('event_venues')
    .select(`
      venue_id,
      venues (*)
    `)
    .eq('event_id', eventId);

  if (error) {
    console.error('Error fetching event venues:', error);
    return { success: false, error: error.message, data: null };
  }

  // Transform the data to return just the venues array
  const venues = data?.map(ev => ev.venues).filter(Boolean) || [];
  return { success: true, data: venues, error: null };
}

export async function setEventVenues(eventId: string, venueIds: string[]) {
  const supabase = await createClient();
  
  try {
    // Delete existing venue assignments
    const { error: deleteError } = await supabase
      .from('event_venues')
      .delete()
      .eq('event_id', eventId);

    if (deleteError) {
      console.error('Error deleting event venues:', deleteError);
      return { success: false, error: deleteError.message };
    }

    // Insert new venue assignments
    if (venueIds.length > 0) {
      const eventVenues = venueIds.map(venueId => ({
        event_id: eventId,
        venue_id: venueId,
      }));

      const { error: insertError } = await supabase
        .from('event_venues')
        .insert(eventVenues);

      if (insertError) {
        console.error('Error inserting event venues:', insertError);
        return { success: false, error: insertError.message };
      }
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
