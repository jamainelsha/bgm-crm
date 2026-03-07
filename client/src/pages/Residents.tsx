// BGM CRM — Residents Page
// Full resident list with search, filter, and detail panel

import { useState } from 'react';
import { Search, Plus, Phone, Mail, Home, Filter, ChevronRight, Heart, FileText, Users, StickyNote, AlertCircle } from 'lucide-react';
import { residents, formatDate, getUnitByNo, type Resident, type ResidentStatus } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function StatusBadge({ status }: { status: ResidentStatus }) {
  const map: Record<ResidentStatus, string> = {
    'Active': 'badge-occupied',
    'Departed': 'badge-terminated',
    'Deceased': 'badge-terminated',
    'On Leave': 'badge-pending',
  };
  return <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', map[status])}>{status}</span>;
}

function ResidentAvatar({ resident }: { resident: Resident }) {
  const colors = ['oklch(0.52 0.09 168)', 'oklch(0.55 0.12 240)', 'oklch(0.62 0.14 50)', 'oklch(0.65 0.12 168)', 'oklch(0.58 0.1 300)'];
  const color = colors[resident.id.charCodeAt(1) % colors.length];
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
      style={{ background: color }}>
      {resident.firstName[0]}{resident.lastName[0]}
    </div>
  );
}

