import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import PageHeader from '@/components/admin/PageHeader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, Users, DollarSign, Edit, Trash2 } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
  description: string;
  type: string;
  price: string;
  status: string;
  bannerImage: string;
  registrationUrl: string;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    attendees: 0,
    description: '',
    type: '',
    price: '',
    status: 'upcoming',
    bannerImage: '',
    registrationUrl: '',
  });

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminEvents({ limit: '100' });
      if (response.success) {
        setEvents(response.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAdd = () => {
    setSelectedEvent(null);
    setFormData({ title: '', date: '', location: '', attendees: 0, description: '', type: '', price: '', status: 'upcoming', bannerImage: '', registrationUrl: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      location: event.location,
      attendees: event.attendees,
      description: event.description,
      type: event.type,
      price: event.price,
      status: event.status,
      bannerImage: event.bannerImage,
      registrationUrl: event.registrationUrl,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedEvent) return;
    try {
      await api.deleteEvent(selectedEvent.id);
      toast.success('Event deleted');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to delete event');
    }
    setIsDeleteOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedEvent) {
        await api.updateEvent(selectedEvent.id, formData);
        toast.success('Event updated');
      } else {
        await api.createEvent(formData);
        toast.success('Event created');
      }
      setIsDialogOpen(false);
      fetchEvents();
    } catch (error) {
      toast.error('Failed to save event');
    }
  };

  return (
    <div>
      <PageHeader title="Events" description="Manage platform events" onAdd={handleAdd} addLabel="Add Event" />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-8 w-16 mr-2" />
                <Skeleton className="h-8 w-16" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              {event.bannerImage && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={event.bannerImage}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </CardDescription>
                  </div>
                  <Badge variant={event.status === 'upcoming' ? 'default' : event.status === 'live' ? 'destructive' : 'secondary'}>
                    {event.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {event.attendees.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {event.price || 'Free'}
                  </div>
                </div>
                <Badge variant="outline" className="w-fit">
                  {event.type}
                </Badge>
                {event.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(event)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(event)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {events.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No events found. Create your first event to get started.</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} placeholder="March 15-17, 2025" required />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conference">Conference</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Hackathon">Hackathon</SelectItem>
                    <SelectItem value="Meetup">Meetup</SelectItem>
                    <SelectItem value="Webinar">Webinar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Attendees</Label>
                <Input type="number" value={formData.attendees} onChange={(e) => setFormData({ ...formData, attendees: parseInt(e.target.value) || 0 })} placeholder="5000" />
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                <Input value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="$299 or Free" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Banner Image URL</Label>
              <Input value={formData.bannerImage} onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Registration URL</Label>
              <Input value={formData.registrationUrl} onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })} placeholder="https://..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{selectedEvent ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete "{selectedEvent?.title}"? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
