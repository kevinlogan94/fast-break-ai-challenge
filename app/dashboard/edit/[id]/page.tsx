'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SportType, EventStatus } from '@/lib/types';
import { getEventById, updateEvent } from '@/actions/events';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form state for event
  const [event, setEvent] = useState({
    title: '',
    sport: 'Basketball' as SportType,
    status: 'upcoming' as EventStatus,
    event_date: '',
    event_time: '',
    venue: '',
    home_team: '',
    away_team: '',
    home_score: null as number | null,
    away_score: null as number | null,
    description: '',
    attendees: 0,
    max_capacity: 0,
  });

  // Fetch event data on mount
  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      
      // Use Server Action instead of direct query
      const result = await getEventById(eventId);

      if (!result.success || !result.data) {
        console.error('Error fetching event:', result.error);
        alert('Failed to load event');
        router.push('/dashboard');
        return;
      }

      if (result.data) {
        const data = result.data;
        setEvent({
          title: data.title,
          sport: data.sport,
          status: data.status,
          event_date: data.event_date,
          event_time: data.event_time,
          venue: data.venue,
          home_team: data.home_team,
          away_team: data.away_team,
          home_score: data.home_score,
          away_score: data.away_score,
          description: data.description || '',
          attendees: data.attendees || 0,
          max_capacity: data.max_capacity || 0,
        });
      }

      setIsLoading(false);
    };

    fetchEvent();
  }, [eventId, router]);

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Use Server Action instead of direct query
      const result = await updateEvent(eventId, {
        title: event.title,
        sport: event.sport,
        status: event.status,
        event_date: event.event_date,
        event_time: event.event_time,
        venue: event.venue,
        home_team: event.home_team,
        away_team: event.away_team,
        home_score: event.home_score,
        away_score: event.away_score,
        description: event.description,
        attendees: event.attendees,
        max_capacity: event.max_capacity,
      });

      if (!result.success) {
        alert('Failed to update event: ' + result.error);
        return;
      }

      // Redirect back to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Failed to update event');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading event...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
              >
                ← Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Edit Event</CardTitle>
            <CardDescription>
              Update the event details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateEvent} className="space-y-6">
              {/* Event Title & Sport */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={event.title}
                    onChange={(e) => setEvent({ ...event, title: e.target.value })}
                    placeholder="Lakers vs Warriors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sport">Sport *</Label>
                  <Select
                    value={event.sport}
                    onValueChange={(value) => setEvent({ ...event, sport: value as SportType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basketball">Basketball</SelectItem>
                      <SelectItem value="Football">Football</SelectItem>
                      <SelectItem value="Soccer">Soccer</SelectItem>
                      <SelectItem value="Baseball">Baseball</SelectItem>
                      <SelectItem value="Tennis">Tennis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Teams */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="home_team">Home Team *</Label>
                  <Input
                    id="home_team"
                    value={event.home_team}
                    onChange={(e) => setEvent({ ...event, home_team: e.target.value })}
                    placeholder="Lakers"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="away_team">Away Team *</Label>
                  <Input
                    id="away_team"
                    value={event.away_team}
                    onChange={(e) => setEvent({ ...event, away_team: e.target.value })}
                    placeholder="Warriors"
                    required
                  />
                </div>
              </div>

              {/* Scores (for live/completed events) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="home_score">Home Score</Label>
                  <Input
                    id="home_score"
                    type="number"
                    value={event.home_score ?? ''}
                    onChange={(e) => setEvent({ ...event, home_score: e.target.value ? parseInt(e.target.value) : null })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="away_score">Away Score</Label>
                  <Input
                    id="away_score"
                    type="number"
                    value={event.away_score ?? ''}
                    onChange={(e) => setEvent({ ...event, away_score: e.target.value ? parseInt(e.target.value) : null })}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Venue */}
              <div className="space-y-2">
                <Label htmlFor="venue">Venue *</Label>
                <Input
                  id="venue"
                  value={event.venue}
                  onChange={(e) => setEvent({ ...event, venue: e.target.value })}
                  placeholder="Crypto.com Arena"
                  required
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event_date">Date *</Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={event.event_date}
                    onChange={(e) => setEvent({ ...event, event_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event_time">Time *</Label>
                  <Input
                    id="event_time"
                    type="time"
                    value={event.event_time}
                    onChange={(e) => setEvent({ ...event, event_time: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Status, Attendees & Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={event.status}
                    onValueChange={(value) => setEvent({ ...event, status: value as EventStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attendees">Attendees</Label>
                  <Input
                    id="attendees"
                    type="number"
                    value={event.attendees || ''}
                    onChange={(e) => setEvent({ ...event, attendees: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_capacity">Max Capacity</Label>
                  <Input
                    id="max_capacity"
                    type="number"
                    value={event.max_capacity || ''}
                    onChange={(e) => setEvent({ ...event, max_capacity: parseInt(e.target.value) || 0 })}
                    placeholder="20000"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={event.description}
                  onChange={(e) => setEvent({ ...event, description: e.target.value })}
                  placeholder="Western Conference showdown"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
