'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Clock, CheckCircle, XCircle, Play } from 'lucide-react';

interface Execution {
  id: string;
  startedAt: string;
  completedAt?: string;
  status: string;
  duration?: number;
  error?: string;
  logs: string;
}

export default function FlowHistoryPage() {
  const params = useParams();
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(null);

  useEffect(() => {
    loadExecutions();
    const interval = setInterval(loadExecutions, 5000);
    return () => clearInterval(interval);
  }, [params.flowId]);

  const loadExecutions = async () => {
    const res = await fetch(`http://localhost:3001/api/flows/${params.flowId}/executions`);
    const data = await res.json();
    setExecutions(data);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-success" size={20} />;
      case 'failed':
        return <XCircle className="text-danger" size={20} />;
      case 'running':
        return <Play className="text-warning animate-pulse" size={20} />;
      default:
        return <Clock className="text-text-muted" size={20} />;
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Flow Execution History</h1>

      <div className="flex gap-6">
        <div className="w-96 space-y-2">
          {executions.length === 0 ? (
            <div className="text-center py-10 text-text-muted">
              No executions yet
            </div>
          ) : (
            executions.map(execution => (
              <div
                key={execution.id}
                onClick={() => setSelectedExecution(execution)}
                className={`p-4 bg-surface rounded-lg cursor-pointer hover:bg-surface-2 ${
                  selectedExecution?.id === execution.id ? 'ring-2 ring-accent' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  {getStatusIcon(execution.status)}
                  <span className="text-xs text-text-muted">
                    {new Date(execution.startedAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm">
                  <div className="capitalize">{execution.status}</div>
                  {execution.duration && (
                    <div className="text-text-muted">{execution.duration}ms</div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex-1 bg-surface rounded-lg p-6">
          {selectedExecution ? (
            <div>
              <div className="flex items-center gap-3 mb-6">
                {getStatusIcon(selectedExecution.status)}
                <div>
                  <h2 className="text-lg font-semibold capitalize">{selectedExecution.status}</h2>
                  <div className="text-sm text-text-muted">
                    {new Date(selectedExecution.startedAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {selectedExecution.duration && (
                <div className="mb-4">
                  <span className="text-sm text-text-muted">Duration: </span>
                  <span className="font-mono">{selectedExecution.duration}ms</span>
                </div>
              )}

              {selectedExecution.error && (
                <div className="mb-4 p-3 bg-danger/10 border border-danger rounded-lg">
                  <div className="text-sm font-semibold text-danger mb-1">Error</div>
                  <div className="text-sm">{selectedExecution.error}</div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-3">Execution Logs</h3>
                <div className="bg-surface-2 rounded-lg p-4 font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
                  {JSON.parse(selectedExecution.logs || '[]').map((log: string, i: number) => (
                    <div key={i} className="text-text-muted">{log}</div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-text-muted">
              Select an execution to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
