// Barrina Gardens CRM — Leads / Enquiries Page
import { useState, useMemo } from 'react';
import {
  Search, Phone, Mail, Plus, X, ChevronRight, MessageSquare,
  PhoneCall, PhoneMissed, AtSign, Users, Calendar,
  CheckCircle2, Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  formatDate, UNIT_STYLES,
  type Lead, type ContactLogEntry, type Note, BGM_BRAND
} from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { useCRM } from '@/contexts/CRMStore';

const C = BGM_BRAND;
function genId() { return Math.random().toString(36).slice(2, 10); }

const CONTACT_TYPES = ['Phone Call', 'SMS', 'Email', 'In-Person Meeting', 'Attempted Contact'] as const;
const CONTACT_SUBTYPES: Record<string, string[]> = {
  'Attempted Contact': ['Left Message', 'Did Not Leave Message'],
  'Phone Call': ['Answered', 'Voicemail'],
};

function getStatusStyle(status: string) {
  switch (status) {
    case 'Active': return { bg: '#dcfce7', text: '#166534' };
    case 'Waitlist': return { bg: '#dbeafe', text: '#1e40af' };
    case 'No Longer Interested': return { bg: '#fee2e2', text: '#991b1b' };
    case 'Sold': return { bg: '#f3f4f6', text: '#374151' };
    default: return { bg: '#fef9c3', text: '#854d0e' };
  }
}

function getContactIcon(type: string) {
  switch (type) {
    case 'SMS': return <MessageSquare size={13} />;
    case 'Phone Call': return <PhoneCall size={13} />;
    case 'Attempted Contact': return <PhoneMissed size={13} />;
    case 'Email': return <AtSign size={13} />;
    case 'In-Person Meeting': return <Users size={13} />;
    default: return <MessageSquare size={13} />;
  }
}

function getFullName(l: Lead) { return `${l.firstName} ${l.lastName}`; }
function getInitials(l: Lead) { return `${(l.firstName || '')[0] || ''}${(l.lastName || '')[0] || ''}`.toUpperCase(); }

