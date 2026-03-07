// Barrina Gardens CRM — Residents Page
import { useState, useMemo, useRef } from 'react';
import {
  Search, Phone, Mail, Heart, AlertCircle, ChevronRight, X, User, Edit2,
  FileText, History, Camera, Upload, Plus, Check, ChevronDown, ChevronUp,
  Stethoscope, Shield, Home, Clock, Trash2, UserMinus, Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { units, formatDate, calcAge, type Unit, type Note, type FieldHistoryEntry, BGM_BRAND } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';

const C = BGM_BRAND;

// ── helpers ──────────────────────────────────────────────────────────────────
function genId() { return Math.random().toString(36).slice(2, 10); }

function getStatusColor(status: string) {
  switch (status) {
    case 'Occupied': return { bg: '#dcfce7', text: '#166534' };
    case 'Vacant': return { bg: '#fef9c3', text: '#854d0e' };
    case 'Under Maintenance': return { bg: '#fee2e2', text: '#991b1b' };
    case 'Reserved': return { bg: '#dbeafe', text: '#1e40af' };
    default: return { bg: '#f3f4f6', text: '#374151' };
  }
}

// ── Field History Side Panel ──────────────────────────────────────────────────
function FieldHistoryPanel({ history, fieldLabel, onClose }: {
  history: FieldHistoryEntry[];
  fieldLabel: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: C.sidebar }}>
        <div>
          <p className="text-xs text-gray-400">Field History</p>
          <p className="text-sm font-semibold text-white">{fieldLabel}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-8">No changes recorded yet.</p>
        ) : (
          history.slice().reverse().map((h) => (
            <div key={h.id} className="border border-gray-100 rounded-lg p-3 bg-gray-50 text-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">{h.changedBy}</span>
                <span className="text-gray-400">{new Date(h.changedAt).toLocaleString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-start gap-1">
                  <span className="text-red-500 font-medium w-12 flex-shrink-0">From:</span>
                  <span className="text-gray-600 break-all">{h.oldValue || '(empty)'}</span>
                </div>
                <div className="flex items-start gap-1">
                  <span className="text-green-600 font-medium w-12 flex-shrink-0">To:</span>
                  <span className="text-gray-800 break-all">{h.newValue || '(empty)'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── Editable Field ────────────────────────────────────────────────────────────
function EditableField({ label, value, fieldKey, onSave, onShowHistory, historyCount = 0, type = 'text', multiline = false, disabled = false }: {
  label: string;
  value?: string;
  fieldKey: string;
  onSave: (key: string, newVal: string) => void;
  onShowHistory: (key: string, label: string) => void;
  historyCount?: number;
  type?: string;
  multiline?: boolean;
  disabled?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || '');

  const handleSave = () => {
    if (draft !== (value || '')) onSave(fieldKey, draft);
    setEditing(false);
  };

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-0.5">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!disabled && (
            <button
              onClick={() => { setDraft(value || ''); setEditing(true); }}
              className="text-gray-400 hover:text-gray-600 p-0.5 rounded"
              title="Edit"
            >
              <Edit2 size={11} />
            </button>
          )}
          <button
            onClick={() => onShowHistory(fieldKey, label)}
            className="text-gray-400 hover:text-blue-600 p-0.5 rounded flex items-center gap-0.5 text-xs"
            title="Field history"
          >
            <History size={11} />
            {historyCount > 0 && <span className="text-blue-500">{historyCount}</span>}
          </button>
        </div>
      </div>
      {editing ? (
        <div className="flex items-start gap-1">
          {multiline ? (
            <textarea
              className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
              rows={3}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
            />
          ) : (
            <input
              type={type}
              className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
            />
          )}
          <button onClick={handleSave} className="text-green-600 hover:text-green-700 p-1">
            <Check size={14} />
          </button>
          <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={14} />
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-800">{value || <span className="text-gray-400 italic">Not recorded</span>}</p>
      )}
    </div>
  );
}

// ── Notes Section ─────────────────────────────────────────────────────────────
function NotesSection({ notes, onAddNote, authorName }: {
  notes: Note[];
  onAddNote: (text: string) => void;
  authorName: string;
}) {
  const [draft, setDraft] = useState('');
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Textarea
          placeholder="Add a note..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="text-sm resize-none"
          rows={2}
        />
        <Button
          size="sm"
          onClick={() => { if (draft.trim()) { onAddNote(draft.trim()); setDraft(''); } }}
          disabled={!draft.trim()}
          style={{ backgroundColor: C.green, color: 'white' }}
        >
          <Plus size={14} />
        </Button>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {notes.slice().reverse().map((n) => (
          <div key={n.id} className="bg-gray-50 rounded-lg p-3 text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-700 text-xs">{n.author}</span>
              <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{n.text}</p>
          </div>
        ))}
        {notes.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">No notes yet.</p>}
      </div>
    </div>
  );
}

// ── Medical Files Section ─────────────────────────────────────────────────────
function MedicalFilesSection({ files, unitNo }: { files: string[]; unitNo: string }) {
  const [selected, setSelected] = useState<string | null>(null);
  if (files.length === 0) {
    return <p className="text-sm text-gray-400 italic">No medical records attached.</p>;
  }
  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {files.map((f, i) => {
          const name = f.split('/').pop() || f;
          const isPdf = f.toLowerCase().endsWith('.pdf');
          return (
            <button
              key={i}
              onClick={() => setSelected(f)}
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-green-400 hover:shadow-sm transition text-left"
            >
              {isPdf ? (
                <div className="h-20 bg-red-50 flex items-center justify-center">
                  <FileText size={28} className="text-red-400" />
                </div>
              ) : (
                <img src={f} alt={name} className="w-full h-20 object-cover" />
              )}
              <div className="px-2 py-1 bg-white">
                <p className="text-xs text-gray-600 truncate">{name}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="max-w-3xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-white text-sm">{selected.split('/').pop()}</p>
              <button onClick={() => setSelected(null)} className="text-white hover:text-gray-300">
                <X size={20} />
              </button>
            </div>
            {selected.toLowerCase().endsWith('.pdf') ? (
              <iframe src={selected} className="w-full h-[80vh] rounded" title="Medical record" />
            ) : (
              <img src={selected} alt="Medical record" className="max-w-full max-h-[80vh] rounded object-contain" />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Resident Detail Panel ─────────────────────────────────────────────────────
function ResidentDetailPanel({ unit, onClose, onUpdate }: {
  unit: Unit;
  onClose: () => void;
  onUpdate: (updated: Unit) => void;
}) {
  const { user, isSuperAdmin } = useAuth();
  const [historyPanel, setHistoryPanel] = useState<{ key: string; label: string } | null>(null);
  const [localUnit, setLocalUnit] = useState<Unit>(unit);
  const [retireConfirm, setRetireConfirm] = useState(false);

  const getFieldHistory = (key: string): FieldHistoryEntry[] => {
    return (localUnit.fieldHistory || []).filter(h => h.field === key);
  };

  const handleSaveField = (key: string, newVal: string) => {
    const oldVal = String((localUnit as any)[key] || '');
    const entry: FieldHistoryEntry = {
      id: genId(),
      field: key,
      oldValue: oldVal,
      newValue: newVal,
      changedBy: user?.name || 'Unknown',
      changedAt: new Date().toISOString(),
    };
    const updated: Unit = {
      ...localUnit,
      [key]: newVal,
      fieldHistory: [...(localUnit.fieldHistory || []), entry],
    };
    setLocalUnit(updated);
    onUpdate(updated);
    toast.success(`${key} updated`);
  };

  const handleAddNote = (text: string) => {
    const note: Note = {
      id: genId(),
      text,
      author: user?.name || 'Unknown',
      createdAt: new Date().toISOString(),
    };
    const updated: Unit = { ...localUnit, notes: [...(localUnit.notes || []), note] };
    setLocalUnit(updated);
    onUpdate(updated);
    toast.success('Note added');
  };

  const handleRetire = () => {
    const updated: Unit = { ...localUnit, status: 'Vacant', isDeceased: true };
    setLocalUnit(updated);
    onUpdate(updated);
    setRetireConfirm(false);
    toast.success(`${localUnit.ownerName} has been retired. Unit ${localUnit.unitNo} is now Vacant.`);
  };

  const statusColors = getStatusColor(localUnit.status);

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-4 px-6 py-4 border-b" style={{ backgroundColor: C.sidebar }}>
          <div className="relative flex-shrink-0">
            {localUnit.photos && localUnit.photos.length > 0 ? (
              <img
                src={localUnit.photos[0]}
                alt={localUnit.ownerName}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
              />
            ) : (
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-white/30" style={{ backgroundColor: C.green, color: 'white' }}>
                {localUnit.ownerName.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white text-lg font-bold leading-tight">{localUnit.ownerName}</h2>
            <p className="text-gray-400 text-sm">Unit {localUnit.unitNo} · {localUnit.unitType} {localUnit.unitStyle}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: statusColors.bg, color: statusColors.text }}>
                {localUnit.status}
              </span>
              {localUnit.isDeceased && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">Deceased</span>
              )}
              {localUnit.isForSale && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-900 text-amber-200">For Sale</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isSuperAdmin && (
              <Button
                size="sm"
                variant="outline"
                className="text-red-400 border-red-400/30 hover:bg-red-900/20 hover:text-red-300 text-xs"
                onClick={() => setRetireConfirm(true)}
              >
                <UserMinus size={12} className="mr-1" />
                Retire
              </Button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-4 mt-3 mb-0 justify-start bg-gray-100 h-8">
            <TabsTrigger value="details" className="text-xs h-7">Details</TabsTrigger>
            <TabsTrigger value="medical" className="text-xs h-7">Medical</TabsTrigger>
            <TabsTrigger value="emergency" className="text-xs h-7">Emergency</TabsTrigger>
            {isSuperAdmin && <TabsTrigger value="financial" className="text-xs h-7">Financial</TabsTrigger>}
            <TabsTrigger value="notes" className="text-xs h-7">Notes</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            {/* Details Tab */}
            <TabsContent value="details" className="p-4 space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <EditableField label="Owner Name" value={localUnit.ownerName} fieldKey="ownerName" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('ownerName').length} disabled={!isSuperAdmin} />
                <EditableField label="Date of Birth" value={localUnit.dob} fieldKey="dob" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('dob').length} />
                <EditableField label="Gender" value={localUnit.gender} fieldKey="gender" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('gender').length} />
                <EditableField label="Care Alert Phone" value={localUnit.careAlertPhone} fieldKey="careAlertPhone" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('careAlertPhone').length} />
                <EditableField label="Address" value={localUnit.address} fieldKey="address" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('address').length} />
                <EditableField label="Suburb" value={localUnit.suburb} fieldKey="suburb" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('suburb').length} />
                <EditableField label="Unit Type" value={localUnit.unitType} fieldKey="unitType" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('unitType').length} />
                <EditableField label="Unit Style" value={localUnit.unitStyle} fieldKey="unitStyle" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('unitStyle').length} />
                <EditableField label="Ownership" value={localUnit.ownership} fieldKey="ownership" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('ownership').length} />
                <EditableField label="Contract Type" value={localUnit.contractType} fieldKey="contractType" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('contractType').length} />
                <EditableField label="Comments" value={localUnit.comments} fieldKey="comments" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('comments').length} multiline />
              </div>
            </TabsContent>

            {/* Medical Tab */}
            <TabsContent value="medical" className="p-4 space-y-4 mt-0">
              <div className="grid grid-cols-2 gap-4">
                <EditableField label="Medical Conditions" value={localUnit.residents?.[0]?.medicalConditions} fieldKey="medicalConditions" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('medicalConditions').length} multiline />
                <EditableField label="Allergies" value={localUnit.residents?.[0]?.allergies} fieldKey="allergies" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('allergies').length} multiline />
                <EditableField label="Medicare No." value={localUnit.residents?.[0]?.medicareNo} fieldKey="medicareNo" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('medicareNo').length} />
                <EditableField label="Ambulance No." value={localUnit.residents?.[0]?.ambulanceNo} fieldKey="ambulanceNo" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('ambulanceNo').length} />
                <EditableField label="Health Fund" value={localUnit.residents?.[0]?.healthFund} fieldKey="healthFund" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('healthFund').length} />
                <EditableField label="Health Fund No." value={localUnit.residents?.[0]?.healthFundNo} fieldKey="healthFundNo" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('healthFundNo').length} />
                <EditableField label="GP Name" value={localUnit.residents?.[0]?.drName} fieldKey="drName" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('drName').length} />
                <EditableField label="GP Clinic" value={localUnit.residents?.[0]?.drClinic} fieldKey="drClinic" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('drClinic').length} />
                <EditableField label="GP Phone" value={localUnit.residents?.[0]?.drPhone} fieldKey="drPhone" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('drPhone').length} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <FileText size={14} style={{ color: C.green }} />
                  Medical Record Files
                </h3>
                <MedicalFilesSection files={localUnit.medicalFiles || []} unitNo={localUnit.unitNo} />
              </div>
            </TabsContent>

            {/* Emergency Tab */}
            <TabsContent value="emergency" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                  <Heart size={14} className="text-red-500" />
                  Emergency Contact 1
                </h3>
                <div className="grid grid-cols-2 gap-3 bg-red-50 rounded-lg p-3">
                  <EditableField label="Name" value={localUnit.residents?.[0]?.ec1?.firstName ? `${localUnit.residents[0].ec1.firstName} ${localUnit.residents[0].ec1.lastName || ''}`.trim() : undefined} fieldKey="ec1Name" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('ec1Name').length} />
                  <EditableField label="Relationship" value={localUnit.residents?.[0]?.ec1?.relationship} fieldKey="ec1Relationship" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('ec1Relationship').length} />
                  <EditableField label="Mobile" value={localUnit.residents?.[0]?.ec1?.mobile} fieldKey="ec1Mobile" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('ec1Mobile').length} />
                  <EditableField label="Email" value={localUnit.residents?.[0]?.ec1?.email} fieldKey="ec1Email" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('ec1Email').length} />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                  <Heart size={14} className="text-orange-500" />
                  Emergency Contact 2
                </h3>
                <div className="grid grid-cols-2 gap-3 bg-orange-50 rounded-lg p-3">
                  <EditableField label="Name" value={localUnit.residents?.[0]?.ec2?.firstName ? `${localUnit.residents[0].ec2.firstName} ${localUnit.residents[0].ec2.lastName || ''}`.trim() : undefined} fieldKey="ec2Name" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('ec2Name').length} />
                  <EditableField label="Relationship" value={localUnit.residents?.[0]?.ec2?.relationship} fieldKey="ec2Relationship" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('ec2Relationship').length} />
                  <EditableField label="Mobile" value={localUnit.residents?.[0]?.ec2?.mobile} fieldKey="ec2Mobile" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('ec2Mobile').length} />
                  <EditableField label="Email" value={localUnit.residents?.[0]?.ec2?.email} fieldKey="ec2Email" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('ec2Email').length} />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                  <Shield size={14} style={{ color: C.green }} />
                  Legal / POA
                </h3>
                <div className="grid grid-cols-2 gap-3 bg-green-50 rounded-lg p-3">
                  <EditableField label="Lawyer Firm" value={localUnit.residents?.[0]?.lawyerFirm} fieldKey="lawyerFirm" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('lawyerFirm').length} />
                  <EditableField label="Lawyer Name" value={localUnit.residents?.[0]?.lawyerName} fieldKey="lawyerName" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('lawyerName').length} />
                  <EditableField label="POA Holder" value={localUnit.residents?.[0]?.poaHolder} fieldKey="poaHolder" onSave={handleSaveField} onShowHistory={(k, l) => setHistoryPanel({ key: k, label: l })} historyCount={getFieldHistory('poaHolder').length} />
                </div>
              </div>
            </TabsContent>

            {/* Financial Tab (Super Admin only) */}
            {isSuperAdmin && (
              <TabsContent value="financial" className="p-4 space-y-4 mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Settlement Price</label>
                    <p className="text-sm font-semibold text-gray-800">${localUnit.settlementPrice?.toLocaleString('en-AU')}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Settlement Date</label>
                    <p className="text-sm text-gray-800">{formatDate(localUnit.settlementDate)}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Market Value</label>
                    <p className="text-sm font-semibold text-gray-800">${localUnit.marketValue?.toLocaleString('en-AU')}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Years Owned</label>
                    <p className="text-sm text-gray-800">{localUnit.yearsOwned?.toFixed(2)}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">DMF Rate</label>
                    <p className="text-sm font-semibold" style={{ color: C.green }}>{((localUnit.dmfRate || 0) * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Annual DMF</label>
                    <p className="text-sm text-gray-800">${localUnit.annualDmf?.toLocaleString('en-AU')}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Deferred</label>
                    <p className="text-sm font-bold text-gray-900">${localUnit.totalDeferred?.toLocaleString('en-AU', { maximumFractionDigits: 0 })}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Contract Type</label>
                    <p className="text-sm text-gray-800">{localUnit.contractType}</p>
                  </div>
                  {localUnit.nonAccDmf != null && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Non-Acc DMF p.a.</label>
                      <p className="text-sm text-gray-800">${localUnit.nonAccDmf?.toLocaleString('en-AU')}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}

            {/* Notes Tab */}
            <TabsContent value="notes" className="p-4 mt-0">
              <NotesSection
                notes={localUnit.notes || []}
                onAddNote={handleAddNote}
                authorName={user?.name || 'Unknown'}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Field History Side Panel */}
      {historyPanel && (
        <FieldHistoryPanel
          history={getFieldHistory(historyPanel.key)}
          fieldLabel={historyPanel.label}
          onClose={() => setHistoryPanel(null)}
        />
      )}

      {/* Retire Confirm Dialog */}
      <Dialog open={retireConfirm} onOpenChange={setRetireConfirm}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <UserMinus size={18} />
              Retire Resident
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to retire <strong>{localUnit.ownerName}</strong>?
            This will mark Unit {localUnit.unitNo} as <strong>Vacant</strong>.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRetireConfirm(false)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleRetire}>
              Confirm Retire
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Main Residents Page ───────────────────────────────────────────────────────
export default function Residents() {
  const { isSuperAdmin } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [allUnits, setAllUnits] = useState<Unit[]>(units);

  const filtered = useMemo(() => {
    return allUnits.filter((u) => {
      const matchSearch = !search || u.ownerName.toLowerCase().includes(search.toLowerCase()) || u.unitNo.includes(search);
      const matchStatus = statusFilter === 'All' || u.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [allUnits, search, statusFilter]);

  const handleUpdate = (updated: Unit) => {
    setAllUnits(prev => prev.map(u => u.unitNo === updated.unitNo ? updated : u));
    if (selectedUnit?.unitNo === updated.unitNo) setSelectedUnit(updated);
  };

  const stats = useMemo(() => ({
    total: allUnits.length,
    occupied: allUnits.filter(u => u.status === 'Occupied').length,
    vacant: allUnits.filter(u => u.status === 'Vacant').length,
    residents: allUnits.reduce((sum, u) => sum + (u.numResidents || 0), 0),
  }), [allUnits]);

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Residents</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {stats.occupied} occupied · {stats.vacant} vacant · {stats.residents} residents
            </p>
          </div>
          {isSuperAdmin && (
            <Button size="sm" style={{ backgroundColor: C.green, color: 'white' }}>
              <Plus size={14} className="mr-1" />
              Add Resident
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Total Units', value: stats.total, color: C.sidebar },
            { label: 'Occupied', value: stats.occupied, color: '#166534' },
            { label: 'Vacant', value: stats.vacant, color: '#854d0e' },
            { label: 'Total Residents', value: stats.residents, color: C.green },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-lg px-3 py-2 text-center">
              <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mt-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name or unit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
          <div className="flex items-center gap-1">
            {['All', 'Occupied', 'Vacant', 'Under Maintenance', 'Reserved'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${statusFilter === s ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                style={statusFilter === s ? { backgroundColor: C.green } : {}}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Residents Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((u) => {
            const statusColors = getStatusColor(u.status);
            return (
              <button
                key={u.unitNo}
                onClick={() => setSelectedUnit(u)}
                className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:shadow-md hover:border-green-300 transition-all group"
              >
                <div className="flex items-start gap-3">
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    {u.photos && u.photos.length > 0 ? (
                      <img
                        src={u.photos[0]}
                        alt={u.ownerName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 group-hover:border-green-200 transition"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 border-gray-100"
                        style={{ backgroundColor: u.status === 'Vacant' ? '#f3f4f6' : C.green + '20', color: u.status === 'Vacant' ? '#9ca3af' : C.green }}
                      >
                        {u.status === 'Vacant' ? <Home size={20} className="text-gray-400" /> : u.ownerName.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-sm font-semibold text-gray-800 leading-tight truncate">{u.ownerName}</p>
                      <span className="text-xs font-bold flex-shrink-0" style={{ color: C.green }}>U{u.unitNo}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{u.unitType} · {u.unitStyle}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: statusColors.bg, color: statusColors.text }}>
                        {u.status}
                      </span>
                      {u.numResidents && u.numResidents > 1 && (
                        <span className="text-xs text-gray-400">{u.numResidents} residents</span>
                      )}
                    </div>
                    {u.careAlertPhone && (
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Phone size={10} />
                        {u.careAlertPhone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Medical indicator */}
                {u.medicalFiles && u.medicalFiles.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-1">
                    <Stethoscope size={10} className="text-blue-400" />
                    <span className="text-xs text-blue-500">{u.medicalFiles.length} medical file{u.medicalFiles.length > 1 ? 's' : ''}</span>
                  </div>
                )}
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12">
              <User size={40} className="mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500 font-medium">No residents found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      {selectedUnit && (
        <ResidentDetailPanel
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
