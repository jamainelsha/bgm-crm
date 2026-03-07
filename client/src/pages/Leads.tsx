// Barrina Gardens CRM — Leads / Prospective Residents
import { useState, useMemo } from 'react';
import { Search, ChevronRight, X, Phone, Mail, Calendar, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { leads, formatDate, type Lead, type EnquiryStatus } from '@/lib/data';

const C = { green: 'oklch(0.48 0.12 145)', amber: 'oklch(0.72 0.14 80)', brown: 'oklch(0.42 0.08 65)' };

const STATUS_COLORS: Record<EnquiryStatus, string> = {
  'Active': 'bg-green-100 text-green-800 border-green-200',
  'Waitlist': 'bg-blue-100 text-blue-800 border-blue-200',
  'No Longer Interested': 'bg-gray-100 text-gray-600 border-gray-200',
  'Sold': 'bg-purple-100 text-purple-800 border-purple-200',
};

export default function Leads() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Lead | null>(null);

  const sources = useMemo(() => {
    const s = new Set(leads.map(l => l.leadSource).filter(Boolean));
    return Array.from(s).sort();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return leads.filter(l => {
      const matchSearch = !q || l.name.toLowerCase().includes(q) || l.phone.includes(q) || l.email.toLowerCase().includes(q) || l.notes.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || l.status === statusFilter;
      const matchSource = sourceFilter === 'all' || l.leadSource === sourceFilter;
      return matchSearch && matchStatus && matchSource;
    });
  }, [search, statusFilter, sourceFilter]);

  const stats = useMemo(() => ({
    active: leads.filter(l => l.status === 'Active').length,
    waitlist: leads.filter(l => l.status === 'Waitlist').length,
    noLonger: leads.filter(l => l.status === 'No Longer Interested').length,
    sold: leads.filter(l => l.status === 'Sold').length,
  }), []);

  return (
    <div className="flex h-full overflow-hidden">
      {/* List panel */}
      <div className={`flex flex-col border-r border-border bg-card ${selected ? 'hidden lg:flex lg:w-96' : 'w-full'}`}>
        <div className="p-4 border-b border-border space-y-3">
          <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Prospective Leads</h1>
          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Active', value: stats.active, color: C.green },
              { label: 'Waitlist', value: stats.waitlist, color: '#3b82f6' },
              { label: 'No Longer', value: stats.noLonger, color: '#9ca3af' },
              { label: 'Sold', value: stats.sold, color: '#8b5cf6' },
            ].map(s => (
              <div key={s.label} className="text-center p-2 rounded-lg bg-muted/40">
                <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          {/* Filters */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search name, phone, notes..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 text-xs flex-1">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Waitlist">Waitlist</SelectItem>
                <SelectItem value="No Longer Interested">No Longer Interested</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="h-8 text-xs flex-1">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {sources.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">{filtered.length} of {leads.length} leads</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(lead => (
            <div key={lead.id} onClick={() => setSelected(lead)}
              className={`flex items-start gap-3 px-4 py-3 border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${selected?.id === lead.id ? 'bg-muted' : ''}`}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white" style={{ background: C.amber }}>
                {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                <p className="text-xs text-muted-foreground truncate">{lead.phone || lead.email || 'No contact'}</p>
                {lead.notes && <p className="text-xs text-muted-foreground truncate mt-0.5 italic">{lead.notes.slice(0, 60)}{lead.notes.length > 60 ? '...' : ''}</p>}
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${STATUS_COLORS[lead.status]}`}>{lead.status}</span>
                {lead.contactDate && <span className="text-[10px] text-muted-foreground">{formatDate(lead.contactDate)}</span>}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">No leads found</div>}
        </div>
      </div>

      {/* Detail panel */}
      {selected ? (
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelected(null)} className="lg:hidden p-1 rounded hover:bg-muted mr-1"><X size={16} /></button>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: C.amber }}>
                {selected.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">{selected.name}</h2>
                <p className="text-xs text-muted-foreground">{selected.leadSource || 'Unknown source'}</p>
              </div>
            </div>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
          </div>
          <div className="p-6 space-y-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Contact Details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{selected.name}</p></div>
                <div><p className="text-xs text-muted-foreground">Lead Source</p><p className="font-medium">{selected.leadSource || '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="font-medium flex items-center gap-1"><Phone size={12} />{selected.phone || '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium flex items-center gap-1 truncate"><Mail size={12} />{selected.email || '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Contact Date</p><p className="font-medium flex items-center gap-1"><Calendar size={12} />{selected.contactDate ? formatDate(selected.contactDate) : '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Callback Date</p><p className="font-medium flex items-center gap-1"><Calendar size={12} />{selected.callbackDate ? formatDate(selected.callbackDate) : '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Action By</p><p className="font-medium">{selected.actionBy || '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Status</p><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[selected.status]}`}>{selected.status}</span></div>
              </CardContent>
            </Card>
            {selected.notes && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Notes</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{selected.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center text-muted-foreground bg-muted/20">
          <div className="text-center">
            <Filter size={48} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">Select a lead to view details</p>
          </div>
        </div>
      )}
    </div>
  );
}
