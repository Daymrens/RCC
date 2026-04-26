import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';

export function useDevice(deviceId: string) {
  const [device, setDevice] = useState<any>(null);
  const [status, setStatus] = useState<string>('disconnected');

  useEffect(() => {
    fetch(`http://localhost:3001/api/devices/${deviceId}`)
      .then(res => res.json())
      .then(setDevice);

    const handleStatus = (data: any) => {
      if (data.deviceId === deviceId) {
        setStatus(data.status);
      }
    };

    socket.on('device:status', handleStatus);

    return () => {
      socket.off('device:status', handleStatus);
    };
  }, [deviceId]);

  const connect = async () => {
    await fetch(`http://localhost:3001/api/devices/${deviceId}/connect`, {
      method: 'POST'
    });
  };

  const disconnect = async () => {
    await fetch(`http://localhost:3001/api/devices/${deviceId}/disconnect`, {
      method: 'POST'
    });
  };

  const send = async (command: string) => {
    socket.emit('device:send', { deviceId, command });
  };

  return { device, status, connect, disconnect, send };
}
