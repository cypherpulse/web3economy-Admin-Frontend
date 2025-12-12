import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
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
import { Badge } from '@/components/ui/badge';

interface Subscriber {
  id: string;
  email: string;
  source?: string;
  status?: string;
  subscribedAt?: string;
  createdAt?: string;
}

const columns = [
  { key: 'email', label: 'Email' },
  {
    key: 'source',
    label: 'Source',
    render: (value: string) => value || 'Unknown',
  },
  {
    key: 'status',
    label: 'Status',
    render: (value: string) => (
      <Badge variant={value === 'active' ? 'default' : 'secondary'} className="text-xs">
        {value || 'active'}
      </Badge>
    ),
  },
  {
    key: 'subscribedAt',
    label: 'Subscribed',
    render: (value: string) => value ? new Date(value).toLocaleDateString() : '-',
  },
];

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const response = await api.getSubscribers({ limit: '100' });
      if (response.success) {
        const subscribers = (response.data as { subscribers: Subscriber[] })?.subscribers || (response.data as Subscriber[]) || [];
        setSubscribers(subscribers);
      }
    } catch (error) {
      toast.error('Failed to fetch subscribers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = (subscriber: Subscriber) => {
    setSelectedSubscriber(subscriber);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSubscriber) return;
    try {
      await api.deleteSubscriber(selectedSubscriber.id);
      toast.success('Subscriber removed');
      fetchSubscribers();
    } catch (error) {
      toast.error('Failed to remove subscriber');
    }
    setIsDeleteOpen(false);
  };

  return (
    <div>
      <PageHeader title="Newsletter Subscribers" description="Manage newsletter subscriptions" />

      <DataTable columns={columns} data={subscribers} isLoading={isLoading} onDelete={handleDelete} />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Subscriber</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to remove "{selectedSubscriber?.email}" from the newsletter? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
