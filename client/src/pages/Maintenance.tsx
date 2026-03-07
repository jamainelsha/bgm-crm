// BGM CRM — Maintenance Page

import { useState } from 'react';
import { Search, Plus, Wrench, AlertTriangle, ChevronRight } from 'lucide-react';
import { maintenanceRequests, formatDate, type MaintenanceRequest, type MaintenanceStatus, type TaskPriority } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function StatusBadge({ status }: { status: MaintenanceStatus }) {
  const map: Record<MaintenanceStatus, string> = {
    'Logged': 'badge-pending',
    'Assigned': 'badge-waitlist',
    'In Progress': 'badge-occupied',
    'Completed': 'badge-terminated',
    'Deferred': 'badge-terminated',
  };
  return <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', map[status])}>{status}</span>;
}

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const map: Record<TaskPriority, string> = {
    'Urgent': 'bg-red-100 text-red-700 border border-red-200',
    'High': 'bg-orange-50 text-orange-700 border border-orange-200',
    'Medium': 'bg-amber-50 text-amber-700 border border-amber-200',
    'Low': 'bg-slate-100 text-slate-600 border border-slate-200',
  };
  return <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', map[priority])}>{priority}</span>;
}

export default function MaintenancePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = maintenanceRequests.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.title.toLowerCase().includes(q) || (m.unitNo || '').includes(q) || m.category.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    Logged: maintenanceRequests.filter(m => m.status === 'Logged').length,
    Assigned: maintenanceRequests.filter(m => m.status === 'Assigned').length,
    'In Progress': maintenanceRequests.filter(m => m.status === 'In Progress').length,
    Completed: maintenanceRequests.filter(m => m.status === 'Completed').length,
  };

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Maintenance</h1>
          <p className="page-subtitle">{maintenanceRequests.filter(m => m.status !== 'Completed').length} open requests</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => toast.info('Log maintenance request coming soon.')}>
          <Plus className="w-3.5 h-3.5" /> Log Request
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {Object.entries(counts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
            className={cn('stat-card py-3 text-left transition-all', statusFilter === status && 'ring-2 ring-primary')}>
            <span className="stat-card-label">{status}</span>
            <div className="text-2xl font-bold mt-1" style={{ fontFamily: 'Sora, sans-serif' }}>{count}</div>
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Search requests..." className="pl-8 h-8 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Logged">Logged</SelectItem>
            <SelectItem value="Assigned">Assigned</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Deferred">Deferred</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th>Request</th>
              <th>Priority</th>
              <th>Status</th>
              <th className="hidden md:table-cell">Unit</th>
              <th className="hidden lg:table-cell">Category</th>
              <th className="hidden md:table-cell">Assigned To</th>
              <th className="hidden lg:table-cell">Reported</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-muted-foreground text-sm">No requests found</td></tr>
            ) : filtered.map(m => (
              <tr key={m.id} className="cursor-pointer" onClick={() => toast.info(`${m.requestNo}: ${m.title}\n${m.description}`)}>
                <td>
                  <div className="flex items-start gap-2">
                    <Wrench className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground/60" />
                    <div>
                      <div className="font-medium text-sm">{m.title}</div>
                      <div className="text-xs text-muted-foreground font-mono">{m.requestNo}</div>
                    </div>
                  </div>
                </td>
                <td><PriorityBadge priority={m.priority} /></td>
                <td><StatusBadge status={m.status} /></td>
                <td className="hidden md:table-cell text-sm">{m.unitNo ? `Unit ${m.unitNo}` : <span className="text-muted-foreground">Common</span>}</td>
                <td className="hidden lg:table-cell text-sm text-muted-foreground">{m.category}</td>
                <td className="hidden md:table-cell text-sm text-muted-foreground">{m.assignedTo || '—'}</td>
                <td className="hidden lg:table-cell text-sm text-muted-foreground">{formatDate(m.reportedDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
