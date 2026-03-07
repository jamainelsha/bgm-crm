// BGM CRM — Main Layout Component
// Design: Precision Slate — Fixed 240px sidebar (deep warm slate) + top bar + content area
// Sidebar groups: Main, Residents, Operations, Finance, Settings

import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard, Users, Home, FileText, Search, Bell, ChevronDown,
  ClipboardList, Wrench, Calendar, UserPlus, BarChart3, FolderOpen,
  Settings, LogOut, Menu, X, Building2, ChevronRight, AlertTriangle,
  CheckSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { currentUser } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  badgeVariant?: 'default' | 'destructive' | 'warning';
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Main',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    ]
  },
  {
    label: 'Village',
    items: [
      { label: 'Residents', href: '/residents', icon: Users },
      { label: 'Units', href: '/units', icon: Home },
      { label: 'Contracts', href: '/contracts', icon: FileText },
    ]
  },
  {
    label: 'Sales & Enquiries',
    items: [
      { label: 'Enquiries', href: '/enquiries', icon: UserPlus },
      { label: 'Waitlist', href: '/waitlist', icon: ClipboardList },
      { label: 'Appointments', href: '/appointments', icon: Calendar },
    ]
  },
  {
    label: 'Operations',
    items: [
      { label: 'Tasks', href: '/tasks', icon: CheckSquare },
      { label: 'Maintenance', href: '/maintenance', icon: Wrench },
      { label: 'Documents', href: '/documents', icon: FolderOpen },
    ]
  },
  {
    label: 'Reporting',
    items: [
      { label: 'Reports', href: '/reports', icon: BarChart3 },
    ]
  },
];

interface LayoutProps {
  children: React.ReactNode;
  taskBadge?: number;
  maintenanceBadge?: number;
  enquiryBadge?: number;
}

export default function Layout({ children, taskBadge, maintenanceBadge, enquiryBadge }: LayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for "${searchQuery}"...`, { description: 'Global search coming soon.' });
    }
  };

  const getBadge = (href: string) => {
    if (href === '/tasks' && taskBadge) return taskBadge;
    if (href === '/maintenance' && maintenanceBadge) return maintenanceBadge;
    if (href === '/enquiries' && enquiryBadge) return enquiryBadge;
    return undefined;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'oklch(0.52 0.09 168)' }}>
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-sidebar-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>
              BGM CRM
            </div>
            <div className="text-xs text-sidebar-foreground/50">Barrina Gardens</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-widest" style={{ color: 'oklch(0.55 0.01 240)' }}>
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const badge = getBadge(item.href);
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={cn(
                        'nav-item',
                        active && 'active'
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {badge !== undefined && (
                        <span className="ml-auto text-xs font-semibold px-1.5 py-0.5 rounded-full"
                          style={{ background: 'oklch(0.577 0.245 27.325 / 0.2)', color: 'oklch(0.75 0.18 27)' }}>
                          {badge}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent transition-colors">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: 'oklch(0.52 0.09 168)' }}>
                {currentUser.initials}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-xs font-medium text-sidebar-foreground truncate">{currentUser.name}</div>
                <div className="text-xs text-sidebar-foreground/50 truncate">{currentUser.role}</div>
              </div>
              <ChevronDown className="w-3 h-3 text-sidebar-foreground/40 shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => toast.info('Profile settings coming soon.')}>
              <Settings className="w-4 h-4 mr-2" /> Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.info('Logged out.')} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-sidebar-border"
        style={{ background: 'oklch(0.22 0.025 240)' }}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-60 shrink-0 border-r border-sidebar-border z-10"
            style={{ background: 'oklch(0.22 0.025 240)' }}>
            <button
              className="absolute top-4 right-4 text-sidebar-foreground/60 hover:text-sidebar-foreground"
              onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 shrink-0 border-b border-border flex items-center gap-4 px-4 bg-card">
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
            <Building2 className="w-3.5 h-3.5" />
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">
              {navGroups.flatMap(g => g.items).find(i => isActive(i.href))?.label ?? 'Dashboard'}
            </span>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search residents, units..."
              className="pl-8 h-8 w-56 text-sm bg-muted/50 border-border/60"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Notifications */}
          <button
            className="relative text-muted-foreground hover:text-foreground"
            onClick={() => toast.info('Notifications coming soon.')}>
            <Bell className="w-5 h-5" />
            {(taskBadge || 0) > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-white text-xs flex items-center justify-center">
                {taskBadge}
              </span>
            )}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
