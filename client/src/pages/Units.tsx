// Barrina Gardens CRM — Units Page (Enhanced with photo upload & CRMStore)
import { useState, useMemo, useRef } from 'react';
import { Search, Home, ChevronRight, X, Camera, Upload, Trash2, Edit2, Check, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { formatCurrency, formatDate, calcAge, type Unit, type UnitStatus, BGM_BRAND } from '@/lib/data';
import { useCRM } from '@/contexts/CRMStore';
import { useAuth } from '@/contexts/AuthContext';

const C = BGM_BRAND;

const STATUS_CONFIG: Record<UnitStatus, { label: string; color: string; bg: string }> = {
  'Occupied': { label: 'Occupied', color: C.green, bg: '#dcfce7' },
  'Vacant': { label: 'Vacant', color: '#854d0e', bg: '#fef9c3' },
  'Under Maintenance': { label: 'Maintenance', color: '#991b1b', bg: '#fee2e2' },
  'Reserved': { label: 'Reserved', color: '#1e40af', bg: '#dbeafe' },
};

// ── Photo Gallery ─────────────────────────────────────────────────────────────
function UnitPhotoGallery({ unit, onUpdate, canEdit }: { unit: Unit; onUpdate: (u: Unit) => void; canEdit: boolean }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const readers = files.map(file => new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (ev) => resolve(ev.target?.result as string);
      reader.readAsDataURL(file);
    }));
    Promise.all(readers).then(dataUrls => {
      const existing = unit.unitPhotos || [];
      onUpdate({ ...unit, unitPhotos: [...existing, ...dataUrls] });
      toast.success(`${files.length} photo${files.length > 1 ? 's' : ''} uploaded`);
    });
    e.target.value = '';
  };

  const handleDelete = (idx: number) => {
    const photos = [...(unit.unitPhotos || [])];
    photos.splice(idx, 1);
    onUpdate({ ...unit, unitPhotos: photos });
    toast.success('Photo removed');
  };

  const photos = unit.unitPhotos || [];

  return (
    <div>
      {canEdit && (
        <div className="mb-3">
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
          <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
            <Camera size={14} className="mr-1" /> Upload Unit Photos
          </Button>
          <p className="text-xs text-gray-400 mt-1">Upload interior/exterior photos of this unit. Multiple files accepted.</p>
        </div>
      )}
      {photos.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
          <Camera size={32} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm text-gray-400">No photos uploaded yet</p>
          {canEdit && <p className="text-xs text-gray-300 mt-1">Click "Upload Unit Photos" to add images</p>}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((src, i) => (
            <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-100">
              <img src={src} alt={`Unit ${unit.unitNo} photo ${i + 1}`} className="w-full h-full object-cover cursor-pointer" onClick={() => setLightbox(src)} />
              {canEdit && (
                <button
                  onClick={() => handleDelete(i)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                  title="Remove photo"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {lightbox && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Unit photo" className="max-w-full max-h-full rounded-lg shadow-2xl" onClick={e => e.stopPropagation()} />
          <button className="absolute top-4 right-4 text-white hover:text-gray-300" onClick={() => setLightbox(null)}><X size={24} /></button>
        </div>
      )}
    </div>
  );
}

// ── Editable Field ────────────────────────────────────────────────────────────
function EditField({ label, value, onSave, canEdit }: { label: string; value?: string | number; onSave: (v: string) => void; canEdit: boolean }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? ''));
  const handleSave = () => { onSave(draft); setEditing(false); toast.success(`${label} updated`); };
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      {editing ? (
        <div className="flex items-center gap-1 mt-0.5">
          <Input value={draft} onChange={e => setDraft(e.target.value)} className="h-7 text-sm flex-1" autoFocus />
          <button onClick={handleSave} className="text-green-600 hover:text-green-700"><Check size={14} /></button>
          <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
        </div>
      ) : (
        <div className="flex items-center gap-1 group">
          <p className="font-medium text-sm">{value || <span className="text-gray-400 italic text-xs">Not set</span>}</p>
          {canEdit && <button onClick={() => { setDraft(String(value ?? '')); setEditing(true); }} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600"><Edit2 size={11} /></button>}
        </div>
      )}
    </div>
  );
}

// ── Unit Detail Panel ─────────────────────────────────────────────────────────
function UnitDetailPanel({ unit, onClose, onUpdate }: { unit: Unit; onClose: () => void; onUpdate: (u: Unit) => void }) {
  const { isSuperAdmin } = useAuth();
  const canEdit = isSuperAdmin;
  const cfg = STATUS_CONFIG[unit.status];

  const handleStatusChange = (status: string) => {
    onUpdate({ ...unit, status: status as UnitStatus });
    toast.success(`Unit ${unit.unitNo} status updated to ${status}`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-muted mr-1"><X size={16} /></button>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: cfg.bg, color: cfg.color }}>
            {unit.unitNo}
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Unit {unit.unitNo} — {unit.unitType}</h2>
            <p className="text-xs text-muted-foreground">{unit.address}, {unit.suburb} VIC {unit.postcode}</p>
          </div>
        </div>
        {canEdit ? (
          <Select value={unit.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-7 text-xs w-36" style={{ background: cfg.bg, color: cfg.color, border: 'none' }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
        )}
      </div>

      <div className="p-6">
        <Tabs defaultValue="details">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Unit Details</TabsTrigger>
            <TabsTrigger value="resident">Resident</TabsTrigger>
            <TabsTrigger value="contract">Contract & DMF</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="sim">SIM / Care Alert</TabsTrigger>
          </TabsList>

          {/* Unit Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Property Details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Unit No.</p><p className="text-2xl font-bold" style={{ color: C.green }}>Unit {unit.unitNo}</p></div>
                <EditField label="Unit Type" value={unit.unitType} onSave={v => onUpdate({ ...unit, unitType: v })} canEdit={canEdit} />
                <EditField label="Style" value={unit.unitStyle} onSave={v => onUpdate({ ...unit, unitStyle: v })} canEdit={canEdit} />
                <EditField label="Land Size (m²)" value={unit.landSqm} onSave={v => onUpdate({ ...unit, landSqm: parseFloat(v) || 0 })} canEdit={canEdit} />
                <div className="col-span-2">
                  <EditField label="Address" value={unit.address} onSave={v => onUpdate({ ...unit, address: v })} canEdit={canEdit} />
                </div>
                <EditField label="Suburb" value={unit.suburb} onSave={v => onUpdate({ ...unit, suburb: v })} canEdit={canEdit} />
                <EditField label="Postcode" value={unit.postcode} onSave={v => onUpdate({ ...unit, postcode: v })} canEdit={canEdit} />
                <EditField label="Ownership" value={unit.ownership} onSave={v => onUpdate({ ...unit, ownership: v })} canEdit={canEdit} />
                <EditField label="Owner Name" value={unit.ownerName} onSave={v => onUpdate({ ...unit, ownerName: v })} canEdit={canEdit} />
                <EditField label="Market Value ($)" value={unit.marketValue} onSave={v => onUpdate({ ...unit, marketValue: parseFloat(v.replace(/[^0-9.]/g, '')) || 0 })} canEdit={canEdit} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resident Tab */}
          <TabsContent value="resident" className="space-y-4">
            {unit.resident ? (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Current Resident</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{unit.resident.title} {unit.resident.firstName} {unit.resident.lastName}</p></div>
                  <div><p className="text-xs text-muted-foreground">Age</p><p className="font-medium">{calcAge(unit.resident.dob) > 0 ? `${calcAge(unit.resident.dob)} years` : '—'}</p></div>
                  <div><p className="text-xs text-muted-foreground">Mobile</p><p className="font-medium">{unit.resident.mobile || '—'}</p></div>
                  <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium truncate">{unit.resident.email || '—'}</p></div>
                  <div><p className="text-xs text-muted-foreground">Doctor</p><p className="font-medium">{unit.resident.drName || '—'}</p></div>
                  <div><p className="text-xs text-muted-foreground">Medical Conditions</p><p className="font-medium">{unit.resident.medicalConditions || 'None recorded'}</p></div>
                  <div><p className="text-xs text-muted-foreground">Allergies</p><p className="font-medium">{unit.resident.allergies || 'None recorded'}</p></div>
                  <div><p className="text-xs text-muted-foreground">Pet</p><p className="font-medium">{unit.resident.hasPet ? `Yes — ${unit.resident.petType || 'Unknown type'}` : 'No'}</p></div>
                  {unit.resident2 && (
                    <>
                      <div className="col-span-2 border-t pt-3"><p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Second Resident</p></div>
                      <div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{unit.resident2.title} {unit.resident2.firstName} {unit.resident2.lastName}</p></div>
                      <div><p className="text-xs text-muted-foreground">Mobile</p><p className="font-medium">{unit.resident2.mobile || '—'}</p></div>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Home size={40} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm">No resident currently in this unit</p>
              </div>
            )}
          </TabsContent>

          {/* Contract & DMF Tab */}
          <TabsContent value="contract" className="space-y-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Contract & DMF Details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Contract Type</p><p className="font-medium">{unit.contractType || '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Settlement Date</p><p className="font-medium">{unit.settlementDate ? formatDate(unit.settlementDate) : '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Settlement Price</p><p className="font-medium text-lg">{unit.settlementPrice ? formatCurrency(unit.settlementPrice) : '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Market Value</p><p className="font-medium text-lg">{unit.marketValue ? formatCurrency(unit.marketValue) : '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Years Owned</p><p className="font-medium">{unit.yearsOwned ? `${unit.yearsOwned.toFixed(1)} years` : '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">DMF Rate</p><p className="font-medium">{unit.dmfRate ? `${(unit.dmfRate * 100).toFixed(0)}%` : '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Annual DMF</p><p className="font-medium">{unit.annualDmf ? formatCurrency(unit.annualDmf) : '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Total DMF Accrued</p><p className="font-bold text-lg" style={{ color: C.green }}>{unit.totalDeferred ? formatCurrency(unit.totalDeferred) : '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Accumulating?</p><p className="font-medium">{unit.isAccumulating !== undefined ? (unit.isAccumulating ? 'Yes' : 'No') : '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">DMF Cap</p><p className="font-medium">{unit.dmfCap ? `${(unit.dmfCap * 100).toFixed(0)}%` : '30%'}</p></div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Unit Interior & Exterior Photos</CardTitle></CardHeader>
              <CardContent>
                <UnitPhotoGallery unit={unit} onUpdate={onUpdate} canEdit={canEdit} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* SIM / Care Alert Tab */}
          <TabsContent value="sim" className="space-y-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Care Alert & SIM Details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <EditField label="Care Alert Phone" value={unit.careAlertPhone} onSave={v => onUpdate({ ...unit, careAlertPhone: v })} canEdit={canEdit} />
                <EditField label="SIM Mobile" value={unit.simMobile} onSave={v => onUpdate({ ...unit, simMobile: v })} canEdit={canEdit} />
                <EditField label="Vodafone SIM" value={unit.simVodafone} onSave={v => onUpdate({ ...unit, simVodafone: v })} canEdit={canEdit} />
                <EditField label="Telstra SIM" value={unit.simTelstra} onSave={v => onUpdate({ ...unit, simTelstra: v })} canEdit={canEdit} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ── Main Units Page ───────────────────────────────────────────────────────────
export default function Units() {
  const { units, updateUnit } = useCRM();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Unit | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return units.filter(u => {
      const matchSearch = !q || u.unitNo.toLowerCase().includes(q) ||
        u.address.toLowerCase().includes(q) ||
        (u.resident && `${u.resident.firstName} ${u.resident.lastName}`.toLowerCase().includes(q)) ||
        (u.ownerName && u.ownerName.toLowerCase().includes(q));
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [units, search, statusFilter]);

  const stats = useMemo(() => ({
    occupied: units.filter(u => u.status === 'Occupied').length,
    vacant: units.filter(u => u.status === 'Vacant').length,
    maintenance: units.filter(u => u.status === 'Under Maintenance').length,
    reserved: units.filter(u => u.status === 'Reserved').length,
  }), [units]);

  const handleUpdate = (updated: Unit) => {
    updateUnit(updated.unitNo, updated);
    if (selected?.unitNo === updated.unitNo) setSelected(updated);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar List */}
      <div className={`flex flex-col border-r border-border bg-card ${selected ? 'hidden lg:flex lg:w-80 xl:w-96' : 'w-full'}`}>
        <div className="p-4 border-b border-border space-y-3">
          <h1 className="text-lg font-bold text-foreground">Units</h1>
          <div className="grid grid-cols-4 gap-2">
            {[
              { key: 'occupied', label: 'Occupied', val: stats.occupied, color: C.green, bg: '#dcfce7' },
              { key: 'vacant', label: 'Vacant', val: stats.vacant, color: '#854d0e', bg: '#fef9c3' },
              { key: 'maintenance', label: 'Maint.', val: stats.maintenance, color: '#991b1b', bg: '#fee2e2' },
              { key: 'reserved', label: 'Reserved', val: stats.reserved, color: '#1e40af', bg: '#dbeafe' },
            ].map(s => (
              <div key={s.key} className="text-center p-2 rounded-lg cursor-pointer" style={{ background: s.bg }}
                onClick={() => setStatusFilter(statusFilter === s.key ? 'all' : s.key)}>
                <p className="text-lg font-bold" style={{ color: s.color }}>{s.val}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search unit, resident, address..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Units ({units.length})</SelectItem>
              <SelectItem value="Occupied">Occupied ({stats.occupied})</SelectItem>
              <SelectItem value="Vacant">Vacant ({stats.vacant})</SelectItem>
              <SelectItem value="Under Maintenance">Under Maintenance ({stats.maintenance})</SelectItem>
              <SelectItem value="Reserved">Reserved ({stats.reserved})</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{filtered.length} of {units.length} units</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(u => {
            const cfg = STATUS_CONFIG[u.status];
            const photoCount = (u.unitPhotos || []).length;
            return (
              <div key={u.unitNo} onClick={() => setSelected(u)}
                className={`flex items-center gap-3 px-4 py-3 border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${selected?.unitNo === u.unitNo ? 'bg-muted' : ''}`}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: cfg.bg, color: cfg.color }}>
                  {u.unitNo}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">Unit {u.unitNo} — {u.unitType}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {u.resident ? `${u.resident.firstName} ${u.resident.lastName}` : u.ownerName || 'Vacant'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                  {photoCount > 0 && <span className="text-[10px] text-blue-500">{photoCount} photo{photoCount > 1 ? 's' : ''}</span>}
                </div>
                <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
              </div>
            );
          })}
          {filtered.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">No units found</div>}
        </div>
      </div>

      {/* Detail Panel */}
      {selected ? (
        <UnitDetailPanel unit={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} />
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center text-muted-foreground bg-muted/20">
          <div className="text-center">
            <Home size={48} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">Select a unit to view details</p>
          </div>
        </div>
      )}
    </div>
  );
}
