import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import PageHeader from '@/components/admin/PageHeader';
import DataTable from '@/components/admin/DataTable';
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
import { Badge } from '@/components/ui/badge';

interface Contact {
  id: string;
  fullName: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  subscribeNewsletter: boolean;
  submittedAt: string;
}

const columns = [
  { key: 'fullName', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'company', label: 'Company' },
  { key: 'subject', label: 'Subject' },
  {
    key: 'subscribeNewsletter',
    label: 'Newsletter',
    render: (value: boolean) => <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Yes' : 'No'}</Badge>,
  },
  {
    key: 'submittedAt',
    label: 'Date',
    render: (value: string) => value ? new Date(value).toLocaleDateString() : '-',
  },
];

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const response = await api.getContacts({ limit: '100' });
      if (response.success) {
        const contacts = (response.data as { contacts: Contact[] })?.contacts || (response.data as Contact[]) || [];
        setContacts(contacts);
      }
    } catch (error) {
      toast.error('Failed to fetch contacts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleView = (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewOpen(true);
  };

  const handleDelete = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedContact) return;
    try {
      await api.deleteContact(selectedContact.id);
      toast.success('Contact deleted');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to delete contact');
    }
    setIsDeleteOpen(false);
  };

  return (
    <div>
      <PageHeader title="Contact Messages" description="View and manage contact form submissions" />

      <DataTable columns={columns} data={contacts} isLoading={isLoading} onView={handleView} onDelete={handleDelete} />

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Contact Message</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedContact.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedContact.email}</p>
                </div>
              </div>
              {selectedContact.company && (
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{selectedContact.company}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Newsletter Subscription</p>
                  <Badge variant={selectedContact.subscribeNewsletter ? 'default' : 'secondary'}>
                    {selectedContact.subscribeNewsletter ? 'Subscribed' : 'Not Subscribed'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(selectedContact.submittedAt).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Subject</p>
                <p className="font-medium">{selectedContact.subject}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Message</p>
                <p className="mt-1 p-3 bg-muted rounded-md text-sm">{selectedContact.message}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this message from "{selectedContact?.fullName}"? This action cannot be undone.</AlertDialogDescription>
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
