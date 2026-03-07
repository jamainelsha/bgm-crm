// BGM CRM — Documents Page

import { useState } from 'react';
import { FolderOpen, FileText, Image, File, Upload, Search, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const documentCategories = [
  {
    name: 'Contracts',
    count: 8,
    icon: FileText,
    color: 'oklch(0.52 0.09 168)',
    files: [
      { name: 'Contract CM02-220101-HR.pdf', size: '245 KB', date: '01 Jan 2022', type: 'pdf' },
      { name: 'Contract CM05-191201-CL.pdf', size: '238 KB', date: '01 Dec 2019', type: 'pdf' },
      { name: 'Contract CM08-220101-MI.pdf', size: '251 KB', date: '01 Jan 2022', type: 'pdf' },
      { name: 'Contract CM10A-201201-SD.pdf', size: '260 KB', date: '01 Dec 2020', type: 'pdf' },
    ]
  },
  {
    name: 'Residents',
    count: 12,
    icon: FileText,
    color: 'oklch(0.55 0.12 240)',
    files: [
      { name: 'Resident Application - H. Renshaw.pdf', size: '180 KB', date: '15 Dec 2021', type: 'pdf' },
      { name: 'Health Assessment - S. Dhillon.pdf', size: '95 KB', date: '01 Mar 2025', type: 'pdf' },
      { name: 'POA - H. Renshaw.pdf', size: '120 KB', date: '01 Jun 2020', type: 'pdf' },
    ]
  },
  {
    name: 'Units',
    count: 24,
    icon: Image,
    color: 'oklch(0.62 0.14 50)',
    files: [
      { name: 'Unit 02 - Photo 1.jpg', size: '1.2 MB', date: '15 Jan 2022', type: 'image' },
      { name: 'Unit 05 - Floor Plan.pdf', size: '340 KB', date: '01 Dec 2019', type: 'pdf' },
      { name: 'Unit 12A - Inspection Report.pdf', size: '210 KB', date: '20 Feb 2025', type: 'pdf' },
    ]
  },
  {
    name: 'Prospects',
    count: 5,
    icon: File,
    color: 'oklch(0.58 0.1 300)',
    files: [
      { name: 'Application - P. Morrison.pdf', size: '175 KB', date: '01 Feb 2025', type: 'pdf' },
      { name: 'ID Verification - P. Morrison.pdf', size: '88 KB', date: '01 Feb 2025', type: 'pdf' },
    ]
  },
];

function FileIcon({ type }: { type: string }) {
  if (type === 'image') return <Image className="w-4 h-4 text-blue-500" />;
  if (type === 'pdf') return <FileText className="w-4 h-4 text-red-500" />;
  return <File className="w-4 h-4 text-muted-foreground" />;
}

export default function DocumentsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const category = documentCategories.find(c => c.name === activeCategory);

  return (
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Documents</h1>
          <p className="page-subtitle">{documentCategories.reduce((s, c) => s + c.count, 0)} files across {documentCategories.length} categories</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => toast.info('Upload document coming soon.')}>
          <Upload className="w-3.5 h-3.5" /> Upload
        </Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input placeholder="Search documents..." className="pl-8 h-8 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {!activeCategory ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {documentCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className="bg-card border border-border rounded-lg p-5 text-left hover:border-primary/40 transition-colors group">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: `${cat.color}/0.12` }}>
                  <Icon className="w-5 h-5" style={{ color: cat.color }} />
                </div>
                <div className="font-semibold text-sm" style={{ fontFamily: 'Sora, sans-serif' }}>{cat.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{cat.count} files</div>
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setActiveCategory(null)} className="text-sm text-muted-foreground hover:text-foreground">Documents</button>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium">{activeCategory}</span>
          </div>

          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th className="hidden md:table-cell">Size</th>
                  <th className="hidden md:table-cell">Date</th>
                  <th className="w-24">Actions</th>
                </tr>
              </thead>
              <tbody>
                {category?.files.map((file, i) => (
                  <tr key={i}>
                    <td>
                      <div className="flex items-center gap-2">
                        <FileIcon type={file.type} />
                        <span className="text-sm font-medium">{file.name}</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell text-sm text-muted-foreground">{file.size}</td>
                    <td className="hidden md:table-cell text-sm text-muted-foreground">{file.date}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => toast.info('Preview coming soon.')}><Eye className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => toast.info('Download coming soon.')}><Download className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
