// Barrina Gardens CRM — Waitlist Page
import { useState, useMemo } from 'react';
import { ListOrdered, Phone, Mail, Calendar, Plus, X, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { leads as initialLeads, formatDate, UNIT_STYLES, type Lead, BGM_BRAND } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';

const C = BGM_BRAND;
function genId() { return Math.random().toString(36).slice(2, 10); }
function getFullName(l: Lead) { return `${l.firstName} ${l.lastName}`; }

function AddWaitlistDialog({ open, onClose, onAdd }: {
  open: boolean; onClose: () => void; onAdd: (lead: Lead) => void;
}) {
  const { users } = useAuth();
  const [form, setForm] = useState({
    firstName: '', lastName: '', mobile: '', email: '',
    desiredUnitStyle: '', budget: '', callbackDate: '',
    assignTo: '', notes: '',
  });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) { toast.error('First and last name are required'); return; }
    const lead: Lead = {
      id: genId(), firstName: form.firstName.trim(), lastName: form.lastName.trim(),
      phone: form.mobile || undefined, email: form.email || undefined,
      desiredUnitStyle: form.desiredUnitStyle || undefined,
      budget: form.budget ? parseFloat(form.budget.replace(/[^0-9.]/g, '')) : undefined,
      callbackDate: form.callbackDate || undefined, assignedTo: form.assignTo || undefined,
      notes: form.notes ? [{ id: genId(), text: form.notes, author: 'System', createdAt: new Date().toISOString() }] : [],
      status: 'Waitlist', createdAt: new Date().toISOString().split('T')[0], contactLog: [], fieldHistory: [],
    };
    onAdd(lead);
    toast.success(`${getFullName(lead)} added to waitlist`);
    onClose();
    setForm({ firstName: '', lastName: '', mobile: '', email: '', desiredUnitStyle: '', budget: '', callbackDate: '', assignTo: '', notes: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><ListOrdered size={18} style={{ color: C.green }} />Add to Waitlist</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">First Name *</Label><Input value={form.firstName} onChange={e => set('firstName', e.target.value)} className="h-8 text-sm mt-1" /></div>
            <div><Label className="text-xs">Last Name *</Label><Input value={form.lastName} onChange={e => set('lastName', e.target.value)} className="h-8 text-sm mt-1" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Mobile</Label><Input value={form.mobile} onChange={e => set('mobile', e.target.value)} className="h-8 text-sm mt-1" /></div>
            <div><Label className="text-xs">Email</Label><Input value={form.email} onChange={e => set('email', e.target.value)} className="h-8 text-sm mt-1" type="email" /></div>
          </div>
          <div>
            <Label className="text-xs">Desired Unit Style</Label>
            <Select value={form.desiredUnitStyle} onValueChange={v => set('desiredUnitStyle', v)}>
              <SelectTrigger className="h-8 text-sm mt-1"><SelectValue placeholder="Select unit style..." /></SelectTrigger>
              <SelectContent>{UNIT_STYLES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Budget ($)</Label>
            <div className="relative mt-1">
              <DollarSign size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input value={form.budget} onChange={e => set('budget', e.target.value)} className="h-8 text-sm pl-7" placeholder="e.g. 450000" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Callback Date</Label><Input type="date" value={form.callbackDate} onChange={e => set('callbackDate', e.target.value)} className="h-8 text-sm mt-1" /></div>
            <div>
              <Label className="text-xs">Assign Callback To</Label>
              <Select value={form.assignTo} onValueChange={v => set('assignTo', v)}>
                <SelectTrigger className="h-8 text-sm mt-1"><SelectValue placeholder="Select user..." /></SelectTrigger>
                <SelectContent>{users.map(u => <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div><Label className="text-xs">Notes</Label><Textarea value={form.notes} onChange={e => set('notes', e.target.value)} className="text-sm mt-1 min-h-16" /></div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} style={{ backgroundColor: C.green, color: 'white' }}>Add to Waitlist</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Waitlist() {
  const [allLeads, setAllLeads] = useState<Lead[]>(initialLeads);
  const [showAdd, setShowAdd] = useState(false);

  const waitlistLeads = useMemo(() =>
    allLeads.filter(l => l.status === 'Waitlist').sort((a, b) =>
      (a.createdAt || '').localeCompare(b.createdAt || '')), [allLeads]);

  const handleAdd = (lead: Lead) => setAllLeads(prev => [...prev, lead]);
  const handleRemove = (id: string) => {
    setAllLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'No Longer Interested' as const } : l));
    toast.success('Removed from waitlist');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Waitlist</h1>
          <p className="text-sm text-gray-500 mt-0.5">{waitlistLeads.length} prospect{waitlistLeads.length !== 1 ? 's' : ''} on waitlist</p>
        </div>
        <Button size="sm" style={{ backgroundColor: C.green, color: 'white' }} onClick={() => setShowAdd(true)}>
          <Plus size={14} className="mr-1" />Add to Waitlist
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {waitlistLeads.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <ListOrdered size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No prospects on the waitlist</p>
            <Button size="sm" variant="outline" className="mt-4" onClick={() => setShowAdd(true)}>Add First Entry</Button>
          </div>
        ) : (
          <div className="space-y-2 max-w-3xl">
            {waitlistLeads.map((lead, idx) => (
              <div key={lead.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-4 hover:border-gray-300 transition">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor: C.green }}>{idx + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-semibold text-gray-800">{getFullName(lead)}</p>
                    {lead.desiredUnitStyle && <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: C.green + '20', color: C.green }}>{lead.desiredUnitStyle}</span>}
                    {lead.budget && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">${lead.budget.toLocaleString()}</span>}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                    {lead.phone && <span className="flex items-center gap-1"><Phone size={10} />{lead.phone}</span>}
                    {lead.email && <span className="flex items-center gap-1"><Mail size={10} />{lead.email}</span>}
                    {lead.callbackDate && <span className="flex items-center gap-1"><Calendar size={10} />Callback: {formatDate(lead.callbackDate)}</span>}
                    {lead.assignedTo && <span className="text-gray-400">→ {lead.assignedTo}</span>}
                  </div>
                  {(lead.notes || []).length > 0 && <p className="text-xs text-gray-400 mt-1 italic truncate">{lead.notes![0].text}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400">{lead.createdAt ? formatDate(lead.createdAt) : ''}</span>
                  <button onClick={() => handleRemove(lead.id)} className="text-gray-300 hover:text-red-400 transition"><X size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <AddWaitlistDialog open={showAdd} onClose={() => setShowAdd(false)} onAdd={handleAdd} />
    </div>
  );
}
