// Barrina Gardens CRM — Reports Page
import { useMemo } from 'react';
import { getDashboardStats, formatCurrency, units, leads, maintenanceRequests, calcAge } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const C = { green: 'oklch(0.48 0.12 145)', amber: 'oklch(0.72 0.14 80)', brown: 'oklch(0.42 0.08 65)', blue: '#3b82f6', red: 'oklch(0.577 0.245 27.325)' };
const CHART_COLORS = [C.green, C.amber, C.brown, C.blue, C.red, '#8b5cf6', '#ec4899'];

export default function Reports() {
  const stats = getDashboardStats();

  const occupancyData = useMemo(() => [
    { name: 'Occupied', value: units.filter(u => u.status === 'Occupied').length },
    { name: 'Vacant', value: units.filter(u => u.status === 'Vacant').length },
    { name: 'Maintenance', value: units.filter(u => u.status === 'Under Maintenance').length },
    { name: 'Reserved', value: units.filter(u => u.status === 'Reserved').length },
  ], []);

  const leadSourceData = useMemo(() => {
    const sources: Record<string, number> = {};
    leads.forEach(l => {
      const src = l.leadSource || 'Unknown';
      sources[src] = (sources[src] || 0) + 1;
    });
    return Object.entries(sources)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));
  }, []);

  const leadStatusData = useMemo(() => [
    { name: 'Active', value: leads.filter(l => l.status === 'Active').length },
    { name: 'Waitlist', value: leads.filter(l => l.status === 'Waitlist').length },
    { name: 'Sold', value: leads.filter(l => l.status === 'Sold').length },
    { name: 'Not Interested', value: leads.filter(l => l.status === 'No Longer Interested').length },
  ], []);

  const ageDistData = useMemo(() => {
    const ranges = [
      { range: '65-70', min: 65, max: 70 },
      { range: '70-75', min: 70, max: 75 },
      { range: '75-80', min: 75, max: 80 },
      { range: '80-85', min: 80, max: 85 },
      { range: '85-90', min: 85, max: 90 },
      { range: '90+', min: 90, max: 200 },
    ];
    return ranges.map(r => ({
      range: r.range,
      count: units.filter(u => {
        if (!u.resident?.dob) return false;
        const age = calcAge(u.resident.dob);
        return age >= r.min && age < r.max;
      }).length,
    }));
  }, []);

  const maintenanceCatData = useMemo(() => {
    const cats: Record<string, number> = {};
    maintenanceRequests.forEach(m => {
      cats[m.category] = (cats[m.category] || 0) + 1;
    });
    return Object.entries(cats).map(([name, count]) => ({ name, count }));
  }, []);

  const contractData = useMemo(() => {
    const contracted = units.filter(u => u.contractType && u.settlementPrice > 0);
    return contracted.map(u => ({
      unit: `U${u.unitNo}`,
      settlement: u.settlementPrice || 0,
      marketValue: u.marketValue || 0,
      dmf: u.totalDeferred || 0,
    })).sort((a, b) => b.settlement - a.settlement).slice(0, 15);
  }, []);

  const totalSettlement = useMemo(() => units.reduce((s, u) => s + (u.settlementPrice || 0), 0), []);
  const totalDmf = useMemo(() => units.reduce((s, u) => s + (u.totalDeferred || 0), 0), []);
  const totalMarketValue = useMemo(() => units.reduce((s, u) => s + (u.marketValue || 0), 0), []);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b border-border bg-card">
        <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Reports</h1>
        <p className="text-xs text-muted-foreground mt-1">Village-wide analytics and financial summary</p>
      </div>
      <div className="p-4 space-y-4">
        {/* KPI Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Occupied Units', value: stats.occupied, sub: `${stats.occupancyRate}% occupancy`, color: C.green },
            { label: 'Active Residents', value: stats.occupied, sub: `${units.filter(u => u.resident).length} with health data`, color: C.brown },
            { label: 'Total Settlement', value: formatCurrency(totalSettlement), sub: 'All contracts', color: C.blue },
            { label: 'Total DMF Accrued', value: formatCurrency(totalDmf), sub: `Market value: ${formatCurrency(totalMarketValue)}`, color: C.amber },
          ].map(k => (
            <Card key={k.label}>
              <CardContent className="pt-4 pb-3">
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="text-xl font-bold mt-1" style={{ color: k.color }}>{k.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{k.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Occupancy Pie */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Unit Occupancy Breakdown</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={occupancyData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                    {occupancyData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Lead Status */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Enquiry Status ({leads.length} total)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={leadStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                    {leadStatusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Lead Sources Bar */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Top Enquiry Sources</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={leadSourceData} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill={C.green} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Resident Age Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ageDistData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill={C.brown} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Contract Financial Table */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Contract Financials (Top 15 by Settlement)</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-3 text-muted-foreground font-medium">Unit</th>
                    <th className="text-right py-2 pr-3 text-muted-foreground font-medium">Settlement</th>
                    <th className="text-right py-2 pr-3 text-muted-foreground font-medium">Market Value</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">DMF Accrued</th>
                  </tr>
                </thead>
                <tbody>
                  {contractData.map(row => (
                    <tr key={row.unit} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-1.5 pr-3 font-medium">{row.unit}</td>
                      <td className="py-1.5 pr-3 text-right">{formatCurrency(row.settlement)}</td>
                      <td className="py-1.5 pr-3 text-right">{formatCurrency(row.marketValue)}</td>
                      <td className="py-1.5 text-right font-medium" style={{ color: C.green }}>{formatCurrency(row.dmf)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-border">
                    <td className="py-2 pr-3 font-bold">Total</td>
                    <td className="py-2 pr-3 text-right font-bold">{formatCurrency(totalSettlement)}</td>
                    <td className="py-2 pr-3 text-right font-bold">{formatCurrency(totalMarketValue)}</td>
                    <td className="py-2 text-right font-bold" style={{ color: C.green }}>{formatCurrency(totalDmf)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Categories */}
        {maintenanceCatData.length > 0 && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Maintenance by Category</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={maintenanceCatData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill={C.amber} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
