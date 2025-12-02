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

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  featured: boolean;
  stats: {
    views: number;
    likes: number;
  };
}

const columns = [
  { key: 'title', label: 'Title' },
  {
    key: 'category',
    label: 'Category',
    render: (value: string) => <Badge variant="outline">{value}</Badge>,
  },
  { key: 'readTime', label: 'Read Time' },
  {
    key: 'featured',
    label: 'Featured',
    render: (value: boolean) => (
      <Badge variant={value ? 'default' : 'secondary'}>{value ? 'Yes' : 'No'}</Badge>
    ),
  },
  {
    key: 'stats',
    label: 'Views',
    render: (value: any) => value?.views?.toLocaleString() || '0',
  },
];

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: 'Tutorial',
    readTime: '',
    featured: false,
    tags: '',
  });

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminBlogs({ limit: '100' });
      if (response.success) {
        setBlogs((response.data as any)?.posts || []);
      }
    } catch (error) {
      toast.error('Failed to fetch blogs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleAdd = () => {
    setSelectedBlog(null);
    setFormData({ title: '', excerpt: '', category: 'Tutorial', readTime: '', featured: false, tags: '' });
    setIsDialogOpen(true);
  };

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      category: blog.category,
      readTime: blog.readTime,
      featured: blog.featured,
      tags: '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedBlog) return;
    try {
      await api.deleteBlog(selectedBlog.id);
      toast.success('Blog deleted');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete blog');
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
      if (selectedBlog) {
        await api.updateBlog(selectedBlog.id, data);
        toast.success('Blog updated');
      } else {
        await api.createBlog(data);
        toast.success('Blog created');
      }
      setIsDialogOpen(false);
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to save blog');
    }
  };

  return (
    <div>
      <PageHeader title="Blogs" description="Manage blog posts" onAdd={handleAdd} addLabel="Add Blog" />

      <DataTable columns={columns} data={blogs} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedBlog ? 'Edit Blog' : 'Add Blog'}</DialogTitle>
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
                    <SelectItem value="News">News</SelectItem>
                    <SelectItem value="Tutorial">Tutorial</SelectItem>
                    <SelectItem value="Guide">Guide</SelectItem>
                    <SelectItem value="Industry News">Industry News</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Read Time</Label>
                <Input value={formData.readTime} onChange={(e) => setFormData({ ...formData, readTime: e.target.value })} placeholder="8 min" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="DeFi, Web3, Tutorial" />
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={3} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.featured} onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })} />
              <Label>Featured</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{selectedBlog ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete "{selectedBlog?.title}"? This action cannot be undone.</AlertDialogDescription>
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
