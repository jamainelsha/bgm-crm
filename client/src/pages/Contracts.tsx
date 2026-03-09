// Barrina Gardens CRM — Contracts & DMF Page
import { useState, useMemo } from 'react';
import { Search, FileText, ChevronRight, X, DollarSign, Calculator, TrendingUp, Edit2, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatCurrency, formatDate, type Unit, BGM_BRAND } from '@/lib/data';
import { useCRM } from '@/contexts/CRMStore';
import { useAuth } from '@/contexts/AuthContext';

const C = BGM_BRAND;

const CONTRACT_COLORS: Record<string, { color: string; bg: string }> = {
  'New':        { color: '#166534', bg: '#dcfce7' },
  'D':          { color: '#1e40af', bg: '#dbeafe' },
  'C':          { color: '#6b21a8', bg: '#f3e8ff' },
  'Loan Lease': { color: '#854d0e', bg: '#fef9c3' },
  'A':          { color: '#9a3412', bg: '#ffedd5' },
  'B':          { color: '#0f766e', bg: '#ccfbf1' },
  'Strata':     { color: '#374151', bg: '#f3f4f6' },
  'N/A':        { color: '#6b7280', bg: '#f9fafb' },
};

function getContractColor(type?: string) {
  return CONTRACT_COLORS[type || ''] || { color: '#6b7280', bg: '#f9fafb' };
}

