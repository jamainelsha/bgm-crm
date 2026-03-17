// BGM CRM — Meta Integration Context
// Manages Meta (Facebook/Instagram) API credentials, lead sync, and ad insights
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface MetaConfig {
  appId: string;
  appSecret: string;
  pageAccessToken: string;
  adAccountId: string; // format: act_XXXXXXXXXX
  pageId: string;
  webhookVerifyToken: string;
  isConnected: boolean;
  connectedAt?: string;
}

export interface MetaLeadField {
  name: string;
  values: string[];
}

export interface MetaLead {
  id: string;
  created_time: string;
  field_data: MetaLeadField[];
  ad_id?: string;
  ad_name?: string;
  adset_id?: string;
  adset_name?: string;
  campaign_id?: string;
  campaign_name?: string;
  form_id?: string;
  form_name?: string;
  platform?: 'facebook' | 'instagram';
  imported?: boolean;
  importedAt?: string;
}

export interface MetaAdInsight {
  campaign_id: string;
  campaign_name: string;
  adset_id?: string;
  adset_name?: string;
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  leads: number;
  cpl: number; // cost per lead
  ctr: number; // click-through rate
  date_start: string;
  date_stop: string;
  platform?: string;
}

export interface MetaSyncLog {
  id: string;
  timestamp: string;
  type: 'lead_sync' | 'insights_sync' | 'webhook' | 'error';
  message: string;
  count?: number;
}

interface MetaIntegrationContextType {
  config: MetaConfig;
  updateConfig: (updates: Partial<MetaConfig>) => void;
  metaLeads: MetaLead[];
  setMetaLeads: (leads: MetaLead[]) => void;
  markLeadImported: (leadId: string) => void;
  adInsights: MetaAdInsight[];
  setAdInsights: (insights: MetaAdInsight[]) => void;
  syncLogs: MetaSyncLog[];
  addSyncLog: (log: Omit<MetaSyncLog, 'id'>) => void;
  clearSyncLogs: () => void;
  lastSyncAt?: string;
  setLastSyncAt: (ts: string) => void;
  insightsDateRange: { start: string; end: string };
  setInsightsDateRange: (range: { start: string; end: string }) => void;
}

const DEFAULT_CONFIG: MetaConfig = {
  appId: '',
  appSecret: '',
  pageAccessToken: '',
  adAccountId: '',
  pageId: '',
  webhookVerifyToken: 'bgm_crm_webhook_' + Math.random().toString(36).slice(2, 10),
  isConnected: false,
};

const STORAGE_KEYS = {
  config: 'bgm_meta_config_v1',
  leads: 'bgm_meta_leads_v1',
  insights: 'bgm_meta_insights_v1',
  logs: 'bgm_meta_logs_v1',
  lastSync: 'bgm_meta_last_sync_v1',
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const s = localStorage.getItem(key);
    if (s) return JSON.parse(s);
  } catch {}
  return fallback;
}

const MetaIntegrationContext = createContext<MetaIntegrationContextType | null>(null);

export function MetaIntegrationProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<MetaConfig>(() =>
    loadStorage(STORAGE_KEYS.config, DEFAULT_CONFIG)
  );
  const [metaLeads, setMetaLeadsState] = useState<MetaLead[]>(() =>
    loadStorage(STORAGE_KEYS.leads, [])
  );
  const [adInsights, setAdInsightsState] = useState<MetaAdInsight[]>(() =>
    loadStorage(STORAGE_KEYS.insights, [])
  );
  const [syncLogs, setSyncLogs] = useState<MetaSyncLog[]>(() =>
    loadStorage(STORAGE_KEYS.logs, [])
  );
  const [lastSyncAt, setLastSyncAtState] = useState<string | undefined>(() =>
    loadStorage(STORAGE_KEYS.lastSync, undefined)
  );
  const [insightsDateRange, setInsightsDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config)); }, [config]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.leads, JSON.stringify(metaLeads)); }, [metaLeads]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.insights, JSON.stringify(adInsights)); }, [adInsights]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(syncLogs)); }, [syncLogs]);
  useEffect(() => { if (lastSyncAt) localStorage.setItem(STORAGE_KEYS.lastSync, JSON.stringify(lastSyncAt)); }, [lastSyncAt]);

  const updateConfig = useCallback((updates: Partial<MetaConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const setMetaLeads = useCallback((leads: MetaLead[]) => {
    setMetaLeadsState(leads);
  }, []);

  const markLeadImported = useCallback((leadId: string) => {
    setMetaLeadsState(prev =>
      prev.map(l => l.id === leadId ? { ...l, imported: true, importedAt: new Date().toISOString() } : l)
    );
  }, []);

  const setAdInsights = useCallback((insights: MetaAdInsight[]) => {
    setAdInsightsState(insights);
  }, []);

  const addSyncLog = useCallback((log: Omit<MetaSyncLog, 'id'>) => {
    const entry: MetaSyncLog = { ...log, id: Math.random().toString(36).slice(2, 10) };
    setSyncLogs(prev => [entry, ...prev].slice(0, 100));
  }, []);

  const clearSyncLogs = useCallback(() => setSyncLogs([]), []);

  const setLastSyncAt = useCallback((ts: string) => setLastSyncAtState(ts), []);

  return (
    <MetaIntegrationContext.Provider value={{
      config, updateConfig,
      metaLeads, setMetaLeads, markLeadImported,
      adInsights, setAdInsights,
      syncLogs, addSyncLog, clearSyncLogs,
      lastSyncAt, setLastSyncAt,
      insightsDateRange, setInsightsDateRange,
    }}>
      {children}
    </MetaIntegrationContext.Provider>
  );
}

export function useMetaIntegration() {
  const ctx = useContext(MetaIntegrationContext);
  if (!ctx) throw new Error('useMetaIntegration must be used within MetaIntegrationProvider');
  return ctx;
}

// ── Helper: extract field value from Meta lead ────────────────────────────────
export function getMetaLeadField(lead: MetaLead, fieldName: string): string {
  const field = lead.field_data.find(f =>
    f.name.toLowerCase().replace(/[_\s]/g, '') === fieldName.toLowerCase().replace(/[_\s]/g, '')
  );
  return field?.values?.[0] || '';
}

// ── Helper: map Meta lead to CRM Lead format ──────────────────────────────────
export function mapMetaLeadToCRM(metaLead: MetaLead) {
  const get = (name: string) => getMetaLeadField(metaLead, name);
  const fullName = get('full_name') || `${get('first_name')} ${get('last_name')}`.trim();
  const firstName = get('first_name') || fullName.split(' ')[0] || 'Unknown';
  const lastName = get('last_name') || fullName.split(' ').slice(1).join(' ') || 'Lead';

  return {
    firstName,
    lastName,
    phone: get('phone_number') || get('mobile') || get('phone') || undefined,
    email: get('email') || undefined,
    address: get('street_address') || get('address') || undefined,
    leadSource: metaLead.platform === 'instagram'
      ? 'Instagram Lead Ad'
      : `Facebook Lead Ad${metaLead.campaign_name ? ` — ${metaLead.campaign_name}` : ''}`,
    notes: [
      metaLead.campaign_name ? `Campaign: ${metaLead.campaign_name}` : '',
      metaLead.adset_name ? `Ad Set: ${metaLead.adset_name}` : '',
      metaLead.form_name ? `Form: ${metaLead.form_name}` : '',
      get('comments') || get('message') || get('any_question') || '',
    ].filter(Boolean).join('\n') || undefined,
  };
}
