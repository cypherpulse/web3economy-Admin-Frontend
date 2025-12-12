import { useState, useEffect } from 'react';
import { api, ResourceInput } from '@/lib/api';
import { toast } from 'sonner';
import PageHeader from '@/components/admin/PageHeader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Star, Clock, Users, Download, ExternalLink, Edit, Trash2 } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  level: string;
  duration: string;
  author: string;
  rating: number;
  students: number;
  downloads: number;
  image: string;
  resourceUrl: string;
  provider: string;
  tags: string[];
  slug: string;
  featured: boolean;
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Tutorial',
    category: 'Getting Started',
    level: 'Beginner',
    duration: '',
    author: '',
    rating: 0,
    students: 0,
    image: '',
    resourceUrl: '',
    provider: '',
    tags: [] as string[],
    featured: false,
  });

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const response = await api.getResources({ limit: '100' });
      if (response.success) {
        const resources = (response.data as { resources: Resource[] })?.resources || [];
        setResources(resources);
      }
    } catch (error) {
      toast.error('Failed to fetch resources');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleAdd = () => {
    setSelectedResource(null);
    setFormData({
      title: '',
      description: '',
      type: 'Tutorial',
      category: 'Getting Started',
      level: 'Beginner',
      duration: '',
      author: '',
      rating: 0,
      students: 0,
      image: '',
      resourceUrl: '',
      provider: '',
      tags: [],
      featured: false,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (resource: Resource) => {
    setSelectedResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description,
      type: resource.type,
      category: resource.category,
      level: resource.level,
      duration: resource.duration,
      author: resource.author,
      rating: resource.rating,
      students: resource.students,
      image: resource.image,
      resourceUrl: resource.resourceUrl,
      provider: resource.provider,
      tags: resource.tags,
      featured: resource.featured,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (resource: Resource) => {
    setSelectedResource(resource);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedResource) return;
    try {
      await api.deleteResource(selectedResource.id);
      toast.success('Resource deleted');
      fetchResources();
    } catch (error) {
      toast.error('Failed to delete resource');
    }
    setIsDeleteOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedResource) {
        await api.updateResource(selectedResource.id, formData);
        toast.success('Resource updated');
      } else {
        await api.createResource(formData);
        toast.success('Resource created');
      }
      setIsDialogOpen(false);
      fetchResources();
    } catch (error) {
      toast.error('Failed to save resource');
    }
  };

  return (
    <div>
      <PageHeader title="Resources" description="Manage learning resources" onAdd={handleAdd} addLabel="Add Resource" />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
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
          {resources.map((resource) => (
            <Card key={resource.id} className="overflow-hidden">
              {resource.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={resource.image}
                    alt={resource.title}
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
                    <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {resource.type}
                      </Badge>
                      {resource.featured && (
                        <Badge variant="default" className="text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {resource.rating.toFixed(1)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {resource.duration}min
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {resource.students.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">
                    {resource.level}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {resource.category}
                  </Badge>
                </div>
                {resource.tags && resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {resource.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{resource.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                {resource.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {resource.description}
                  </p>
                )}
                {resource.provider && (
                  <div className="text-sm text-muted-foreground">
                    By {resource.provider}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                {resource.resourceUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(resource.resourceUrl, '_blank')}
                    className="flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(resource)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(resource)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {resources.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No resources found. Create your first resource to get started.</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedResource ? 'Edit Resource' : 'Add Resource'}</DialogTitle>
            <DialogDescription>
              {selectedResource ? 'Update the resource details below.' : 'Fill in the details to create a new resource.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tutorial">Tutorial</SelectItem>
                    <SelectItem value="Documentation">Documentation</SelectItem>
                    <SelectItem value="Tool">Tool</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Level</Label>
                <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="All Levels">All Levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="45 mins, 2 hours, N/A" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                <Input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label>Students</Label>
                <Input type="number" value={formData.students} onChange={(e) => setFormData({ ...formData, students: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Provider</Label>
                <Input value={formData.provider} onChange={(e) => setFormData({ ...formData, provider: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Resource URL</Label>
              <Input value={formData.resourceUrl} onChange={(e) => setFormData({ ...formData, resourceUrl: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input value={formData.tags?.join(', ')} onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })} placeholder="web3, blockchain, tutorial" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />
              <Label htmlFor="featured">Featured Resource</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{selectedResource ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete "{selectedResource?.title}"? This action cannot be undone.</AlertDialogDescription>
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
