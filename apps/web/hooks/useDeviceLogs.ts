import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';

export function useDeviceLogs(deviceId: string) {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const handleLog = (log: any) => {
      if (log.deviceId === deviceId) {
        setLogs(prev => [...prev, log].slice(-2000));
      }
    };

    socket.on('device:log', handleLog);
    socket.on('device:data', handleLog);

    return () => {
      socket.off('device:log', handleLog);
      socket.off('device:data', handleLog);
    };
  }, [deviceId]);

  return logs;
}
