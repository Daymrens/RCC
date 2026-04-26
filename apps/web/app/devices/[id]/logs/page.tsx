'use client';

import { useParams } from 'next/navigation';
import { useDeviceLogs } from '@/hooks/useDeviceLogs';
import LogViewer from '@/components/logs/LogViewer';

export default function LogsPage() {
  const params = useParams();
  const logs = useDeviceLogs(params.id as string);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Logs</h1>
      <LogViewer logs={logs} />
    </div>
  );
}
