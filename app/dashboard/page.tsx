'use client';

// Learning: This is a Client Component because we need state and interactivity
// In Vue, all components can be reactive. In React, you choose Server or Client.

import { useState, useMemo, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Event, SportType, EventStatus } from '@/lib/types';
import type { User } from '@supabase/supabase-js';
import { getEvents, deleteEvent } from '@/actions/events';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  // State management (like Vue's ref())
  const [searchQuery, setSearchQuery] = useState('');
  const [sportFilter, setSportFilter] = useState<SportType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'all'>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Fetch user and events on mount (like onMounted in Vue)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      // Fetch user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // Fetch events using Server Action
      const result = await getEvents();
      
      if (result.success && result.data) {
        // Transform database format to our Event type
        const transformedEvents: Event[] = result.data.map((event: any) => ({
          id: event.id,
          title: event.title,
          sport: event.sport as SportType,
          status: event.status as EventStatus,
          date: event.event_date,
          time: event.event_time,
          venue: event.venue,
          homeTeam: event.home_team,
          awayTeam: event.away_team,
          homeScore: event.home_score,
          awayScore: event.away_score,
          description: event.description,
          attendees: event.attendees,
          maxCapacity: event.max_capacity,
        }));
        setEvents(transformedEvents);
      } else {
        console.error('Error fetching events:', result.error);
      }
      
      setIsLoading(false);
    };
    
    fetchData();
  }, [supabase]);

  // Computed values (like Vue's computed())
  // useMemo recalculates only when dependencies change
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSport = sportFilter === 'all' || event.sport === sportFilter;
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      
      return matchesSearch && matchesSport && matchesStatus;
    });
  }, [events, searchQuery, sportFilter, statusFilter]);

  const getStatusColor = (status: EventStatus) => {
    switch (status) {
      case 'live':
        return 'bg-red-500 text-white';
      case 'upcoming':
        return 'bg-blue-500 text-white';
      case 'completed':
        return 'bg-gray-500 text-white';
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleDeleteEvent = async (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      // Use Server Action instead of direct query
      const result = await deleteEvent(eventId);

      if (!result.success) {
        alert('Failed to delete event: ' + result.error);
        return;
      }

      // Remove from local state
      setEvents(events.filter(e => e.id !== eventId));
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('Failed to delete event');
    }
  };

  const handleEditEvent = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    router.push(`/dashboard/edit/${eventId}`);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.user_metadata?.full_name) return 'U';
    return user.user_metadata.full_name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg" />
              <h1 className="text-xl font-bold text-gray-900">Fastbreak Dashboard</h1>
            </div>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-indigo-600 text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">
                    {user?.user_metadata?.full_name || user?.email || 'User'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Events</CardDescription>
              <CardTitle className="text-3xl">
                {isLoading ? '...' : events.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Live Now</CardDescription>
              <CardTitle className="text-3xl">
                {isLoading ? '...' : events.filter(e => e.status === 'live').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Upcoming</CardDescription>
              <CardTitle className="text-3xl">
                {isLoading ? '...' : events.filter(e => e.status === 'upcoming').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl">
                {isLoading ? '...' : events.filter(e => e.status === 'completed').length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Event Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  placeholder="Search events, teams, venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <Select value={sportFilter} onValueChange={(value) => setSportFilter(value as SportType | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by sport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sports</SelectItem>
                    <SelectItem value="Basketball">Basketball</SelectItem>
                    <SelectItem value="Football">Football</SelectItem>
                    <SelectItem value="Soccer">Soccer</SelectItem>
                    <SelectItem value="Baseball">Baseball</SelectItem>
                    <SelectItem value="Tennis">Tennis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as EventStatus | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Events ({filteredEvents.length})
            </h2>
            <Button onClick={() => router.push('/dashboard/create')}>
              + Create Event
            </Button>
          </div>
          
          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                Loading events...
              </CardContent>
            </Card>
          ) : filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No events found matching your filters.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Learning: .map() is like v-for in Vue */}
              {filteredEvents.map((event) => (
                <Card 
                  key={event.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {event.venue} • {event.date} at {event.time}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(event.status)}>
                        {event.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{event.homeTeam}</span>
                        {event.homeScore !== undefined && (
                          <span className="text-2xl font-bold">{event.homeScore}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{event.awayTeam}</span>
                        {event.awayScore !== undefined && (
                          <span className="text-2xl font-bold">{event.awayScore}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
                        <Badge variant="outline">{event.sport}</Badge>
                        {event.attendees !== undefined && (
                          <span>
                            {event.attendees.toLocaleString()} / {event.maxCapacity?.toLocaleString()} attendees
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 pt-2 border-t">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleEditEvent(event.id, e)}
                          className="flex-1"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => handleDeleteEvent(event.id, e)}
                          className="flex-1"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Event Detail Modal - We'll add this next */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedEvent(null)}
        >
          <Card 
            className="max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{selectedEvent.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {selectedEvent.venue} • {selectedEvent.date} at {selectedEvent.time}
                  </CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setSelectedEvent(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Badge className={getStatusColor(selectedEvent.status)}>
                  {selectedEvent.status.toUpperCase()}
                </Badge>
                <Badge variant="outline">{selectedEvent.sport}</Badge>
              </div>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-lg">{selectedEvent.homeTeam}</div>
                    <div className="text-sm text-gray-600">Home</div>
                  </div>
                  {selectedEvent.homeScore !== undefined && (
                    <div className="text-4xl font-bold">{selectedEvent.homeScore}</div>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-lg">{selectedEvent.awayTeam}</div>
                    <div className="text-sm text-gray-600">Away</div>
                  </div>
                  {selectedEvent.awayScore !== undefined && (
                    <div className="text-4xl font-bold">{selectedEvent.awayScore}</div>
                  )}
                </div>
              </div>

              {selectedEvent.description && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-600">{selectedEvent.description}</p>
                </div>
              )}

              {selectedEvent.attendees !== undefined && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Attendance</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ 
                          width: `${(selectedEvent.attendees / (selectedEvent.maxCapacity || 1)) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {selectedEvent.attendees.toLocaleString()} / {selectedEvent.maxCapacity?.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
