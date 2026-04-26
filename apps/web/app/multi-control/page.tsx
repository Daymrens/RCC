'use client';

import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { Play, Square, Send } from 'lucide-react';

export default function MultiControlPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set());
  const [command, setCommand] = useState('');
  const [logs, setLogs] = useState<Record<string, string[]>>({});

  useEffect(() => {
    loadDevices();

    socket.on('device:data', (data) => {
      setLogs(prev => ({
        ...prev,
        [data.deviceId]: [...(prev[data.deviceId] || []), `← ${data.data}`].slice(-10)
      }));
    });

    return () => {
      socket.off('device:data');
    };
  }, []);

  const loadDevices = async () => {
    const res = await fetch('http://localhost:3001/api/devices');
    const data = await res.json();
    setDevices(data);
  };

  const toggleDevice = (deviceId: string) => {
    const newSelected = new Set(selectedDevices);
    if (newSelected.has(deviceId)) {
      newSelected.delete(deviceId);
    } else {
      newSelected.add(deviceId);
    }
    setSelectedDevices(newSelected);
  };

  const selectAll = () => {
    setSelectedDevices(new Set(devices.map(d => d.id)));
  };

  const deselectAll = () => {
    setSelectedDevices(new Set());
  };

  const sendToAll = () => {
    if (!command.trim()) return;

    selectedDevices.forEach(deviceId => {
      socket.emit('device:send', { deviceId, command });
      setLogs(prev => ({
        ...prev,
        [deviceId]: [...(prev[deviceId] || []), `→ ${command}`].slice(-10)
      }));
    });

    setCommand('');
  };

  const connectAll = async () => {
    for (const deviceId of selectedDevices) {
      await fetch(`http://localhost:3001/api/devices/${deviceId}/connect`, {
        method: 'POST'
      });
    }
    loadDevices();
  };

  const disconnectAll = async () => {
    for (const deviceId of selectedDevices) {
      await fetch(`http://localhost:3001/api/devices/${deviceId}/disconnect`, {
        method: 'POST'
      });
    }
    loadDevices();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Multi-Device Control</h1>

      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={selectAll}
          className="px-3 py-1 bg-surface-2 rounded hover:bg-surface-3 text-sm"
        >
          Select All
        </button>
        <button
          onClick={deselectAll}
          className="px-3 py-1 bg-surface-2 rounded hover:bg-surface-3 text-sm"
        >
          Deselect All
        </button>
        <div className="flex-1" />
        <span className="text-sm text-text-muted">
          {selectedDevices.size} device{selectedDevices.size !== 1 ? 's' : ''} selected
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {devices.map(device => (
          <div
            key={device.id}
            onClick={() => toggleDevice(device.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
              selectedDevices.has(device.id)
                ? 'border-accent bg-accent-dim'
                : 'border-border bg-surface hover:bg-surface-2'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{device.name}</h3>
              <div className={`w-3 h-3 rounded-full ${
                device.status === 'connected' ? 'bg-success' : 'bg-text-dim'
              }`} />
            </div>
            <div className="text-xs text-text-muted mb-3">
              {device.type} · {device.status}
            </div>
            
            {logs[device.id] && logs[device.id].length > 0 && (
              <div className="bg-surface-2 rounded p-2 font-mono text-xs space-y-0.5 max-h-20 overflow-y-auto">
                {logs[device.id].map((log, i) => (
                  <div key={i} className="text-text-muted truncate">{log}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedDevices.size > 0 && (
        <div className="bg-surface rounded-lg p-6">
          <h2 className="font-semibold mb-4">Control Panel</h2>
          
          <div className="flex gap-2 mb-4">
            <button
              onClick={connectAll}
              className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-green-600"
            >
              <Play size={16} />
              Connect All
            </button>
            <button
              onClick={disconnectAll}
              className="flex items-center gap-2 px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-600"
            >
              <Square size={16} />
              Disconnect All
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={command}
              onChange={e => setCommand(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendToAll()}
              placeholder="Enter command to send to all selected devices..."
              className="flex-1 px-3 py-2 bg-surface-2 border border-border rounded-lg"
            />
            <button
              onClick={sendToAll}
              className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
            >
              <Send size={16} />
              Send to All
            </button>
          </div>

          <div className="mt-4 text-sm text-text-muted">
            Command will be sent to {selectedDevices.size} device{selectedDevices.size !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
}
