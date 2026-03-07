// Barrina Gardens CRM — Enquiries / Leads Pipeline Page
import { useState, useMemo } from "react";
import { Search, UserPlus, Phone, Mail, Calendar, ChevronRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { leads, formatDate, type Lead, type EnquiryStatus } from "@/lib/data";

const C = { green: "oklch(0.48 0.12 145)", amber: "oklch(0.72 0.14 80)", brown: "oklch(0.42 0.08 65)" };

const STATUS_CONFIG: Record<EnquiryStatus, { label: string; color: string; bg: string }> = {
  "Active": { label: "Active", color: C.green, bg: "oklch(0.48 0.12 145 / 0.1)" },
  "Waitlist": { label: "Waitlist", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  "No Longer Interested": { label: "Not Interested", color: "#9ca3af", bg: "rgba(156,163,175,0.1)" },
  "Sold": { label: "Sold", color: C.amber, bg: "oklch(0.72 0.14 80 / 0.1)" },
};

export default function Enquiries() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Lead | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return leads.filter(l => {
      const matchSearch = !q || l.name.toLowerCase().includes(q) ||
        (l.phone && l.phone.toLowerCase().includes(q)) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.notes && l.notes.toLowerCase().includes(q)) ||
        (l.leadSource && l.leadSource.toLowerCase().includes(q));
      const matchStatus = statusFilter === "all" || l.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length };
    (["Active", "Waitlist", "No Longer Interested", "Sold"] as EnquiryStatus[]).forEach(s => {
      c[s] = leads.filter(l => l.status === s).length;
    });
    return c;
  }, []);

  return (
    <div className="flex h-full overflow-hidden">
      <div className={`flex flex-col border-r border-border bg-card ${selected ? "hidden lg:flex lg:w-96" : "w-full"}`}>
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: "Playfair Display, serif" }}>Enquiries</h1>
            <span className="text-xs text-muted-foreground">{leads.length} total</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(["Active", "Waitlist", "Sold", "No Longer Interested"] as EnquiryStatus[]).map(s => {
              const cfg = STATUS_CONFIG[s];
              return (
                <div key={s} className="text-center p-2 rounded-lg cursor-pointer" style={{ background: cfg.bg }}
                  onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}>
                  <p className="text-lg font-bold" style={{ color: cfg.color }}>{counts[s]}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{cfg.label}</p>
                </div>
              );
            })}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search name, phone, email, source..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Enquiries ({leads.length})</SelectItem>
              <SelectItem value="Active">Active ({counts["Active"]})</SelectItem>
              <SelectItem value="Waitlist">Waitlist ({counts["Waitlist"]})</SelectItem>
              <SelectItem value="Sold">Sold ({counts["Sold"]})</SelectItem>
              <SelectItem value="No Longer Interested">Not Interested ({counts["No Longer Interested"]})</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{filtered.length} results</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(lead => {
            const cfg = STATUS_CONFIG[lead.status];
            const initials = lead.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase();
            return (
              <div key={lead.id} onClick={() => setSelected(lead)}
                className={`flex items-center gap-3 px-4 py-3 border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${selected?.id === lead.id ? "bg-muted" : ""}`}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: C.brown }}>
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{lead.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{lead.leadSource || "—"} · {lead.phone || lead.email || "No contact"}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                  {lead.contactDate && <span className="text-[10px] text-muted-foreground">{formatDate(lead.contactDate)}</span>}
                </div>
                <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
              </div>
            );
          })}
          {filtered.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">No enquiries found</div>}
        </div>
      </div>

      {selected ? (
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelected(null)} className="lg:hidden p-1 rounded hover:bg-muted mr-1"><X size={16} /></button>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: C.brown }}>
                {selected.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()}
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">{selected.name}</h2>
                <p className="text-xs text-muted-foreground">{selected.leadSource || "Unknown source"}</p>
              </div>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: STATUS_CONFIG[selected.status].bg, color: STATUS_CONFIG[selected.status].color }}>
              {STATUS_CONFIG[selected.status].label}
            </span>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium flex items-center gap-1.5 mt-0.5">
                    {selected.phone ? <><Phone size={12} className="text-muted-foreground" />{selected.phone}</> : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium flex items-center gap-1.5 mt-0.5">
                    {selected.email ? <><Mail size={12} className="text-muted-foreground" />{selected.email}</> : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Lead Source</p>
                  <p className="text-sm font-medium mt-0.5">{selected.leadSource || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Action By</p>
                  <p className="text-sm font-medium mt-0.5">{selected.actionBy || "—"}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Contact Date</p>
                  <p className="text-sm font-medium flex items-center gap-1.5 mt-0.5">
                    {selected.contactDate ? <><Calendar size={12} className="text-muted-foreground" />{formatDate(selected.contactDate)}</> : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Callback Date</p>
                  <p className="text-sm font-medium flex items-center gap-1.5 mt-0.5">
                    {selected.callbackDate ? <><Calendar size={12} className="text-muted-foreground" />{formatDate(selected.callbackDate)}</> : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 inline-block" style={{ background: STATUS_CONFIG[selected.status].bg, color: STATUS_CONFIG[selected.status].color }}>
                    {STATUS_CONFIG[selected.status].label}
                  </span>
                </div>
              </div>
            </div>
            {selected.notes && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <div className="bg-muted/40 rounded-lg p-3 text-sm text-foreground whitespace-pre-wrap">{selected.notes}</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center text-muted-foreground bg-muted/20">
          <div className="text-center">
            <UserPlus size={48} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">Select an enquiry to view details</p>
          </div>
        </div>
      )}
    </div>
  );
}
