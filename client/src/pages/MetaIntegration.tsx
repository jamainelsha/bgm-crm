// BGM CRM — Meta Integration Page
// Covers: Lead Ads sync, Contact/Enquiry sync, Ad Performance Dashboard, and Configuration
import { useState, useMemo, useCallback } from 'react';
import {
  Facebook, Instagram, RefreshCw, CheckCircle2, XCircle, AlertCircle,
  Settings, Download, TrendingUp, Users, MousePointerClick, DollarSign,
  Eye, BarChart3, Zap, Link2, Copy, Check, ChevronDown, ChevronUp,
  Info, ExternalLink, Clock, Filter, ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell
} from 'recharts';
import {
  useMetaIntegration, mapMetaLeadToCRM, getMetaLeadField,
  type MetaLead, type MetaAdInsight
} from '@/contexts/MetaIntegrationContext';
import { useCRM } from '@/contexts/CRMStore';
import { useAuth } from '@/contexts/AuthContext';
import { BGM_BRAND, type Lead } from '@/lib/data';

const C = BGM_BRAND;
const META_BLUE = '#1877F2';
const META_PINK = '#E1306C';
const META_PURPLE = '#833AB4';

function genId() { return Math.random().toString(36).slice(2, 10); }

// ── Demo/Mock data for when no real API is connected ─────────────────────────
const DEMO_META_LEADS: MetaLead[] = [
  {
    id: 'ml_001', created_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    campaign_name: 'Barrina Gardens — Retirement Living', adset_name: 'Over 55s VIC',
    form_name: 'Enquiry Form — Barrina Gardens', platform: 'facebook',
    field_data: [
      { name: 'full_name', values: ['Margaret Thompson'] },
      { name: 'email', values: ['margaret.thompson@email.com'] },
      { name: 'phone_number', values: ['0412 345 678'] },
      { name: 'any_question', values: ['Interested in a 2-bedroom unit. When can I visit?'] },
    ],
  },
  {
    id: 'ml_002', created_time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    campaign_name: 'Barrina Gardens — Retirement Living', adset_name: 'Downsizers 60+',
    form_name: 'Enquiry Form — Barrina Gardens', platform: 'instagram',
    field_data: [
      { name: 'first_name', values: ['Robert'] },
      { name: 'last_name', values: ['Nguyen'] },
      { name: 'email', values: ['r.nguyen@gmail.com'] },
      { name: 'phone_number', values: ['0498 765 432'] },
    ],
  },
  {
    id: 'ml_003', created_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    campaign_name: 'Barrina Gardens — Open Day', adset_name: 'Retargeting',
    form_name: 'Open Day RSVP', platform: 'facebook',
    field_data: [
      { name: 'full_name', values: ['Patricia & John Walsh'] },
      { name: 'email', values: ['pjwalsh@outlook.com'] },
      { name: 'phone_number', values: ['0411 222 333'] },
      { name: 'comments', values: ['We attended last year and loved it. Would like to see the new units.'] },
    ],
  },
  {
    id: 'ml_004', created_time: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    campaign_name: 'Barrina Gardens — Retirement Living', adset_name: 'Over 55s VIC',
    form_name: 'Enquiry Form — Barrina Gardens', platform: 'facebook',
    field_data: [
      { name: 'first_name', values: ['Helen'] },
      { name: 'last_name', values: ['Kowalski'] },
      { name: 'email', values: ['helen.k@yahoo.com'] },
      { name: 'phone_number', values: ['0455 111 999'] },
    ],
    imported: true, importedAt: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString(),
  },
];

const DEMO_INSIGHTS: MetaAdInsight[] = [
  { campaign_id: 'c1', campaign_name: 'Retirement Living', impressions: 42300, clicks: 1890, spend: 1240.50, reach: 38200, leads: 18, cpl: 68.92, ctr: 4.47, date_start: '2026-02-17', date_stop: '2026-03-17' },
  { campaign_id: 'c2', campaign_name: 'Open Day RSVP', impressions: 18700, clicks: 920, spend: 580.00, reach: 16400, leads: 12, cpl: 48.33, ctr: 4.92, date_start: '2026-02-17', date_stop: '2026-03-17' },
  { campaign_id: 'c3', campaign_name: 'Downsizer Awareness', impressions: 31500, clicks: 1120, spend: 890.25, reach: 28900, leads: 9, cpl: 98.92, ctr: 3.56, date_start: '2026-02-17', date_stop: '2026-03-17' },
];

