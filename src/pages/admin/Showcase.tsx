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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface ShowcaseProject {
  id: string;
  title: string;
  description: string;
  category: string;
  creator: string;
  featured: boolean;
  trending: boolean;
  stats: {
    stars: number;
  };
}

const columns = [
  { key: 'title', label: 'Title' },
  {
    key: 'category',
    label: 'Category',
    render: (value: string) => <Badge variant="outline">{value}</Badge>,
  },
  { key: 'creator', label: 'Creator' },
  {
    key: 'featured',
    label: 'Featured',
    render: (value: boolean) => (
      <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Yes' : 'No'}</Badge>
    ),
  },
  {
    key: 'trending',
    label: 'Trending',
    render: (value: boolean) => (
      <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Yes' : 'No'}</Badge>
    ),
  },
  {
    key: 'stats',
    label: 'Stars',
    render: (value: any) => value?.stars?.toLocaleString() || '0',
  },
];

export default function Showcase() {
  const [projects, setProjects] = useState<ShowcaseProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ShowcaseProject | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'DeFi',
    creator: '',
    featured: false,
    trending: false,
    tags: '',
  });

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminShowcase({ limit: '100' });
      if (response.success) {
        setProjects((response.data as any)?.projects || []);
      }
    } catch (error) {
      toast.error('Failed to fetch showcase projects');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAdd = () => {
    setSelectedProject(null);
    setFormData({ title: '', description: '', category: 'DeFi', creator: '', featured: false, trending: false, tags: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (project: ShowcaseProject) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      creator: project.creator,
      featured: project.featured,
      trending: project.trending,
      tags: '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (project: ShowcaseProject) => {
    setSelectedProject(project);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProject) return;
    try {
      await api.deleteShowcase(selectedProject.id);
      toast.success('Project deleted');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
    setIsDeleteOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      tags: formData.tags.split(',').map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (selectedProject) {
        await api.updateShowcase(selectedProject.id, data);
        toast.success('Project updated');
      } else {
        await api.createShowcase(data);
        toast.success('Project created');
      }
      setIsDialogOpen(false);
      fetchProjects();
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  return (
    <div>
      <PageHeader title="Showcase" description="Manage showcase projects" onAdd={handleAdd} addLabel="Add Project" />

      <DataTable columns={columns} data={projects} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DeFi">DeFi</SelectItem>
                    <SelectItem value="NFT">NFT</SelectItem>
                    <SelectItem value="DAO">DAO</SelectItem>
                    <SelectItem value="GameFi">GameFi</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Social">Social</SelectItem>
                    <SelectItem value="Tools">Tools</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Creator</Label>
                <Input value={formData.creator} onChange={(e) => setFormData({ ...formData, creator: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="Solidity, React, Web3" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={formData.featured} onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })} />
                <Label>Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.trending} onCheckedChange={(checked) => setFormData({ ...formData, trending: checked })} />
                <Label>Trending</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{selectedProject ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete "{selectedProject?.title}"? This action cannot be undone.</AlertDialogDescription>
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
