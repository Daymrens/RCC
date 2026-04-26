'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Plus, Play, Square } from 'lucide-react';
import Link from 'next/link';

export default function FlowsPage() {
  const params = useParams();
  const [flows, setFlows] = useState<any[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/devices/${params.id}/flows`)
      .then(res => res.json())
      .then(setFlows);
  }, [params.id]);

  const handleToggle = async (flowId: string, isActive: boolean) => {
    const action = isActive ? 'stop' : 'start';
    await fetch(`http://localhost:3001/api/flows/${flowId}/${action}`, { method: 'POST' });
    setFlows(flows.map(f => f.id === flowId ? { ...f, isActive: !isActive } : f));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Flows</h1>
        <Link
          href={`/devices/${params.id}/flows/new`}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={20} />
          New Flow
        </Link>
      </div>

      {flows.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          No flows yet
        </div>
      ) : (
        <div className="space-y-2">
          {flows.map(flow => (
            <div key={flow.id} className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <Link href={`/devices/${params.id}/flows/${flow.id}`} className="flex-1">
                <h3 className="font-semibold">{flow.name}</h3>
                <p className="text-sm text-text-muted">
                  {flow.isActive ? '● Active' : '○ Inactive'}
                </p>
              </Link>
              <button
                onClick={() => handleToggle(flow.id, flow.isActive)}
                className={`p-2 rounded ${
                  flow.isActive ? 'bg-danger hover:bg-red-600' : 'bg-success hover:bg-green-600'
                }`}
              >
                {flow.isActive ? <Square size={16} /> : <Play size={16} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
