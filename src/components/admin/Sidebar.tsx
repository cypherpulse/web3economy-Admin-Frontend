import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar,
  Users,
  FolderKanban,
  FileText,
  BookOpen,
  Layers,
  Mail,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/events', icon: Calendar, label: 'Events' },
  { to: '/dashboard/creators', icon: Users, label: 'Creators' },
  { to: '/dashboard/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/dashboard/resources', icon: FileText, label: 'Resources' },
  { to: '/dashboard/blogs', icon: BookOpen, label: 'Blogs' },
  { to: '/dashboard/showcase', icon: Layers, label: 'Showcase' },
  { to: '/dashboard/newsletter', icon: Mail, label: 'Newsletter' },
  { to: '/dashboard/contacts', icon: MessageSquare, label: 'Contacts' },
];

export default function Sidebar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-primary">Web3 Admin</h1>
        <p className="text-sm text-sidebar-foreground/60 mt-1">{admin?.name || admin?.email}</p>
        {admin?.role && (
          <span className="text-xs text-sidebar-foreground/40 capitalize">{admin.role}</span>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
