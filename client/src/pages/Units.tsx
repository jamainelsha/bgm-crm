// Barrina Gardens CRM — Units Page
import { useState, useMemo } from 'react';
import { Search, Home, ChevronRight, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { units, formatCurrency, formatDate, calcAge, type Unit, type UnitStatus } from '@/lib/data';

const C = { green: 'oklch(0.48 0.12 145)', amber: 'oklch(0.72 0.14 80)', brown: 'oklch(0.42 0.08 65)', red: 'oklch(0.577 0.245 27.325)' };

const STATUS_CONFIG: Record<UnitStatus, { label: string; color: string; bg: string }> = {
  'Occupied': { label: 'Occupied', color: C.green, bg: 'oklch(0.48 0.12 145 / 0.1)' },
  'Vacant': { label: 'Vacant', color: C.amber, bg: 'oklch(0.72 0.14 80 / 0.1)' },
  'Under Maintenance': { label: 'Maintenance', color: C.red, bg: 'oklch(0.577 0.245 27.325 / 0.1)' },
  'Reserved': { label: 'Reserved', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
};

export default function Units() {
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
  }, [search, statusFilter]);

  const stats = useMemo(() => ({
    occupied: units.filter(u => u.status === 'Occupied').length,
    vacant: units.filter(u => u.status === 'Vacant').length,
    maintenance: units.filter(u => u.status === 'Under Maintenance').length,
    reserved: units.filter(u => u.status === 'Reserved').length,
  }), []);

  return (
    <div className="flex h-full overflow-hidden">
      <div className={`flex flex-col border-r border-border bg-card ${selected ? 'hidden lg:flex lg:w-80 xl:w-96' : 'w-full'}`}>
        <div className="p-4 border-b border-border space-y-3">
          <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Units</h1>
          <div className="grid grid-cols-4 gap-2">
            {[
              { key: 'occupied', label: 'Occupied', val: stats.occupied, color: C.green, bg: 'oklch(0.48 0.12 145 / 0.1)' },
              { key: 'vacant', label: 'Vacant', val: stats.vacant, color: C.amber, bg: 'oklch(0.72 0.14 80 / 0.1)' },
              { key: 'maintenance', label: 'Maint.', val: stats.maintenance, color: C.red, bg: 'oklch(0.577 0.245 27.325 / 0.1)' },
              { key: 'reserved', label: 'Reserved', val: stats.reserved, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
            ].map(s => (
              <div key={s.key} className="text-center p-2 rounded-lg" style={{ background: s.bg }}>
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
                  {u.marketValue > 0 && <span className="text-[10px] text-muted-foreground">{formatCurrency(u.marketValue)}</span>}
                </div>
                <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
              </div>
            );
          })}
          {filtered.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">No units found</div>}
        </div>
      </div>

      {selected ? (
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelected(null)} className="lg:hidden p-1 rounded hover:bg-muted mr-1"><X size={16} /></button>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: STATUS_CONFIG[selected.status].bg, color: STATUS_CONFIG[selected.status].color }}>
                {selected.unitNo}
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Unit {selected.unitNo} — {selected.unitType}</h2>
                <p className="text-xs text-muted-foreground">{selected.address}, {selected.suburb} VIC {selected.postcode}</p>
              </div>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: STATUS_CONFIG[selected.status].bg, color: STATUS_CONFIG[selected.status].color }}>
              {STATUS_CONFIG[selected.status].label}
            </span>
          </div>
          <div className="p-6">
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Unit Details</TabsTrigger>
                <TabsTrigger value="resident">Resident</TabsTrigger>
                <TabsTrigger value="contract">Contract & DMF</TabsTrigger>
                <TabsTrigger value="sim">SIM / Care Alert</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Property Details</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-xs text-muted-foreground">Unit No.</p><p className="text-2xl font-bold" style={{ color: C.green }}>Unit {selected.unitNo}</p></div>
                    <div><p className="text-xs text-muted-foreground">Unit Type</p><p className="font-medium">{selected.unitType}</p></div>
                    <div><p className="text-xs text-muted-foreground">Style</p><p className="font-medium">{selected.unitStyle || '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Land Size</p><p className="font-medium">{selected.landSqm ? `${selected.landSqm} m²` : '—'}</p></div>
                    <div className="col-span-2"><p className="text-xs text-muted-foreground">Address</p><p className="font-medium">{selected.address}, {selected.suburb} VIC {selected.postcode}</p></div>
                    <div><p className="text-xs text-muted-foreground">Ownership</p><p className="font-medium">{selected.ownership || '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Owner Name</p><p className="font-medium">{selected.ownerName || '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Market Value</p><p className="font-medium text-lg" style={{ color: C.green }}>{selected.marketValue ? formatCurrency(selected.marketValue) : '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Status</p><span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: STATUS_CONFIG[selected.status].bg, color: STATUS_CONFIG[selected.status].color }}>{STATUS_CONFIG[selected.status].label}</span></div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="resident" className="space-y-4">
                {selected.resident ? (
                  <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm">Current Resident</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3 text-sm">
                      <div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{selected.resident.title} {selected.resident.firstName} {selected.resident.lastName}</p></div>
                      <div><p className="text-xs text-muted-foreground">Age</p><p className="font-medium">{calcAge(selected.resident.dob) > 0 ? `${calcAge(selected.resident.dob)} years` : '—'}</p></div>
                      <div><p className="text-xs text-muted-foreground">Mobile</p><p className="font-medium">{selected.resident.mobile || '—'}</p></div>
                      <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium truncate">{selected.resident.email || '—'}</p></div>
                      <div><p className="text-xs text-muted-foreground">Doctor</p><p className="font-medium">{selected.resident.drName || '—'}</p></div>
                      <div><p className="text-xs text-muted-foreground">Medical Conditions</p><p className="font-medium">{selected.resident.medicalConditions || 'None'}</p></div>
                      <div><p className="text-xs text-muted-foreground">Allergies</p><p className="font-medium">{selected.resident.allergies || 'None'}</p></div>
                      <div><p className="text-xs text-muted-foreground">Pet</p><p className="font-medium">{selected.resident.hasPet ? `Yes — ${selected.resident.petType}` : 'No'}</p></div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Home size={40} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No resident currently in this unit</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="contract" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Contract & DMF Details</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-xs text-muted-foreground">Contract Type</p><p className="font-medium">{selected.contractType || '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Settlement Date</p><p className="font-medium">{selected.settlementDate ? formatDate(selected.settlementDate) : '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Settlement Price</p><p className="font-medium text-lg">{selected.settlementPrice ? formatCurrency(selected.settlementPrice) : '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Market Value</p><p className="font-medium text-lg">{selected.marketValue ? formatCurrency(selected.marketValue) : '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Years Owned</p><p className="font-medium">{selected.yearsOwned ? `${selected.yearsOwned.toFixed(1)} years` : '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">DMF Rate</p><p className="font-medium">{selected.dmfRate ? `${selected.dmfRate}% per year` : '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Annual DMF</p><p className="font-medium">{selected.annualDmf ? formatCurrency(selected.annualDmf) : '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Total DMF Accrued</p><p className="font-bold text-lg" style={{ color: C.green }}>{selected.totalDeferred ? formatCurrency(selected.totalDeferred) : '—'}</p></div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="sim" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Care Alert & SIM Details</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-xs text-muted-foreground">Care Alert Phone</p><p className="font-medium font-mono">{selected.careAlertPhone || '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">SIM Mobile</p><p className="font-medium font-mono">{selected.simMobile || '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Vodafone SIM</p><p className="font-medium font-mono">{selected.simVodafone || '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Telstra SIM</p><p className="font-medium font-mono">{selected.simTelstra || '—'}</p></div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
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
