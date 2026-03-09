// Barrina Gardens CRM — Layout Component
// Brand: forest green (#4a7c2f) + warm brown (#5c3d1e) + navy sidebar (#1A2332)
import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard, Users, Home, FileText, ClipboardList,
  ListOrdered, BarChart3, FolderOpen, GanttChartSquare,
  Smartphone, ChevronLeft, ChevronRight, Bell,
  Settings, UserCircle, ClipboardCheck,
  Menu, X, LogOut, Shield, ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const BG_LOGO = '/assets/branding/logo.png';
const SIDEBAR_BG = '#1A2332';
const SIDEBAR_BORDER = '#243040';
const SIDEBAR_TEXT = '#94a3b8';
const SIDEBAR_ACTIVE_BG = '#243040';
const SIDEBAR_HOVER_BG = '#1e2d3e';
const BRAND_GREEN = '#4a7c2f';

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
      { href: '/sales-gantt', icon: GanttChartSquare, label: 'Sales GANTT' },
    ]
  },
  {
    label: 'Operations',
    items: [
      { href: '/tasks', icon: ClipboardCheck, label: 'Tasks' },
      { href: '/sim-cards', icon: Smartphone, label: 'Emergency SIM Cards' },
    ]
  },
  {
    label: 'Admin',
    items: [
      { href: '/reports', icon: BarChart3, label: 'Reports' },
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
  const { user, logout, isSuperAdmin } = useAuth();

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  const currentPageLabel = navGroups.flatMap(g => g.items).find(i => isActive(i.href))?.label ?? 'Dashboard';

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
  };

  const getBadge = (href: string) => {
    if (href === '/tasks' && taskBadge) return taskBadge;
    if (href === '/maintenance' && maintenanceBadge) return maintenanceBadge;
    return null;
  };

  const NavItem = ({ item, isCollapsed }: { item: { href: string; icon: React.ElementType; label: string }; isCollapsed: boolean }) => {
    const active = isActive(item.href);
    const badge = getBadge(item.href);
    return (
      <Link href={item.href}>
        <div
          className={cn(
            'flex items-center rounded-lg cursor-pointer transition-all duration-150',
            isCollapsed ? 'p-2.5 justify-center' : 'px-3 py-2 gap-3'
          )}
          style={{
            backgroundColor: active ? SIDEBAR_ACTIVE_BG : 'transparent',
            color: active ? '#ffffff' : SIDEBAR_TEXT,
          }}
          onMouseEnter={(e) => {
            if (!active) {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = SIDEBAR_HOVER_BG;
              (e.currentTarget as HTMLDivElement).style.color = '#ffffff';
            }
          }}
          onMouseLeave={(e) => {
            if (!active) {
              (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
              (e.currentTarget as HTMLDivElement).style.color = SIDEBAR_TEXT;
            }
          }}
          onClick={() => setMobileOpen(false)}
          title={isCollapsed ? item.label : undefined}
        >
          <div className="relative flex-shrink-0">
            <item.icon size={16} style={{ color: active ? BRAND_GREEN : 'inherit' }} />
            {badge && (
              <span className="absolute -top-1.5 -right-1.5 text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center bg-red-500 text-white">
                {badge}
              </span>
            )}
          </div>
          {!isCollapsed && <span className="text-sm font-medium flex-1">{item.label}</span>}
          {!isCollapsed && badge && (
            <span className="text-[10px] font-bold rounded-full px-1.5 py-0.5 bg-red-500 text-white">{badge}</span>
          )}
        </div>
      </Link>
    );
  };

  const SidebarContent = ({ isCollapsed }: { isCollapsed: boolean }) => (
    <div className="flex flex-col h-full">
      <div
        className={cn('flex items-center border-b', isCollapsed ? 'p-3 justify-center' : 'px-4 py-3 gap-3')}
        style={{ borderColor: SIDEBAR_BORDER }}
      >
        <img
          src={BG_LOGO}
          alt="Barrina Gardens"
          className={cn('object-contain flex-shrink-0', isCollapsed ? 'w-9 h-9' : 'w-10 h-10')}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        {!isCollapsed && (
          <div>
            <p className="text-xs font-bold leading-tight" style={{ color: BRAND_GREEN }}>Barrina Gardens</p>
            <p className="text-[10px] leading-tight" style={{ color: '#64748b' }}>Village Management CRM</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!isCollapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-wider px-2 mb-1" style={{ color: '#475569' }}>
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavItem key={item.href} item={item} isCollapsed={isCollapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t p-2 space-y-0.5" style={{ borderColor: SIDEBAR_BORDER }}>
        {isSuperAdmin && (
          <Link href="/settings">
            <div
              className={cn(
                'flex items-center rounded-lg cursor-pointer transition-all duration-150',
                isCollapsed ? 'p-2.5 justify-center' : 'px-3 py-2 gap-3'
              )}
              style={{
                backgroundColor: isActive('/settings') ? SIDEBAR_ACTIVE_BG : 'transparent',
                color: isActive('/settings') ? '#ffffff' : SIDEBAR_TEXT,
              }}
              onMouseEnter={(e) => {
                if (!isActive('/settings')) {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = SIDEBAR_HOVER_BG;
                  (e.currentTarget as HTMLDivElement).style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/settings')) {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLDivElement).style.color = SIDEBAR_TEXT;
                }
              }}
              title={isCollapsed ? 'Settings' : undefined}
            >
              <Settings size={16} style={{ color: isActive('/settings') ? BRAND_GREEN : 'inherit' }} />
              {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
            </div>
          </Link>
        )}

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className={cn(
                  'flex items-center rounded-lg cursor-pointer transition-all duration-150',
                  isCollapsed ? 'p-2.5 justify-center' : 'px-3 py-2 gap-3'
                )}
                style={{ color: SIDEBAR_TEXT }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = SIDEBAR_HOVER_BG;
                  (e.currentTarget as HTMLDivElement).style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLDivElement).style.color = SIDEBAR_TEXT;
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: BRAND_GREEN, color: 'white' }}
                >
                  {user.name.charAt(0)}
                </div>
                {!isCollapsed && (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate text-white">{user.name}</p>
                      <p className="text-[10px] truncate" style={{ color: '#64748b' }}>
                        {user.role === 'super_admin' ? 'Super Admin' : 'Manager'}
                      </p>
                    </div>
                    <ChevronDown size={12} />
                  </>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              {isSuperAdmin && (
                <Link href="/settings">
                  <DropdownMenuItem className="cursor-pointer">
                    <Shield size={14} className="mr-2" />
                    Admin Settings
                  </DropdownMenuItem>
                </Link>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                <LogOut size={14} className="mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 transition-all duration-300 relative"
        style={{ width: collapsed ? '60px' : '240px', backgroundColor: SIDEBAR_BG }}
      >
        <SidebarContent isCollapsed={collapsed} />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center shadow-md z-10 transition-colors"
          style={{ backgroundColor: SIDEBAR_BG, border: `1px solid ${SIDEBAR_BORDER}`, color: SIDEBAR_TEXT }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = BRAND_GREEN;
            (e.currentTarget as HTMLButtonElement).style.color = 'white';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = SIDEBAR_BG;
            (e.currentTarget as HTMLButtonElement).style.color = SIDEBAR_TEXT;
          }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 flex flex-col h-full z-10" style={{ backgroundColor: SIDEBAR_BG }}>
            <div className="absolute top-3 right-3">
              <button onClick={() => setMobileOpen(false)} style={{ color: SIDEBAR_TEXT }}>
                <X size={18} />
              </button>
            </div>
            <SidebarContent isCollapsed={false} />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-shrink-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4 shadow-sm">
          <button className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <img
              src={BG_LOGO}
              alt="Barrina Gardens"
              className="h-7 w-auto object-contain lg:hidden"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <h1 className="text-sm font-semibold text-gray-700">{currentPageLabel}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 relative">
              <Bell size={18} />
            </button>
            {user && (
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: BRAND_GREEN, color: 'white' }}
                >
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:block text-xs font-medium text-gray-700">{user.name}</span>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
