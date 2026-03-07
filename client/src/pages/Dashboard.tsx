// Barrina Gardens CRM — Dashboard
import { useMemo } from 'react';
import { Link } from 'wouter';
import { Home, Users, ClipboardList, Wrench, TrendingUp, AlertTriangle, Calendar, ChevronRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { units, leads, tasks, maintenanceRequests, appointments, formatCurrency, formatDate, getDashboardStats } from '@/lib/data';

const BG_LOGO = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663364956560/3kCyjBhX6Z8kZVCZhWirGM/logopng_eca26cdc.png';
const C = { green: 'oklch(0.48 0.12 145)', lgreen: 'oklch(0.65 0.14 145)', brown: 'oklch(0.42 0.08 65)', amber: 'oklch(0.72 0.14 80)', red: 'oklch(0.577 0.245 27.325)' };

export default function Dashboard() {
  const stats = useMemo(() => getDashboardStats(), []);
  const unitStatusData = useMemo(() => [
    { name: 'Occupied', value: stats.occupied, color: C.green },
    { name: 'Vacant', value: stats.vacant, color: C.amber },
    { name: 'Maintenance', value: units.filter(u => u.status === 'Under Maintenance').length, color: C.red },
    { name: 'Reserved', value: units.filter(u => u.status === 'Reserved').length, color: C.lgreen },
  ].filter(d => d.value > 0), [stats]);
  const leadsBySource = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => { const src = l.leadSource || 'Unknown'; counts[src] = (counts[src] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6)
      .map(([name, value]) => ({ name: name.length > 16 ? name.slice(0, 16) + '...' : name, value }));
  }, []);
  const urgentTasks = useMemo(() => tasks.filter(t => t.priority === 'Urgent' || t.priority === 'High').slice(0, 5), []);
  const upcomingAppts = useMemo(() => appointments.filter(a => a.status === 'Scheduled').slice(0, 4), []);
  const openMaintenance = useMemo(() => maintenanceRequests.filter(m => m.status !== 'Completed').slice(0, 4), []);
  const contractTypes = useMemo(() => {
    const counts: Record<string, number> = {};
    units.forEach(u => { if (u.contractType) counts[u.contractType] = (counts[u.contractType] || 0) + 1; });
    return counts;
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <img src={BG_LOGO} alt="Barrina Gardens" className="w-14 h-14 object-contain" />
          <div>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Barrina Gardens</h1>
            <p className="text-sm text-muted-foreground">26 Barrina Street, Blackburn South VIC 3130 &middot; Village Dashboard</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-muted-foreground">Today</p>
          <p className="text-sm font-medium">{new Date().toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/units"><Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4" style={{ borderLeftColor: C.green }}><CardContent className="p-4"><div className="flex items-start justify-between"><div><p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Occupancy</p><p className="text-3xl font-bold mt-1" style={{ color: C.green }}>{stats.occupancyRate}%</p><p className="text-xs text-muted-foreground mt-1">{stats.occupied} of {stats.totalUnits} units</p></div><div className="p-2 rounded-lg" style={{ background: 'oklch(0.48 0.12 145 / 0.1)' }}><Home size={18} style={{ color: C.green }} /></div></div><Progress value={stats.occupancyRate} className="mt-3 h-1.5" /></CardContent></Card></Link>
        <Link href="/residents"><Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4" style={{ borderLeftColor: C.brown }}><CardContent className="p-4"><div className="flex items-start justify-between"><div><p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Residents</p><p className="text-3xl font-bold mt-1" style={{ color: C.brown }}>{units.filter(u => u.resident).length}</p><p className="text-xs text-muted-foreground mt-1">Active on site</p></div><div className="p-2 rounded-lg" style={{ background: 'oklch(0.42 0.08 65 / 0.1)' }}><Users size={18} style={{ color: C.brown }} /></div></div></CardContent></Card></Link>
        <Link href="/leads"><Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4" style={{ borderLeftColor: C.amber }}><CardContent className="p-4"><div className="flex items-start justify-between"><div><p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Active Leads</p><p className="text-3xl font-bold mt-1" style={{ color: C.amber }}>{stats.activeLeads}</p><p className="text-xs text-muted-foreground mt-1">{stats.waitlistLeads} on waitlist</p></div><div className="p-2 rounded-lg" style={{ background: 'oklch(0.72 0.14 80 / 0.1)' }}><ClipboardList size={18} style={{ color: C.amber }} /></div></div></CardContent></Card></Link>
        <Link href="/contracts"><Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4" style={{ borderLeftColor: C.lgreen }}><CardContent className="p-4"><div className="flex items-start justify-between"><div><p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">DMF Accrued</p><p className="text-xl font-bold mt-1" style={{ color: C.lgreen }}>{formatCurrency(stats.totalDeferred)}</p><p className="text-xs text-muted-foreground mt-1">Across all units</p></div><div className="p-2 rounded-lg" style={{ background: 'oklch(0.65 0.14 145 / 0.1)' }}><TrendingUp size={18} style={{ color: C.lgreen }} /></div></div></CardContent></Card></Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Unit Status</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={180}><PieChart><Pie data={unitStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">{unitStatusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}</Pie><Tooltip formatter={(v: number) => [`${v} units`, '']} /><Legend formatter={(value) => <span className="text-xs">{value}</span>} /></PieChart></ResponsiveContainer></CardContent></Card>
        <Card className="lg:col-span-2"><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Leads by Source (Top 6)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={180}><BarChart data={leadsBySource} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="value" fill={C.green} radius={[3, 3, 0, 0]} name="Leads" /></BarChart></ResponsiveContainer></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card><CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-sm font-semibold">Priority Tasks</CardTitle><Link href="/tasks"><Button variant="ghost" size="sm" className="h-7 text-xs gap-1">View all <ChevronRight size={12} /></Button></Link></CardHeader><CardContent className="space-y-2">{urgentTasks.map(task => (<div key={task.id} className="flex items-start gap-2 p-2 rounded-md bg-muted/40"><div className="mt-0.5">{task.priority === 'Urgent' ? <AlertTriangle size={13} className="text-red-500" /> : <Clock size={13} className="text-amber-500" />}</div><div className="min-w-0 flex-1"><p className="text-xs font-medium text-foreground truncate">{task.title}</p><p className="text-[10px] text-muted-foreground">{task.assignedTo} &middot; {task.dueDate ? formatDate(task.dueDate) : 'No due date'}</p></div><Badge variant={task.priority === 'Urgent' ? 'destructive' : 'outline'} className="text-[10px] px-1.5 py-0 h-4 flex-shrink-0">{task.priority}</Badge></div>))}</CardContent></Card>
        <Card><CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-sm font-semibold">Upcoming Appointments</CardTitle><Link href="/appointments"><Button variant="ghost" size="sm" className="h-7 text-xs gap-1">View all <ChevronRight size={12} /></Button></Link></CardHeader><CardContent className="space-y-2">{upcomingAppts.length === 0 ? <p className="text-xs text-muted-foreground text-center py-4">No upcoming appointments</p> : upcomingAppts.map(appt => (<div key={appt.id} className="flex items-start gap-2 p-2 rounded-md bg-muted/40"><div className="p-1.5 rounded" style={{ background: 'oklch(0.48 0.12 145 / 0.12)' }}><Calendar size={12} style={{ color: C.green }} /></div><div className="min-w-0 flex-1"><p className="text-xs font-medium text-foreground truncate">{appt.title}</p><p className="text-[10px] text-muted-foreground">{formatDate(appt.date)} at {appt.time}</p></div><Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 flex-shrink-0">{appt.type}</Badge></div>))}</CardContent></Card>
        <Card><CardHeader className="pb-2 flex flex-row items-center justify-between"><CardTitle className="text-sm font-semibold">Open Maintenance</CardTitle><Link href="/maintenance"><Button variant="ghost" size="sm" className="h-7 text-xs gap-1">View all <ChevronRight size={12} /></Button></Link></CardHeader><CardContent className="space-y-2">{openMaintenance.map(req => (<div key={req.id} className="flex items-start gap-2 p-2 rounded-md bg-muted/40"><div className="p-1.5 rounded" style={{ background: 'oklch(0.577 0.245 27.325 / 0.1)' }}><Wrench size={12} className="text-red-500" /></div><div className="min-w-0 flex-1"><p className="text-xs font-medium text-foreground truncate">{req.title}</p><p className="text-[10px] text-muted-foreground">{req.unitNo ? `Unit ${req.unitNo} - ` : ''}{req.status}</p></div><Badge variant={req.priority === 'Urgent' ? 'destructive' : 'outline'} className="text-[10px] px-1.5 py-0 h-4 flex-shrink-0">{req.priority}</Badge></div>))}</CardContent></Card>
      </div>

      <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Financial Overview</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><div className="text-center p-3 rounded-lg bg-muted/40"><p className="text-xs text-muted-foreground mb-1">Total Settlement Value</p><p className="text-lg font-bold text-foreground">{formatCurrency(stats.totalSettlement)}</p></div><div className="text-center p-3 rounded-lg bg-muted/40"><p className="text-xs text-muted-foreground mb-1">Total Market Value</p><p className="text-lg font-bold text-foreground">{formatCurrency(stats.totalMarketValue)}</p></div><div className="text-center p-3 rounded-lg bg-muted/40"><p className="text-xs text-muted-foreground mb-1">Total DMF Accrued</p><p className="text-lg font-bold" style={{ color: C.green }}>{formatCurrency(stats.totalDeferred)}</p></div><div className="text-center p-3 rounded-lg bg-muted/40"><p className="text-xs text-muted-foreground mb-1">Contract Types</p><div className="flex flex-wrap gap-1 justify-center mt-1">{Object.entries(contractTypes).map(([type, count]) => (<Badge key={type} variant="outline" className="text-[10px] px-1.5 py-0">{type}: {count}</Badge>))}</div></div></div></CardContent></Card>
    </div>
  );
}