const DEMO_TREND = [
  { date: 'Feb 17', impressions: 3200, clicks: 140, leads: 2, spend: 95 },
  { date: 'Feb 21', impressions: 4100, clicks: 190, leads: 3, spend: 120 },
  { date: 'Feb 25', impressions: 5800, clicks: 260, leads: 4, spend: 175 },
  { date: 'Mar 01', impressions: 6200, clicks: 285, leads: 5, spend: 195 },
  { date: 'Mar 05', impressions: 7100, clicks: 320, leads: 6, spend: 220 },
  { date: 'Mar 09', impressions: 8400, clicks: 390, leads: 7, spend: 265 },
  { date: 'Mar 13', impressions: 9200, clicks: 425, leads: 8, spend: 290 },
  { date: 'Mar 17', impressions: 10500, clicks: 480, leads: 9, spend: 350 },
];

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color }}>{value}</p>
            {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
          </div>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '18' }}>
            <Icon size={18} style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Platform Badge ────────────────────────────────────────────────────────────
function PlatformBadge({ platform }: { platform?: string }) {
  if (platform === 'instagram') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#fce7f3', color: META_PINK }}>
        <Instagram size={9} /> Instagram
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#dbeafe', color: META_BLUE }}>
      <Facebook size={9} /> Facebook
    </span>
  );
}

