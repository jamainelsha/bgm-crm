// BGM CRM — Sales GANTT / Workflow Tracker
import { useState, useMemo } from 'react';
import { CheckCircle2, Circle, Clock, ChevronRight, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useCRM, type GanttWorkflow, type GanttStep } from '@/contexts/CRMStore';
import { units as allUnits, formatCurrency, BGM_BRAND } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';

const C = BGM_BRAND;

const WORKFLOW_STEPS: Omit<GanttStep, 'status'>[] = [
  { stepNumber: 1, stepName: 'Resident / Family Notified of Intention to Sell', assignedTo: 'Sam' },
  { stepNumber: 2, stepName: 'Unit Inspection & Condition Report', assignedTo: 'Katherine' },
  { stepNumber: 3, stepName: 'Renovation Scope & Quote', assignedTo: 'Katherine' },
  { stepNumber: 4, stepName: 'Renovation Approved & Scheduled', assignedTo: 'Sam' },
  { stepNumber: 5, stepName: 'Renovation Commenced', assignedTo: 'Katherine' },
  { stepNumber: 6, stepName: 'Renovation Completed', assignedTo: 'Katherine' },
  { stepNumber: 7, stepName: 'Unit Photographed', assignedTo: 'Katherine' },
  { stepNumber: 8, stepName: 'Listing Price Set', assignedTo: 'Sam' },
  { stepNumber: 9, stepName: 'Marketing Material Prepared', assignedTo: 'Katherine' },
  { stepNumber: 10, stepName: 'Unit Listed / Advertised', assignedTo: 'Katherine' },
  { stepNumber: 11, stepName: 'Enquiries Received', assignedTo: 'Katherine' },
  { stepNumber: 12, stepName: 'Inspections Conducted', assignedTo: 'Katherine' },
  { stepNumber: 13, stepName: 'Expression of Interest (EOI) Received', assignedTo: 'Katherine' },
  { stepNumber: 14, stepName: 'EOI Reviewed & Accepted', assignedTo: 'Sam' },
  { stepNumber: 15, stepName: 'Purchaser Solicitor Details Obtained', assignedTo: 'Katherine' },
  { stepNumber: 16, stepName: 'Contract of Sale Prepared', assignedTo: 'Nikki' },
  { stepNumber: 17, stepName: 'Contract Sent to Purchaser Solicitor', assignedTo: 'Nikki' },
  { stepNumber: 18, stepName: 'Contract Reviewed by Purchaser', assignedTo: 'Nikki' },
  { stepNumber: 19, stepName: 'Contract Signed by Purchaser', assignedTo: 'Nikki' },
  { stepNumber: 20, stepName: 'Contract Signed by Vendor', assignedTo: 'Sam' },
  { stepNumber: 21, stepName: 'Deposit Received', assignedTo: 'Nikki' },
  { stepNumber: 22, stepName: 'Loan Lease / Occupancy Agreement Prepared', assignedTo: 'Nikki' },
  { stepNumber: 23, stepName: 'Loan Lease Sent to Purchaser', assignedTo: 'Nikki' },
  { stepNumber: 24, stepName: 'Loan Lease Signed by Purchaser', assignedTo: 'Nikki' },
  { stepNumber: 25, stepName: 'Loan Lease Signed by BGP', assignedTo: 'Sam' },
  { stepNumber: 26, stepName: 'Finance Approval Confirmed', assignedTo: 'Nikki' },
  { stepNumber: 27, stepName: 'Settlement Date Confirmed', assignedTo: 'Nikki' },
  { stepNumber: 28, stepName: 'Pre-Settlement Inspection', assignedTo: 'Katherine' },
  { stepNumber: 29, stepName: 'Keys Prepared & Labelled', assignedTo: 'Katherine' },
  { stepNumber: 30, stepName: 'Settlement Completed', assignedTo: 'Nikki' },
  { stepNumber: 31, stepName: 'Keys Handed to New Resident', assignedTo: 'Katherine' },
  { stepNumber: 32, stepName: 'Welcome Pack Delivered', assignedTo: 'Katherine' },
  { stepNumber: 33, stepName: 'Resident Onboarding Completed', assignedTo: 'Katherine' },
];

