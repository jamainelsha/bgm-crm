// BGM CRM — Appointments Page

import { useState } from 'react';
import { Plus, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { appointments, formatDate, type Appointment } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const typeColors: Record<string, string> = {
  'Tour': 'oklch(0.55 0.12 240)',
  'Meeting': 'oklch(0.52 0.09 168)',
  'Move-In': 'oklch(0.52 0.09 168)',
  'Move-Out': 'oklch(0.62 0.14 50)',
  'Medical': 'oklch(0.577 0.245 27.325)',
  'Legal': 'oklch(0.58 0.1 300)',
  'Other': 'oklch(0.52 0.012 240)',
};

function AppointmentCard({ apt }: { apt: Appointment }) {
  return (
    <div
      className="bg-card border border-border rounded-lg p-4 hover:border-primary/40 transition-colors cursor-pointer"
      onClick={() => toast.info(`${apt.title}\n${apt.date} at ${apt.time} · ${apt.duration} min\n${apt.location || ''}\n${apt.notes || ''}`)}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg flex flex-col items-center justify-center shrink-0"
          style={{ background: `${typeColors[apt.type] || 'oklch(0.52 0.012 240)'}/0.12` }}>
          <span className="text-sm font-bold leading-none" style={{ color: typeColors[apt.type] }}>
            {new Date(apt.date).getDate()}
          </span>
          <span className="text-xs leading-none mt-0.5" style={{ color: `${typeColors[apt.type]}` }}>
            {new Date(apt.date).toLocaleString('en-AU', { month: 'short' })}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="font-medium text-sm">{apt.title}</div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0"
              style={{ background: `${typeColors[apt.type] || 'oklch(0.52 0.012 240)'}/0.12`, color: typeColors[apt.type] || 'oklch(0.52 0.012 240)' }}>
              {apt.type}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{apt.time} · {apt.duration} min</span>
            {apt.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{apt.location}</span>}
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{apt.attendees.join(', ')}</span>
          </div>
          {apt.notes && <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">{apt.notes}</p>}
        </div>
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = appointments.filter(a => typeFilter === 'all' || a.type === typeFilter);
  const upcoming = filtered.filter(a => a.status === 'Scheduled');
  const past = filtered.filter(a => a.status !== 'Scheduled');

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="page-subtitle">{upcoming.length} upcoming scheduled</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => toast.info('Schedule appointment coming soon.')}>
          <Plus className="w-3.5 h-3.5" /> Schedule
        </Button>
      </div>

      <div className="flex gap-2">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="All Types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Tour">Tour</SelectItem>
            <SelectItem value="Meeting">Meeting</SelectItem>
            <SelectItem value="Move-In">Move-In</SelectItem>
            <SelectItem value="Move-Out">Move-Out</SelectItem>
            <SelectItem value="Medical">Medical</SelectItem>
            <SelectItem value="Legal">Legal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {upcoming.length > 0 && (
        <div>
          <div className="section-label">Upcoming</div>
          <div className="space-y-3">
            {upcoming.map(a => <AppointmentCard key={a.id} apt={a} />)}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <div className="section-label">Past</div>
          <div className="space-y-3 opacity-70">
            {past.map(a => <AppointmentCard key={a.id} apt={a} />)}
          </div>
        </div>
      )}
    </div>
  );
}