// ── Format helpers ────────────────────────────────────────────────────────────
function fmtCurrency(n: number) { return `$${n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
function fmtNum(n: number) { return n.toLocaleString('en-AU'); }
function fmtPct(n: number) { return `${n.toFixed(2)}%`; }
function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Lead Row ─────────────────────────────────────────────────────────────────
function MetaLeadRow({ lead, onImport }: { lead: MetaLead; onImport: (lead: MetaLead) => void }) {
  const [expanded, setExpanded] = useState(false);
  const mapped = mapMetaLeadToCRM(lead);
  const allFields = lead.field_data.filter(f => !['full_name', 'first_name', 'last_name', 'email', 'phone_number', 'mobile', 'phone'].includes(f.name.toLowerCase()));

  return (
    <div className="border rounded-lg overflow-hidden mb-2">
      <div className="flex items-center gap-3 p-3 bg-white">
        <PlatformBadge platform={lead.platform} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {mapped.firstName} {mapped.lastName}
            </p>
            {lead.imported && (
              <Badge className="text-[10px] h-4" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
                <CheckCircle2 size={9} className="mr-0.5" /> Imported
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">
            {mapped.email || mapped.phone || 'No contact info'} · {lead.campaign_name || 'Unknown Campaign'} · {timeAgo(lead.created_time)}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {!lead.imported && (
            <Button
              size="sm"
              className="h-7 text-xs"
              style={{ backgroundColor: C.green, color: 'white' }}
              onClick={() => onImport(lead)}
            >
              <Download size={12} className="mr-1" /> Import to CRM
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
        </div>
      </div>
      {expanded && (
        <div className="border-t bg-gray-50 p-3 grid grid-cols-2 gap-2 text-xs">
          {lead.field_data.map(f => (
            <div key={f.name}>
              <span className="text-gray-400 capitalize">{f.name.replace(/_/g, ' ')}: </span>
              <span className="text-gray-700 font-medium">{f.values.join(', ')}</span>
            </div>
          ))}
          {lead.campaign_name && (
            <div className="col-span-2 pt-1 border-t mt-1">
              <span className="text-gray-400">Campaign: </span>
              <span className="text-gray-700">{lead.campaign_name}</span>
              {lead.adset_name && <> · <span className="text-gray-400">Ad Set: </span><span className="text-gray-700">{lead.adset_name}</span></>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function MetaIntegration() {
  const { config, updateConfig, metaLeads, setMetaLeads, markLeadImported, adInsights, setAdInsights, syncLogs, addSyncLog, lastSyncAt, setLastSyncAt, insightsDateRange, setInsightsDateRange } = useMetaIntegration();
  const { addLead } = useCRM();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('leads');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSyncingInsights, setIsSyncingInsights] = useState(false);
  const [showConfigSaved, setShowConfigSaved] = useState(false);
  const [configForm, setConfigForm] = useState({ ...config });
  const [showSecret, setShowSecret] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [platformFilter, setPlatformFilter] = useState<'all' | 'facebook' | 'instagram'>('all');
  const [importFilter, setImportFilter] = useState<'all' | 'pending' | 'imported'>('all');

  const isConfigured = config.pageAccessToken && config.adAccountId && config.pageId;

  // Use demo data if not configured, otherwise use stored leads/insights
  const displayLeads = isConfigured ? metaLeads : DEMO_META_LEADS;
  const displayInsights = isConfigured ? adInsights : DEMO_INSIGHTS;

  const filteredLeads = useMemo(() => {
    return displayLeads.filter(l => {
      if (platformFilter !== 'all' && l.platform !== platformFilter) return false;
      if (importFilter === 'pending' && l.imported) return false;
      if (importFilter === 'imported' && !l.imported) return false;
      return true;
    });
  }, [displayLeads, platformFilter, importFilter]);

  const pendingCount = useMemo(() => displayLeads.filter(l => !l.imported).length, [displayLeads]);

  const totalStats = useMemo(() => ({
    impressions: displayInsights.reduce((s, i) => s + i.impressions, 0),
    clicks: displayInsights.reduce((s, i) => s + i.clicks, 0),
    spend: displayInsights.reduce((s, i) => s + i.spend, 0),
    leads: displayInsights.reduce((s, i) => s + i.leads, 0),
    reach: displayInsights.reduce((s, i) => s + i.reach, 0),
    ctr: displayInsights.length > 0
      ? displayInsights.reduce((s, i) => s + i.clicks, 0) / displayInsights.reduce((s, i) => s + i.impressions, 0) * 100
      : 0,
    cpl: displayInsights.reduce((s, i) => s + i.leads, 0) > 0
      ? displayInsights.reduce((s, i) => s + i.spend, 0) / displayInsights.reduce((s, i) => s + i.leads, 0)
      : 0,
  }), [displayInsights]);

  const handleImportLead = useCallback((metaLead: MetaLead) => {
    const mapped = mapMetaLeadToCRM(metaLead);
    const lead: Lead = {
      id: genId(),
      firstName: mapped.firstName,
      lastName: mapped.lastName,
      phone: mapped.phone,
      email: mapped.email,
      address: mapped.address,
      leadSource: mapped.leadSource,
      status: 'Active',
      createdAt: metaLead.created_time || new Date().toISOString(),
      notes: mapped.notes ? [{ id: genId(), text: mapped.notes, author: 'Meta Import', createdAt: new Date().toISOString() }] : [],
    };
    addLead(lead);
    markLeadImported(metaLead.id);
    // Also mark in demo leads if using demo
    if (!isConfigured) {
      const idx = DEMO_META_LEADS.findIndex(l => l.id === metaLead.id);
      if (idx >= 0) DEMO_META_LEADS[idx] = { ...DEMO_META_LEADS[idx], imported: true, importedAt: new Date().toISOString() };
    }
    addSyncLog({ timestamp: new Date().toISOString(), type: 'lead_sync', message: `Imported lead: ${mapped.firstName} ${mapped.lastName}`, count: 1 });
    toast.success(`Lead imported: ${mapped.firstName} ${mapped.lastName}`, {
      description: 'Added to Leads & Enquiries with source tagged as Meta Lead Ad.',
    });
  }, [addLead, markLeadImported, addSyncLog, isConfigured]);

  const handleImportAll = useCallback(() => {
    const pending = displayLeads.filter(l => !l.imported);
    if (pending.length === 0) { toast.info('No pending leads to import.'); return; }
    pending.forEach(l => handleImportLead(l));
    toast.success(`${pending.length} leads imported to CRM`);
  }, [displayLeads, handleImportLead]);

  const handleSyncLeads = useCallback(async () => {
    if (!isConfigured) {
      toast.error('Please configure your Meta credentials in the Settings tab first.');
      return;
    }
    setIsSyncing(true);
    try {
      // Real API call: GET /{page-id}/leadgen_forms?access_token={token}
      // Then for each form: GET /{form-id}/leads?access_token={token}
      const response = await fetch(
        `https://graph.facebook.com/v19.0/${config.pageId}/leadgen_forms?access_token=${config.pageAccessToken}&fields=id,name,leads{id,created_time,field_data,ad_id,adset_id,campaign_id}`
      );
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const allLeads: MetaLead[] = [];
      for (const form of (data.data || [])) {
        const formLeads = (form.leads?.data || []).map((l: MetaLead) => ({
          ...l,
          form_id: form.id,
          form_name: form.name,
          platform: 'facebook' as const,
        }));
        allLeads.push(...formLeads);
      }
      setMetaLeads(allLeads);
      setLastSyncAt(new Date().toISOString());
      addSyncLog({ timestamp: new Date().toISOString(), type: 'lead_sync', message: `Synced ${allLeads.length} leads from Meta Lead Ads`, count: allLeads.length });
      toast.success(`Synced ${allLeads.length} leads from Meta`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      addSyncLog({ timestamp: new Date().toISOString(), type: 'error', message: `Lead sync failed: ${msg}` });
      toast.error(`Sync failed: ${msg}`);
    } finally {
      setIsSyncing(false);
    }
  }, [config, isConfigured, setMetaLeads, setLastSyncAt, addSyncLog]);

  const handleSyncInsights = useCallback(async () => {
    if (!isConfigured) {
      toast.error('Please configure your Meta credentials in the Settings tab first.');
      return;
    }
    setIsSyncingInsights(true);
    try {
      // Real API call: GET /act_{adAccountId}/insights
      const fields = 'campaign_id,campaign_name,adset_id,adset_name,impressions,clicks,spend,reach,actions,ctr,cpm';
      const response = await fetch(
        `https://graph.facebook.com/v19.0/${config.adAccountId}/insights?fields=${fields}&time_range={"since":"${insightsDateRange.start}","until":"${insightsDateRange.end}"}&level=campaign&access_token=${config.pageAccessToken}`
      );
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const insights: MetaAdInsight[] = (data.data || []).map((row: Record<string, unknown>) => {
        const actions = (row.actions as Array<{ action_type: string; value: string }>) || [];
        const leadAction = actions.find((a) => a.action_type === 'lead');
        const leads = leadAction ? parseInt(leadAction.value) : 0;
        const spend = parseFloat(row.spend as string) || 0;
        return {
          campaign_id: row.campaign_id as string,
          campaign_name: row.campaign_name as string,
          adset_id: row.adset_id as string,
          adset_name: row.adset_name as string,
          impressions: parseInt(row.impressions as string) || 0,
          clicks: parseInt(row.clicks as string) || 0,
          spend,
          reach: parseInt(row.reach as string) || 0,
          leads,
          cpl: leads > 0 ? spend / leads : 0,
          ctr: parseFloat(row.ctr as string) || 0,
          date_start: row.date_start as string,
          date_stop: row.date_stop as string,
        };
      });
      setAdInsights(insights);
      setLastSyncAt(new Date().toISOString());
      addSyncLog({ timestamp: new Date().toISOString(), type: 'insights_sync', message: `Synced insights for ${insights.length} campaigns`, count: insights.length });
      toast.success(`Ad insights updated for ${insights.length} campaigns`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      addSyncLog({ timestamp: new Date().toISOString(), type: 'error', message: `Insights sync failed: ${msg}` });
      toast.error(`Insights sync failed: ${msg}`);
    } finally {
      setIsSyncingInsights(false);
    }
  }, [config, isConfigured, insightsDateRange, setAdInsights, setLastSyncAt, addSyncLog]);

  const handleSaveConfig = () => {
    updateConfig({ ...configForm, isConnected: !!(configForm.pageAccessToken && configForm.adAccountId && configForm.pageId) });
    setShowConfigSaved(true);
    setTimeout(() => setShowConfigSaved(false), 3000);
    toast.success('Meta configuration saved');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    });
  };

  const CHART_COLORS = [META_BLUE, META_PINK, META_PURPLE, C.green, '#f59e0b'];

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Facebook size={20} style={{ color: META_BLUE }} />
              <Instagram size={20} style={{ color: META_PINK }} />
            </div>
            Meta Integration
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Facebook & Instagram Lead Ads sync, contact management, and ad performance dashboard
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isConfigured ? (
            <Badge className="text-xs" style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
              <CheckCircle2 size={11} className="mr-1" /> Connected
            </Badge>
          ) : (
            <Badge className="text-xs" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
              <AlertCircle size={11} className="mr-1" /> Demo Mode — Configure credentials to connect
            </Badge>
          )}
          {lastSyncAt && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock size={11} /> Last sync: {timeAgo(lastSyncAt)}
            </span>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <StatCard icon={Eye} label="Impressions" value={fmtNum(totalStats.impressions)} sub="Last 30 days" color={META_BLUE} />
        <StatCard icon={MousePointerClick} label="Clicks" value={fmtNum(totalStats.clicks)} sub={`CTR ${fmtPct(totalStats.ctr)}`} color={META_PURPLE} />
        <StatCard icon={DollarSign} label="Total Spend" value={fmtCurrency(totalStats.spend)} sub="All campaigns" color="#f59e0b" />
        <StatCard icon={Users} label="Reach" value={fmtNum(totalStats.reach)} sub="Unique people" color="#06b6d4" />
        <StatCard icon={TrendingUp} label="Leads Generated" value={totalStats.leads} sub="From Lead Ads" color={C.green} />
        <StatCard icon={DollarSign} label="Cost Per Lead" value={fmtCurrency(totalStats.cpl)} sub="Avg across campaigns" color={META_PINK} />
        <StatCard icon={Download} label="Pending Import" value={pendingCount} sub="Ready to import" color="#8b5cf6" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="leads" className="text-xs">
            <Download size={13} className="mr-1" /> Lead Sync
            {pendingCount > 0 && (
              <span className="ml-1.5 text-[10px] font-bold rounded-full px-1.5 py-0.5 bg-red-500 text-white">{pendingCount}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="performance" className="text-xs">
            <BarChart3 size={13} className="mr-1" /> Ad Performance
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs">
            <Settings size={13} className="mr-1" /> Configuration
          </TabsTrigger>
        </TabsList>

        {/* ── LEAD SYNC TAB ─────────────────────────────────────────────────── */}
        <TabsContent value="leads" className="space-y-4 mt-4">
          {!isConfigured && (
            <div className="flex items-start gap-2 p-3 rounded-lg border text-sm" style={{ backgroundColor: '#fffbeb', borderColor: '#fcd34d' }}>
              <Info size={15} className="mt-0.5 flex-shrink-0" style={{ color: '#92400e' }} />
              <div style={{ color: '#78350f' }}>
                <strong>Demo Mode:</strong> Showing sample leads. Enter your Meta credentials in the <button className="underline font-semibold" onClick={() => setActiveTab('settings')}>Configuration tab</button> to sync real leads from your Facebook and Instagram Lead Ad forms.
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Select value={platformFilter} onValueChange={(v) => setPlatformFilter(v as typeof platformFilter)}>
                <SelectTrigger className="h-8 text-xs w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                </SelectContent>
              </Select>
              <Select value={importFilter} onValueChange={(v) => setImportFilter(v as typeof importFilter)}>
                <SelectTrigger className="h-8 text-xs w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leads</SelectItem>
                  <SelectItem value="pending">Pending Import</SelectItem>
                  <SelectItem value="imported">Already Imported</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs text-gray-500">{filteredLeads.length} leads</span>
            </div>
            <div className="flex items-center gap-2">
              {pendingCount > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs"
                  onClick={handleImportAll}
                >
                  <Download size={12} className="mr-1" /> Import All Pending ({pendingCount})
                </Button>
              )}
              <Button
                size="sm"
                className="h-8 text-xs"
                style={{ backgroundColor: META_BLUE, color: 'white' }}
                onClick={handleSyncLeads}
                disabled={isSyncing}
              >
                <RefreshCw size={12} className={`mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing…' : 'Sync from Meta'}
              </Button>
            </div>
          </div>

          {/* Lead List */}
          <div>
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Users size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No leads found</p>
                <p className="text-xs mt-1">Adjust filters or sync from Meta to fetch new leads</p>
              </div>
            ) : (
              filteredLeads.map(lead => (
                <MetaLeadRow key={lead.id} lead={lead} onImport={handleImportLead} />
              ))
            )}
          </div>

          {/* Sync Log */}
          {syncLogs.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sync Activity Log</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y max-h-40 overflow-y-auto">
                  {syncLogs.slice(0, 10).map(log => (
                    <div key={log.id} className="px-4 py-2 flex items-center gap-3 text-xs">
                      {log.type === 'error' ? <XCircle size={12} className="text-red-500 flex-shrink-0" /> :
                        log.type === 'lead_sync' ? <Download size={12} className="text-green-600 flex-shrink-0" /> :
                          <BarChart3 size={12} className="text-blue-500 flex-shrink-0" />}
                      <span className="text-gray-600 flex-1">{log.message}</span>
                      <span className="text-gray-400 flex-shrink-0">{timeAgo(log.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── AD PERFORMANCE TAB ────────────────────────────────────────────── */}
        <TabsContent value="performance" className="space-y-4 mt-4">
          {!isConfigured && (
            <div className="flex items-start gap-2 p-3 rounded-lg border text-sm" style={{ backgroundColor: '#fffbeb', borderColor: '#fcd34d' }}>
              <Info size={15} className="mt-0.5 flex-shrink-0" style={{ color: '#92400e' }} />
              <div style={{ color: '#78350f' }}>
                <strong>Demo Mode:</strong> Showing sample ad performance data. Connect your Meta credentials to view real campaign metrics.
              </div>
            </div>
          )}

          {/* Date Range + Sync */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Label className="text-xs text-gray-500">Date range:</Label>
              <Input
                type="date"
                value={insightsDateRange.start}
                onChange={e => setInsightsDateRange({ ...insightsDateRange, start: e.target.value })}
                className="h-8 text-xs w-36"
              />
              <span className="text-xs text-gray-400">to</span>
              <Input
                type="date"
                value={insightsDateRange.end}
                onChange={e => setInsightsDateRange({ ...insightsDateRange, end: e.target.value })}
                className="h-8 text-xs w-36"
              />
            </div>
            <Button
              size="sm"
              className="h-8 text-xs"
              style={{ backgroundColor: META_BLUE, color: 'white' }}
              onClick={handleSyncInsights}
              disabled={isSyncingInsights}
            >
              <RefreshCw size={12} className={`mr-1 ${isSyncingInsights ? 'animate-spin' : ''}`} />
              {isSyncingInsights ? 'Fetching…' : 'Refresh Insights'}
            </Button>
          </div>

          {/* Trend Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Performance Trend — Last 30 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={DEMO_TREND} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 11 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line yAxisId="left" type="monotone" dataKey="impressions" stroke={META_BLUE} strokeWidth={2} dot={false} name="Impressions" />
                  <Line yAxisId="left" type="monotone" dataKey="clicks" stroke={META_PURPLE} strokeWidth={2} dot={false} name="Clicks" />
                  <Line yAxisId="right" type="monotone" dataKey="leads" stroke={C.green} strokeWidth={2} dot={{ r: 3 }} name="Leads" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Campaign Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Spend by Campaign</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={displayInsights} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="campaign_name" tick={{ fontSize: 9 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${v}`} />
                    <Tooltip formatter={(v: number) => fmtCurrency(v)} contentStyle={{ fontSize: 11 }} />
                    <Bar dataKey="spend" name="Spend" radius={[3, 3, 0, 0]}>
                      {displayInsights.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">Leads by Campaign</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={displayInsights} dataKey="leads" nameKey="campaign_name" cx="50%" cy="50%" outerRadius={75} label={({ name, value }) => `${name.slice(0, 12)}: ${value}`} labelLine={false}>
                      {displayInsights.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Campaign Table */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Campaign Performance Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left px-4 py-2 font-semibold text-gray-600">Campaign</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Impressions</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Clicks</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">CTR</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Spend</th>
                      <th className="text-right px-3 py-2 font-semibold text-gray-600">Leads</th>
                      <th className="text-right px-4 py-2 font-semibold text-gray-600">CPL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {displayInsights.map((row, i) => (
                      <tr key={row.campaign_id} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                            <span className="font-medium text-gray-800">{row.campaign_name}</span>
                          </div>
                        </td>
                        <td className="text-right px-3 py-2.5 text-gray-600">{fmtNum(row.impressions)}</td>
                        <td className="text-right px-3 py-2.5 text-gray-600">{fmtNum(row.clicks)}</td>
                        <td className="text-right px-3 py-2.5 text-gray-600">{fmtPct(row.ctr)}</td>
                        <td className="text-right px-3 py-2.5 text-gray-600">{fmtCurrency(row.spend)}</td>
                        <td className="text-right px-3 py-2.5">
                          <span className="font-semibold" style={{ color: C.green }}>{row.leads}</span>
                        </td>
                        <td className="text-right px-4 py-2.5 text-gray-600">{row.cpl > 0 ? fmtCurrency(row.cpl) : '—'}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-semibold border-t-2">
                      <td className="px-4 py-2.5 text-gray-700">Total</td>
                      <td className="text-right px-3 py-2.5 text-gray-700">{fmtNum(totalStats.impressions)}</td>
                      <td className="text-right px-3 py-2.5 text-gray-700">{fmtNum(totalStats.clicks)}</td>
                      <td className="text-right px-3 py-2.5 text-gray-700">{fmtPct(totalStats.ctr)}</td>
                      <td className="text-right px-3 py-2.5 text-gray-700">{fmtCurrency(totalStats.spend)}</td>
                      <td className="text-right px-3 py-2.5" style={{ color: C.green }}>{totalStats.leads}</td>
                      <td className="text-right px-4 py-2.5 text-gray-700">{fmtCurrency(totalStats.cpl)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── CONFIGURATION TAB ─────────────────────────────────────────────── */}
        <TabsContent value="settings" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Credentials Form */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Link2 size={15} style={{ color: META_BLUE }} />
                  Meta App Credentials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-600">Meta App ID</Label>
                  <Input
                    value={configForm.appId}
                    onChange={e => setConfigForm(p => ({ ...p, appId: e.target.value }))}
                    placeholder="e.g. 1234567890123456"
                    className="h-8 text-sm"
                  />
                  <p className="text-[10px] text-gray-400">Found in your Meta Developer App Dashboard</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-600">App Secret</Label>
                  <div className="relative">
                    <Input
                      type={showSecret ? 'text' : 'password'}
                      value={configForm.appSecret}
                      onChange={e => setConfigForm(p => ({ ...p, appSecret: e.target.value }))}
                      placeholder="App secret key"
                      className="h-8 text-sm pr-8"
                    />
                    <button className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600" onClick={() => setShowSecret(!showSecret)}>
                      {showSecret ? <Eye size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-600">Facebook Page ID</Label>
                  <Input
                    value={configForm.pageId}
                    onChange={e => setConfigForm(p => ({ ...p, pageId: e.target.value }))}
                    placeholder="e.g. 123456789012345"
                    className="h-8 text-sm"
                  />
                  <p className="text-[10px] text-gray-400">Your Facebook Business Page ID</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-600">Page Access Token</Label>
                  <div className="relative">
                    <Input
                      type={showToken ? 'text' : 'password'}
                      value={configForm.pageAccessToken}
                      onChange={e => setConfigForm(p => ({ ...p, pageAccessToken: e.target.value }))}
                      placeholder="Long-lived page access token"
                      className="h-8 text-sm pr-8"
                    />
                    <button className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600" onClick={() => setShowToken(!showToken)}>
                      <Eye size={14} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400">Generate from Graph API Explorer with lead_retrieval, pages_manage_metadata, ads_management permissions</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-gray-600">Ad Account ID</Label>
                  <Input
                    value={configForm.adAccountId}
                    onChange={e => setConfigForm(p => ({ ...p, adAccountId: e.target.value }))}
                    placeholder="act_XXXXXXXXXX"
                    className="h-8 text-sm"
                  />
                  <p className="text-[10px] text-gray-400">Format: act_XXXXXXXXXX — found in Meta Ads Manager</p>
                </div>
                <Button
                  className="w-full h-8 text-sm"
                  style={{ backgroundColor: META_BLUE, color: 'white' }}
                  onClick={handleSaveConfig}
                >
                  {showConfigSaved ? <><Check size={14} className="mr-1" /> Saved</> : <><Settings size={14} className="mr-1" /> Save Configuration</>}
                </Button>
              </CardContent>
            </Card>

            {/* Webhook Setup */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Zap size={15} style={{ color: '#f59e0b' }} />
                    Webhook Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <p className="text-gray-600">
                    Set up a Meta Webhook to receive real-time lead notifications. Configure the following in your Meta Developer App under <strong>Webhooks → Page → leadgen</strong>:
                  </p>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Callback URL</Label>
                      <div className="flex items-center gap-1 mt-1">
                        <code className="flex-1 bg-gray-100 rounded px-2 py-1.5 text-[11px] text-gray-700 truncate">
                          https://your-domain.com/api/meta/webhook
                        </code>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0 flex-shrink-0">
                          <Copy size={12} />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Verify Token</Label>
                      <div className="flex items-center gap-1 mt-1">
                        <code className="flex-1 bg-gray-100 rounded px-2 py-1.5 text-[11px] text-gray-700 truncate">
                          {config.webhookVerifyToken}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 flex-shrink-0"
                          onClick={() => copyToClipboard(config.webhookVerifyToken)}
                        >
                          {copiedToken ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg p-2.5 text-[11px]" style={{ backgroundColor: '#eff6ff', borderLeft: `3px solid ${META_BLUE}` }}>
                    <p className="font-semibold text-blue-800 mb-1">Webhook Setup Steps:</p>
                    <ol className="space-y-0.5 text-blue-700 list-decimal list-inside">
                      <li>Go to <a href="https://developers.facebook.com/apps" target="_blank" rel="noreferrer" className="underline">developers.facebook.com/apps</a></li>
                      <li>Select your app → Webhooks → Add Subscription</li>
                      <li>Choose <strong>Page</strong> object, subscribe to <strong>leadgen</strong> field</li>
                      <li>Enter the Callback URL and Verify Token above</li>
                      <li>Subscribe your Page using the Page Access Token</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <ExternalLink size={15} style={{ color: C.green }} />
                    Required Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-1.5">
                  {[
                    { perm: 'leads_retrieval', desc: 'Read lead data from Lead Ads forms' },
                    { perm: 'pages_manage_metadata', desc: 'Subscribe to Page webhooks' },
                    { perm: 'pages_show_list', desc: 'List Pages you manage' },
                    { perm: 'pages_read_engagement', desc: 'Read Page engagement data' },
                    { perm: 'ads_management', desc: 'Access ad account insights' },
                  ].map(({ perm, desc }) => (
                    <div key={perm} className="flex items-start gap-2">
                      <CheckCircle2 size={12} className="mt-0.5 flex-shrink-0" style={{ color: C.green }} />
                      <div>
                        <code className="font-semibold text-gray-700">{perm}</code>
                        <span className="text-gray-500"> — {desc}</span>
                      </div>
                    </div>
                  ))}
                  <a
                    href="https://developers.facebook.com/docs/marketing-api/guides/lead-ads/quickstart/webhooks-integration/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-blue-600 hover:underline"
                  >
                    <ExternalLink size={11} /> Meta Developer Documentation
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
