// Barrina Gardens CRM — Residents Page
// Real data: 58 residents with full health, emergency contact, and unit data
import { useState, useMemo } from 'react';
import { Search, Phone, Mail, Heart, AlertCircle, ChevronRight, X, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { units, formatDate, calcAge, type Unit } from '@/lib/data';

const C = { green: 'oklch(0.48 0.12 145)', brown: 'oklch(0.42 0.08 65)', amber: 'oklch(0.72 0.14 80)' };
const occupiedUnits = units.filter(u => u.resident);

export default function Residents() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Unit | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return occupiedUnits.filter(u => {
      const r = u.resident!;
      return (
        u.unitNo.toLowerCase().includes(q) ||
        `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
        r.mobile.includes(q) ||
        r.email.toLowerCase().includes(q)
      );
    });
  }, [search]);

  const resident = selected?.resident;

  return (
    <div className="flex h-full overflow-hidden">
      {/* List panel */}
      <div className={`flex flex-col border-r border-border bg-card ${selected ? 'hidden lg:flex lg:w-80 xl:w-96' : 'w-full'}`}>
        <div className="p-4 border-b border-border">
          <h1 className="text-lg font-bold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Residents</h1>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search name, unit, phone..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{filtered.length} of {occupiedUnits.length} residents</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(u => {
            const r = u.resident!;
            const age = calcAge(r.dob);
            return (
              <div key={u.unitNo} onClick={() => setSelected(u)}
                className={`flex items-center gap-3 px-4 py-3 border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${selected?.unitNo === u.unitNo ? 'bg-muted' : ''}`}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-white" style={{ background: C.green }}>
                  {r.firstName?.[0] || '?'}{r.lastName?.[0] || ''}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{r.firstName} {r.lastName}</p>
                  <p className="text-xs text-muted-foreground">Unit {u.unitNo}{age > 0 ? ` · Age ${age}` : ''}</p>
                </div>
                <div className="flex items-center gap-1">
                  {r.medicalConditions && <div className="w-2 h-2 rounded-full bg-amber-400" title="Medical conditions" />}
                  {r.allergies && <div className="w-2 h-2 rounded-full bg-red-400" title="Allergies" />}
                </div>
                <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
              </div>
            );
          })}
          {filtered.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">No residents found</div>}
        </div>
      </div>

      {/* Detail panel */}
      {selected && resident ? (
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelected(null)} className="lg:hidden p-1 rounded hover:bg-muted mr-1">
                <X size={16} />
              </button>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: C.green }}>
                {resident.firstName?.[0] || '?'}{resident.lastName?.[0] || ''}
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">{resident.title} {resident.firstName} {resident.lastName}</h2>
                <p className="text-xs text-muted-foreground">Unit {selected.unitNo} · {selected.contractType} Contract{calcAge(resident.dob) > 0 ? ` · Age ${calcAge(resident.dob)}` : ''}</p>
              </div>
            </div>
            <Badge variant="outline" style={{ borderColor: C.green, color: C.green }}>Active Resident</Badge>
          </div>

          <div className="p-6">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="health">Health & Medical</TabsTrigger>
                <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
                <TabsTrigger value="unit">Unit & Contract</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Personal Details</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-xs text-muted-foreground">Full Name</p><p className="font-medium">{resident.title} {resident.firstName} {resident.lastName}</p></div>
                    <div><p className="text-xs text-muted-foreground">Preferred Name</p><p className="font-medium">{resident.preferredName || '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Date of Birth</p><p className="font-medium">{resident.dob ? formatDate(resident.dob) : '—'}{calcAge(resident.dob) > 0 ? ` (Age ${calcAge(resident.dob)})` : ''}</p></div>
                    <div><p className="text-xs text-muted-foreground">Gender</p><p className="font-medium">{resident.gender || '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Mobile</p><p className="font-medium flex items-center gap-1"><Phone size={12} />{resident.mobile || '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium flex items-center gap-1 truncate"><Mail size={12} />{resident.email || '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Pet</p><p className="font-medium">{resident.hasPet ? `Yes — ${resident.petType}${resident.petBreed ? ` (${resident.petBreed})` : ''}` : 'No'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Care Alert SIM</p><p className="font-medium">{selected.careAlertPhone || '—'}</p></div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Professional Contacts</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-xs text-muted-foreground">Doctor</p><p className="font-medium">{resident.drName || '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Clinic</p><p className="font-medium">{resident.drClinic || '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Doctor Phone</p><p className="font-medium">{resident.drPhone || '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Doctor Email</p><p className="font-medium truncate">{resident.drEmail || '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Lawyer / Firm</p><p className="font-medium">{resident.lawyerName ? `${resident.lawyerName}${resident.lawyerFirm ? ` — ${resident.lawyerFirm}` : ''}` : '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Power of Attorney</p><p className="font-medium">{resident.poaHolder || '—'}</p></div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="health" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Heart size={14} style={{ color: C.green }} />Medical Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Medical Conditions</p>
                      <p className="font-medium">{resident.medicalConditions || 'None recorded'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Allergies</p>
                      {resident.allergies ? (
                        <div className="flex flex-wrap gap-1">
                          {resident.allergies.split(',').map((a, i) => <Badge key={i} variant="destructive" className="text-xs">{a.trim()}</Badge>)}
                        </div>
                      ) : <p className="font-medium">None recorded</p>}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Current Medications</p>
                      {resident.medications && resident.medications.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {resident.medications.map((m, i) => <Badge key={i} variant="outline" className="text-xs">{m}</Badge>)}
                        </div>
                      ) : <p className="font-medium">None recorded</p>}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Insurance & Medicare</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-xs text-muted-foreground">Medicare No.</p><p className="font-medium font-mono text-xs">{resident.medicareNo || '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Ambulance Membership</p><p className="font-medium font-mono text-xs">{resident.ambulanceNo || '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Health Fund</p><p className="font-medium">{resident.healthFund || '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Health Fund No.</p><p className="font-medium font-mono text-xs">{resident.healthFundNo || '—'}</p></div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="emergency" className="space-y-4">
                {[resident.ec1, resident.ec2].map((ec, idx) => ec && (ec.firstName || ec.lastName) ? (
                  <Card key={idx}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <AlertCircle size={14} className="text-amber-500" />
                        Emergency Contact {idx + 1}{ec.relationship ? ` — ${ec.relationship}` : ''}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3 text-sm">
                      <div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{ec.title ? `${ec.title} ` : ''}{ec.firstName} {ec.lastName}</p></div>
                      <div><p className="text-xs text-muted-foreground">Relationship</p><p className="font-medium">{ec.relationship || '—'}</p></div>
                      <div><p className="text-xs text-muted-foreground">Mobile</p><p className="font-medium">{ec.mobile || '—'}</p></div>
                      <div><p className="text-xs text-muted-foreground">Email</p><p className="font-medium truncate">{ec.email || '—'}</p></div>
                      <div className="col-span-2"><p className="text-xs text-muted-foreground">Address</p><p className="font-medium">{ec.address || '—'}</p></div>
                    </CardContent>
                  </Card>
                ) : null)}
                {!((resident.ec1 && (resident.ec1.firstName || resident.ec1.lastName)) || (resident.ec2 && (resident.ec2.firstName || resident.ec2.lastName))) && (
                  <div className="text-center py-8 text-muted-foreground text-sm">No emergency contacts recorded</div>
                )}
              </TabsContent>

              <TabsContent value="unit" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm">Unit Details</CardTitle></CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-xs text-muted-foreground">Unit No.</p><p className="text-2xl font-bold" style={{ color: C.green }}>Unit {selected.unitNo}</p></div>
                    <div><p className="text-xs text-muted-foreground">Unit Type</p><p className="font-medium">{selected.unitType} — {selected.unitStyle}</p></div>
                    <div><p className="text-xs text-muted-foreground">Address</p><p className="font-medium">{selected.address}</p></div>
                    <div><p className="text-xs text-muted-foreground">Contract Type</p><p className="font-medium">{selected.contractType}</p></div>
                    <div><p className="text-xs text-muted-foreground">Settlement Date</p><p className="font-medium">{selected.settlementDate ? formatDate(selected.settlementDate) : '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Years Owned</p><p className="font-medium">{selected.yearsOwned ? `${selected.yearsOwned.toFixed(1)} years` : '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Settlement Price</p><p className="font-medium">{selected.settlementPrice ? `$${selected.settlementPrice.toLocaleString()}` : '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">DMF Accrued</p><p className="font-medium" style={{ color: C.green }}>{selected.totalDeferred ? `$${selected.totalDeferred.toLocaleString()}` : '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">Care Alert Phone</p><p className="font-medium">{selected.careAlertPhone || '—'}</p></div>
                    <div><p className="text-xs text-muted-foreground">SIM Mobile</p><p className="font-medium">{selected.simMobile || '—'}</p></div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center text-muted-foreground bg-muted/20">
          <div className="text-center">
            <User size={48} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">Select a resident to view their full profile</p>
          </div>
        </div>
      )}
    </div>
  );
}
