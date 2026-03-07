// BGM CRM — Enquiries Page
// Sales pipeline with list view and detail panel

import { useState } from 'react';
import { Search, Plus, Phone, Mail, Calendar, ChevronRight, UserPlus, StickyNote, ArrowRight } from 'lucide-react';
import { enquiries, formatDate, type Enquiry, type EnquiryStatus } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusOrder: EnquiryStatus[] = ['New', 'Contacted', 'Tour Scheduled', 'Application', 'Waitlisted', 'Closed Won', 'Closed Lost'];

function StatusBadge({ status }: { status: EnquiryStatus }) {
  const map: Record<EnquiryStatus, string> = {
    'New': 'badge-enquiry',
    'Contacted': 'badge-pending',
    'Tour Scheduled': 'badge-pending',
    'Application': 'badge-occupied',
    'Waitlisted': 'badge-waitlist',
    'Closed Won': 'badge-occupied',
    'Closed Lost': 'badge-terminated',
  };
  return <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', map[status])}>{status}</span>;
}

function EnquiryDetail({ enquiry, onClose }: { enquiry: Enquiry; onClose: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-border">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white shrink-0"
            style={{ background: 'oklch(0.55 0.12 240)' }}>
            {enquiry.firstName[0]}{enquiry.lastName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
              {enquiry.title} {enquiry.firstName} {enquiry.lastName}
            </h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <StatusBadge status={enquiry.status} />
              <span className="text-xs text-muted-foreground">{enquiry.enquiryNo}</span>
              <span className="text-xs text-muted-foreground">via {enquiry.source}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg font-light">×</button>
        </div>
      </div>

      {/* Pipeline progress */}
      <div className="px-5 py-3 border-b border-border">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {statusOrder.slice(0, 5).map((s, i) => (
            <div key={s} className="flex items-center gap-1 shrink-0">
              <div className={cn('px-2 py-1 rounded text-xs font-medium',
                enquiry.status === s ? 'text-white' : 'text-muted-foreground bg-muted/50'
              )}
                style={enquiry.status === s ? { background: 'oklch(0.52 0.09 168)' } : {}}>
                {s}
              </div>
              {i < 4 && <ArrowRight className="w-3 h-3 text-muted-foreground/40 shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-5 mt-3 w-auto justify-start h-8 bg-muted/50 p-0.5">
          <TabsTrigger value="details" className="text-xs h-7">Details</TabsTrigger>
          <TabsTrigger value="notes" className="text-xs h-7">Notes ({enquiry.notes.length})</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="details" className="p-5 space-y-4 mt-0">
            <div className="form-section">
              <div className="form-section-title">Contact Information</div>
              <div className="space-y-2 text-sm">
                {enquiry.mobile && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-muted-foreground" />{enquiry.mobile}</div>}
                {enquiry.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-muted-foreground" />{enquiry.phone}</div>}
                {enquiry.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-muted-foreground" />{enquiry.email}</div>}
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">Enquiry Details</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Enquiry Date</span><div className="font-medium mt-0.5">{formatDate(enquiry.enquiryDate)}</div></div>
                <div><span className="text-muted-foreground">Source</span><div className="font-medium mt-0.5">{enquiry.source}</div></div>
                {enquiry.preferredUnitType && <div><span className="text-muted-foreground">Preferred Unit</span><div className="font-medium mt-0.5">{enquiry.preferredUnitType}</div></div>}
                {enquiry.budget && <div><span className="text-muted-foreground">Budget</span><div className="font-medium mt-0.5">${enquiry.budget.toLocaleString()}</div></div>}
                {enquiry.assignedTo && <div><span className="text-muted-foreground">Assigned To</span><div className="font-medium mt-0.5">{enquiry.assignedTo}</div></div>}
                {enquiry.tourDate && <div><span className="text-muted-foreground">Tour Date</span><div className="font-medium mt-0.5">{formatDate(enquiry.tourDate)}</div></div>}
                {enquiry.nextFollowUp && <div><span className="text-muted-foreground">Next Follow-up</span><div className="font-medium mt-0.5">{formatDate(enquiry.nextFollowUp)}</div></div>}
                {enquiry.waitlistPosition && <div><span className="text-muted-foreground">Waitlist Position</span><div className="font-medium mt-0.5">#{enquiry.waitlistPosition}</div></div>}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="p-5 mt-0">
            <div className="flex items-center justify-between mb-4">
              <span className="section-label">Activity & Notes</span>
              <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => toast.info('Add note coming soon.')}>
                <Plus className="w-3 h-3 mr-1" /> Add Note
              </Button>
            </div>
            {enquiry.notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notes recorded.</p>
            ) : (
              <div className="space-y-3">
                {enquiry.notes.map(note => (
                  <div key={note.id} className="timeline-item">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: 'oklch(0.55 0.12 240)' }}>
                      {note.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 bg-muted/40 rounded-md p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold">{note.user}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(note.date)} {note.time}</span>
                      </div>
                      <p className="text-sm">{note.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>

      <div className="p-4 border-t border-border flex gap-2">
        <Button size="sm" className="flex-1 text-xs" onClick={() => toast.info('Update status coming soon.')}>Update Status</Button>
        <Button size="sm" variant="outline" className="text-xs" onClick={() => toast.info('Schedule tour coming soon.')}>
          <Calendar className="w-3 h-3 mr-1" /> Schedule Tour
        </Button>
      </div>
    </div>
  );
}

export default function EnquiriesPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Enquiry | null>(null);

  const filtered = enquiries.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${e.firstName} ${e.lastName} ${e.enquiryNo} ${e.email || ''} ${e.mobile || ''}`.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pipelineCounts = statusOrder.reduce((acc, s) => {
    acc[s] = enquiries.filter(e => e.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex h-full">
      <div className={cn('flex flex-col', selected ? 'hidden lg:flex lg:w-[480px] shrink-0 border-r border-border' : 'flex-1')}>
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="page-title">Enquiries</h1>
              <p className="page-subtitle">{enquiries.filter(e => e.status !== 'Closed Won' && e.status !== 'Closed Lost').length} active · {enquiries.length} total</p>
            </div>
            <Button size="sm" className="gap-1.5 text-xs" onClick={() => toast.info('Add enquiry coming soon.')}>
              <Plus className="w-3.5 h-3.5" /> New Enquiry
            </Button>
          </div>

          {/* Pipeline summary */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 mb-4">
            {statusOrder.slice(0, 5).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
                className={cn('flex flex-col items-center px-3 py-2 rounded-lg text-xs border shrink-0 transition-colors',
                  statusFilter === s ? 'bg-foreground text-background border-foreground' : 'bg-card border-border hover:border-foreground/30'
                )}>
                <span className="font-bold text-base leading-none">{pipelineCounts[s] || 0}</span>
                <span className="mt-0.5 opacity-70">{s}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Search enquiries..." className="pl-8 h-8 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 h-8 text-xs">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOrder.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <UserPlus className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">No enquiries found</p>
            </div>
          ) : (
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>Prospect</th>
                  <th>Status</th>
                  <th className="hidden md:table-cell">Preference</th>
                  <th className="hidden lg:table-cell">Follow-up</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id} className={cn('cursor-pointer', selected?.id === e.id && 'bg-accent/60')} onClick={() => setSelected(e)}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: 'oklch(0.55 0.12 240)' }}>
                          {e.firstName[0]}{e.lastName[0]}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{e.title} {e.firstName} {e.lastName}</div>
                          <div className="text-xs text-muted-foreground">{e.enquiryNo} · {e.source}</div>
                        </div>
                      </div>
                    </td>
                    <td><StatusBadge status={e.status} /></td>
                    <td className="hidden md:table-cell text-sm text-muted-foreground">{e.preferredUnitType || '—'}</td>
                    <td className="hidden lg:table-cell text-sm text-muted-foreground">{e.nextFollowUp ? formatDate(e.nextFollowUp) : '—'}</td>
                    <td><ChevronRight className="w-4 h-4 text-muted-foreground" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selected && (
        <div className="flex-1 overflow-hidden">
          <EnquiryDetail enquiry={selected} onClose={() => setSelected(null)} />
        </div>
      )}
    </div>
  );
}
