// BGM CRM — Dashboard Page
// Design: Precision Slate — stat cards, occupancy chart, recent activity, upcoming tasks

import { Link } from 'wouter';
import {
  Home, Users, UserPlus, CheckSquare, Wrench, Calendar,
  TrendingUp, AlertTriangle, ArrowRight, Clock
} from 'lucide-react';
import {
  getDashboardStats, formatCurrency, formatDate,
  tasks, maintenanceRequests, appointments, enquiries, residents, units
} from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { cn } from '@/lib/utils';

const stats = getDashboardStats();

const occupancyData = [
  { name: 'Occupied', value: stats.occupiedUnits, color: 'oklch(0.52 0.09 168)' },
  { name: 'Vacant', value: stats.vacantUnits, color: 'oklch(0.72 0.12 80)' },
  { name: 'Maintenance', value: stats.maintenanceUnits, color: 'oklch(0.62 0.14 50)' },
  { name: 'Reserved', value: stats.reservedUnits, color: 'oklch(0.55 0.12 240)' },
];

const monthlyEnquiries = [
  { month: 'Oct', count: 3 },
  { month: 'Nov', count: 5 },
  { month: 'Dec', count: 2 },
  { month: 'Jan', count: 4 },
  { month: 'Feb', count: 3 },
  { month: 'Mar', count: 4 },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    'Open': 'badge-pending',
    'In Progress': 'badge-occupied',
    'Overdue': 'badge-overdue',
    'Completed': 'badge-terminated',
    'Logged': 'badge-pending',
    'Assigned': 'badge-waitlist',
    'Scheduled': 'badge-pending',
    'New': 'badge-enquiry',
    'Tour Scheduled': 'badge-pending',
    'Application': 'badge-occupied',
    'Waitlisted': 'badge-waitlist',
  };
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', map[status] || 'badge-terminated')}>
      {status}
    </span>
  );
}

function PriorityDot({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    'Urgent': 'bg-red-500',
    'High': 'bg-orange-400',
    'Medium': 'bg-amber-400',
    'Low': 'bg-slate-400',
  };
  return <span className={cn('inline-block w-2 h-2 rounded-full shrink-0', colors[priority] || 'bg-slate-400')} />;
}

