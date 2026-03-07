// Barrina Gardens CRM — Templates Page
// Communication templates: letters, emails, forms, contracts, notices
import { useState } from 'react';
import { FileText, Mail, ClipboardList, FileSignature, Bell, Search, Copy, CheckCircle, Eye, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { templates, formatDate, type Template } from '@/lib/data';
import { toast } from 'sonner';

const CATEGORY_ICONS: Record<Template['category'], React.ReactNode> = {
  Letter: <FileText size={14} />,
  Email: <Mail size={14} />,
  Form: <ClipboardList size={14} />,
  Contract: <FileSignature size={14} />,
  Notice: <Bell size={14} />,
};

const CATEGORY_COLORS: Record<Template['category'], string> = {
  Letter: 'oklch(0.48 0.12 145)',
  Email: '#3b82f6',
  Form: 'oklch(0.72 0.14 80)',
  Contract: 'oklch(0.42 0.08 65)',
  Notice: 'oklch(0.577 0.245 27.325)',
};

const CATEGORY_BG: Record<Template['category'], string> = {
  Letter: 'oklch(0.48 0.12 145 / 0.1)',
  Email: 'rgba(59,130,246,0.1)',
  Form: 'oklch(0.72 0.14 80 / 0.1)',
  Contract: 'oklch(0.42 0.08 65 / 0.1)',
  Notice: 'oklch(0.577 0.245 27.325 / 0.1)',
};

const LOGO_URL = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663364956560/3kCyjBhX6Z8kZVCZhWirGM/Logolargerforwebsite_b2810c5f.png';

export default function Templates() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Template | null>(null);
  const [copied, setCopied] = useState(false);

  const filtered = templates.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    const matchCat = categoryFilter === 'all' || t.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const categories = Array.from(new Set(templates.map(t => t.category)));

  const copyContent = () => {
    if (!selected) return;
    navigator.clipboard.writeText(selected.content).then(() => {
      setCopied(true);
      toast.success('Template content copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* List Panel */}
      <div className={`flex flex-col border-r border-border bg-card ${selected ? 'hidden lg:flex lg:w-80' : 'w-full'}`}>
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Templates</h1>
            <span className="text-xs text-muted-foreground">{templates.length} templates</span>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search templates..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${categoryFilter === 'all' ? 'border-transparent text-white' : 'border-border text-muted-foreground hover:bg-muted'}`}
              style={categoryFilter === 'all' ? { background: 'oklch(0.48 0.12 145)' } : {}}
            >
              All ({templates.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${categoryFilter === cat ? 'border-transparent text-white' : 'border-border text-muted-foreground hover:bg-muted'}`}
                style={categoryFilter === cat ? { background: CATEGORY_COLORS[cat as Template['category']] } : {}}
              >
                {cat} ({templates.filter(t => t.category === cat).length})
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.map(tpl => (
            <div
              key={tpl.id}
              onClick={() => setSelected(tpl)}
              className={`flex items-start gap-3 px-4 py-3 border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${selected?.id === tpl.id ? 'bg-muted' : ''}`}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: CATEGORY_BG[tpl.category], color: CATEGORY_COLORS[tpl.category] }}>
                {CATEGORY_ICONS[tpl.category]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground leading-tight">{tpl.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{tpl.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                    style={{ background: CATEGORY_BG[tpl.category], color: CATEGORY_COLORS[tpl.category] }}>
                    {tpl.category}
                  </span>
                  <span className="text-[10px] text-muted-foreground">Updated {formatDate(tpl.lastUpdated)}</span>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">
              <FileText size={32} className="mx-auto mb-2 opacity-20" />
              No templates found
            </div>
          )}
        </div>
      </div>

      {/* Preview Panel */}
      {selected ? (
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelected(null)} className="lg:hidden p-1 rounded hover:bg-muted mr-1"><X size={16} /></button>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: CATEGORY_BG[selected.category], color: CATEGORY_COLORS[selected.category] }}>
                {CATEGORY_ICONS[selected.category]}
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">{selected.name}</h2>
                <p className="text-xs text-muted-foreground">{selected.category} · Updated {formatDate(selected.lastUpdated)}</p>
              </div>
            </div>
            <button
              onClick={copyContent}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              {copied ? <CheckCircle size={13} className="text-green-600" /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Letterhead Preview */}
          <div className="p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-border overflow-hidden">
              {/* Letterhead Header */}
              <div className="px-8 pt-6 pb-4 border-b-2" style={{ borderColor: 'oklch(0.48 0.12 145)' }}>
                <div className="flex items-center justify-between">
                  <img src={LOGO_URL} alt="Barrina Gardens" className="h-12 object-contain" />
                  <div className="text-right text-xs text-gray-500 leading-relaxed">
                    <p className="font-semibold text-gray-700">Barrina Gardens Retirement Village</p>
                    <p>26 Barrina Street, Blackburn South VIC 3130</p>
                    <p>Phone: (03) 9877 1200</p>
                    <p>info@barrinagardens.com.au</p>
                  </div>
                </div>
              </div>

              {/* Template Content */}
              <div className="px-8 py-6">
                <p className="text-xs text-gray-400 mb-4 italic">
                  {selected.description}
                </p>
                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-mono bg-gray-50 rounded-lg p-4 border border-gray-100">
                  {selected.content}
                </div>
              </div>

              {/* Letterhead Footer */}
              <div className="px-8 py-3 border-t text-center" style={{ background: 'oklch(0.48 0.12 145)', }}>
                <p className="text-xs text-white/80">Barrina Gardens Retirement Village · 26 Barrina Street, Blackburn South VIC 3130 · (03) 9877 1200</p>
              </div>
            </div>

            {/* Placeholder fields note */}
            <div className="max-w-2xl mx-auto mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-700">
                <strong>Note:</strong> Fields in [square brackets] are placeholders — replace with actual resident name, unit number, date, and staff details before sending.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center text-muted-foreground bg-muted/20">
          <div className="text-center">
            <Eye size={48} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">Select a template to preview</p>
          </div>
        </div>
      )}
    </div>
  );
}
