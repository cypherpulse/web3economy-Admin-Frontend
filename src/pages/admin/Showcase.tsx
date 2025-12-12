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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Users, TrendingUp, ExternalLink, Edit, Trash2, Github, Globe, Twitter, MessageCircle } from 'lucide-react';

interface ShowcaseProject {
  id: string;
  title: string;
  description: string;
  category: string;
  creator: string;
  image: string;
  tags: string[];
  stats: {
    stars: number;
    users: string;
    tvl: string;
  };
  links: {
    website?: string;
    github?: string;
    twitter?: string;
    discord?: string;
    documentation?: string;
  };
  featured: boolean;
  trending: boolean;
  color: 'mint' | 'gold';
  published: boolean;
  slug: string;
}

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
    image: '',
    tags: [] as string[],
    stats: {
      stars: 0,
      users: '',
      tvl: ''
    },
    links: {
      website: '',
      github: '',
      twitter: '',
      discord: '',
      documentation: ''
    } as {
      website?: string;
      github?: string;
      twitter?: string;
      discord?: string;
      documentation?: string;
    },
    featured: false,
    trending: false,
    color: 'mint' as 'mint' | 'gold',
    published: true,
  });

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminShowcase({ limit: '100' });
      if (response.success) {
        const projects = (response.data as { projects: ShowcaseProject[] })?.projects || [];
        setProjects(projects);
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
    setFormData({
      title: '',
      description: '',
      category: 'DeFi',
      creator: '',
      image: '',
      tags: [],
      stats: {
        stars: 0,
        users: '',
        tvl: ''
      },
      links: {
        website: '',
        github: '',
        twitter: '',
        discord: '',
        documentation: ''
      },
      featured: false,
      trending: false,
      color: 'mint' as 'mint' | 'gold',
      published: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (project: ShowcaseProject) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      creator: project.creator,
      image: project.image,
      tags: Array.isArray(project.tags) ? project.tags : [],
      stats: project.stats,
      links: project.links,
      featured: project.featured,
      trending: project.trending,
      color: project.color as 'mint' | 'gold',
      published: project.published,
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
    try {
      // Prepare data for API - ensure required fields are present
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        creator: formData.creator.trim(),
        image: formData.image.trim() || undefined,
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        stats: {
          stars: formData.stats.stars || 0,
          users: formData.stats.users.trim() || undefined,
          tvl: formData.stats.tvl.trim() || undefined,
        },
        links: {
          website: formData.links.website.trim() || undefined,
          github: formData.links.github.trim() || undefined,
          twitter: formData.links.twitter.trim() || undefined,
          discord: formData.links.discord.trim() || undefined,
          documentation: formData.links.documentation.trim() || undefined,
        },
        featured: formData.featured,
        trending: formData.trending,
        color: formData.color,
        published: formData.published,
      };

      // Remove empty links object properties
      if (submitData.links && Object.values(submitData.links).every(v => !v)) {
        delete submitData.links;
      }

      // Remove empty stats object properties
      if (submitData.stats && Object.values(submitData.stats).every(v => !v)) {
        delete submitData.stats;
      }

      console.log('Submitting data:', submitData);

      if (selectedProject) {
        await api.updateShowcase(selectedProject.id, submitData);
        toast.success('Project updated');
      } else {
        await api.createShowcase(submitData);
        toast.success('Project created');
      }
      setIsDialogOpen(false);
      fetchProjects();
    } catch (error) {
      console.error('API Error:', error);
      toast.error(`Failed to save project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div>
      <PageHeader title="Showcase" description="Manage showcase projects" onAdd={handleAdd} addLabel="Add Project" />

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
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              {project.image && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
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
                    <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <span>by {project.creator}</span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    {project.featured && (
                      <Badge variant="default" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    {project.trending && (
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {project.stats.stars.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {project.stats.users}
                  </div>
                </div>
                <Badge variant="outline" className="w-fit">
                  {project.category}
                </Badge>
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                )}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(project)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(project)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {projects.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found. Create your first showcase project to get started.</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label>Image URL</Label>
              <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://example.com/image.jpg" />
            </div>
            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input value={formData.tags.join(', ')} onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) })} placeholder="Solidity, React, Web3" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Stars</Label>
                <Input type="number" value={formData.stats.stars} onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, stars: parseInt(e.target.value) || 0 } })} />
              </div>
              <div className="space-y-2">
                <Label>Users</Label>
                <Input value={formData.stats.users} onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, users: e.target.value } })} placeholder="50K+" />
              </div>
              <div className="space-y-2">
                <Label>TVL</Label>
                <Input value={formData.stats.tvl} onChange={(e) => setFormData({ ...formData, stats: { ...formData.stats, tvl: e.target.value } })} placeholder="$25M" />
              </div>
            </div>
            <div className="space-y-4">
              <Label>Links</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input value={formData.links.website} onChange={(e) => setFormData({ ...formData, links: { ...formData.links, website: e.target.value } })} placeholder="Website URL" />
                <Input value={formData.links.github} onChange={(e) => setFormData({ ...formData, links: { ...formData.links, github: e.target.value } })} placeholder="GitHub URL" />
                <Input value={formData.links.twitter} onChange={(e) => setFormData({ ...formData, links: { ...formData.links, twitter: e.target.value } })} placeholder="Twitter URL" />
                <Input value={formData.links.discord} onChange={(e) => setFormData({ ...formData, links: { ...formData.links, discord: e.target.value } })} placeholder="Discord URL" />
                <Input value={formData.links.documentation} onChange={(e) => setFormData({ ...formData, links: { ...formData.links, documentation: e.target.value } })} placeholder="Documentation URL" className="md:col-span-2" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Color</Label>
                <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value as 'mint' | 'gold' })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mint">Mint</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.published} onCheckedChange={(checked) => setFormData({ ...formData, published: checked })} />
                <Label>Published</Label>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
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
