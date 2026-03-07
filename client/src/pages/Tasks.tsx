// BGM CRM — Tasks Page

import { useState } from 'react';
import { Search, Plus, Clock, CheckSquare, AlertTriangle, Filter } from 'lucide-react';
import { tasks, formatDate, type Task, type TaskStatus, type TaskPriority } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function StatusBadge({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, string> = {
    'Open': 'badge-pending',
    'In Progress': 'badge-occupied',
    'Completed': 'badge-terminated',
    'Overdue': 'badge-overdue',
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

export default function TasksPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Task | null>(null);

  const filtered = tasks.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q) || (t.assignedTo || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const counts = {
    Open: tasks.filter(t => t.status === 'Open').length,
    'In Progress': tasks.filter(t => t.status === 'In Progress').length,
    Overdue: tasks.filter(t => t.status === 'Overdue').length,
    Completed: tasks.filter(t => t.status === 'Completed').length,
  };

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">{tasks.filter(t => t.status !== 'Completed').length} open · {counts.Overdue} overdue</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => toast.info('Add task coming soon.')}>
          <Plus className="w-3.5 h-3.5" /> New Task
        </Button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(counts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
            className={cn('stat-card py-3 text-left transition-all',
              statusFilter === status && 'ring-2 ring-primary'
            )}>
            <span className="stat-card-label">{status}</span>
            <div className={cn('text-2xl font-bold mt-1', status === 'Overdue' && count > 0 ? 'text-red-600' : '')}
              style={{ fontFamily: 'Sora, sans-serif' }}>{count}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Search tasks..." className="pl-8 h-8 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="Urgent">Urgent</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Task list */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Priority</th>
              <th>Status</th>
              <th className="hidden md:table-cell">Assigned To</th>
              <th className="hidden lg:table-cell">Category</th>
              <th className="hidden md:table-cell">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-muted-foreground text-sm">No tasks found</td></tr>
            ) : filtered.map(t => (
              <tr key={t.id} className="cursor-pointer" onClick={() => toast.info(`Task: ${t.title}${t.description ? '\n' + t.description : ''}`)}>
                <td>
                  <div className="flex items-start gap-2">
                    <CheckSquare className={cn('w-4 h-4 mt-0.5 shrink-0', t.status === 'Completed' ? 'text-emerald-500' : 'text-muted-foreground/40')} />
                    <div>
                      <div className={cn('font-medium text-sm', t.status === 'Completed' && 'line-through text-muted-foreground')}>{t.title}</div>
                      {t.description && <div className="text-xs text-muted-foreground truncate max-w-[280px]">{t.description}</div>}
                    </div>
                  </div>
                </td>
                <td><PriorityBadge priority={t.priority} /></td>
                <td><StatusBadge status={t.status} /></td>
                <td className="hidden md:table-cell text-sm text-muted-foreground">{t.assignedTo || '—'}</td>
                <td className="hidden lg:table-cell text-sm text-muted-foreground">{t.category}</td>
                <td className="hidden md:table-cell">
                  {t.dueDate ? (
                    <span className={cn('text-sm', t.status === 'Overdue' ? 'text-red-600 font-medium' : 'text-muted-foreground')}>
                      {t.status === 'Overdue' && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                      {formatDate(t.dueDate)}
                    </span>
                  ) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