function ResidentDetail({ resident, onClose }: { resident: Resident; onClose: () => void }) {
  const unit = resident.unitNo ? getUnitByNo(resident.unitNo) : undefined;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0"
            style={{ background: 'oklch(0.52 0.09 168)' }}>
            {resident.firstName[0]}{resident.lastName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>
              {resident.title} {resident.firstName} {resident.lastName}
            </h2>
            {resident.preferredName !== resident.firstName && (
              <p className="text-sm text-muted-foreground">Known as "{resident.preferredName}"</p>
            )}
            <div className="flex items-center gap-2 mt-1.5">
              <StatusBadge status={resident.status} />
              {resident.unitNo && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Home className="w-3 h-3" /> Unit {resident.unitNo}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg font-light">×</button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-5 mt-3 w-auto justify-start h-8 bg-muted/50 p-0.5">
          <TabsTrigger value="overview" className="text-xs h-7">Overview</TabsTrigger>
          <TabsTrigger value="health" className="text-xs h-7">Health</TabsTrigger>
          <TabsTrigger value="contacts" className="text-xs h-7">Contacts</TabsTrigger>
          <TabsTrigger value="notes" className="text-xs h-7">Notes</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="overview" className="p-5 space-y-4 mt-0">
            <div className="form-section">
              <div className="form-section-title">Personal Details</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Date of Birth</span><div className="font-medium mt-0.5">{formatDate(resident.dateOfBirth)}</div></div>
                <div><span className="text-muted-foreground">Age</span><div className="font-medium mt-0.5">{resident.age} years</div></div>
                <div><span className="text-muted-foreground">Gender</span><div className="font-medium mt-0.5">{resident.gender}</div></div>
                <div><span className="text-muted-foreground">Resident ID</span><div className="font-medium mt-0.5 font-mono text-xs">{resident.residentId}</div></div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-title">Contact Information</div>
              <div className="space-y-2 text-sm">
                {resident.mobile && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-muted-foreground" /><span>{resident.mobile}</span><span className="text-muted-foreground text-xs">Mobile</span></div>}
                {resident.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-muted-foreground" /><span>{resident.phone}</span><span className="text-muted-foreground text-xs">Home</span></div>}
                {resident.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-muted-foreground" /><span>{resident.email}</span></div>}
              </div>
            </div>

            {resident.unitNo && (
              <div className="form-section">
                <div className="form-section-title">Unit Details</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Unit No.</span><div className="font-medium mt-0.5">Unit {resident.unitNo}</div></div>
                  {unit && <>
                    <div><span className="text-muted-foreground">Type</span><div className="font-medium mt-0.5">{unit.unitType} — {unit.unitStyle}</div></div>
                    <div><span className="text-muted-foreground">Size</span><div className="font-medium mt-0.5">{unit.sqm} m²</div></div>
                  </>}
                  {resident.moveInDate && <div><span className="text-muted-foreground">Move-in</span><div className="font-medium mt-0.5">{formatDate(resident.moveInDate)}</div></div>}
                  {resident.moveOutDate && <div><span className="text-muted-foreground">Move-out</span><div className="font-medium mt-0.5">{formatDate(resident.moveOutDate)}</div></div>}
                </div>
              </div>
            )}

            {resident.pets && resident.pets.length > 0 && (
              <div className="form-section">
                <div className="form-section-title">Pets</div>
                {resident.pets.map((pet, i) => (
                  <div key={i} className="text-sm">{pet.type} — {pet.breed}</div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="health" className="p-5 space-y-4 mt-0">
            <div className="form-section">
              <div className="form-section-title">Health Insurance & Medicare</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {resident.medicareNo && <div><span className="text-muted-foreground">Medicare No.</span><div className="font-medium mt-0.5 font-mono text-xs">{resident.medicareNo}</div></div>}
                {resident.ambulanceNo && <div><span className="text-muted-foreground">Ambulance No.</span><div className="font-medium mt-0.5 font-mono text-xs">{resident.ambulanceNo}</div></div>}
                {resident.healthInsName && <div><span className="text-muted-foreground">Health Insurance</span><div className="font-medium mt-0.5">{resident.healthInsName}</div></div>}
                {resident.healthInsNo && <div><span className="text-muted-foreground">Policy No.</span><div className="font-medium mt-0.5 font-mono text-xs">{resident.healthInsNo}</div></div>}
              </div>
            </div>

            {resident.drName && (
              <div className="form-section">
                <div className="form-section-title">General Practitioner</div>
                <div className="space-y-1.5 text-sm">
                  <div className="font-medium">{resident.drName}</div>
                  {resident.clinicName && <div className="text-muted-foreground">{resident.clinicName}</div>}
                  {resident.drPhone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-muted-foreground" />{resident.drPhone}</div>}
                </div>
              </div>
            )}

            {resident.medications.length > 0 && (
              <div className="form-section">
                <div className="form-section-title">Medications</div>
                <div className="space-y-2">
                  {resident.medications.map(med => (
                    <div key={med.id} className="flex items-start justify-between text-sm">
                      <div>
                        <div className="font-medium">{med.name}</div>
                        <div className="text-muted-foreground text-xs">{med.dosage} · {med.frequency}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resident.allergies.length > 0 && (
              <div className="form-section">
                <div className="form-section-title flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500" /> Allergies
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {resident.allergies.map(a => (
                    <span key={a} className="badge-overdue inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">{a}</span>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="contacts" className="p-5 space-y-4 mt-0">
            <div className="form-section">
              <div className="form-section-title">Emergency Contacts</div>
              {resident.emergencyContacts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No emergency contacts recorded.</p>
              ) : (
                <div className="space-y-3">
                  {resident.emergencyContacts.map(ec => (
                    <div key={ec.id} className="flex items-start gap-3 p-2.5 bg-muted/40 rounded-md">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: 'oklch(0.55 0.12 240)' }}>
                        {ec.callSeq}
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">{ec.title} {ec.fullName}</div>
                        <div className="text-muted-foreground text-xs">{ec.relationship}</div>
                        {ec.mobile && <div className="flex items-center gap-1 mt-1"><Phone className="w-3 h-3 text-muted-foreground" />{ec.mobile}</div>}
                        {ec.phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-muted-foreground" />{ec.phone}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {resident.lawyerName && (
              <div className="form-section">
                <div className="form-section-title">Lawyer</div>
                <div className="text-sm space-y-1">
                  <div className="font-medium">{resident.lawyerName}</div>
                  {resident.firmName && <div className="text-muted-foreground">{resident.firmName}</div>}
                </div>
              </div>
            )}

            {resident.poaName && (
              <div className="form-section">
                <div className="form-section-title">Power of Attorney</div>
                <div className="text-sm space-y-1">
                  <div className="font-medium">{resident.poaName}</div>
                  {resident.poaAppointed && <div className="text-muted-foreground text-xs">Appointed: {formatDate(resident.poaAppointed)}</div>}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="p-5 mt-0">
            <div className="flex items-center justify-between mb-4">
              <span className="section-label">Notes & History</span>
              <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => toast.info('Add note coming soon.')}>
                <Plus className="w-3 h-3 mr-1" /> Add Note
              </Button>
            </div>
            {resident.notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notes recorded.</p>
            ) : (
              <div className="space-y-3">
                {resident.notes.map(note => (
                  <div key={note.id} className="timeline-item">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: 'oklch(0.52 0.09 168)' }}>
                      {note.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 bg-muted/40 rounded-md p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold">{note.user}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(note.date)} {note.time}</span>
                      </div>
                      <span className={cn('inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium mb-1.5',
                        note.type === 'Medical' ? 'bg-red-50 text-red-700' : 'bg-muted text-muted-foreground')}>
                        {note.type}
                      </span>
                      <p className="text-sm">{note.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>

      {/* Actions */}
      <div className="p-4 border-t border-border flex gap-2">
        <Button size="sm" className="flex-1 text-xs" onClick={() => toast.info('Edit resident coming soon.')}>Edit Record</Button>
        <Button size="sm" variant="outline" className="text-xs" onClick={() => toast.info('Print record coming soon.')}>Print</Button>
      </div>
    </div>
  );
}

export default function ResidentsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Resident | null>(null);

  const filtered = residents.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${r.firstName} ${r.lastName} ${r.preferredName} ${r.residentId} ${r.unitNo}`.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex h-full">
      {/* List panel */}
      <div className={cn('flex flex-col', selected ? 'hidden lg:flex lg:w-[420px] shrink-0 border-r border-border' : 'flex-1')}>
        {/* Header */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="page-title">Residents</h1>
              <p className="page-subtitle">{residents.filter(r => r.status === 'Active').length} active · {residents.length} total</p>
            </div>
            <Button size="sm" className="gap-1.5 text-xs" onClick={() => toast.info('Add resident coming soon.')}>
              <Plus className="w-3.5 h-3.5" /> Add Resident
            </Button>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Search residents..." className="pl-8 h-8 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Departed">Departed</SelectItem>
                <SelectItem value="Deceased">Deceased</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <Users className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">No residents found</p>
            </div>
          ) : (
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>Resident</th>
                  <th className="hidden sm:table-cell">Unit</th>
                  <th>Status</th>
                  <th className="hidden md:table-cell">Move-in</th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr
                    key={r.id}
                    className={cn('cursor-pointer', selected?.id === r.id && 'bg-accent/60')}
                    onClick={() => setSelected(r)}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <ResidentAvatar resident={r} />
                        <div>
                          <div className="font-medium text-sm">{r.title} {r.firstName} {r.lastName}</div>
                          <div className="text-xs text-muted-foreground">{r.preferredName !== r.firstName ? `"${r.preferredName}" · ` : ''}{r.residentId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">
                      {r.unitNo ? <span className="text-sm">Unit {r.unitNo}</span> : <span className="text-muted-foreground text-sm">—</span>}
                    </td>
                    <td><StatusBadge status={r.status} /></td>
                    <td className="hidden md:table-cell text-sm text-muted-foreground">{r.moveInDate ? formatDate(r.moveInDate) : '—'}</td>
                    <td><ChevronRight className="w-4 h-4 text-muted-foreground" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="flex-1 overflow-hidden">
          <ResidentDetail resident={selected} onClose={() => setSelected(null)} />
        </div>
      )}
    </div>
  );
}
