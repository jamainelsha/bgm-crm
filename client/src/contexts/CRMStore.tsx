// BGM CRM — Central Data Store
// All CRM data is managed here with localStorage persistence
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { units as initialUnits, leads as initialLeads, simCards as initialSimCards, tasks as initialTasks, upcomingSales as initialUpcomingSales, type Unit, type Lead, type Task, type SimCard, type UpcomingSale } from '@/lib/data';

const KEYS = {
  units: 'bgm_units_v2',
  leads: 'bgm_leads_v2',
  tasks: 'bgm_tasks_v2',
  simCards: 'bgm_simcards_v2',
  upcomingSales: 'bgm_upcoming_sales_v2',
  ganttWorkflows: 'bgm_gantt_workflows_v2',
  documents: 'bgm_documents_v2',
};

function loadOrInit<T>(key: string, initial: T[]): T[] {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {}
  return initial;
}

function save<T>(key: string, data: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('localStorage save failed:', e);
  }
}

export interface GanttWorkflow {
  unitNo: string;
  steps: GanttStep[];
  solicitorId?: string;
  buyerName?: string;
  salePrice?: number;
  notes?: string;
}

export interface GanttStep {
  stepNumber: number;
  stepName: string;
  assignedTo?: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  dateCompleted?: string;
  notes?: string;
}

export interface Document {
  id: string;
  unitId?: string;
  residentId?: string;
  leadId?: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
  url?: string;
  notes?: string;
}

interface CRMStoreContextType {
  units: Unit[];
  updateUnit: (unitNo: string, updates: Partial<Unit>) => void;
  leads: Lead[];
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  simCards: SimCard[];
  updateSimCard: (unitNo: string, updates: Partial<SimCard>) => void;
  upcomingSales: UpcomingSale[];
  addUpcomingSale: (sale: UpcomingSale) => void;
  updateUpcomingSale: (unitNo: string, updates: Partial<UpcomingSale>) => void;
  removeUpcomingSale: (unitNo: string) => void;
  ganttWorkflows: GanttWorkflow[];
  updateGanttWorkflow: (unitNo: string, updates: Partial<GanttWorkflow>) => void;
  updateGanttStep: (unitNo: string, stepNumber: number, updates: Partial<GanttStep>) => void;
  documents: Document[];
  addDocument: (doc: Document) => void;
  deleteDocument: (id: string) => void;
}

const CRMStoreContext = createContext<CRMStoreContextType | null>(null);

export function CRMStoreProvider({ children }: { children: React.ReactNode }) {
  const [units, setUnits] = useState<Unit[]>(() => loadOrInit(KEYS.units, initialUnits));
  const [leads, setLeads] = useState<Lead[]>(() => loadOrInit(KEYS.leads, initialLeads));
  const [tasks, setTasks] = useState<Task[]>(() => loadOrInit(KEYS.tasks, initialTasks));
  const [simCards, setSimCards] = useState<SimCard[]>(() => loadOrInit(KEYS.simCards, initialSimCards));
  const [upcomingSales, setUpcomingSales] = useState<UpcomingSale[]>(() => loadOrInit(KEYS.upcomingSales, initialUpcomingSales));
  const [ganttWorkflows, setGanttWorkflows] = useState<GanttWorkflow[]>(() => loadOrInit(KEYS.ganttWorkflows, []));
  const [documents, setDocuments] = useState<Document[]>(() => loadOrInit(KEYS.documents, []));

  useEffect(() => { save(KEYS.units, units); }, [units]);
  useEffect(() => { save(KEYS.leads, leads); }, [leads]);
  useEffect(() => { save(KEYS.tasks, tasks); }, [tasks]);
  useEffect(() => { save(KEYS.simCards, simCards); }, [simCards]);
  useEffect(() => { save(KEYS.upcomingSales, upcomingSales); }, [upcomingSales]);
  useEffect(() => { save(KEYS.ganttWorkflows, ganttWorkflows); }, [ganttWorkflows]);
  useEffect(() => { save(KEYS.documents, documents); }, [documents]);

  const updateUnit = useCallback((unitNo: string, updates: Partial<Unit>) => {
    setUnits(prev => prev.map(u => u.unitNo === unitNo ? { ...u, ...updates } : u));
  }, []);

  const addLead = useCallback((lead: Lead) => { setLeads(prev => [lead, ...prev]); }, []);
  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  }, []);
  const deleteLead = useCallback((id: string) => { setLeads(prev => prev.filter(l => l.id !== id)); }, []);

  const addTask = useCallback((task: Task) => { setTasks(prev => [task, ...prev]); }, []);
  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);
  const deleteTask = useCallback((id: string) => { setTasks(prev => prev.filter(t => t.id !== id)); }, []);

  const updateSimCard = useCallback((unitNo: string, updates: Partial<SimCard>) => {
    setSimCards(prev => prev.map(s => s.unitNo === unitNo ? { ...s, ...updates } : s));
  }, []);

  const addUpcomingSale = useCallback((sale: UpcomingSale) => { setUpcomingSales(prev => [...prev, sale]); }, []);
  const updateUpcomingSale = useCallback((unitNo: string, updates: Partial<UpcomingSale>) => {
    setUpcomingSales(prev => prev.map(s => s.unitNo === unitNo ? { ...s, ...updates } : s));
  }, []);
  const removeUpcomingSale = useCallback((unitNo: string) => {
    setUpcomingSales(prev => prev.filter(s => s.unitNo !== unitNo));
  }, []);

  const updateGanttWorkflow = useCallback((unitNo: string, updates: Partial<GanttWorkflow>) => {
    setGanttWorkflows(prev => {
      const existing = prev.find(w => w.unitNo === unitNo);
      if (existing) return prev.map(w => w.unitNo === unitNo ? { ...w, ...updates } : w);
      return [...prev, { unitNo, steps: [], ...updates }];
    });
  }, []);

  const updateGanttStep = useCallback((unitNo: string, stepNumber: number, updates: Partial<GanttStep>) => {
    setGanttWorkflows(prev => {
      const existing = prev.find(w => w.unitNo === unitNo);
      if (!existing) return prev;
      const newSteps = existing.steps.map(s => s.stepNumber === stepNumber ? { ...s, ...updates } : s);
      return prev.map(w => w.unitNo === unitNo ? { ...w, steps: newSteps } : w);
    });
  }, []);

  const addDocument = useCallback((doc: Document) => { setDocuments(prev => [doc, ...prev]); }, []);
  const deleteDocument = useCallback((id: string) => { setDocuments(prev => prev.filter(d => d.id !== id)); }, []);

  return (
    <CRMStoreContext.Provider value={{
      units, updateUnit,
      leads, addLead, updateLead, deleteLead,
      tasks, addTask, updateTask, deleteTask,
      simCards, updateSimCard,
      upcomingSales, addUpcomingSale, updateUpcomingSale, removeUpcomingSale,
      ganttWorkflows, updateGanttWorkflow, updateGanttStep,
      documents, addDocument, deleteDocument,
    }}>
      {children}
    </CRMStoreContext.Provider>
  );
}

export function useCRM() {
  const ctx = useContext(CRMStoreContext);
  if (!ctx) throw new Error('useCRM must be used within CRMStoreProvider');
  return ctx;
}
