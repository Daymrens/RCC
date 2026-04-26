'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface AddWidgetDialogProps {
  dashboardId: string;
  onClose: () => void;
  onAdd: (widget: any) => void;
}

export default function AddWidgetDialog({ dashboardId, onClose, onAdd }: AddWidgetDialogProps) {
  const [type, setType] = useState<string>('button');
  const [label, setLabel] = useState('');
  const [command, setCommand] = useState('');
  const [config, setConfig] = useState<any>({});

  const widgetTypes = [
    { id: 'button', name: 'Button', icon: '🔘' },
    { id: 'slider', name: 'Slider', icon: '🎚️' },
    { id: 'toggle', name: 'Toggle', icon: '🔄' },
    { id: 'gauge', name: 'Gauge', icon: '📊' },
    { id: 'display', name: 'Display', icon: '📺' },
    { id: 'joystick', name: 'Joystick', icon: '🕹️' }
  ];

  const handleSave = async () => {
    const widget = {
      dashboardId,
      type,
      label,
      command,
      config,
      position: { x: 0, y: 0, w: 2, h: 2 }
    };

    await fetch(`http://localhost:3001/api/dashboards/${dashboardId}/widgets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(widget)
    });

    onAdd(widget);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add Widget</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-muted mb-2">Widget Type</label>
            <div className="grid grid-cols-3 gap-2">
              {widgetTypes.map(wt => (
                <button
                  key={wt.id}
                  onClick={() => setType(wt.id)}
                  className={`p-3 rounded-lg border-2 text-center ${
                    type === wt.id ? 'border-accent bg-accent-dim' : 'border-border'
                  }`}
                >
                  <div className="text-2xl mb-1">{wt.icon}</div>
                  <div className="text-xs">{wt.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-2">Label</label>
            <input
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value)}
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
              placeholder="Widget label"
            />
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-2">Command</label>
            <input
              type="text"
              value={command}
              onChange={e => setCommand(e.target.value)}
              className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
              placeholder="Command to send"
            />
          </div>

          {type === 'slider' && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-text-muted mb-1">Min</label>
                  <input
                    type="number"
                    value={config.min || 0}
                    onChange={e => setConfig({ ...config, min: Number(e.target.value) })}
                    className="w-full px-2 py-1 bg-surface-2 border border-border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">Max</label>
                  <input
                    type="number"
                    value={config.max || 100}
                    onChange={e => setConfig({ ...config, max: Number(e.target.value) })}
                    className="w-full px-2 py-1 bg-surface-2 border border-border rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1">Step</label>
                  <input
                    type="number"
                    value={config.step || 1}
                    onChange={e => setConfig({ ...config, step: Number(e.target.value) })}
                    className="w-full px-2 py-1 bg-surface-2 border border-border rounded text-sm"
                  />
                </div>
              </div>
            </>
          )}

          {type === 'toggle' && (
            <>
              <div>
                <label className="block text-sm text-text-muted mb-2">On Command</label>
                <input
                  type="text"
                  value={config.onCommand || ''}
                  onChange={e => setConfig({ ...config, onCommand: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">Off Command</label>
                <input
                  type="text"
                  value={config.offCommand || ''}
                  onChange={e => setConfig({ ...config, offCommand: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
                />
              </div>
            </>
          )}

          {(type === 'gauge' || type === 'display') && (
            <>
              <div>
                <label className="block text-sm text-text-muted mb-2">Data Key</label>
                <input
                  type="text"
                  value={config.dataKey || ''}
                  onChange={e => setConfig({ ...config, dataKey: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
                  placeholder="e.g. sensor.temperature"
                />
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-2">Unit</label>
                <input
                  type="text"
                  value={config.unit || ''}
                  onChange={e => setConfig({ ...config, unit: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
                  placeholder="e.g. °C, km/h"
                />
              </div>
            </>
          )}

          <button
            onClick={handleSave}
            className="w-full py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
          >
            Add Widget
          </button>
        </div>
      </div>
    </div>
  );
}
