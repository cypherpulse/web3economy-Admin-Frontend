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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Creator {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  expertise: string[];
  featured: boolean;
}

const columns = [
  {
    key: 'avatar',
    label: 'Avatar',
    render: (value: string, item: Creator) => (
      <Avatar className="h-10 w-10">
        <AvatarImage src={value} />
        <AvatarFallback>{item.name?.charAt(0)}</AvatarFallback>
      </Avatar>
    ),
  },
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  {
    key: 'expertise',
    label: 'Expertise',
    render: (value: string[]) => (
      <div className="flex gap-1 flex-wrap">
        {value?.slice(0, 2).map((skill) => (
          <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
        ))}
        {value?.length > 2 && <Badge variant="outline">+{value.length - 2}</Badge>}
      </div>
    ),
  },
  {
    key: 'featured',
    label: 'Featured',
    render: (value: boolean) => (
      <Badge variant={value ? 'default' : 'outline'}>{value ? 'Yes' : 'No'}</Badge>
    ),
  },
];

export default function Creators() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    avatar: '',
    expertise: '',
    featured: false,
  });

  const fetchCreators = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminCreators({ limit: '100' });
      if (response.success) {
        setCreators((response.data as any)?.creators || []);
      }
    } catch (error) {
      toast.error('Failed to fetch creators');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  const handleAdd = () => {
    setSelectedCreator(null);
    setFormData({ name: '', role: '', bio: '', avatar: '', expertise: '', featured: false });
    setIsDialogOpen(true);
  };

  const handleEdit = (creator: Creator) => {
    setSelectedCreator(creator);
    setFormData({
      name: creator.name,
      role: creator.role,
      bio: creator.bio,
      avatar: creator.avatar,
      expertise: creator.expertise?.join(', ') || '',
      featured: creator.featured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (creator: Creator) => {
    setSelectedCreator(creator);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCreator) return;
    try {
      await api.deleteCreator(selectedCreator.id);
      toast.success('Creator deleted');
      fetchCreators();
    } catch (error) {
      toast.error('Failed to delete creator');
    }
    setIsDeleteOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      expertise: formData.expertise.split(',').map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (selectedCreator) {
        await api.updateCreator(selectedCreator.id, data);
        toast.success('Creator updated');
      } else {
        await api.createCreator(data);
        toast.success('Creator created');
      }
      setIsDialogOpen(false);
      fetchCreators();
    } catch (error) {
      toast.error('Failed to save creator');
    }
  };

  return (
    <div>
      <PageHeader title="Creators" description="Manage platform creators" onAdd={handleAdd} addLabel="Add Creator" />

      <DataTable columns={columns} data={creators} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedCreator ? 'Edit Creator' : 'Add Creator'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Avatar URL</Label>
              <Input value={formData.avatar} onChange={(e) => setFormData({ ...formData, avatar: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Expertise (comma-separated)</Label>
              <Input value={formData.expertise} onChange={(e) => setFormData({ ...formData, expertise: e.target.value })} placeholder="Solidity, React, DeFi" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.featured} onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })} />
              <Label>Featured</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{selectedCreator ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Creator</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete "{selectedCreator?.name}"? This action cannot be undone.</AlertDialogDescription>
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
