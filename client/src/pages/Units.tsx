// BGM CRM — Units Page
// Unit inventory with status, occupancy, and detail view

import { useState } from 'react';
import { Search, Plus, Home, DollarSign, Maximize2, ChevronRight, Wrench, Users, FileText, StickyNote } from 'lucide-react';
import { units, residents, contracts, formatCurrency, formatDate, type Unit, type UnitStatus } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function StatusBadge({ status }: { status: UnitStatus }) {
  const map: Record<UnitStatus, string> = {
    'Occupied': 'badge-occupied',
    'Vacant': 'badge-vacant',
    'Under Maintenance': 'badge-overdue',
    'Reserved': 'badge-pending',
  };
  return <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', map[status])}>{status}</span>;
}

function UnitDetail({ unit, onClose }: { unit: Unit; onClose: () => void }) {
  const unitResidents = residents.filter(r => unit.residentIds.includes(r.id));
  const contract = unit.contractId ? contracts.find(c => c.id === unit.contractId) : undefined;

  return (
    <div className="flex flex-col h-full">
      {/* Header with photo */}
      <div className="relative h-40 shrink-0">
        <img src={unit.photos[0] || 'https://d2xsxph8kpxj0f.cloudfront.net/310519663364956560/3kCyjBhX6Z8kZVCZhWirGM/bgm-unit-placeholder_1f396481.jpg'}
          alt={`Unit ${unit.unitNo}`} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60">×</button>
        <div className="absolute bottom-3 left-4">
          <h2 className="text-white text-xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>Unit {unit.unitNo}</h2>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={unit.status} />
            <span className="text-white/80 text-xs">{unit.unitType} · {unit.unitStyle}</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-5 mt-3 w-auto justify-start h-8 bg-muted/50 p-0.5">
          <TabsTrigger value="details" className="text-xs h-7">Details</TabsTrigger>
          <TabsTrigger value="residents" className="text-xs h-7">Residents</TabsTrigger>
          <TabsTrigger value="contract" className="text-xs h-7">Contract</TabsTrigger>
          <TabsTrigger value="notes" className="text-xs h-7">Notes</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="details" className="p-5 space-y-4 mt-0">
            <div className="grid grid-cols-2 gap-3">
              <div className="stat-card py-3">
                <span className="stat-card-label">Market Value</span>
                <div className="text-lg font-bold mt-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>{formatCurrency(unit.marketValue)}</div>
              </div>
              <div className="stat-card py-3">
                <span className="stat-card-label">Size</span>
                <div className="text-lg font-bold mt-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>{unit.sqm} m²</div>
              </div>
              {unit.landSize && (
                <div className="stat-card py-3">
                  <span className="stat-card-label">Land Size</span>
                  <div className="text-lg font-bold mt-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>{unit.landSize} m²</div>
                </div>
              )}
            </div>

            {unit.features.length > 0 && (
              <div className="form-section">
                <div className="form-section-title">Features</div>
                <div className="flex flex-wrap gap-1.5">
                  {unit.features.map(f => (
                    <span key={f} className="badge-pending inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium">{f}</span>
                  ))}
                </div>
              </div>
            )}

            {unit.lastMaintenanceDate && (
              <div className="form-section">
                <div className="form-section-title">Maintenance</div>
                <div className="text-sm"><span className="text-muted-foreground">Last maintenance:</span> <span className="font-medium">{formatDate(unit.lastMaintenanceDate)}</span></div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="residents" className="p-5 mt-0">
            {unitResidents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No current residents</p>
              </div>
            ) : (
              <div className="space-y-3">
                {unitResidents.map(r => (
                  <div key={r.id} className="flex items-center gap-3 p-3 bg-muted/40 rounded-md">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ background: 'oklch(0.52 0.09 168)' }}>
                      {r.firstName[0]}{r.lastName[0]}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{r.title} {r.firstName} {r.lastName}</div>
                      <div className="text-xs text-muted-foreground">Age {r.age} · {r.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="contract" className="p-5 mt-0">
            {!contract ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No active contract</p>
                <Button size="sm" variant="outline" className="mt-3 text-xs" onClick={() => toast.info('Create contract coming soon.')}>
                  Create Contract
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="form-section">
                  <div className="form-section-title">Contract Details</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Contract No.</span><div className="font-medium mt-0.5 font-mono text-xs">{contract.contractNo}</div></div>
                    <div><span className="text-muted-foreground">Status</span><div className="mt-0.5"><span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', contract.status === 'Active' ? 'badge-occupied' : 'badge-terminated')}>{contract.status}</span></div></div>
                    <div><span className="text-muted-foreground">Settlement</span><div className="font-medium mt-0.5">{formatCurrency(contract.settlementAmount)}</div></div>
                    <div><span className="text-muted-foreground">Start Date</span><div className="font-medium mt-0.5">{formatDate(contract.startDate)}</div></div>
                    <div><span className="text-muted-foreground">Years Owned</span><div className="font-medium mt-0.5">{contract.years} yrs</div></div>
                    <div><span className="text-muted-foreground">DMF Rate</span><div className="font-medium mt-0.5">{contract.dmfPercent}%</div></div>
                    <div><span className="text-muted-foreground">Deferred</span><div className="font-medium mt-0.5">{formatCurrency(contract.deferred)}</div></div>
                    <div><span className="text-muted-foreground">Capped Years</span><div className="font-medium mt-0.5">{contract.cappedYears} yrs</div></div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notes" className="p-5 mt-0">
            <div className="flex items-center justify-between mb-4">
              <span className="section-label">Unit Notes</span>
              <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => toast.info('Add note coming soon.')}>
                <Plus className="w-3 h-3 mr-1" /> Add Note
              </Button>
            </div>
            {unit.notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notes recorded.</p>
            ) : (
              <div className="space-y-3">
                {unit.notes.map(note => (
                  <div key={note.id} className="p-3 bg-muted/40 rounded-md">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold">{note.user}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(note.date)}</span>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>

      <div className="p-4 border-t border-border flex gap-2">
        <Button size="sm" className="flex-1 text-xs" onClick={() => toast.info('Edit unit coming soon.')}>Edit Unit</Button>
        <Button size="sm" variant="outline" className="text-xs" onClick={() => toast.info('Log maintenance coming soon.')}>
          <Wrench className="w-3 h-3 mr-1" /> Maintenance
        </Button>
      </div>
    </div>
  );
}

export default function UnitsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Unit | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filtered = units.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !q || `unit ${u.unitNo} ${u.unitType} ${u.unitStyle}`.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    const matchType = typeFilter === 'all' || u.unitType === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const statusCounts = {
    Occupied: units.filter(u => u.status === 'Occupied').length,
    Vacant: units.filter(u => u.status === 'Vacant').length,
    'Under Maintenance': units.filter(u => u.status === 'Under Maintenance').length,
    Reserved: units.filter(u => u.status === 'Reserved').length,
  };

  return (
    <div className="flex h-full">
      <div className={cn('flex flex-col', selected ? 'hidden lg:flex lg:w-[480px] shrink-0 border-r border-border' : 'flex-1')}>
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="page-title">Units</h1>
              <p className="page-subtitle">{units.length} total units</p>
            </div>
            <Button size="sm" className="gap-1.5 text-xs" onClick={() => toast.info('Add unit coming soon.')}>
              <Plus className="w-3.5 h-3.5" /> Add Unit
            </Button>
          </div>

          {/* Status summary pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(statusCounts).map(([status, count]) => (
              <button
                key={status}
                onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
                className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                  statusFilter === status ? 'bg-foreground text-background border-foreground' : 'bg-card border-border hover:border-foreground/30'
                )}>
                <span>{status}</span>
                <span className="font-bold">{count}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input placeholder="Search units..." className="pl-8 h-8 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Villa">Villa</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Studio">Studio</SelectItem>
                <SelectItem value="Cottage">Cottage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full data-table">
            <thead>
              <tr>
                <th>Unit</th>
                <th>Type</th>
                <th>Status</th>
                <th className="hidden md:table-cell">Market Value</th>
                <th className="hidden lg:table-cell">Size</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const unitResidents = residents.filter(r => u.residentIds.includes(r.id));
                return (
                  <tr key={u.id} className={cn('cursor-pointer', selected?.id === u.id && 'bg-accent/60')} onClick={() => setSelected(u)}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md overflow-hidden shrink-0">
                          <img src={u.photos[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Unit {u.unitNo}</div>
                          {unitResidents.length > 0 && (
                            <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                              {unitResidents.map(r => r.preferredName).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{u.unitType} · {u.unitStyle}</td>
                    <td><StatusBadge status={u.status} /></td>
                    <td className="hidden md:table-cell text-sm">{formatCurrency(u.marketValue)}</td>
                    <td className="hidden lg:table-cell text-sm text-muted-foreground">{u.sqm} m²</td>
                    <td><ChevronRight className="w-4 h-4 text-muted-foreground" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="flex-1 overflow-hidden">
          <UnitDetail unit={selected} onClose={() => setSelected(null)} />
        </div>
      )}
    </div>
  );
}
