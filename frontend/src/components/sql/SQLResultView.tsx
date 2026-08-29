import React, { useState } from 'react';
import { Check, Code, Copy, Database, Table } from 'lucide-react';

interface SQLResultViewProps {
  query?: string;
  data?: Record<string, any>[];
}

export const SQLResultView: React.FC<SQLResultViewProps> = ({ query, data }) => {
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [copiedTable, setCopiedTable] = useState(false);
  const [showRawSql, setShowRawSql] = useState(true);

  if (!query && (!data || data.length === 0)) return null;

  const handleCopyQuery = () => {
    if (query) {
      navigator.clipboard.writeText(query);
      setCopiedQuery(true);
      setTimeout(() => setCopiedQuery(false), 2000);
    }
  };

  const handleCopyTable = () => {
    if (data && data.length > 0) {
      const headers = Object.keys(data[0]).join('\t');
      const rows = data.map(row => Object.values(row).join('\t')).join('\n');
      navigator.clipboard.writeText(`${headers}\n${rows}`);
      setCopiedTable(true);
      setTimeout(() => setCopiedTable(false), 2000);
    }
  };

  // Derive headers from data if available
  const headers = data && data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="my-3 rounded-xl bg-slate-900/90 border border-emerald-900/40 overflow-hidden text-xs shadow-lg">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-emerald-950/40 border-b border-emerald-900/30">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-emerald-200">PostgreSQL Query Result</span>
        </div>
        {query && (
          <button
            onClick={() => setShowRawSql(!showRawSql)}
            className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800/60 transition-colors"
          >
            <Code className="w-3 h-3 text-emerald-400" />
            {showRawSql ? 'Hide SQL' : 'View SQL'}
          </button>
        )}
      </div>

      {/* SQL Query Snippet */}
      {query && showRawSql && (
        <div className="p-3 bg-slate-950 border-b border-slate-800/80 relative group font-mono text-[11px]">
          <div className="flex items-center justify-between text-slate-500 mb-1 font-sans text-[10px]">
            <span>GENERATED SQL</span>
            <button
              onClick={handleCopyQuery}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {copiedQuery ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedQuery ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="text-emerald-300 whitespace-pre-wrap break-words">{query}</pre>
        </div>
      )}

      {/* Tabular Data View */}
      {data && data.length > 0 ? (
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
              <Table className="w-3.5 h-3.5 text-emerald-400" />
              {data.length} row(s) returned
            </span>
            <button
              onClick={handleCopyTable}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            >
              {copiedTable ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedTable ? 'Copied TSV' : 'Copy Data'}</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-slate-300 font-semibold border-b border-slate-800">
                  {headers.map((h, i) => (
                    <th key={i} className="py-2 px-3 border-r border-slate-800/60 last:border-r-0 uppercase tracking-wider text-[10px]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {data.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-800/30 transition-colors font-mono text-slate-300">
                    {headers.map((h, cIdx) => (
                      <td key={cIdx} className="py-1.5 px-3 border-r border-slate-800/40 last:border-r-0 whitespace-nowrap">
                        {String(row[h] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
};
