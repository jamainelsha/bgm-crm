// BGM CRM — Contracts Page

import { useState } from 'react';
import { Search, Plus, FileText, ChevronRight, DollarSign } from 'lucide-react';
import { contracts, residents, units, formatCurrency, formatDate, type Contract, type ContractStatus } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function StatusBadge({ status }: { status: ContractStatus }) {
  const map: Record<ContractStatus, string> = {
    'Active': 'badge-occupied',
    'Terminated': 'badge-terminated',
    'Pending Settlement': 'badge-pending',
  };
  return <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', map[status])}>{status}</span>;
}

export default function ContractsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = contracts.filter(c => {
    const q = search.toLowerCase();
    const contractResidents = residents.filter(r => c.residentIds.includes(r.id));
    const residentNames = contractResidents.map(r => `${r.firstName} ${r.lastName}`).join(' ').toLowerCase();
    const matchSearch = !q || c.contractNo.toLowerCase().includes(q) || c.unitNo.includes(q) || residentNames.includes(q);
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalSettlement = contracts.filter(c => c.status === 'Active').reduce((s, c) => s + c.settlementAmount, 0);
  const totalDeferred = contracts.filter(c => c.status === 'Active').reduce((s, c) => s + c.deferred, 0);

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Contracts</h1>
          <p className="page-subtitle">{contracts.filter(c => c.status === 'Active').length} active · {contracts.length} total</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => toast.info('New contract coming soon.')}>
          <Plus className="w-3.5 h-3.5" /> New Contract
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="stat-card">
          <span className="stat-card-label">Total Settlement (Active)</span>
          <div className="text-xl font-bold mt-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>{formatCurrency(totalSettlement)}</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Total Deferred (Active)</span>
          <div className="text-xl font-bold mt-0.5" style={{ fontFamily: 'Sora, sans-serif' }}>{formatCurrency(totalDeferred)}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="Search contracts..." className="pl-8 h-8 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 h-8 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Terminated">Terminated</SelectItem>
            <SelectItem value="Pending Settlement">Pending Settlement</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full data-table">
          <thead>
            <tr>
              <th>Contract</th>
              <th>Residents</th>
              <th>Status</th>
              <th className="hidden md:table-cell">Settlement</th>
              <th className="hidden lg:table-cell">DMF</th>
              <th className="hidden lg:table-cell">Deferred</th>
              <th className="hidden md:table-cell">Start Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => {
              const contractResidents = residents.filter(r => c.residentIds.includes(r.id));
              return (
                <tr key={c.id} className="cursor-pointer" onClick={() => toast.info(`Contract: ${c.contractNo}\nUnit ${c.unitNo} · ${c.status}\nSettlement: ${formatCurrency(c.settlementAmount)}\nDMF: ${c.dmfPercent}% · Deferred: ${formatCurrency(c.deferred)}`)}>
                  <td>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground/60 shrink-0" />
                      <div>
                        <div className="font-medium text-sm font-mono text-xs">{c.contractNo}</div>
                        <div className="text-xs text-muted-foreground">Unit {c.unitNo}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm">
                      {contractResidents.length === 0 ? <span className="text-muted-foreground">—</span> :
                        contractResidents.map(r => `${r.preferredName} ${r.lastName}`).join(', ')}
                    </div>
                  </td>
                  <td><StatusBadge status={c.status} /></td>
                  <td className="hidden md:table-cell text-sm font-medium">{formatCurrency(c.settlementAmount)}</td>
                  <td className="hidden lg:table-cell text-sm text-muted-foreground">{c.dmfPercent}%</td>
                  <td className="hidden lg:table-cell text-sm text-muted-foreground">{formatCurrency(c.deferred)}</td>
                  <td className="hidden md:table-cell text-sm text-muted-foreground">{formatDate(c.startDate)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