// ── DMF Calculator ────────────────────────────────────────────────────────────
function DMFCalculator() {
  const [form, setForm] = useState({
    settlementPrice: '',
    marketValue: '',
    settlementDate: '',
    contractType: 'New',
    isAccumulating: 'Yes',
  });
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const result = useMemo(() => {
    const sp = parseFloat(form.settlementPrice.replace(/[^0-9.]/g, '')) || 0;
    const mv = parseFloat(form.marketValue.replace(/[^0-9.]/g, '')) || 0;
    if (!sp || !form.settlementDate) return null;

    const settled = new Date(form.settlementDate);
    const now = new Date();
    const yearsOwned = Math.max(0, (now.getTime() - settled.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    const dmfRatePerYear = 0.03; // 3% per annum
    const dmfCap = 0.30; // 30% cap

    let dmfPct: number;
    if (form.isAccumulating === 'Yes') {
      dmfPct = Math.min(yearsOwned * dmfRatePerYear, dmfCap);
    } else {
      dmfPct = Math.min(Math.floor(yearsOwned) * dmfRatePerYear, dmfCap);
    }

    const dmfAmount = sp * dmfPct;
    const annualDmf = sp * dmfRatePerYear;
    const yearsToMax = dmfCap / dmfRatePerYear;
    const maxDmf = sp * dmfCap;
    const netToResident = mv - dmfAmount;

    return { yearsOwned, dmfPct, dmfAmount, annualDmf, yearsToMax, maxDmf, netToResident, sp, mv };
  }, [form]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Settlement Price ($)</Label>
          <Input className="h-8 text-sm mt-1" placeholder="e.g. 350000" value={form.settlementPrice} onChange={e => set('settlementPrice', e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">Current Market Value ($)</Label>
          <Input className="h-8 text-sm mt-1" placeholder="e.g. 450000" value={form.marketValue} onChange={e => set('marketValue', e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">Settlement Date</Label>
          <Input type="date" className="h-8 text-sm mt-1" value={form.settlementDate} onChange={e => set('settlementDate', e.target.value)} />
        </div>
        <div>
          <Label className="text-xs">Accumulating DMF?</Label>
          <Select value={form.isAccumulating} onValueChange={v => set('isAccumulating', v)}>
            <SelectTrigger className="h-8 text-sm mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes (daily accumulation)</SelectItem>
              <SelectItem value="No">No (whole years only)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {result && (
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="text-xs text-green-700">DMF Accrued</p>
              <p className="text-xl font-bold text-green-800">{formatCurrency(result.dmfAmount)}</p>
              <p className="text-xs text-green-600">{(result.dmfPct * 100).toFixed(2)}% of settlement price</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-xs text-blue-700">Net to Resident</p>
              <p className="text-xl font-bold text-blue-800">{formatCurrency(result.netToResident)}</p>
              <p className="text-xs text-blue-600">Market value minus DMF</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-700">Annual DMF</p>
              <p className="text-lg font-bold text-amber-800">{formatCurrency(result.annualDmf)}</p>
              <p className="text-xs text-amber-600">3% p.a. of settlement price</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
              <p className="text-xs text-purple-700">Years Owned</p>
              <p className="text-lg font-bold text-purple-800">{result.yearsOwned.toFixed(2)} years</p>
              <p className="text-xs text-purple-600">Max cap at {result.yearsToMax} years</p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs text-gray-600">DMF Progress to Cap (30%)</p>
              <p className="text-xs font-medium text-gray-700">{(result.dmfPct * 100).toFixed(1)}% / 30%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="h-2 rounded-full transition-all" style={{ width: `${Math.min((result.dmfPct / 0.30) * 100, 100)}%`, background: C.green }} />
            </div>
            <p className="text-xs text-gray-500 mt-1">Maximum DMF: {formatCurrency(result.maxDmf)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Editable Field ────────────────────────────────────────────────────────────
function EditField({ label, value, onSave, canEdit, type = 'text' }: {
  label: string; value?: string | number; onSave: (v: string) => void; canEdit: boolean; type?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? ''));
  const handleSave = () => { onSave(draft); setEditing(false); toast.success(`${label} updated`); };
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      {editing ? (
        <div className="flex items-center gap-1 mt-0.5">
          <Input type={type} value={draft} onChange={e => setDraft(e.target.value)} className="h-7 text-sm flex-1" autoFocus />
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

// ── Contract Detail Panel ─────────────────────────────────────────────────────
function ContractDetailPanel({ unit, onClose, onUpdate }: { unit: Unit; onClose: () => void; onUpdate: (u: Unit) => void }) {
  const { isSuperAdmin } = useAuth();
  const canEdit = isSuperAdmin;
  const cfg = getContractColor(unit.contractType);

  // Live DMF calculation
  const dmfCalc = useMemo(() => {
    if (!unit.settlementPrice || !unit.settlementDate) return null;
    const settled = new Date(unit.settlementDate);
    const now = new Date();
    const yearsOwned = Math.max(0, (now.getTime() - settled.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    const dmfPct = Math.min(yearsOwned * 0.03, 0.30);
    const dmfAmount = unit.settlementPrice * dmfPct;
    const annualDmf = unit.settlementPrice * 0.03;
    return { yearsOwned, dmfPct, dmfAmount, annualDmf };
  }, [unit.settlementPrice, unit.settlementDate]);

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="lg:hidden p-1 rounded hover:bg-muted mr-1"><X size={16} /></button>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: cfg.bg }}>
            <FileText size={18} style={{ color: cfg.color }} />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Unit {unit.unitNo} — Contract & DMF</h2>
            <p className="text-xs text-muted-foreground">{unit.resident ? `${unit.resident.firstName} ${unit.resident.lastName}` : unit.ownerName || '—'}</p>
          </div>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>{unit.contractType}</span>
      </div>

      <div className="p-6">
        <Tabs defaultValue="contract">
          <TabsList className="mb-4">
            <TabsTrigger value="contract">Contract Details</TabsTrigger>
            <TabsTrigger value="dmf">DMF Analysis</TabsTrigger>
            <TabsTrigger value="legal">Legal & POA</TabsTrigger>
          </TabsList>

          {/* Contract Details Tab */}
          <TabsContent value="contract" className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Settlement Price', value: formatCurrency(unit.settlementPrice), color: C.brown },
                { label: 'Market Value', value: formatCurrency(unit.marketValue), color: '#1e40af' },
                { label: 'DMF Accrued', value: formatCurrency(unit.totalDeferred || (dmfCalc?.dmfAmount ?? 0)), color: C.green },
              ].map(s => (
                <Card key={s.label}>
                  <CardContent className="pt-4 pb-3">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-lg font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Contract Information</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <EditField label="Contract Type" value={unit.contractType} onSave={v => onUpdate({ ...unit, contractType: v })} canEdit={canEdit} />
                <EditField label="Settlement Date" value={unit.settlementDate} onSave={v => onUpdate({ ...unit, settlementDate: v })} canEdit={canEdit} type="date" />
                <EditField label="Settlement Price ($)" value={unit.settlementPrice} onSave={v => onUpdate({ ...unit, settlementPrice: parseFloat(v.replace(/[^0-9.]/g, '')) || 0 })} canEdit={canEdit} />
                <EditField label="Market Value ($)" value={unit.marketValue} onSave={v => onUpdate({ ...unit, marketValue: parseFloat(v.replace(/[^0-9.]/g, '')) || 0 })} canEdit={canEdit} />
                <div>
                  <p className="text-xs text-muted-foreground">Years Owned</p>
                  <p className="font-medium">{dmfCalc ? `${dmfCalc.yearsOwned.toFixed(2)} years` : (unit.yearsOwned ? `${unit.yearsOwned.toFixed(1)} years` : '—')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Accumulating DMF</p>
                  <p className="font-medium">{unit.isAccumulating !== undefined ? (unit.isAccumulating ? 'Yes' : 'No') : '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Annual DMF</p>
                  <p className="font-medium">{dmfCalc ? formatCurrency(dmfCalc.annualDmf) : (unit.annualDmf ? formatCurrency(unit.annualDmf) : '—')}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total DMF Accrued</p>
                  <p className="font-bold text-base" style={{ color: C.green }}>{formatCurrency(unit.totalDeferred || (dmfCalc?.dmfAmount ?? 0))}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* DMF Analysis Tab */}
          <TabsContent value="dmf" className="space-y-4">
            {dmfCalc ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Card>
                    <CardContent className="pt-4 pb-3">
                      <p className="text-xs text-muted-foreground">DMF Percentage</p>
                      <p className="text-2xl font-bold" style={{ color: C.green }}>{(dmfCalc.dmfPct * 100).toFixed(2)}%</p>
                      <p className="text-xs text-muted-foreground">of {formatCurrency(unit.settlementPrice)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 pb-3">
                      <p className="text-xs text-muted-foreground">DMF Amount</p>
                      <p className="text-2xl font-bold" style={{ color: C.green }}>{formatCurrency(dmfCalc.dmfAmount)}</p>
                      <p className="text-xs text-muted-foreground">accrued to date</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 pb-3">
                      <p className="text-xs text-muted-foreground">Annual DMF</p>
                      <p className="text-xl font-bold text-amber-700">{formatCurrency(dmfCalc.annualDmf)}</p>
                      <p className="text-xs text-muted-foreground">3% p.a. of settlement</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4 pb-3">
                      <p className="text-xs text-muted-foreground">Net to Resident</p>
                      <p className="text-xl font-bold text-blue-700">{formatCurrency(unit.marketValue - dmfCalc.dmfAmount)}</p>
                      <p className="text-xs text-muted-foreground">market value minus DMF</p>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium">DMF Progress to 30% Cap</p>
                      <p className="text-sm font-bold" style={{ color: C.green }}>{(dmfCalc.dmfPct * 100).toFixed(1)}% / 30%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="h-3 rounded-full transition-all" style={{ width: `${Math.min((dmfCalc.dmfPct / 0.30) * 100, 100)}%`, background: C.green }} />
                    </div>
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-500">0%</p>
                      <p className="text-xs text-gray-500">Max DMF: {formatCurrency(unit.settlementPrice * 0.30)} at 10 years</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">Settlement price and date required for DMF analysis</p>
              </div>
            )}
          </TabsContent>

          {/* Legal & POA Tab */}
          <TabsContent value="legal" className="space-y-4">
            {unit.resident ? (
              <>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Solicitor / Lawyer</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <EditField label="Lawyer Name" value={unit.resident.lawyerName} onSave={v => onUpdate({ ...unit, resident: { ...unit.resident!, lawyerName: v } })} canEdit={canEdit} />
                    <EditField label="Lawyer Firm" value={unit.resident.lawyerFirm} onSave={v => onUpdate({ ...unit, resident: { ...unit.resident!, lawyerFirm: v } })} canEdit={canEdit} />
                    <EditField label="Lawyer Phone" value={unit.resident.lawyerPhone} onSave={v => onUpdate({ ...unit, resident: { ...unit.resident!, lawyerPhone: v } })} canEdit={canEdit} />
                    <EditField label="Lawyer Email" value={unit.resident.lawyerEmail} onSave={v => onUpdate({ ...unit, resident: { ...unit.resident!, lawyerEmail: v } })} canEdit={canEdit} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Power of Attorney</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <EditField label="POA Holder" value={unit.resident.poaHolder} onSave={v => onUpdate({ ...unit, resident: { ...unit.resident!, poaHolder: v } })} canEdit={canEdit} />
                    <EditField label="POA Phone" value={unit.resident.poaPhone} onSave={v => onUpdate({ ...unit, resident: { ...unit.resident!, poaPhone: v } })} canEdit={canEdit} />
                    <EditField label="POA Email" value={unit.resident.poaEmail} onSave={v => onUpdate({ ...unit, resident: { ...unit.resident!, poaEmail: v } })} canEdit={canEdit} />
                    <EditField label="POA Relationship" value={unit.resident.poaRelationship} onSave={v => onUpdate({ ...unit, resident: { ...unit.resident!, poaRelationship: v } })} canEdit={canEdit} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Will Details</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 text-sm">
                    <EditField label="Will Holder" value={unit.resident.willHolder} onSave={v => onUpdate({ ...unit, resident: { ...unit.resident!, willHolder: v } })} canEdit={canEdit} />
                    <EditField label="Executor Name" value={unit.resident.executorName} onSave={v => onUpdate({ ...unit, resident: { ...unit.resident!, executorName: v } })} canEdit={canEdit} />
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No resident data available for this unit</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ── Main Contracts Page ───────────────────────────────────────────────────────
export default function Contracts() {
  const { units, updateUnit } = useCRM();
  const { isSuperAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Unit | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);

  const contractedUnits = useMemo(() => units.filter(u => u.contractType && u.settlementPrice > 0), [units]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return contractedUnits.filter(u => {
      const matchSearch = !q || u.unitNo.toLowerCase().includes(q) ||
        (u.resident && `${u.resident.firstName} ${u.resident.lastName}`.toLowerCase().includes(q)) ||
        (u.ownerName && u.ownerName.toLowerCase().includes(q));
      const matchType = typeFilter === 'all' || u.contractType === typeFilter;
      return matchSearch && matchType;
    });
  }, [contractedUnits, search, typeFilter]);

  const totals = useMemo(() => ({
    totalSettlement: contractedUnits.reduce((s, u) => s + (u.settlementPrice || 0), 0),
    totalDeferred: contractedUnits.reduce((s, u) => s + (u.totalDeferred || 0), 0),
    totalMarketValue: contractedUnits.reduce((s, u) => s + (u.marketValue || 0), 0),
  }), [contractedUnits]);

  const contractTypes = useMemo(() => {
    const types = new Set(contractedUnits.map(u => u.contractType).filter(Boolean));
    return Array.from(types).sort();
  }, [contractedUnits]);

  const handleUpdate = (updated: Unit) => {
    updateUnit(updated.unitNo, updated);
    if (selected?.unitNo === updated.unitNo) setSelected(updated);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar List */}
      <div className={`flex flex-col border-r border-border bg-card ${selected ? 'hidden lg:flex lg:w-96' : 'w-full'}`}>
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-foreground">Contracts & DMF</h1>
            <Button size="sm" variant="outline" onClick={() => setShowCalculator(true)}>
              <Calculator size={14} className="mr-1" /> DMF Calculator
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Total Settlement', value: formatCurrency(totals.totalSettlement), color: C.brown },
              { label: 'Total DMF Accrued', value: formatCurrency(totals.totalDeferred), color: C.green },
              { label: 'Total Market Value', value: formatCurrency(totals.totalMarketValue), color: '#1e40af' },
            ].map(s => (
              <div key={s.label} className="p-2 rounded-lg bg-muted/40 text-center">
                <p className="text-xs font-bold truncate" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search unit, resident..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Filter by contract type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types ({contractedUnits.length})</SelectItem>
              {contractTypes.map(t => (
                <SelectItem key={t} value={t}>{t} ({contractedUnits.filter(u => u.contractType === t).length})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{filtered.length} contracts</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(u => {
            const cfg = getContractColor(u.contractType);
            return (
              <div key={u.unitNo} onClick={() => setSelected(u)}
                className={`flex items-center gap-3 px-4 py-3 border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${selected?.unitNo === u.unitNo ? 'bg-muted' : ''}`}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: cfg.bg, color: cfg.color }}>
                  {u.unitNo}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Unit {u.unitNo} — {u.resident ? `${u.resident.firstName} ${u.resident.lastName}` : u.ownerName || '—'}
                  </p>
                  <p className="text-xs text-muted-foreground">{u.contractType} · {u.settlementDate ? formatDate(u.settlementDate) : '—'}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-xs font-medium" style={{ color: C.green }}>{u.settlementPrice ? formatCurrency(u.settlementPrice) : '—'}</span>
                  {u.totalDeferred > 0 && <span className="text-[10px] text-muted-foreground">DMF: {formatCurrency(u.totalDeferred)}</span>}
                </div>
                <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
              </div>
            );
          })}
          {filtered.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">No contracts found</div>}
        </div>
      </div>

      {/* Detail Panel */}
      {selected ? (
        <ContractDetailPanel unit={selected} onClose={() => setSelected(null)} onUpdate={handleUpdate} />
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center text-muted-foreground bg-muted/20">
          <div className="text-center">
            <DollarSign size={48} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">Select a contract to view details</p>
          </div>
        </div>
      )}

      {/* DMF Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator size={20} style={{ color: C.green }} />
                <h2 className="text-base font-bold">DMF Calculator</h2>
              </div>
              <button onClick={() => setShowCalculator(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <p className="text-xs text-gray-500 mb-4">Calculate the Deferred Management Fee for any unit. Rate: 3% per annum, capped at 30% (10 years).</p>
            <DMFCalculator />
          </div>
        </div>
      )}
    </div>
  );
}