// ── Add Lead Dialog ───────────────────────────────────────────────────────────
function AddLeadDialog({ open, onClose, onAdd }: {
  open: boolean; onClose: () => void; onAdd: (lead: Lead) => void;
}) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', mobile: '', email: '', address: '',
    currentAddress: '', ownsProperty: '', preferredCallbackTime: '',
    desiredUnitStyle: '', budget: '', notes: '', leadSource: '',
  });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) { toast.error('First and last name are required'); return; }
    const lead: Lead = {
      id: genId(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.mobile || undefined,
      email: form.email || undefined,
      address: form.address || undefined,
      currentAddress: form.currentAddress || undefined,
      ownsProperty: form.ownsProperty === 'Yes' ? true : form.ownsProperty === 'No' ? false : undefined,
      preferredCallbackTime: form.preferredCallbackTime || undefined,
      desiredUnitStyle: form.desiredUnitStyle || undefined,
      budget: form.budget ? parseFloat(form.budget.replace(/[^0-9.]/g, '')) : undefined,
      notes: form.notes ? [{ id: genId(), text: form.notes, author: 'System', createdAt: new Date().toISOString() }] : [],
      leadSource: form.leadSource || undefined,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      contactLog: [],
      fieldHistory: [],
    };
    onAdd(lead);
    toast.success(`Lead added: ${getFullName(lead)}`);
    onClose();
    setForm({ firstName: '', lastName: '', mobile: '', email: '', address: '', currentAddress: '', ownsProperty: '', preferredCallbackTime: '', desiredUnitStyle: '', budget: '', notes: '', leadSource: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus size={18} style={{ color: C.green }} />
            New Lead / Enquiry
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">First Name *</Label><Input value={form.firstName} onChange={e => set('firstName', e.target.value)} className="h-8 text-sm mt-1" placeholder="First name" /></div>
            <div><Label className="text-xs">Last Name *</Label><Input value={form.lastName} onChange={e => set('lastName', e.target.value)} className="h-8 text-sm mt-1" placeholder="Last name" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Mobile</Label><Input value={form.mobile} onChange={e => set('mobile', e.target.value)} className="h-8 text-sm mt-1" placeholder="04xx xxx xxx" /></div>
            <div><Label className="text-xs">Email</Label><Input value={form.email} onChange={e => set('email', e.target.value)} className="h-8 text-sm mt-1" type="email" /></div>
          </div>
          <div><Label className="text-xs">Address</Label><Input value={form.address} onChange={e => set('address', e.target.value)} className="h-8 text-sm mt-1" /></div>
          <div className="border-t pt-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Optional Details</p>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Current Address</Label><Input value={form.currentAddress} onChange={e => set('currentAddress', e.target.value)} className="h-8 text-sm mt-1" /></div>
              <div>
                <Label className="text-xs">Owns Property?</Label>
                <Select value={form.ownsProperty} onValueChange={v => set('ownsProperty', v)}>
                  <SelectTrigger className="h-8 text-sm mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Desired Unit Style</Label>
                <Select value={form.desiredUnitStyle} onValueChange={v => set('desiredUnitStyle', v)}>
                  <SelectTrigger className="h-8 text-sm mt-1"><SelectValue placeholder="Any style" /></SelectTrigger>
                  <SelectContent>{UNIT_STYLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs">Budget ($)</Label><Input value={form.budget} onChange={e => set('budget', e.target.value)} className="h-8 text-sm mt-1" placeholder="e.g. 450000" /></div>
              <div><Label className="text-xs">Preferred Callback Time</Label><Input value={form.preferredCallbackTime} onChange={e => set('preferredCallbackTime', e.target.value)} className="h-8 text-sm mt-1" placeholder="e.g. Mornings" /></div>
              <div>
                <Label className="text-xs">Lead Source</Label>
                <Select value={form.leadSource} onValueChange={v => set('leadSource', v)}>
                  <SelectTrigger className="h-8 text-sm mt-1"><SelectValue placeholder="Source..." /></SelectTrigger>
                  <SelectContent>{['Website', 'Referral', 'Phone Enquiry', 'Walk-In', 'Real Estate', 'Social Media', 'Other'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div><Label className="text-xs">Notes</Label><Textarea value={form.notes} onChange={e => set('notes', e.target.value)} className="text-sm mt-1 min-h-16" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} style={{ backgroundColor: C.green, color: 'white' }}>Add Lead</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Add Contact Log Dialog ────────────────────────────────────────────────────
function AddContactLogDialog({ open, onClose, onAdd }: {
  open: boolean; onClose: () => void; onAdd: (entry: ContactLogEntry) => void;
}) {
  const { user } = useAuth();
  const [type, setType] = useState<string>('Phone Call');
  const [subType, setSubType] = useState('');
  const [notes, setNotes] = useState('');
  const subtypes = CONTACT_SUBTYPES[type] || [];

  const handleAdd = () => {
    const entry: ContactLogEntry = {
      id: genId(), type: type as any, subType: subType || undefined,
      notes, author: user?.name || 'Unknown', createdAt: new Date().toISOString(),
    };
    onAdd(entry);
    toast.success('Contact logged');
    onClose();
    setType('Phone Call'); setSubType(''); setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><PhoneCall size={16} style={{ color: C.green }} />Log Contact</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Contact Type</Label>
            <Select value={type} onValueChange={v => { setType(v); setSubType(''); }}>
              <SelectTrigger className="h-8 text-sm mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{CONTACT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {subtypes.length > 0 && (
            <div>
              <Label className="text-xs">Sub-type</Label>
              <Select value={subType} onValueChange={setSubType}>
                <SelectTrigger className="h-8 text-sm mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>{subtypes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
          <div><Label className="text-xs">Notes</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} className="text-sm mt-1 min-h-20" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAdd} style={{ backgroundColor: C.green, color: 'white' }}>Log Contact</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Schedule Callback Dialog ──────────────────────────────────────────────────
function ScheduleCallbackDialog({ open, onClose, leadName, onSchedule }: {
  open: boolean; onClose: () => void; leadName: string;
  onSchedule: (date: string, assignTo: string, notes: string) => void;
}) {
  const { users } = useAuth();
  const [date, setDate] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><Calendar size={16} style={{ color: C.green }} />Schedule Callback — {leadName}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label className="text-xs">Callback Date & Time</Label><Input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} className="h-8 text-sm mt-1" /></div>
          <div>
            <Label className="text-xs">Assign To</Label>
            <Select value={assignTo} onValueChange={setAssignTo}>
              <SelectTrigger className="h-8 text-sm mt-1"><SelectValue placeholder="Select user..." /></SelectTrigger>
              <SelectContent>{users.map(u => <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div><Label className="text-xs">Notes</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} className="text-sm mt-1 min-h-16" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { if (!date) { toast.error('Select a date'); return; } onSchedule(date, assignTo, notes); onClose(); }} style={{ backgroundColor: C.green, color: 'white' }}>Schedule & Create Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Lead Detail Panel ─────────────────────────────────────────────────────────
function LeadDetailPanel({ lead, onClose, onUpdate }: {
  lead: Lead; onClose: () => void; onUpdate: (l: Lead) => void;
}) {
  const { user } = useAuth();
  const [local, setLocal] = useState<Lead>(lead);
  const [showContactLog, setShowContactLog] = useState(false);
  const [showCallback, setShowCallback] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [noteInput, setNoteInput] = useState('');

  const update = (updates: Partial<Lead>) => {
    const updated = { ...local, ...updates };
    setLocal(updated);
    onUpdate(updated);
  };

  const addContactLog = (entry: ContactLogEntry) => update({ contactLog: [...(local.contactLog || []), entry] });

  const addNote = () => {
    if (!noteInput.trim()) return;
    const note: Note = { id: genId(), text: noteInput.trim(), author: user?.name || 'Unknown', createdAt: new Date().toISOString() };
    update({ notes: [...(local.notes || []), note] });
    setNoteInput('');
    toast.success('Note added');
  };

  const scheduleCallback = (date: string, assignTo: string, _notes: string) => {
    update({ callbackDate: date.split('T')[0] });
    toast.success(`Callback scheduled — Task created for ${assignTo || 'unassigned'}`);
  };

  const ss = getStatusStyle(local.status);

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-xl bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b flex items-start justify-between" style={{ backgroundColor: C.sidebar }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ backgroundColor: C.green }}>{getInitials(local)}</div>
            <div>
              <p className="text-lg font-bold text-white">{getFullName(local)}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer" style={{ backgroundColor: ss.bg, color: ss.text }} onClick={() => setEditingStatus(true)}>{local.status}</span>
                {local.leadSource && <span className="text-xs text-gray-400">{local.leadSource}</span>}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white mt-1"><X size={20} /></button>
        </div>

        {editingStatus && (
          <div className="px-4 py-2 bg-gray-50 border-b flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">Change status:</span>
            {(['Active', 'Waitlist', 'No Longer Interested', 'Sold'] as const).map(s => (
              <button key={s} onClick={() => { update({ status: s }); setEditingStatus(false); }} className="text-xs px-2 py-0.5 rounded-full font-medium" style={getStatusStyle(s)}>{s}</button>
            ))}
            <button onClick={() => setEditingStatus(false)} className="ml-auto text-gray-400"><X size={14} /></button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Contact details */}
          <div className="grid grid-cols-2 gap-3">
            {local.phone && (
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2.5">
                <Phone size={14} style={{ color: C.green }} />
                <div><p className="text-xs text-gray-400">Mobile</p><p className="text-sm font-medium text-gray-800">{local.phone}</p></div>
              </div>
            )}
            {local.email && (
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2.5">
                <Mail size={14} style={{ color: C.green }} />
                <div><p className="text-xs text-gray-400">Email</p><p className="text-sm font-medium text-gray-800 truncate">{local.email}</p></div>
              </div>
            )}
            {local.address && (
              <div className="col-span-2 bg-gray-50 rounded-lg p-2.5">
                <p className="text-xs text-gray-400">Address</p>
                <p className="text-sm font-medium text-gray-800">{local.address}</p>
              </div>
            )}
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['Current Address', local.currentAddress],
              ['Owns Property', local.ownsProperty === true ? 'Yes' : local.ownsProperty === false ? 'No' : undefined],
              ['Desired Unit Style', local.desiredUnitStyle],
              ['Budget', local.budget ? `$${local.budget.toLocaleString()}` : undefined],
              ['Preferred Callback', local.preferredCallbackTime],
              ['Callback Date', local.callbackDate ? formatDate(local.callbackDate) : undefined],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label as string}>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="font-medium text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={() => setShowContactLog(true)}><PhoneCall size={13} className="mr-1" />Log Contact</Button>
            <Button size="sm" variant="outline" onClick={() => setShowCallback(true)}><Calendar size={13} className="mr-1" />Schedule Callback</Button>
            {local.status !== 'Sold' && (
              <Button size="sm" variant="outline" onClick={() => { update({ status: 'Sold' }); toast.success('Lead marked as Sold'); }}>
                <CheckCircle2 size={13} className="mr-1" />Mark Sold
              </Button>
            )}
          </div>

          {/* Contact Log */}
          {(local.contactLog || []).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Contact Log</p>
              <div className="space-y-2">
                {(local.contactLog || []).slice().reverse().map(e => (
                  <div key={e.id} className="flex items-start gap-2 bg-gray-50 rounded-lg p-2.5 text-xs">
                    <div className="mt-0.5" style={{ color: C.green }}>{getContactIcon(e.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-medium text-gray-700">{e.type}{e.subType ? ` — ${e.subType}` : ''}</span>
                        <span className="text-gray-400">{new Date(e.createdAt).toLocaleString('en-AU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-gray-500">{e.author}</p>
                      {e.notes && <p className="text-gray-700 mt-0.5">{e.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes</p>
            <div className="space-y-2">
              {(local.notes || []).slice().reverse().map(n => (
                <div key={n.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-700 text-xs">{n.author}</span>
                    <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-gray-700">{n.text}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input placeholder="Add a note..." value={noteInput} onChange={e => setNoteInput(e.target.value)} className="text-sm h-8" onKeyDown={e => e.key === 'Enter' && addNote()} />
              <Button size="sm" style={{ backgroundColor: C.green, color: 'white' }} onClick={addNote} disabled={!noteInput.trim()}><Plus size={14} /></Button>
            </div>
          </div>
        </div>
      </div>

      {showContactLog && <AddContactLogDialog open onClose={() => setShowContactLog(false)} onAdd={addContactLog} />}
      {showCallback && <ScheduleCallbackDialog open onClose={() => setShowCallback(false)} leadName={getFullName(local)} onSchedule={scheduleCallback} />}
    </div>
  );
}

// ── Main Leads Page ───────────────────────────────────────────────────────────
export default function Leads() {
  const { leads: allLeads, addLead, updateLead } = useCRM();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [contactedFilter, setContactedFilter] = useState('All');
  const [selected, setSelected] = useState<Lead | null>(null);
  const [showAddLead, setShowAddLead] = useState(false);

  const filtered = useMemo(() => allLeads.filter(l => {
    const q = search.toLowerCase();
    const fullName = getFullName(l).toLowerCase();
    const matchSearch = !q || fullName.includes(q) || (l.phone || '').includes(q) || (l.email || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || l.status === statusFilter;
    const hasContact = (l.contactLog || []).length > 0;
    const matchContacted = contactedFilter === 'All' || (contactedFilter === 'Contacted' && hasContact) || (contactedFilter === 'Not Contacted' && !hasContact);
    return matchSearch && matchStatus && matchContacted;
  }), [allLeads, search, statusFilter, contactedFilter]);

  const stats = useMemo(() => ({
    total: allLeads.length,
    active: allLeads.filter(l => l.status === 'Active').length,
    waitlist: allLeads.filter(l => l.status === 'Waitlist').length,
    sold: allLeads.filter(l => l.status === 'Sold').length,
  }), [allLeads]);

   const handleUpdate = (updated: Lead) => {
    updateLead(updated.id, updated);
    if (selected?.id === updated.id) setSelected(updated);
  };
  const handleAdd = (lead: Lead) => {
    addLead(lead);
    setSelected(lead);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Leads & Enquiries</h1>
            <p className="text-sm text-gray-500 mt-0.5">{stats.active} active · {stats.waitlist} waitlist · {stats.sold} sold</p>
          </div>
          <Button size="sm" style={{ backgroundColor: C.green, color: 'white' }} onClick={() => setShowAddLead(true)}>
            <Plus size={14} className="mr-1" />New Lead
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Total Leads', value: stats.total, color: C.sidebar },
            { label: 'Active', value: stats.active, color: '#166534' },
            { label: 'Waitlist', value: stats.waitlist, color: '#1e40af' },
            { label: 'Sold', value: stats.sold, color: '#374151' },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 rounded-lg px-3 py-2 text-center">
              <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <div className="relative flex-1 min-w-48 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search leads..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {['All', 'Active', 'Waitlist', 'No Longer Interested', 'Sold'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className="px-3 py-1 rounded-full text-xs font-medium transition"
                style={statusFilter === s ? { backgroundColor: C.green, color: 'white' } : { backgroundColor: '#f3f4f6', color: '#374151' }}>
                {s === 'No Longer Interested' ? 'Not Interested' : s}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {['All', 'Contacted', 'Not Contacted'].map(f => (
              <button key={f} onClick={() => setContactedFilter(f)} className="px-3 py-1 rounded-full text-xs font-medium transition"
                style={contactedFilter === f ? { backgroundColor: C.brown, color: 'white' } : { backgroundColor: '#f3f4f6', color: '#374151' }}>{f}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
            <tr>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Name</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Contact</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Desired Unit</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Contacts</th>
              <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">Callback</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(l => {
              const ss = getStatusStyle(l.status);
              const contactCount = (l.contactLog || []).length;
              return (
                <tr key={l.id} className="hover:bg-gray-50 cursor-pointer transition" onClick={() => setSelected(l)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: C.green }}>{getInitials(l)}</div>
                      <p className="font-medium text-gray-800">{getFullName(l)}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      {l.phone && <p className="text-gray-600 flex items-center gap-1 text-xs"><Phone size={10} />{l.phone}</p>}
                      {l.email && <p className="text-gray-400 text-xs truncate max-w-36">{l.email}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: ss.bg, color: ss.text }}>{l.status}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{l.desiredUnitStyle || '—'}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {contactCount > 0
                      ? <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-50 text-green-700">{contactCount} contact{contactCount > 1 ? 's' : ''}</span>
                      : <span className="text-xs text-gray-400">None</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden lg:table-cell">{l.callbackDate ? formatDate(l.callbackDate) : '—'}</td>
                  <td className="px-4 py-3"><ChevronRight size={16} className="text-gray-400" /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!filtered.length && (
          <div className="text-center py-12">
            <Filter size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No leads found</p>
          </div>
        )}
      </div>

      {selected && <LeadDetailPanel lead={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} />}
      <AddLeadDialog open={showAddLead} onClose={() => setShowAddLead(false)} onAdd={handleAdd} />
    </div>
  );
}
