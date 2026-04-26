'use client';

import { X, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface OutputConsoleProps {
  output: string[];
  onClear: () => void;
}

export default function OutputConsole({ output, onClear }: OutputConsoleProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(output.join('\n'));
    toast.success('Copied to clipboard');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="font-semibold text-sm">Output Console</h3>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-surface-2 rounded"
            title="Copy output"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={onClear}
            className="p-1 hover:bg-surface-2 rounded"
            title="Clear console"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1">
        {output.length === 0 ? (
          <div className="text-text-muted text-center py-10">No output</div>
        ) : (
          output.map((line, i) => (
            <div
              key={i}
              className={
                line.startsWith('Error:')
                  ? 'text-danger'
                  : line.startsWith('Sent:')
                  ? 'text-blue-400'
                  : line.startsWith('Received:')
                  ? 'text-green-400'
                  : 'text-text-muted'
              }
            >
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
