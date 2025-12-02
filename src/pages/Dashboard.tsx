import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import {
  Calendar,
  Users,
  FolderKanban,
  FileText,
  BookOpen,
  Layers,
  Activity,
  TrendingUp,
  Eye,
  Star,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Badge } from '@/components/ui/badge';

interface Stats {
  events: number;
  creators: number;
  projects: number;
  resources: number;
  blogs: number;
  showcase: number;
}

interface RecentItem {
  id: string;
  title: string;
  type: string;
  date: string;
}

const mockActivityData = [
  { name: 'Mon', views: 400, signups: 24 },
  { name: 'Tue', views: 300, signups: 13 },
  { name: 'Wed', views: 520, signups: 38 },
  { name: 'Thu', views: 478, signups: 29 },
  { name: 'Fri', views: 590, signups: 48 },
  { name: 'Sat', views: 350, signups: 18 },
  { name: 'Sun', views: 410, signups: 22 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    events: 0,
    creators: 0,
    projects: 0,
    resources: 0,
    blogs: 0,
    showcase: 0,
  });
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<'connected' | 'error' | 'loading'>('loading');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [events, creators, projects, resources, blogs, showcase, health] = await Promise.all([
          api.getEvents({ limit: '5' }),
          api.getCreators({ limit: '5' }),
          api.getProjects({ limit: '5' }),
          api.getResources({ limit: '5' }),
          api.getBlogs({ limit: '5' }),
          api.getShowcase({ limit: '5' }),
          api.health(),
        ]);

        setStats({
          events: (events.data as any)?.total || 0,
          creators: (creators.data as any)?.total || 0,
          projects: (projects.data as any)?.total || 0,
          resources: (resources.data as any)?.total || 0,
          blogs: (blogs.data as any)?.total || 0,
          showcase: (showcase.data as any)?.total || 0,
        });

        const recent: RecentItem[] = [];
        const eventsData = (events.data as any)?.events || [];
        const blogsData = (blogs.data as any)?.posts || [];
        
        eventsData.slice(0, 3).forEach((e: any) => {
          recent.push({ id: e.id, title: e.title, type: 'Event', date: e.date || e.createdAt });
        });
        blogsData.slice(0, 3).forEach((b: any) => {
          recent.push({ id: b.id, title: b.title, type: 'Blog', date: b.publishedDate || b.createdAt });
        });
        
        setRecentItems(recent.slice(0, 5));
        setApiStatus((health as any)?.status === 'OK' ? 'connected' : 'error');
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setApiStatus('error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Events', value: stats.events, icon: Calendar, change: '+12%', positive: true },
    { title: 'Creators', value: stats.creators, icon: Users, change: '+8%', positive: true },
    { title: 'Projects', value: stats.projects, icon: FolderKanban, change: '+15%', positive: true },
    { title: 'Resources', value: stats.resources, icon: FileText, change: '+5%', positive: true },
    { title: 'Blogs', value: stats.blogs, icon: BookOpen, change: '-2%', positive: false },
    { title: 'Showcase', value: stats.showcase, icon: Layers, change: '+20%', positive: true },
  ];

  const pieData = [
    { name: 'Events', value: stats.events || 1 },
    { name: 'Creators', value: stats.creators || 1 },
    { name: 'Projects', value: stats.projects || 1 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to your Web3 Economy admin panel</p>
        </div>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center gap-3 p-3">
            <Activity className={`h-4 w-4 ${apiStatus === 'connected' ? 'text-primary' : 'text-destructive'}`} />
            <div>
              <p className="text-xs text-muted-foreground">API Status</p>
              <p className={`text-sm font-medium ${apiStatus === 'connected' ? 'text-primary' : 'text-destructive'}`}>
                {apiStatus === 'loading' ? 'Checking...' : apiStatus === 'connected' ? 'Connected' : 'Error'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? '...' : stat.value.toLocaleString()}</div>
              <div className={`flex items-center text-xs mt-1 ${stat.positive ? 'text-primary' : 'text-destructive'}`}>
                {stat.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                <span>{stat.change} from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="signups" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-sm text-muted-foreground">Signups</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers className="h-4 w-4 text-primary" />
              Content Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {pieData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="h-4 w-4 text-primary" />
              Recent Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent items found</p>
            ) : (
              <div className="space-y-3">
                {recentItems.map((item, index) => (
                  <div key={item.id || index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">{item.type}</Badge>
                      <span className="text-sm font-medium truncate max-w-[200px]">{item.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.date ? new Date(item.date).toLocaleDateString() : '-'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="h-4 w-4 text-accent" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Use the sidebar navigation to manage your platform content.</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'New Event', icon: Calendar },
                { label: 'Add Creator', icon: Users },
                { label: 'New Blog', icon: BookOpen },
                { label: 'Add Project', icon: FolderKanban },
              ].map((action) => (
                <div key={action.label} className="flex items-center gap-2 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                  <action.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm">{action.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
