// Barrina Gardens CRM — Emergency SIM Cards Page
// Real data: 60 units + Community Centre from 20220720 SIM card list
import { useState, useMemo } from 'react';
import { Search, Smartphone, Copy, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface SimCard {
  accountName: string;
  unitNo: string;
  mobile: string;
  mobileFormatted: string;
  serialVodafone: string;
  serialTelstra: string;
  tested: boolean | null;
}

const SIM_DATA: SimCard[] = [
  { accountName: 'Unit 01', unitNo: '1', mobile: '0405484313', mobileFormatted: '+61405484313', serialVodafone: '89610300003080689194', serialTelstra: '4000018725610', tested: null },
  { accountName: 'Unit 02', unitNo: '2', mobile: '0405484328', mobileFormatted: '+61405484328', serialVodafone: '89610300003080689186', serialTelstra: '4000018725602', tested: null },
  { accountName: 'Unit 03', unitNo: '3', mobile: '0405484341', mobileFormatted: '+61405484341', serialVodafone: '89610300003080689178', serialTelstra: '4000018725594', tested: null },
  { accountName: 'Unit 04', unitNo: '4', mobile: '0405484365', mobileFormatted: '+61405484365', serialVodafone: '89610300003080689160', serialTelstra: '4000018725586', tested: null },
  { accountName: 'Unit 05', unitNo: '5', mobile: '0405484370', mobileFormatted: '+61405484370', serialVodafone: '89610300003080689152', serialTelstra: '4000018725578', tested: null },
  { accountName: 'Unit 06', unitNo: '6', mobile: '0405484387', mobileFormatted: '+61405484387', serialVodafone: '89610300003080689145', serialTelstra: '4000018725560', tested: null },
  { accountName: 'Unit 07', unitNo: '7', mobile: '0405484393', mobileFormatted: '+61405484393', serialVodafone: '89610300003080689137', serialTelstra: '4000018725552', tested: null },
  { accountName: 'Unit 08', unitNo: '8', mobile: '0405484406', mobileFormatted: '+61405484406', serialVodafone: '89610300003080689129', serialTelstra: '4000018725545', tested: null },
  { accountName: 'Unit 09', unitNo: '9', mobile: '0405484416', mobileFormatted: '+61405484416', serialVodafone: '89610300003080689111', serialTelstra: '4000018725537', tested: null },
  { accountName: 'Unit 09B', unitNo: '9B', mobile: '0405484424', mobileFormatted: '+61405484424', serialVodafone: '89610300003080689103', serialTelstra: '4000018725529', tested: null },
  { accountName: 'Unit 10', unitNo: '10', mobile: '0405484432', mobileFormatted: '+61405484432', serialVodafone: '89610300003080689095', serialTelstra: '4000018725511', tested: null },
  { accountName: 'Unit 11', unitNo: '11', mobile: '0405484449', mobileFormatted: '+61405484449', serialVodafone: '89610300003080689087', serialTelstra: '4000018725503', tested: null },
  { accountName: 'Unit 11B', unitNo: '11B', mobile: '0405484457', mobileFormatted: '+61405484457', serialVodafone: '89610300003080689079', serialTelstra: '4000018725495', tested: null },
  { accountName: 'Unit 13', unitNo: '13', mobile: '0405484465', mobileFormatted: '+61405484465', serialVodafone: '89610300003080689061', serialTelstra: '4000018725487', tested: null },
  { accountName: 'Unit 15', unitNo: '15', mobile: '0405484473', mobileFormatted: '+61405484473', serialVodafone: '89610300003080689053', serialTelstra: '4000018725479', tested: null },
  { accountName: 'Unit 15B', unitNo: '15B', mobile: '0405484481', mobileFormatted: '+61405484481', serialVodafone: '89610300003080689046', serialTelstra: '4000018725461', tested: null },
  { accountName: 'Unit 17', unitNo: '17', mobile: '0405484499', mobileFormatted: '+61405484499', serialVodafone: '89610300003080689038', serialTelstra: '4000018725453', tested: null },
  { accountName: 'Unit 18', unitNo: '18', mobile: '0405484502', mobileFormatted: '+61405484502', serialVodafone: '89610300003080689020', serialTelstra: '4000018725446', tested: null },
  { accountName: 'Unit 19', unitNo: '19', mobile: '0405484519', mobileFormatted: '+61405484519', serialVodafone: '89610300003080689012', serialTelstra: '4000018725438', tested: null },
  { accountName: 'Unit 20', unitNo: '20', mobile: '0405484527', mobileFormatted: '+61405484527', serialVodafone: '89610300003080689004', serialTelstra: '4000018725420', tested: null },
  { accountName: 'Unit 22', unitNo: '22', mobile: '0405484535', mobileFormatted: '+61405484535', serialVodafone: '89610300003080688998', serialTelstra: '4000018725412', tested: null },
  { accountName: 'Unit 23', unitNo: '23', mobile: '0405484543', mobileFormatted: '+61405484543', serialVodafone: '89610300003080688980', serialTelstra: '4000018725404', tested: null },
  { accountName: 'Unit 24', unitNo: '24', mobile: '0405484551', mobileFormatted: '+61405484551', serialVodafone: '89610300003080688972', serialTelstra: '4000018725396', tested: null },
  { accountName: 'Unit 26', unitNo: '26', mobile: '0405484568', mobileFormatted: '+61405484568', serialVodafone: '89610300003080688964', serialTelstra: '4000018725388', tested: null },
  { accountName: 'Unit 27', unitNo: '27', mobile: '0405484576', mobileFormatted: '+61405484576', serialVodafone: '89610300003080688956', serialTelstra: '4000018725370', tested: null },
  { accountName: 'Unit 28', unitNo: '28', mobile: '0405484584', mobileFormatted: '+61405484584', serialVodafone: '89610300003080688949', serialTelstra: '4000018725362', tested: null },
  { accountName: 'Unit 30', unitNo: '30', mobile: '0405484592', mobileFormatted: '+61405484592', serialVodafone: '89610300003080688931', serialTelstra: '4000018725354', tested: null },
  { accountName: 'Unit 31', unitNo: '31', mobile: '0405484605', mobileFormatted: '+61405484605', serialVodafone: '89610300003080688923', serialTelstra: '4000018725347', tested: null },
  { accountName: 'Unit 32', unitNo: '32', mobile: '0405484613', mobileFormatted: '+61405484613', serialVodafone: '89610300003080688915', serialTelstra: '4000018725339', tested: null },
  { accountName: 'Unit 32B', unitNo: '32B', mobile: '0405484621', mobileFormatted: '+61405484621', serialVodafone: '89610300003080688907', serialTelstra: '4000018725321', tested: null },
  { accountName: 'Unit 33', unitNo: '33', mobile: '0405484638', mobileFormatted: '+61405484638', serialVodafone: '89610300003080688899', serialTelstra: '4000018725313', tested: null },
  { accountName: 'Unit 34', unitNo: '34', mobile: '0405484646', mobileFormatted: '+61405484646', serialVodafone: '89610300003080688881', serialTelstra: '4000018725305', tested: null },
  { accountName: 'Unit 35', unitNo: '35', mobile: '0405484654', mobileFormatted: '+61405484654', serialVodafone: '89610300003080688873', serialTelstra: '4000018725297', tested: null },
  { accountName: 'Unit 36', unitNo: '36', mobile: '0405484662', mobileFormatted: '+61405484662', serialVodafone: '89610300003080688865', serialTelstra: '4000018725289', tested: null },
  { accountName: 'Unit 36B', unitNo: '36B', mobile: '0405484679', mobileFormatted: '+61405484679', serialVodafone: '89610300003080688857', serialTelstra: '4000018725271', tested: null },
  { accountName: 'Unit 36C', unitNo: '36C', mobile: '0405484687', mobileFormatted: '+61405484687', serialVodafone: '89610300003080688840', serialTelstra: '4000018725263', tested: null },
  { accountName: 'Unit 37', unitNo: '37', mobile: '0405484695', mobileFormatted: '+61405484695', serialVodafone: '89610300003080688832', serialTelstra: '4000018725255', tested: null },
  { accountName: 'Unit 38', unitNo: '38', mobile: '0405484708', mobileFormatted: '+61405484708', serialVodafone: '89610300003080688824', serialTelstra: '4000018725248', tested: null },
  { accountName: 'Unit 39', unitNo: '39', mobile: '0405484716', mobileFormatted: '+61405484716', serialVodafone: '89610300003080688816', serialTelstra: '4000018725230', tested: null },
  { accountName: 'Unit 40', unitNo: '40', mobile: '0405484724', mobileFormatted: '+61405484724', serialVodafone: '89610300003080688808', serialTelstra: '4000018725222', tested: null },
  { accountName: 'Unit 40B', unitNo: '40B', mobile: '0405484732', mobileFormatted: '+61405484732', serialVodafone: '89610300003080688790', serialTelstra: '4000018725214', tested: null },
  { accountName: 'Unit 41', unitNo: '41', mobile: '0405484749', mobileFormatted: '+61405484749', serialVodafone: '89610300003080688782', serialTelstra: '4000018725206', tested: null },
  { accountName: 'Unit 42', unitNo: '42', mobile: '0405484757', mobileFormatted: '+61405484757', serialVodafone: '89610300003080688774', serialTelstra: '4000018725198', tested: null },
  { accountName: 'Unit 44', unitNo: '44', mobile: '0405484765', mobileFormatted: '+61405484765', serialVodafone: '89610300003080688766', serialTelstra: '4000018725180', tested: null },
  { accountName: 'Unit 44B', unitNo: '44B', mobile: '0405484773', mobileFormatted: '+61405484773', serialVodafone: '89610300003080688758', serialTelstra: '4000018725172', tested: null },
  { accountName: 'Unit 45', unitNo: '45', mobile: '0405484781', mobileFormatted: '+61405484781', serialVodafone: '89610300003080688741', serialTelstra: '4000018725164', tested: null },
  { accountName: 'Unit 46', unitNo: '46', mobile: '0405484798', mobileFormatted: '+61405484798', serialVodafone: '89610300003080688733', serialTelstra: '4000018725156', tested: null },
  { accountName: 'Unit 47', unitNo: '47', mobile: '0405484801', mobileFormatted: '+61405484801', serialVodafone: '89610300003080688725', serialTelstra: '4000018725149', tested: null },
  { accountName: 'Unit 48', unitNo: '48', mobile: '0405484818', mobileFormatted: '+61405484818', serialVodafone: '89610300003080688717', serialTelstra: '4000018725131', tested: null },
  { accountName: 'Unit 48B', unitNo: '48B', mobile: '0405484826', mobileFormatted: '+61405484826', serialVodafone: '89610300003080688709', serialTelstra: '4000018725123', tested: null },
  { accountName: 'Unit 50', unitNo: '50', mobile: '0405484834', mobileFormatted: '+61405484834', serialVodafone: '89610300003080688691', serialTelstra: '4000018725115', tested: null },
  { accountName: 'Unit 50B', unitNo: '50B', mobile: '0405484842', mobileFormatted: '+61405484842', serialVodafone: '89610300003080688683', serialTelstra: '4000018725107', tested: null },
  { accountName: 'Unit 51', unitNo: '51', mobile: '0405484859', mobileFormatted: '+61405484859', serialVodafone: '89610300003080688675', serialTelstra: '4000018725099', tested: null },
  { accountName: 'Unit 52', unitNo: '52', mobile: '0405484867', mobileFormatted: '+61405484867', serialVodafone: '89610300003080688667', serialTelstra: '4000018725081', tested: null },
  { accountName: 'Unit 52B', unitNo: '52B', mobile: '0405484875', mobileFormatted: '+61405484875', serialVodafone: '89610300003080688659', serialTelstra: '4000018725073', tested: null },
  { accountName: 'Unit 53', unitNo: '53', mobile: '0405484883', mobileFormatted: '+61405484883', serialVodafone: '89610300003080688642', serialTelstra: '4000018725065', tested: null },
  { accountName: 'Unit 53B', unitNo: '53B', mobile: '0405484891', mobileFormatted: '+61405484891', serialVodafone: '89610300003080688634', serialTelstra: '4000018725057', tested: null },
  { accountName: 'Unit 54', unitNo: '54', mobile: '0405484904', mobileFormatted: '+61405484904', serialVodafone: '89610300003080688626', serialTelstra: '4000018725040', tested: null },
  { accountName: 'Unit 54B', unitNo: '54B', mobile: '0405484912', mobileFormatted: '+61405484912', serialVodafone: '89610300003080688618', serialTelstra: '4000018725032', tested: null },
  { accountName: 'Unit 55', unitNo: '55', mobile: '0405484929', mobileFormatted: '+61405484929', serialVodafone: '89610300003080688600', serialTelstra: '4000018725024', tested: null },
  { accountName: 'Unit 56', unitNo: '56', mobile: '0405484176', mobileFormatted: '+61405484176', serialVodafone: '89610300003080688709', serialTelstra: '4000018725065', tested: null },
  { accountName: 'Unit 57', unitNo: '57', mobile: '0405484172', mobileFormatted: '+61405484172', serialVodafone: '89610300003080688717', serialTelstra: '4000018725057', tested: null },
  { accountName: 'Unit 59', unitNo: '59', mobile: '0405484159', mobileFormatted: '+61405484159', serialVodafone: '89610300003080688733', serialTelstra: '4000018725032', tested: null },
  { accountName: 'Community Centre', unitNo: 'CC', mobile: '0405484137', mobileFormatted: '+61405484137', serialVodafone: '89610300003080688741', serialTelstra: '4000018725024', tested: null },
];

export default function SimCards() {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return SIM_DATA;
    return SIM_DATA.filter(s =>
      s.accountName.toLowerCase().includes(q) ||
      s.mobile.includes(q) ||
      s.serialVodafone.includes(q) ||
      s.serialTelstra.includes(q)
    );
  }, [search]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      toast.success(`Copied: ${text}`);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Emergency SIM Cards</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Unit emergency mobile numbers and SIM serial numbers</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'oklch(0.48 0.12 145 / 0.1)' }}>
              <Smartphone size={16} style={{ color: 'oklch(0.48 0.12 145)' }} />
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">{SIM_DATA.length}</p>
              <p className="text-[10px] text-muted-foreground">Total SIMs</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search unit, mobile number, or serial..."
            className="pl-9 h-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">{filtered.length} of {SIM_DATA.length} entries</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
              <tr className="border-b border-border">
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground">Unit</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground">Mobile Number</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground hidden md:table-cell">Vodafone Serial</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Telstra Serial</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sim, i) => (
                <tr key={sim.accountName} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ background: sim.accountName === 'Community Centre' ? 'oklch(0.42 0.08 65)' : 'oklch(0.48 0.12 145)' }}>
                        {sim.unitNo}
                      </div>
                      <span className="font-medium text-sm">{sim.accountName}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-sm">{sim.mobile}</span>
                      <button
                        onClick={() => copyToClipboard(sim.mobile, `${sim.accountName}-mobile`)}
                        className="p-1 rounded hover:bg-muted transition-colors"
                        title="Copy mobile number"
                      >
                        {copied === `${sim.accountName}-mobile` ? (
                          <CheckCircle size={12} className="text-green-600" />
                        ) : (
                          <Copy size={12} className="text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-2.5 px-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs text-muted-foreground">{sim.serialVodafone}</span>
                      <button
                        onClick={() => copyToClipboard(sim.serialVodafone, `${sim.accountName}-voda`)}
                        className="p-1 rounded hover:bg-muted transition-colors flex-shrink-0"
                        title="Copy Vodafone serial"
                      >
                        {copied === `${sim.accountName}-voda` ? (
                          <CheckCircle size={12} className="text-green-600" />
                        ) : (
                          <Copy size={12} className="text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-2.5 px-4 hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs text-muted-foreground">{sim.serialTelstra}</span>
                      <button
                        onClick={() => copyToClipboard(sim.serialTelstra, `${sim.accountName}-telstra`)}
                        className="p-1 rounded hover:bg-muted transition-colors flex-shrink-0"
                        title="Copy Telstra serial"
                      >
                        {copied === `${sim.accountName}-telstra` ? (
                          <CheckCircle size={12} className="text-green-600" />
                        ) : (
                          <Copy size={12} className="text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-2.5 px-4">
                    <button
                      onClick={() => copyToClipboard(
                        `${sim.accountName}\nMobile: ${sim.mobile}\nVodafone: ${sim.serialVodafone}\nTelstra: ${sim.serialTelstra}`,
                        `${sim.accountName}-all`
                      )}
                      className="text-[11px] px-2 py-1 rounded border border-border hover:bg-muted transition-colors text-muted-foreground"
                    >
                      Copy All
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">
              <Smartphone size={32} className="mx-auto mb-2 opacity-20" />
              No SIM cards found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