function StepBadge({ status }: { status: GanttStep['status'] }) {
  if (status === 'Completed') return <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />;
  if (status === 'In Progress') return <Clock size={16} className="text-amber-500 flex-shrink-0" />;
  return <Circle size={16} className="text-gray-300 flex-shrink-0" />;
}

function getProgress(steps: GanttStep[]) {
  if (!steps.length) return 0;
  const completed = steps.filter(s => s.status === 'Completed').length;
  return Math.round((completed / steps.length) * 100);
}

function initWorkflow(unitNo: string): GanttWorkflow {
  return {
    unitNo,
    steps: WORKFLOW_STEPS.map(s => ({ ...s, status: 'Not Started' as const })),
  };
}

export default function SalesGantt() {
  const { ganttWorkflows, updateGanttWorkflow, updateGanttStep, upcomingSales } = useCRM();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';

  const [selectedUnitNo, setSelectedUnitNo] = useState<string | null>(null);
  const [addUnitDialog, setAddUnitDialog] = useState(false);
  const [newUnitNo, setNewUnitNo] = useState('');
  const [editStep, setEditStep] = useState<{ unitNo: string; step: GanttStep } | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editStatus, setEditStatus] = useState<GanttStep['status']>('Not Started');

  // Get all unit numbers that have workflows or are in upcoming sales
  const activeUnitNos = useMemo(() => {
    const fromWorkflows = ganttWorkflows.map(w => w.unitNo);
    const fromSales = upcomingSales.map(s => s.unitNo);
    const combined = [...new Set([...fromWorkflows, ...fromSales])].filter(Boolean);
    return combined.sort((a, b) => parseInt(a) - parseInt(b));
  }, [ganttWorkflows, upcomingSales]);

  const getWorkflow = (unitNo: string): GanttWorkflow => {
    return ganttWorkflows.find(w => w.unitNo === unitNo) || initWorkflow(unitNo);
  };

  const selectedWorkflow = selectedUnitNo ? getWorkflow(selectedUnitNo) : null;

  const handleAddUnit = () => {
    const n = parseInt(newUnitNo);
    if (!n || n < 1 || n > 59) { toast.error('Enter a valid unit number (1–59)'); return; }
    const unitNoStr = String(n);
    if (activeUnitNos.includes(unitNoStr)) { toast.error(`Unit ${n} already has a workflow`); return; }
    updateGanttWorkflow(unitNoStr, initWorkflow(unitNoStr));
    setSelectedUnitNo(unitNoStr);
    setAddUnitDialog(false);
    setNewUnitNo('');
    toast.success(`Sales workflow created for Unit ${n}`);
  };

  const handleStepClick = (step: GanttStep) => {
    if (!isSuperAdmin) return;
    setEditStep({ unitNo: selectedUnitNo!, step });
    setEditStatus(step.status);
    setEditNotes(step.notes || '');
    setEditDate(step.dateCompleted || '');
  };

  const handleSaveStep = () => {
    if (!editStep) return;
    updateGanttStep(editStep.unitNo, editStep.step.stepNumber, {
      status: editStatus,
      notes: editNotes || undefined,
      dateCompleted: editDate || undefined,
    });
    toast.success('Step updated');
    setEditStep(null);
  };

  const getUnitLabel = (unitNo: string) => {
    const unit = allUnits.find(u => u.unitNo === unitNo);
    return unit ? `Unit ${unitNo} — ${unit.ownerName}` : `Unit ${unitNo}`;
  };

  const getSaleInfo = (unitNo: string) => upcomingSales.find(s => s.unitNo === unitNo);

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Sales GANTT — Workflow Tracker</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{activeUnitNos.length} active sale{activeUnitNos.length !== 1 ? 's' : ''} in pipeline</p>
        </div>
        {isSuperAdmin && (
          <Button size="sm" onClick={() => setAddUnitDialog(true)} style={{ background: C.green }} className="text-white gap-1.5">
            <Plus size={14} /> Add Unit to Pipeline
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Unit List */}
        <div className="lg:col-span-1 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">Active Units</p>
          {activeUnitNos.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No active sales workflows.<br />Click "Add Unit" to start.
              </CardContent>
            </Card>
          )}
          {activeUnitNos.map(unitNo => {
            const wf = getWorkflow(unitNo);
            const progress = getProgress(wf.steps);
            const sale = getSaleInfo(unitNo);
            const isSelected = selectedUnitNo === unitNo;
            return (
              <Card
                key={unitNo}
                className="cursor-pointer transition-all hover:shadow-md"
                style={isSelected ? { outline: `2px solid ${C.green}` } : {}}
                onClick={() => setSelectedUnitNo(unitNo)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold">Unit {unitNo}</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{progress}%</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate mb-2">
                    {allUnits.find(u => u.unitNo === unitNo)?.ownerName || 'Unknown'}
                  </p>
                  {sale && (
                    <p className="text-[11px] font-medium" style={{ color: C.green }}>
                      {formatCurrency(sale.sellPrice)}
                    </p>
                  )}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${progress}%`, background: C.green }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Workflow Steps */}
        <div className="lg:col-span-3">
          {!selectedWorkflow ? (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                <ChevronRight size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a unit from the left to view its 33-step sales workflow</p>
                {isSuperAdmin && activeUnitNos.length === 0 && (
                  <Button
                    size="sm" variant="outline" className="mt-4"
                    onClick={() => setAddUnitDialog(true)}
                  >
                    <Plus size={14} className="mr-1" /> Add First Unit
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{getUnitLabel(selectedUnitNo!)}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {selectedWorkflow.steps.filter(s => s.status === 'Completed').length} of {selectedWorkflow.steps.length} steps completed
                      {isSuperAdmin && <span className="ml-2 text-[10px] text-blue-500">Click any step to update</span>}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: C.green }}>
                      {getProgress(selectedWorkflow.steps)}%
                    </p>
                    <p className="text-[10px] text-muted-foreground">Complete</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${getProgress(selectedWorkflow.steps)}%`, background: C.green }}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {selectedWorkflow.steps.map(step => (
                    <div
                      key={step.stepNumber}
                      className={`flex items-start gap-3 px-4 py-2.5 transition-colors ${isSuperAdmin ? 'hover:bg-muted/40 cursor-pointer' : ''} ${step.status === 'Completed' ? 'bg-green-50/40' : ''}`}
                      onClick={() => handleStepClick(step)}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        <StepBadge status={step.status} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground w-5 flex-shrink-0">{step.stepNumber}.</span>
                          <p className={`text-xs font-medium ${step.status === 'Completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {step.stepName}
                          </p>
                        </div>
                        {(step.notes || step.dateCompleted) && (
                          <div className="ml-7 mt-0.5 flex items-center gap-2 flex-wrap">
                            {step.dateCompleted && (
                              <span className="text-[10px] text-muted-foreground">{step.dateCompleted}</span>
                            )}
                            {step.notes && (
                              <span className="text-[10px] text-muted-foreground truncate">{step.notes}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-[10px] text-muted-foreground">{step.assignedTo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Unit Dialog */}
      <Dialog open={addUnitDialog} onOpenChange={setAddUnitDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add Unit to Sales Pipeline</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label>Unit Number (1–59)</Label>
              <Input
                type="number" min="1" max="59" placeholder="e.g. 38"
                value={newUnitNo}
                onChange={e => setNewUnitNo(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddUnit()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddUnitDialog(false)}>Cancel</Button>
            <Button onClick={handleAddUnit} style={{ background: C.green }} className="text-white">
              Create Workflow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Step Dialog */}
      <Dialog open={!!editStep} onOpenChange={() => setEditStep(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Step {editStep?.step.stepNumber}</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">{editStep?.step.stepName}</p>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label>Status</Label>
              <Select value={editStatus} onValueChange={v => setEditStatus(v as GanttStep['status'])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date Completed</Label>
              <Input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={editNotes}
                onChange={e => setEditNotes(e.target.value)}
                rows={3}
                placeholder="Optional notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditStep(null)}>Cancel</Button>
            <Button onClick={handleSaveStep} style={{ background: C.green }} className="text-white">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
