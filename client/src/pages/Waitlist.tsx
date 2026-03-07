// Barrina Gardens CRM — Waitlist Page
import { useMemo } from "react";
import { ListOrdered, Phone, Mail, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { leads, formatDate } from "@/lib/data";

const C = { green: "oklch(0.48 0.12 145)", amber: "oklch(0.72 0.14 80)" };

export default function Waitlist() {
  const waitlistLeads = useMemo(() =>
    leads.filter(l => l.status === "Waitlist").sort((a, b) => {
      const da = a.contactDate || "";
      const db = b.contactDate || "";
      return da.localeCompare(db);
    }), []
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border bg-card">
        <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: "playfair display, serif" }}>Waitlist</h1>
        <p className="text-xs text-muted-foreground mt-1">{waitlistLeads.length} prospects on waitlist</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {waitlistLeads.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <ListOrdered size={48} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">No prospects on the waitlist</p>
          </div>
        ) : (
          <div className="space-y-2">
            {waitlistLeads.map((lead, idx) => (
              <Card key={lead.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="py-3 px-4 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: C.green }}>
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.leadSource || "Unknown source"}</p>
                    {lead.notes && <p className="text-xs text-muted-foreground truncate italic mt-0.5">{lead.notes.slice(0, 80)}{lead.notes.length > 80 ? "..." : ""}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 text-xs text-muted-foreground">
                    {lead.phone && <span className="flex items-center gap-1"><Phone size={10} />{lead.phone}</span>}
                    {lead.email && <span className="flex items-center gap-1 truncate max-w-32"><Mail size={10} />{lead.email}</span>}
                    {lead.contactDate && <span className="flex items-center gap-1"><Calendar size={10} />{formatDate(lead.contactDate)}</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
