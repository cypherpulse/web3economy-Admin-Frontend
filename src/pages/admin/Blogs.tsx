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
import { Calendar, Eye, Heart, Edit, Trash2, User } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  author: {
    name: string;
    role: string;
    bio?: string;
    avatar?: string;
  };
  category: string;
  image?: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  color?: string;
  publishedDate?: string;
  stats: {
    views: number;
    likes: number;
    comments: number;
    bookmarks: number;
  };
  readTime: string;
  createdAt: string;
  updatedAt: string;
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    authorName: '',
    authorRole: '',
    authorBio: '',
    authorAvatar: '',
    category: 'Tutorial',
    image: '',
    tags: [] as string[],
    featured: false,
    published: true,
    color: 'from-blue-500 to-purple-600',
  });

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminBlogs({ limit: '100' });
      if (response.success) {
        const blogs = (response.data as { posts: Blog[] })?.posts || [];
        setBlogs(blogs);
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
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      authorName: '',
      authorRole: '',
      authorBio: '',
      authorAvatar: '',
      category: 'Tutorial',
      image: '',
      tags: [],
      featured: false,
      published: true,
      color: 'from-blue-500 to-purple-600',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (blog: Blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content || '',
      authorName: blog.author.name,
      authorRole: blog.author.role,
      authorBio: blog.author.bio || '',
      authorAvatar: blog.author.avatar || '',
      category: blog.category,
      image: blog.image || '',
      tags: blog.tags,
      featured: blog.featured,
      published: blog.published,
      color: blog.color || 'from-blue-500 to-purple-600',
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
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      author: {
        name: formData.authorName,
        role: formData.authorRole,
        bio: formData.authorBio,
        avatar: formData.authorAvatar,
      },
      category: formData.category,
      image: formData.image,
      tags: formData.tags,
      featured: formData.featured,
      published: formData.published,
      color: formData.color,
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
          {blogs.map((blog) => (
            <Card key={blog.id} className="overflow-hidden">
              {blog.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
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
                    <CardTitle className="text-lg line-clamp-2">{blog.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <User className="h-4 w-4" />
                      {blog.author.name}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    {blog.featured && <Badge variant="default">Featured</Badge>}
                    {!blog.published && <Badge variant="secondary">Draft</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {blog.stats.views.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {blog.stats.likes.toLocaleString()}
                  </div>
                  <span className="text-muted-foreground">{blog.readTime}</span>
                </div>
                <Badge variant="outline" className="w-fit">
                  {blog.category}
                </Badge>
                {blog.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {blog.excerpt}
                  </p>
                )}
                {blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {blog.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{blog.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(blog)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(blog)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {blogs.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blogs found. Create your first blog post to get started.</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedBlog ? 'Edit Blog' : 'Add Blog'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="News">News</SelectItem>
                    <SelectItem value="Tutorial">Tutorial</SelectItem>
                    <SelectItem value="Guide">Guide</SelectItem>
                    <SelectItem value="Industry News">Industry News</SelectItem>
                    <SelectItem value="Updates">Updates</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Color Theme</Label>
                <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="from-blue-500 to-purple-600">Blue to Purple</SelectItem>
                    <SelectItem value="from-green-500 to-teal-600">Green to Teal</SelectItem>
                    <SelectItem value="from-purple-500 to-pink-600">Purple to Pink</SelectItem>
                    <SelectItem value="from-yellow-500 to-orange-600">Yellow to Orange</SelectItem>
                    <SelectItem value="from-red-500 to-pink-600">Red to Pink</SelectItem>
                    <SelectItem value="from-gray-500 to-gray-600">Gray</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Author Information</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Author Name</Label>
                  <Input value={formData.authorName} onChange={(e) => setFormData({ ...formData, authorName: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Author Role</Label>
                  <Input value={formData.authorRole} onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })} placeholder="Senior Developer" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Author Bio</Label>
                  <Input value={formData.authorBio} onChange={(e) => setFormData({ ...formData, authorBio: e.target.value })} placeholder="Brief bio about the author" />
                </div>
                <div className="space-y-2">
                  <Label>Author Avatar URL</Label>
                  <Input value={formData.authorAvatar} onChange={(e) => setFormData({ ...formData, authorAvatar: e.target.value })} placeholder="https://..." />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
            </div>

            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input value={formData.tags?.join(', ')} onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })} placeholder="DeFi, Web3, Tutorial" />
            </div>

            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={3} required />
            </div>

            <div className="space-y-2">
              <Label>Content (Markdown)</Label>
              <MDEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value || '' })}
                preview="edit"
                hideToolbar={false}
                visibleDragBar={false}
                data-color-mode="light"
                className="min-h-[400px]"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />
                <Label htmlFor="featured">Featured Blog</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="published" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} />
                <Label htmlFor="published">Published</Label>
              </div>
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
