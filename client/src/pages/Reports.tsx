// BGM CRM — Reports Page

import { getDashboardStats, formatCurrency, units, residents, contracts, enquiries, maintenanceRequests } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Download, BarChart3 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const stats = getDashboardStats();

const occupancyData = [
  { name: 'Occupied', value: stats.occupiedUnits, color: 'oklch(0.52 0.09 168)' },
  { name: 'Vacant', value: stats.vacantUnits, color: 'oklch(0.72 0.12 80)' },
  { name: 'Maintenance', value: stats.maintenanceUnits, color: 'oklch(0.62 0.14 50)' },
  { name: 'Reserved', value: stats.reservedUnits, color: 'oklch(0.55 0.12 240)' },
];

const unitTypeData = [
  { name: 'Villa 2BR', count: units.filter(u => u.unitType === 'Villa' && u.unitStyle === '2BR').length },
  { name: 'Villa 1BR', count: units.filter(u => u.unitType === 'Villa' && u.unitStyle === '1BR').length },
  { name: 'Villa 3BR', count: units.filter(u => u.unitType === 'Villa' && u.unitStyle === '3BR').length },
  { name: 'Apartment', count: units.filter(u => u.unitType === 'Apartment').length },
];

const enquirySourceData = [
  { name: 'Website', value: enquiries.filter(e => e.source === 'Website').length },
  { name: 'Referral', value: enquiries.filter(e => e.source === 'Referral').length },
  { name: 'Phone', value: enquiries.filter(e => e.source === 'Phone').length },
  { name: 'Walk-in', value: enquiries.filter(e => e.source === 'Walk-in').length },
];

const maintenanceCategoryData = [
  { name: 'HVAC', count: maintenanceRequests.filter(m => m.category === 'HVAC').length },
  { name: 'Plumbing', count: maintenanceRequests.filter(m => m.category === 'Plumbing').length },
  { name: 'Electrical', count: maintenanceRequests.filter(m => m.category === 'Electrical').length },
  { name: 'Grounds', count: maintenanceRequests.filter(m => m.category === 'Grounds').length },
  { name: 'Renovation', count: maintenanceRequests.filter(m => m.category === 'Renovation').length },
];

const ageDistribution = [
  { range: '65-70', count: residents.filter(r => r.age >= 65 && r.age < 70 && r.status === 'Active').length },
  { range: '70-75', count: residents.filter(r => r.age >= 70 && r.age < 75 && r.status === 'Active').length },
  { range: '75-80', count: residents.filter(r => r.age >= 75 && r.age < 80 && r.status === 'Active').length },
  { range: '80-85', count: residents.filter(r => r.age >= 80 && r.age < 85 && r.status === 'Active').length },
  { range: '85+', count: residents.filter(r => r.age >= 85 && r.status === 'Active').length },
];

const COLORS = ['oklch(0.52 0.09 168)', 'oklch(0.55 0.12 240)', 'oklch(0.62 0.14 50)', 'oklch(0.65 0.12 168)'];

export default function ReportsPage() {
  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Barrina Gardens Village — Operational Overview</p>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => toast.info('Export report coming soon.')}>
          <Download className="w-3.5 h-3.5" /> Export
        </Button>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <span className="stat-card-label">Occupancy Rate</span>
          <div className="stat-card-value" style={{ color: 'oklch(0.52 0.09 168)' }}>{stats.occupancyRate}%</div>
          <div className="stat-card-delta">{stats.occupiedUnits}/{stats.totalUnits} units</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Active Residents</span>
          <div className="stat-card-value">{stats.activeResidents}</div>
          <div className="stat-card-delta">Avg age: {Math.round(residents.filter(r => r.status === 'Active').reduce((s, r) => s + r.age, 0) / stats.activeResidents)} yrs</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Portfolio Value</span>
          <div className="text-xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>{formatCurrency(stats.totalSettlement)}</div>
          <div className="stat-card-delta">Active settlements</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Deferred Fees</span>
          <div className="text-xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>{formatCurrency(stats.totalDeferred)}</div>
          <div className="stat-card-delta">Accrued DMF</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Occupancy breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>Unit Occupancy Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={occupancyData} cx={65} cy={65} innerRadius={40} outerRadius={65} paddingAngle={2} dataKey="value">
                    {occupancyData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {occupancyData.map(item => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value} units</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resident age distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>Resident Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={ageDistribution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.91 0.006 80)" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: 'oklch(0.52 0.012 240)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'oklch(0.52 0.012 240)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                <Bar dataKey="count" fill="oklch(0.52 0.09 168)" radius={[3, 3, 0, 0]} name="Residents" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Enquiry sources */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>Enquiry Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={enquirySourceData} cx={65} cy={65} outerRadius={65} paddingAngle={2} dataKey="value">
                    {enquirySourceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {enquirySourceData.map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance categories */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>Maintenance by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={maintenanceCategoryData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="oklch(0.91 0.006 80)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'oklch(0.52 0.012 240)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'oklch(0.52 0.012 240)' }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                <Bar dataKey="count" fill="oklch(0.62 0.14 50)" radius={[0, 3, 3, 0]} name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Contract summary table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold" style={{ fontFamily: 'Sora, sans-serif' }}>Contract Financial Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full data-table">
            <thead>
              <tr>
                <th>Contract</th>
                <th>Unit</th>
                <th>Settlement</th>
                <th>DMF %</th>
                <th>Years</th>
                <th>Deferred</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map(c => (
                <tr key={c.id}>
                  <td className="font-mono text-xs">{c.contractNo}</td>
                  <td className="text-sm">Unit {c.unitNo}</td>
                  <td className="text-sm font-medium">{formatCurrency(c.settlementAmount)}</td>
                  <td className="text-sm">{c.dmfPercent}%</td>
                  <td className="text-sm">{c.years}</td>
                  <td className="text-sm">{formatCurrency(c.deferred)}</td>
                  <td>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'Active' ? 'badge-occupied' : 'badge-terminated'}`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
