// Barrina Gardens CRM — Layout Component
// Deep forest green sidebar, BG logo, full navigation

import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard, Users, Home, FileText, ClipboardList,
  Wrench, Calendar, ListOrdered, BarChart3, FolderOpen,
  Smartphone, Mail, ChevronLeft, ChevronRight, Bell,
  Search, Settings, UserCircle, ClipboardCheck, Building2,
  Menu, X, ChevronDown, LogOut
} from 'lucide-react';
import { currentUser } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const BG_LOGO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663364956560/3kCyjBhX6Z8kZVCZhWirGM/logopng_e0be7378.png';

const navGroups = [
  {
    label: 'Core',
    items: [
      { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/residents', icon: Users, label: 'Residents' },
      { href: '/units', icon: Home, label: 'Units' },
      { href: '/contracts', icon: FileText, label: 'Contracts & DMF' },
    ]
  },
  {
    label: 'Sales',
    items: [
      { href: '/leads', icon: ClipboardList, label: 'Leads & Enquiries' },
      { href: '/waitlist', icon: ListOrdered, label: 'Waitlist' },
      { href: '/appointments', icon: Calendar, label: 'Appointments' },
    ]
  },
  {
    label: 'Operations',
    items: [
      { href: '/tasks', icon: ClipboardCheck, label: 'Tasks' },
      { href: '/maintenance', icon: Wrench, label: 'Maintenance' },
      { href: '/sim-cards', icon: Smartphone, label: 'Emergency SIM Cards' },
    ]
  },
  {
    label: 'Admin',
    items: [
      { href: '/reports', icon: BarChart3, label: 'Reports' },
      { href: '/templates', icon: Mail, label: 'Templates' },
      { href: '/documents', icon: FolderOpen, label: 'Documents' },
      { href: '/onboarding', icon: UserCircle, label: 'Resident Onboarding' },
    ]
  },
];

interface LayoutProps {
  children: React.ReactNode;
  taskBadge?: number;
  maintenanceBadge?: number;
}

export default function Layout({ children, taskBadge, maintenanceBadge }: LayoutProps) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  const currentPageLabel = navGroups.flatMap(g => g.items).find(i => isActive(i.href))?.label ?? 'Dashboard';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) toast.info(`Searching for "${searchQuery}"...`, { description: 'Global search coming soon.' });
  };

  const SidebarContent = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn('flex items-center border-b', isCollapsed ? 'p-3 justify-center' : 'px-4 py-3 gap-3')} style={{ borderColor: 'oklch(0.32 0.05 145)' }}>
        <img src={BG_LOGO} alt="Barrina Gardens" className={cn('object-contain flex-shrink-0', isCollapsed ? 'w-9 h-9' : 'w-10 h-10')} />
        {!isCollapsed && (
          <div>
            <p className="text-xs font-bold leading-tight" style={{ color: 'oklch(0.82 0.1 145)', fontFamily: "'Playfair Display', serif" }}>Barrina Gardens</p>
            <p className="text-[10px] leading-tight" style={{ color: 'oklch(0.58 0.04 80)' }}>Retirement Village CRM</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!isCollapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-1" style={{ color: 'oklch(0.48 0.06 145)' }}>
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      onClick={() => setMobileOpen(false)}
                      className={cn('flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer', isCollapsed ? 'justify-center' : '')}
                      style={{
                        background: active ? 'oklch(0.48 0.12 145)' : 'transparent',
                        color: active ? 'white' : 'oklch(0.7 0.02 80)',
                        boxShadow: active ? '0 1px 3px oklch(0 0 0 / 0.3)' : 'none',
                      }}
                      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'oklch(0.3 0.05 145)'; (e.currentTarget as HTMLElement).style.color = 'white'; }}
                      onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'oklch(0.7 0.02 80)'; } }}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <item.icon size={15} className="flex-shrink-0" />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User + collapse */}
      <div className="p-2 space-y-1" style={{ borderTop: '1px solid oklch(0.32 0.05 145)' }}>
        {!isCollapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-2 px-2 py-2 rounded-md transition-colors" style={{ background: 'oklch(0.28 0.04 145)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0.32 0.05 145)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'oklch(0.28 0.04 145)')}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: 'oklch(0.48 0.12 145)', color: 'white' }}>
                  {currentUser.initials}
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-xs font-medium truncate" style={{ color: 'oklch(0.88 0.01 80)' }}>{currentUser.name}</p>
                  <p className="text-[10px] truncate" style={{ color: 'oklch(0.58 0.02 80)' }}>{currentUser.role}</p>
                </div>
                <ChevronDown size={12} style={{ color: 'oklch(0.55 0.02 80)', flexShrink: 0 }} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => toast.info('Profile settings coming soon.')}><Settings size={14} className="mr-2" />Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.info('Signed out.')} className="text-destructive"><LogOut size={14} className="mr-2" />Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <button
          onClick={() => setCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded-md transition-colors text-sm"
          style={{ color: 'oklch(0.55 0.02 80)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'oklch(0.3 0.05 145)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={15} /> : <><ChevronLeft size={15} /><span className="ml-1 text-xs">Collapse</span></>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn('hidden lg:flex flex-col h-full transition-all duration-200 ease-in-out flex-shrink-0')}
        style={{ width: collapsed ? '64px' : '240px', background: 'oklch(0.22 0.04 145)', borderRight: '1px solid oklch(0.32 0.05 145)' }}
      >
        <SidebarContent isCollapsed={collapsed} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex flex-col w-60 h-full z-10" style={{ background: 'oklch(0.22 0.04 145)', borderRight: '1px solid oklch(0.32 0.05 145)' }}>
            <button className="absolute top-3 right-3 p-1 rounded" style={{ color: 'oklch(0.6 0.02 80)' }} onClick={() => setMobileOpen(false)}>
              <X size={16} />
            </button>
            <SidebarContent isCollapsed={false} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-13 shrink-0 border-b border-border flex items-center gap-3 px-4 bg-card" style={{ height: '52px' }}>
          <button className="lg:hidden text-muted-foreground hover:text-foreground" onClick={() => setMobileOpen(true)}>
            <Menu size={18} />
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
            <Building2 size={13} />
            <ChevronRight size={12} />
            <span className="text-foreground font-medium text-sm">{currentPageLabel}</span>
          </div>

          <div className="flex-1" />

          <form onSubmit={handleSearch} className="hidden md:flex relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search residents, units..."
              className="pl-8 h-8 w-52 text-sm bg-muted/50 border-border/60"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </form>

          <button className="relative p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" onClick={() => toast.info('Notifications coming soon.')}>
            <Bell size={16} />
            {(taskBadge || 0) > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />}
          </button>

          <div className="w-px h-5 bg-border" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'oklch(0.48 0.12 145)', color: 'white' }}>
              {currentUser.initials}
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:block">{currentUser.name}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="page-enter">{children}</div>
        </main>
      </div>
    </div>
  );
}
