'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Plus, Play } from 'lucide-react';
import Link from 'next/link';

export default function FunctionsPage() {
  const params = useParams();
  const [functions, setFunctions] = useState<any[]>([]);

  useEffect(() => {
    fetch(`http://localhost:3001/api/devices/${params.id}/functions`)
      .then(res => res.json())
      .then(setFunctions);
  }, [params.id]);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Functions</h1>
        <Link
          href={`/devices/${params.id}/functions/new`}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={20} />
          New Function
        </Link>
      </div>

      {functions.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          No functions yet
        </div>
      ) : (
        <div className="space-y-2">
          {functions.map(func => (
            <div key={func.id} className="flex items-center justify-between p-4 bg-surface rounded-lg">
              <div>
                <h3 className="font-semibold">{func.name}</h3>
                <p className="text-sm text-text-muted">{func.type} · {func.trigger}</p>
              </div>
              <button className="p-2 hover:bg-surface-2 rounded">
                <Play size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
