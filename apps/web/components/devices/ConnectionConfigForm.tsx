'use client';

import { useState, useEffect } from 'react';

interface ConnectionConfigFormProps {
  type: 'serial' | 'ble';
  config: any;
  onChange: (config: any) => void;
}

export default function ConnectionConfigForm({ type, config, onChange }: ConnectionConfigFormProps) {
  const [ports, setPorts] = useState<any[]>([]);

  useEffect(() => {
    if (type === 'serial') {
      fetch('http://localhost:3001/api/serial/ports')
        .then(res => res.json())
        .then(setPorts)
        .catch(() => setPorts([]));
    }
  }, [type]);

  if (type === 'serial') {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-text-muted mb-2">Port</label>
          <select
            value={config.port || ''}
            onChange={e => onChange({ ...config, port: e.target.value })}
            className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
          >
            <option value="">Select port...</option>
            {ports.map(port => (
              <option key={port.path} value={port.path}>
                {port.path} {port.manufacturer && `(${port.manufacturer})`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-text-muted mb-2">Baud Rate</label>
          <select
            value={config.baudRate || 115200}
            onChange={e => onChange({ ...config, baudRate: Number(e.target.value) })}
            className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
          >
            <option value={9600}>9600</option>
            <option value={19200}>19200</option>
            <option value={38400}>38400</option>
            <option value={57600}>57600</option>
            <option value={115200}>115200</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs text-text-muted mb-1">Data Bits</label>
            <select
              value={config.dataBits || 8}
              onChange={e => onChange({ ...config, dataBits: Number(e.target.value) })}
              className="w-full px-2 py-1 bg-surface-2 border border-border rounded text-sm"
            >
              <option value={8}>8</option>
              <option value={7}>7</option>
              <option value={6}>6</option>
              <option value={5}>5</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-text-muted mb-1">Parity</label>
            <select
              value={config.parity || 'none'}
              onChange={e => onChange({ ...config, parity: e.target.value })}
              className="w-full px-2 py-1 bg-surface-2 border border-border rounded text-sm"
            >
              <option value="none">None</option>
              <option value="even">Even</option>
              <option value="odd">Odd</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-text-muted mb-1">Stop Bits</label>
            <select
              value={config.stopBits || 1}
              onChange={e => onChange({ ...config, stopBits: Number(e.target.value) })}
              className="w-full px-2 py-1 bg-surface-2 border border-border rounded text-sm"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  // BLE config
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-text-muted mb-2">Device Name</label>
        <input
          type="text"
          value={config.deviceName || ''}
          onChange={e => onChange({ ...config, deviceName: e.target.value })}
          className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
          placeholder="BLE Device"
        />
      </div>

      <div>
        <label className="block text-sm text-text-muted mb-2">Service UUID</label>
        <input
          type="text"
          value={config.serviceUUID || ''}
          onChange={e => onChange({ ...config, serviceUUID: e.target.value })}
          className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg font-mono text-sm"
          placeholder="0000ffe0-0000-1000-8000-00805f9b34fb"
        />
      </div>

      <div>
        <label className="block text-sm text-text-muted mb-2">Write Characteristic UUID</label>
        <input
          type="text"
          value={config.writeCharUUID || ''}
          onChange={e => onChange({ ...config, writeCharUUID: e.target.value })}
          className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg font-mono text-sm"
          placeholder="0000ffe1-0000-1000-8000-00805f9b34fb"
        />
      </div>

      <div>
        <label className="block text-sm text-text-muted mb-2">Notify Characteristic UUID</label>
        <input
          type="text"
          value={config.notifyCharUUID || ''}
          onChange={e => onChange({ ...config, notifyCharUUID: e.target.value })}
          className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg font-mono text-sm"
          placeholder="0000ffe1-0000-1000-8000-00805f9b34fb"
        />
      </div>

      <div>
        <label className="block text-sm text-text-muted mb-2">Protocol</label>
        <select
          value={config.protocol || 'uart'}
          onChange={e => onChange({ ...config, protocol: e.target.value })}
          className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
        >
          <option value="uart">UART</option>
          <option value="custom">Custom GATT</option>
        </select>
      </div>
    </div>
  );
}