export default function Dashboard() {
  const urgentTasks = tasks.filter(t => (t.status === 'Open' || t.status === 'Overdue') && (t.priority === 'Urgent' || t.priority === 'High')).slice(0, 5);
  const upcomingAppointments = appointments.filter(a => a.status === 'Scheduled').slice(0, 4);
  const recentEnquiries = enquiries.filter(e => e.status !== 'Closed Won' && e.status !== 'Closed Lost').slice(0, 4);
  const openMaintenance = maintenanceRequests.filter(m => m.status !== 'Completed').slice(0, 4);

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Barrina Gardens Village — Overview for {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Hero stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-card-label">Occupancy Rate</span>
            <Home className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="stat-card-value" style={{ color: 'oklch(0.52 0.09 168)' }}>{stats.occupancyRate}%</div>
          <div className="stat-card-delta">{stats.occupiedUnits} of {stats.totalUnits} units occupied</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-card-label">Active Residents</span>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="stat-card-value">{stats.activeResidents}</div>
          <div className="stat-card-delta">{stats.totalUnits} total units</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-card-label">Open Enquiries</span>
            <UserPlus className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="stat-card-value">{enquiries.filter(e => e.status !== 'Closed Won' && e.status !== 'Closed Lost').length}</div>
          <div className="stat-card-delta">{stats.newEnquiries} new this week</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-card-label">Open Tasks</span>
            <CheckSquare className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="stat-card-value" style={{ color: stats.overdueTasks > 0 ? 'oklch(0.577 0.245 27.325)' : undefined }}>
            {stats.openTasks}
          </div>
          <div className="stat-card-delta">
            {stats.overdueTasks > 0 ? (
              <span className="text-red-600 font-medium">{stats.overdueTasks} overdue</span>
            ) : 'All on track'}
          </div>
        </div>
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-card-label">Vacant Units</span>
            <Home className="w-4 h-4 text-amber-500" />
          </div>
          <div className="stat-card-value text-amber-600">{stats.vacantUnits}</div>
          <div className="stat-card-delta">{stats.reservedUnits} reserved</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-card-label">Maintenance</span>
            <Wrench className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="stat-card-value">{stats.openMaintenance}</div>
          <div className="stat-card-delta">
            {stats.urgentMaintenance > 0 ? (
              <span className="text-red-600 font-medium">{stats.urgentMaintenance} urgent</span>
            ) : 'No urgent items'}
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-card-label">Total Settlement</span>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="text-xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>{formatCurrency(stats.totalSettlement)}</div>
          <div className="stat-card-delta">Active contracts</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="stat-card-label">Appointments</span>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="stat-card-value">{stats.upcomingAppointments}</div>
          <div className="stat-card-delta">Upcoming scheduled</div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Occupancy chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>Unit Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie data={occupancyData} cx={55} cy={55} innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
                    {occupancyData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {occupancyData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly enquiries chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>Enquiries — Last 6 Months</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={monthlyEnquiries} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.006 80)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'oklch(0.52 0.012 240)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'oklch(0.52 0.012 240)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ fontSize: 12, border: '1px solid oklch(0.91 0.006 80)', borderRadius: 6 }}
                  cursor={{ fill: 'oklch(0.52 0.09 168 / 0.08)' }}
                />
                <Bar dataKey="count" fill="oklch(0.52 0.09 168)" radius={[3, 3, 0, 0]} name="Enquiries" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Priority tasks */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>Priority Tasks</CardTitle>
              <Link href="/tasks">
                <Button variant="ghost" size="sm" className="text-xs h-7 gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {urgentTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No priority tasks</p>
            ) : urgentTasks.map(task => (
              <div key={task.id} className="flex items-start gap-3 p-2.5 rounded-md hover:bg-muted/50 transition-colors">
                <PriorityDot priority={task.priority} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{task.title}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={task.status} />
                    {task.dueDate && (
                      <span className={cn('text-xs flex items-center gap-1', 
                        task.status === 'Overdue' ? 'text-red-600' : 'text-muted-foreground')}>
                        <Clock className="w-3 h-3" />
                        {formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{task.assignedTo?.split(' ')[0]}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming appointments */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>Upcoming Appointments</CardTitle>
              <Link href="/appointments">
                <Button variant="ghost" size="sm" className="text-xs h-7 gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingAppointments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No upcoming appointments</p>
            ) : upcomingAppointments.map(apt => (
              <div key={apt.id} className="flex items-start gap-3 p-2.5 rounded-md hover:bg-muted/50 transition-colors">
                <div className="w-9 h-9 rounded-md flex flex-col items-center justify-center text-center shrink-0"
                  style={{ background: 'oklch(0.52 0.09 168 / 0.1)' }}>
                  <span className="text-xs font-bold leading-none" style={{ color: 'oklch(0.52 0.09 168)' }}>
                    {new Date(apt.date).getDate()}
                  </span>
                  <span className="text-xs leading-none mt-0.5" style={{ color: 'oklch(0.52 0.09 168 / 0.7)' }}>
                    {new Date(apt.date).toLocaleString('en-AU', { month: 'short' })}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{apt.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{apt.time} · {apt.type} · {apt.location}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent enquiries */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>Active Enquiries</CardTitle>
              <Link href="/enquiries">
                <Button variant="ghost" size="sm" className="text-xs h-7 gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentEnquiries.map(enq => (
              <div key={enq.id} className="flex items-center gap-3 p-2.5 rounded-md hover:bg-muted/50 transition-colors">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: 'oklch(0.55 0.12 240)' }}>
                  {enq.firstName[0]}{enq.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{enq.title} {enq.firstName} {enq.lastName}</div>
                  <div className="text-xs text-muted-foreground">{enq.preferredUnitType} · {enq.source}</div>
                </div>
                <StatusBadge status={enq.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Open maintenance */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>Open Maintenance</CardTitle>
              <Link href="/maintenance">
                <Button variant="ghost" size="sm" className="text-xs h-7 gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {openMaintenance.map(req => (
              <div key={req.id} className="flex items-start gap-3 p-2.5 rounded-md hover:bg-muted/50 transition-colors">
                <PriorityDot priority={req.priority} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{req.title}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusBadge status={req.status} />
                    {req.unitNo && <span className="text-xs text-muted-foreground">Unit {req.unitNo}</span>}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{req.category}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Village photo banner */}
      <Card className="overflow-hidden">
        <div className="relative h-48">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663364956560/3kCyjBhX6Z8kZVCZhWirGM/bgm-dashboard-bg_173f19d2.jpg"
            alt="Barrina Gardens Village"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-8">
            <div>
              <h2 className="text-white text-xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Barrina Gardens</h2>
              <p className="text-white/80 text-sm mt-1">Retirement Village — {stats.totalUnits} units · {stats.activeResidents} residents</p>
              <div className="flex gap-3 mt-3">
                <Link href="/units">
                  <Button size="sm" variant="secondary" className="text-xs">View Units</Button>
                </Link>
                <Link href="/residents">
                  <Button size="sm" variant="outline" className="text-xs text-white border-white/40 hover:bg-white/10">View Residents</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
