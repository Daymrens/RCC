import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';

export function useFlow(flowId: string) {
  const [logs, setLogs] = useState<any[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleLog = (log: any) => {
      if (log.flowId === flowId) {
        setLogs(prev => [...prev, log].slice(-100));
      }
    };

    socket.on('flow:log', handleLog);

    return () => {
      socket.off('flow:log', handleLog);
    };
  }, [flowId]);

  const start = async () => {
    await fetch(`http://localhost:3001/api/flows/${flowId}/start`, { method: 'POST' });
    setIsActive(true);
  };

  const stop = async () => {
    await fetch(`http://localhost:3001/api/flows/${flowId}/stop`, { method: 'POST' });
    setIsActive(false);
  };

  return { logs, isActive, start, stop };
}
