'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import ConnectionConfigForm from './ConnectionConfigForm';

export default function AddDeviceDialog({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<'serial' | 'ble'>('serial');
  const [name, setName] = useState('');
  const [config, setConfig] = useState<any>({});

  const handleSave = async () => {
    const device = {
      name,
      type,
      connectionConfig: config,
      status: 'disconnected'
    };

    await fetch('http://localhost:3001/api/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(device)
    });

    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add Device</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text">
            <X size={20} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  s === step
                    ? 'bg-accent text-white'
                    : s < step
                    ? 'bg-success text-white'
                    : 'bg-surface-3 text-text-muted'
                }`}
              >
                {s}
              </div>
              {s < 3 && <div className="w-8 h-0.5 bg-surface-3" />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <p className="text-text-muted mb-4">Choose connection type:</p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setType('serial')}
                className={`p-6 rounded-lg border-2 ${
                  type === 'serial' ? 'border-accent bg-accent-dim' : 'border-border'
                }`}
              >
                <div className="text-2xl mb-2">🔌</div>
                <div className="font-semibold">Serial (USB)</div>
                <div className="text-xs text-text-muted mt-1">Direct cable</div>
              </button>
              <button
                onClick={() => setType('ble')}
                className={`p-6 rounded-lg border-2 ${
                  type === 'ble' ? 'border-accent bg-accent-dim' : 'border-border'
                }`}
              >
                <div className="text-2xl mb-2">📡</div>
                <div className="font-semibold">Bluetooth BLE</div>
                <div className="text-xs text-text-muted mt-1">Wireless</div>
              </button>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <ConnectionConfigForm type={type} config={config} onChange={setConfig} />
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2 bg-surface-2 rounded-lg hover:bg-surface-3"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-text-muted mb-2">Device Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
                  placeholder="My Device"
                />
              </div>

              <div className="bg-surface-2 rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-2">Summary</h3>
                <div className="text-xs text-text-muted space-y-1">
                  <div>Type: {type === 'serial' ? 'Serial (USB)' : 'Bluetooth BLE'}</div>
                  {type === 'serial' && config.port && (
                    <>
                      <div>Port: {config.port}</div>
                      <div>Baud Rate: {config.baudRate || 115200}</div>
                    </>
                  )}
                  {type === 'ble' && config.deviceName && (
                    <div>Device: {config.deviceName}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-2 bg-surface-2 rounded-lg hover:bg-surface-3"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={!name}
                className="flex-1 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Save Device
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
