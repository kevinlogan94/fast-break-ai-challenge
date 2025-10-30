// Event form validation schemas using Zod
// Learning: Zod provides runtime type checking and validation

import * as z from 'zod';

export const eventFormSchema = z.object({
  title: z.string().min(1, { message: 'Event title is required' }).max(100, { message: 'Title is too long' }),
  sport: z.enum(['Basketball', 'Football', 'Soccer', 'Baseball', 'Tennis']),
  status: z.enum(['upcoming', 'live', 'completed']),
  event_date: z.string().min(1, { message: 'Event date is required' }),
  event_time: z.string().min(1, { message: 'Event time is required' }),
  venue: z.string().max(200, { message: 'Venue name is too long' }).optional().or(z.literal('')),
  home_team: z.string().min(1, { message: 'Home team is required' }).max(100, { message: 'Team name is too long' }),
  away_team: z.string().min(1, { message: 'Away team is required' }).max(100, { message: 'Team name is too long' }),
  description: z.string().optional().or(z.literal('')),
  max_capacity: z.coerce.number().int().min(0).optional(),
});

export const eventEditFormSchema = eventFormSchema.extend({
  home_score: z.coerce.number().int().min(0).nullable().optional(),
  away_score: z.coerce.number().int().min(0).nullable().optional(),
  attendees: z.coerce.number().int().min(0).optional(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
export type EventEditFormValues = z.infer<typeof eventEditFormSchema>;
