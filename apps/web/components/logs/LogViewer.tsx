'use client';

import { useState } from 'react';
import { Download, Search } from 'lucide-react';

interface LogViewerProps {
  logs: any[];
}

export default function LogViewer({ logs }: LogViewerProps) {
  const [filter, setFilter] = useState<'all' | 'in' | 'out' | 'error'>('all');
  const [search, setSearch] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);

  const filteredLogs = logs.filter(log => {
    if (filter !== 'all' && log.direction !== filter) return false;
    if (search && !log.data.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const exportLogs = () => {
    const csv = filteredLogs
      .map(log => `${log.timestamp},${log.direction},${log.data}`)
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="bg-surface rounded-lg">
      <div className="flex items-center gap-4 p-4 border-b border-border">
        <div className="flex gap-2">
          {['all', 'in', 'out', 'error'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1 rounded text-sm ${
                filter === f ? 'bg-accent text-white' : 'bg-surface-2 hover:bg-surface-3'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search logs..."
            className="w-full pl-10 pr-3 py-1 bg-surface-2 border border-border rounded-lg text-sm"
          />
        </div>

        <button
          onClick={exportLogs}
          className="p-2 hover:bg-surface-2 rounded"
          title="Export logs"
        >
          <Download size={16} />
        </button>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={e => setAutoScroll(e.target.checked)}
            className="accent-accent"
          />
          Auto-scroll
        </label>
      </div>

      <div className="p-4 font-mono text-sm space-y-1 max-h-[600px] overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="text-center text-text-muted py-10">No logs</div>
        ) : (
          filteredLogs.map((log, i) => (
            <div key={i} className="flex gap-4 hover:bg-surface-2 px-2 py-1 rounded">
              <span className="text-text-dim text-xs">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className={log.direction === 'out' ? 'text-blue-400' : 'text-green-400'}>
                {log.direction === 'out' ? '→' : '←'}
              </span>
              <span className="flex-1 break-all">{log.data}</span>
            </div>
          ))
        )}
      </div>

      <div className="px-4 py-2 border-t border-border text-xs text-text-muted text-right">
        Showing {filteredLogs.length} / {logs.length}
      </div>
    </div>
  );
}
