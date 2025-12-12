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
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Twitter, Youtube, Github, Linkedin, Globe, TrendingUp, TrendingDown, Users, Edit, Trash2 } from 'lucide-react';

interface Creator {
  id: string;
  name: string;
  bio: string;
  profileImage: string;
  socialMedia: Array<{
    platform: string;
    url: string;
  }>;
  creatorCoin: {
    symbol: string;
    marketCap: number;
    price: number;
    change24h: number;
  };
  followers: string;
}

export default function Creators() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    profileImage: '',
    socialMedia: [] as Array<{ platform: string; url: string }>,
    creatorCoin: {
      symbol: '',
      marketCap: 0,
      price: 0,
      change24h: 0,
    },
    followers: '',
  });

  const fetchCreators = async () => {
    setIsLoading(true);
    try {
      const response = await api.getCreators({ limit: '100' });
      if (response.success) {
        const creators = response.data as Creator[];
        setCreators(creators || []);
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
    setFormData({
      name: '',
      bio: '',
      profileImage: '',
      socialMedia: [],
      creatorCoin: {
        symbol: '',
        marketCap: 0,
        price: 0,
        change24h: 0,
      },
      followers: '',
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (creator: Creator) => {
    setSelectedCreator(creator);
    setFormData({
      name: creator.name,
      bio: creator.bio,
      profileImage: creator.profileImage,
      socialMedia: creator.socialMedia,
      creatorCoin: creator.creatorCoin,
      followers: creator.followers,
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
    try {
      if (selectedCreator) {
        await api.updateCreator(selectedCreator.id, formData);
        toast.success('Creator updated');
      } else {
        await api.createCreator(formData);
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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
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
          {creators.map((creator) => (
            <Card key={creator.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={creator.profileImage} />
                    <AvatarFallback>{creator.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-1">{creator.name}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {creator.followers}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {creator.bio && (
                  <CardDescription className="line-clamp-2">
                    {creator.bio}
                  </CardDescription>
                )}
                
                {creator.creatorCoin && (
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{creator.creatorCoin.symbol}</Badge>
                      <span className="text-sm font-medium">${creator.creatorCoin.price.toFixed(2)}</span>
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${
                      creator.creatorCoin.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {creator.creatorCoin.change24h >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(creator.creatorCoin.change24h)}%
                    </div>
                  </div>
                )}

                {creator.socialMedia && creator.socialMedia.length > 0 && (
                  <div className="flex gap-2">
                    {creator.socialMedia.slice(0, 3).map((social) => {
                      const Icon = {
                        twitter: Twitter,
                        youtube: Youtube,
                        github: Github,
                        linkedin: Linkedin,
                      }[social.platform] || Globe;
                      
                      return (
                        <Button
                          key={social.platform}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => window.open(social.url, '_blank')}
                        >
                          <Icon className="h-4 w-4" />
                        </Button>
                      );
                    })}
                    {creator.socialMedia.length > 3 && (
                      <Badge variant="outline">+{creator.socialMedia.length - 3}</Badge>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(creator)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(creator)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {creators.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No creators found. Create your first creator to get started.</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedCreator ? 'Edit Creator' : 'Add Creator'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Profile Image URL</Label>
              <Input value={formData.profileImage} onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Followers</Label>
              <Input value={formData.followers} onChange={(e) => setFormData({ ...formData, followers: e.target.value })} placeholder="125K" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Coin Symbol</Label>
                <Input 
                  value={formData.creatorCoin.symbol} 
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    creatorCoin: { ...formData.creatorCoin, symbol: e.target.value } 
                  })} 
                  placeholder="ALEX" 
                />
              </div>
              <div className="space-y-2">
                <Label>Coin Price</Label>
                <Input 
                  type="number" 
                  step="0.01"
                  value={formData.creatorCoin.price} 
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    creatorCoin: { ...formData.creatorCoin, price: parseFloat(e.target.value) || 0 } 
                  })} 
                  placeholder="12.50" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Market Cap</Label>
                <Input 
                  type="number" 
                  value={formData.creatorCoin.marketCap} 
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    creatorCoin: { ...formData.creatorCoin, marketCap: parseInt(e.target.value) || 0 } 
                  })} 
                  placeholder="2500000" 
                />
              </div>
              <div className="space-y-2">
                <Label>24h Change (%)</Label>
                <Input 
                  type="number" 
                  step="0.1"
                  value={formData.creatorCoin.change24h} 
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    creatorCoin: { ...formData.creatorCoin, change24h: parseFloat(e.target.value) || 0 } 
                  })} 
                  placeholder="5.2" 
                />
              </div>
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
