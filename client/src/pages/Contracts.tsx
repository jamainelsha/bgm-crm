// Barrina Gardens CRM — Contracts Page
import { useState, useMemo } from 'react';
import { Search, FileText, ChevronRight, X, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { units, formatCurrency, formatDate, type Unit } from '@/lib/data';

const C = { green: 'oklch(0.48 0.12 145)', amber: 'oklch(0.72 0.14 80)', brown: 'oklch(0.42 0.08 65)' };

const CONTRACT_COLORS: Record<string, { color: string; bg: string }> = {
  'New': { color: C.green, bg: 'oklch(0.48 0.12 145 / 0.1)' },
  'D': { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  'C': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  'Loan Lease': { color: C.amber, bg: 'oklch(0.72 0.14 80 / 0.1)' },
  'Old': { color: '#9ca3af', bg: 'rgba(156,163,175,0.1)' },
};

const contractedUnits = units.filter(u => u.contractType && u.settlementPrice > 0);

export default function Contracts() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Unit | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return contractedUnits.filter(u => {
      const matchSearch = !q || u.unitNo.toLowerCase().includes(q) ||
        (u.resident && `${u.resident.firstName} ${u.resident.lastName}`.toLowerCase().includes(q)) ||
        (u.ownerName && u.ownerName.toLowerCase().includes(q));
      const matchType = typeFilter === 'all' || u.contractType === typeFilter;
      return matchSearch && matchType;
    });
  }, [search, typeFilter]);

  const totals = useMemo(() => ({
    totalSettlement: contractedUnits.reduce((s, u) => s + (u.settlementPrice || 0), 0),
    totalDeferred: contractedUnits.reduce((s, u) => s + (u.totalDeferred || 0), 0),
    totalMarketValue: contractedUnits.reduce((s, u) => s + (u.marketValue || 0), 0),
  }), []);

  const contractTypes = useMemo(() => {
    const types = new Set(contractedUnits.map(u => u.contractType).filter(Boolean));
    return Array.from(types).sort();
  }, []);

  return (
    <div className="flex h-full overflow-hidden">
      <div className={`flex flex-col border-r border-border bg-card ${selected ? 'hidden lg:flex lg:w-96' : 'w-full'}`}>
        <div className="p-4 border-b border-border space-y-3">
          <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Contracts</h1>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Total Settlement', value: formatCurrency(totals.totalSettlement), color: C.brown },
              { label: 'Total DMF Accrued', value: formatCurrency(totals.totalDeferred), color: C.green },
              { label: 'Total Market Value', value: formatCurrency(totals.totalMarketValue), color: '#3b82f6' },
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
              {contractTypes.map(t => <SelectItem key={t} value={t}>{t} ({contractedUnits.filter(u => u.contractType === t).length})</SelectItem>)}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{filtered.length} contracts</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(u => {
            const cfg = CONTRACT_COLORS[u.contractType] || { color: '#9ca3af', bg: 'rgba(156,163,175,0.1)' };
            return (
              <div key={u.unitNo} onClick={() => setSelected(u)}
                className={`flex items-center gap-3 px-4 py-3 border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${selected?.unitNo === u.unitNo ? 'bg-muted' : ''}`}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: cfg.bg, color: cfg.color }}>
                  {u.unitNo}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">Unit {u.unitNo} — {u.resident ? `${u.resident.firstName} ${u.resident.lastName}` : u.ownerName || '—'}</p>
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

      {selected ? (
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelected(null)} className="lg:hidden p-1 rounded hover:bg-muted mr-1"><X size={16} /></button>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: (CONTRACT_COLORS[selected.contractType] || { bg: 'rgba(156,163,175,0.1)' }).bg }}>
                <FileText size={18} style={{ color: (CONTRACT_COLORS[selected.contractType] || { color: '#9ca3af' }).color }} />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Unit {selected.unitNo} Contract</h2>
                <p className="text-xs text-muted-foreground">{selected.contractType} · {selected.resident ? `${selected.resident.firstName} ${selected.resident.lastName}` : selected.ownerName || '—'}</p>
              </div>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: (CONTRACT_COLORS[selected.contractType] || { bg: 'rgba(156,163,175,0.1)' }).bg, color: (CONTRACT_COLORS[selected.contractType] || { color: '#9ca3af' }).color }}>
              {selected.contractType}
            </span>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Settlement Price', value: formatCurrency(selected.settlementPrice), color: C.brown },
                { label: 'Market Value', value: formatCurrency(selected.marketValue), color: '#3b82f6' },
                { label: 'DMF Accrued', value: formatCurrency(selected.totalDeferred), color: C.green },
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
              <CardHeader className="pb-2"><CardTitle className="text-sm">Contract Details</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Unit No.</p><p className="font-medium">Unit {selected.unitNo}</p></div>
                <div><p className="text-xs text-muted-foreground">Contract Type</p><p className="font-medium">{selected.contractType || '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Resident / Owner</p><p className="font-medium">{selected.resident ? `${selected.resident.firstName} ${selected.resident.lastName}` : selected.ownerName || '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Settlement Date</p><p className="font-medium">{selected.settlementDate ? formatDate(selected.settlementDate) : '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Settlement Price</p><p className="font-medium">{formatCurrency(selected.settlementPrice)}</p></div>
                <div><p className="text-xs text-muted-foreground">Market Value</p><p className="font-medium">{formatCurrency(selected.marketValue)}</p></div>
                <div><p className="text-xs text-muted-foreground">Years Owned</p><p className="font-medium">{selected.yearsOwned ? `${selected.yearsOwned.toFixed(1)} years` : '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">DMF Rate</p><p className="font-medium">{selected.dmfRate ? `${selected.dmfRate}% per year` : '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Annual DMF</p><p className="font-medium">{selected.annualDmf ? formatCurrency(selected.annualDmf) : '—'}</p></div>
                <div><p className="text-xs text-muted-foreground">Total DMF Accrued</p><p className="font-bold" style={{ color: C.green }}>{selected.totalDeferred ? formatCurrency(selected.totalDeferred) : '—'}</p></div>
              </CardContent>
            </Card>
            {selected.resident && (
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm">Resident Details</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{selected.resident.title} {selected.resident.firstName} {selected.resident.lastName}</p></div>
                  <div><p className="text-xs text-muted-foreground">Mobile</p><p className="font-medium">{selected.resident.mobile || '—'}</p></div>
                  <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium truncate">{selected.resident.email || '—'}</p></div>
                  <div><p className="text-xs text-muted-foreground">Lawyer</p><p className="font-medium">{selected.resident.lawyerName || '—'}</p></div>
                  <div><p className="text-xs text-muted-foreground">Lawyer Firm</p><p className="font-medium">{selected.resident.lawyerFirm || '—'}</p></div>
                  <div><p className="text-xs text-muted-foreground">Power of Attorney</p><p className="font-medium">{selected.resident.poaHolder || '—'}</p></div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center text-muted-foreground bg-muted/20">
          <div className="text-center">
            <DollarSign size={48} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">Select a contract to view details</p>
          </div>
        </div>
      )}
    </div>
  );
}
