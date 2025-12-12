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
  Mail,
  MessageSquare,
  Shield,
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
import { useAuth } from '@/contexts/AuthContext';

interface Stats {
  events: number;
  creators: number;
  projects: number;
  resources: number;
  blogs: number;
  showcase: number;
  subscribers: number;
  contacts: number;
  admins: number;
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
  const { admin: currentAdmin } = useAuth();
  const [stats, setStats] = useState<Stats>({
    events: 0,
    creators: 0,
    projects: 0,
    resources: 0,
    blogs: 0,
    showcase: 0,
    subscribers: 0,
    contacts: 0,
    admins: 0,
  });
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<'connected' | 'error' | 'loading'>('loading');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiCalls = [
          api.getEvents({ limit: '5' }),
          api.getCreators({ limit: '5' }),
          api.getProjects({ limit: '5' }),
          api.getResources({ limit: '5' }),
          api.getBlogs({ limit: '5' }),
          api.getShowcase({ limit: '5' }),
          api.getSubscribers({ limit: '5' }),
          api.getContacts({ limit: '5' }),
          api.health(),
        ];

        if (currentAdmin?.role === 'superadmin') {
          apiCalls.splice(8, 0, api.getAdminAdmins({ limit: '5' }));
        }

        const results = await Promise.all(apiCalls);

        const [
          events,
          creators,
          projects,
          resources,
          blogs,
          showcase,
          subscribers,
          contacts,
          health,
          admins,
        ] = results;

        setStats({
          events: (events.data as any)?.total || (events.data as any)?.events?.length || (Array.isArray(events.data) ? events.data.length : 0),
          creators: (creators.data as any)?.total || (creators.data as any)?.creators?.length || (Array.isArray(creators.data) ? creators.data.length : 0),
          projects: (projects.data as any)?.total || (projects.data as any)?.projects?.length || (Array.isArray(projects.data) ? projects.data.length : 0),
          resources: (resources.data as any)?.total || 0,
          blogs: (blogs.data as any)?.total || 0,
          showcase: (showcase.data as any)?.total || 0,
          subscribers: (subscribers.data as any)?.total || 0,
          contacts: (contacts.data as any)?.total || (contacts.data as any)?.contacts?.length || (Array.isArray(contacts.data) ? contacts.data.length : 0),
          admins: currentAdmin?.role === 'superadmin' ? ((admins as any)?.data as any)?.total || ((admins as any)?.data as any)?.admins?.length || (Array.isArray((admins as any)?.data) ? (admins as any).data.length : 0) : 0,
        });

        const recent: RecentItem[] = [];
        const eventsData = (events.data as any)?.events || (Array.isArray(events.data) ? events.data : []);
        const blogsData = (blogs.data as any)?.posts || [];
        const creatorsData = (creators.data as any)?.creators || (Array.isArray(creators.data) ? creators.data : []);
        const projectsData = (projects.data as any)?.projects || (Array.isArray(projects.data) ? projects.data : []);
        const showcaseData = (showcase.data as any)?.projects || [];
        const subscribersData = (subscribers.data as any)?.subscribers || [];
        const contactsData = (contacts.data as any)?.contacts || [];
        
        // Add recent items from different sources
        eventsData.slice(0, 2).forEach((e: any) => {
          recent.push({ id: e.id, title: e.title, type: 'Event', date: e.date || e.createdAt });
        });
        blogsData.slice(0, 2).forEach((b: any) => {
          recent.push({ id: b.id, title: b.title, type: 'Blog', date: b.publishedDate || b.createdAt });
        });
        creatorsData.slice(0, 1).forEach((c: any) => {
          recent.push({ id: c.id, title: c.name || c.title, type: 'Creator', date: c.createdAt });
        });
        projectsData.slice(0, 1).forEach((p: any) => {
          recent.push({ id: p.id, title: p.title, type: 'Project', date: p.createdAt });
        });
        showcaseData.slice(0, 1).forEach((s: any) => {
          recent.push({ id: s.id, title: s.title, type: 'Showcase', date: s.createdAt });
        });
        subscribersData.slice(0, 1).forEach((s: any) => {
          recent.push({ id: s.id, title: s.email || s.name, type: 'Subscriber', date: s.createdAt });
        });
        contactsData.slice(0, 1).forEach((c: any) => {
          recent.push({ id: c.id, title: c.name || c.email, type: 'Contact', date: c.createdAt });
        });
        
        // Sort by date and take the most recent 5
        setRecentItems(recent
          .filter(item => item.date)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5)
        );
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
    { title: 'Subscribers', value: stats.subscribers, icon: Mail, change: '+25%', positive: true },
    { title: 'Contacts', value: stats.contacts, icon: MessageSquare, change: '+10%', positive: true },
    ...(currentAdmin?.role === 'superadmin' ? [{ title: 'Admins', value: stats.admins, icon: Shield, change: '+5%', positive: true }] : []),
  ];

  const pieData = [
    { name: 'Events', value: stats.events || 1 },
    { name: 'Creators', value: stats.creators || 1 },
    { name: 'Projects', value: stats.projects || 1 },
    { name: 'Resources', value: stats.resources || 1 },
    { name: 'Blogs', value: stats.blogs || 1 },
    { name: 'Showcase', value: stats.showcase || 1 },
    { name: 'Subscribers', value: stats.subscribers || 1 },
    { name: 'Contacts', value: stats.contacts || 1 },
    ...(currentAdmin?.role === 'superadmin' ? [{ name: 'Admins', value: stats.admins || 1 }] : []),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Welcome to your Web3 Economy admin panel</p>
        </div>
        <Card className="border-primary/20 bg-primary/5 w-full sm:w-auto">
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

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{isLoading ? '...' : stat.value.toLocaleString()}</div>
              <div className={`flex items-center text-xs mt-1 ${stat.positive ? 'text-primary' : 'text-destructive'}`}>
                {stat.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                <span className="hidden sm:inline">{stat.change} from last month</span>
                <span className="sm:hidden">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] sm:h-[300px]">
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
            <div className="flex justify-center gap-4 sm:gap-6 mt-4">
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
            <div className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-2">
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

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
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
                  <div key={item.id || index} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <Badge variant="outline" className="text-xs flex-shrink-0">{item.type}</Badge>
                      <span className="text-sm font-medium truncate">{item.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
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
                  <action.icon className="h-4 w-4 text-primary flex-shrink-0" />
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
