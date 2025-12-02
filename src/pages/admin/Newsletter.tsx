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
  name: string;
  interests: string[];
  subscribedAt: string;
}

const columns = [
  { key: 'email', label: 'Email' },
  { key: 'name', label: 'Name' },
  {
    key: 'interests',
    label: 'Interests',
    render: (value: string[]) => (
      <div className="flex gap-1 flex-wrap">
        {value?.slice(0, 2).map((interest) => (
          <Badge key={interest} variant="secondary" className="text-xs">{interest}</Badge>
        ))}
        {value?.length > 2 && <Badge variant="outline">+{value.length - 2}</Badge>}
      </div>
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
        setSubscribers((response.data as any)?.subscribers || []);
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
