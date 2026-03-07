// BGM CRM — Waitlist Page

import { enquiries, formatDate } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ClipboardList, Phone, Mail, ArrowUp, ArrowDown } from 'lucide-react';

export default function WaitlistPage() {
  const waitlisted = enquiries
    .filter(e => e.status === 'Waitlisted' && e.waitlistPosition)
    .sort((a, b) => (a.waitlistPosition || 99) - (b.waitlistPosition || 99));

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Waitlist</h1>
          <p className="page-subtitle">{waitlisted.length} prospects on waitlist</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => toast.info('Add to waitlist coming soon.')}>
          Add to Waitlist
        </Button>
      </div>

      {waitlisted.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <ClipboardList className="w-8 h-8 mb-2 opacity-40" />
          <p className="text-sm">No prospects on waitlist</p>
        </div>
      ) : (
        <div className="space-y-3">
          {waitlisted.map((e, idx) => (
            <div key={e.id} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white shrink-0"
                style={{ background: 'oklch(0.62 0.14 50)' }}>
                #{e.waitlistPosition}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{e.title} {e.firstName} {e.lastName}</div>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                  {e.mobile && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{e.mobile}</span>}
                  {e.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{e.email}</span>}
                  <span>Preference: {e.preferredUnitType || 'Any'}</span>
                  {e.budget && <span>Budget: ${e.budget.toLocaleString()}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => toast.info('Move up coming soon.')}><ArrowUp className="w-3.5 h-3.5" /></Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => toast.info('Move down coming soon.')}><ArrowDown className="w-3.5 h-3.5" /></Button>
                <Button size="sm" variant="outline" className="text-xs h-7 ml-1" onClick={() => toast.info('Contact prospect coming soon.')}>Contact</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
