'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SportType, EventStatus } from '@/lib/types';
import { createEvent } from '@/actions/events';
import { toast } from 'sonner';
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

export default function CreateEventPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  // Form state for new event
  const [newEvent, setNewEvent] = useState({
    title: '',
    sport: 'Basketball' as SportType,
    status: 'upcoming' as EventStatus,
    event_date: '',
    event_time: '',
    venue: '',
    home_team: '',
    away_team: '',
    description: '',
    max_capacity: 0,
  });

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Use Server Action instead of direct query
      const result = await createEvent(newEvent);

      if (!result.success) {
        toast.error('Failed to create event', {
          description: result.error,
        });
        return;
      }

      toast.success('Event created successfully');
      // Redirect back to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Failed to create event', {
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsCreating(false);
    }
  };

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
            <CardTitle className="text-2xl">Create New Event</CardTitle>
            <CardDescription>
              Add a new sports event to the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateEvent} className="space-y-6">
              {/* Event Title & Sport */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Lakers vs Warriors"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sport">Sport *</Label>
                  <Select
                    value={newEvent.sport}
                    onValueChange={(value) => setNewEvent({ ...newEvent, sport: value as SportType })}
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
                    value={newEvent.home_team}
                    onChange={(e) => setNewEvent({ ...newEvent, home_team: e.target.value })}
                    placeholder="Lakers"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="away_team">Away Team *</Label>
                  <Input
                    id="away_team"
                    value={newEvent.away_team}
                    onChange={(e) => setNewEvent({ ...newEvent, away_team: e.target.value })}
                    placeholder="Warriors"
                    required
                  />
                </div>
              </div>

              {/* Venue */}
              <div className="space-y-2">
                <Label htmlFor="venue">Venue *</Label>
                <Input
                  id="venue"
                  value={newEvent.venue}
                  onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
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
                    value={newEvent.event_date}
                    onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event_time">Time *</Label>
                  <Input
                    id="event_time"
                    type="time"
                    value={newEvent.event_time}
                    onChange={(e) => setNewEvent({ ...newEvent, event_time: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Status & Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={newEvent.status}
                    onValueChange={(value) => setNewEvent({ ...newEvent, status: value as EventStatus })}
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
                  <Label htmlFor="max_capacity">Max Capacity</Label>
                  <Input
                    id="max_capacity"
                    type="number"
                    value={newEvent.max_capacity || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, max_capacity: parseInt(e.target.value) || 0 })}
                    placeholder="20000"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Western Conference showdown"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
