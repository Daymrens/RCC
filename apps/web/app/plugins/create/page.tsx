'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Save } from 'lucide-react';

export default function CreatePluginPage() {
  const router = useRouter();
  const [plugin, setPlugin] = useState({
    name: '',
    description: '',
    deviceType: 'serial' as 'serial' | 'ble',
    config: {},
    functions: [] as any[],
    dashboards: [] as any[]
  });

  const [currentFunction, setCurrentFunction] = useState({
    name: '',
    type: 'code',
    trigger: 'manual',
    code: ''
  });

  const [currentWidget, setCurrentWidget] = useState({
    type: 'button',
    label: '',
    command: '',
    config: {},
    position: { x: 0, y: 0, w: 1, h: 1 }
  });

  const addFunction = () => {
    if (currentFunction.name) {
      setPlugin({
        ...plugin,
        functions: [...plugin.functions, { ...currentFunction }]
      });
      setCurrentFunction({ name: '', type: 'code', trigger: 'manual', code: '' });
    }
  };

  const removeFunction = (index: number) => {
    setPlugin({
      ...plugin,
      functions: plugin.functions.filter((_, i) => i !== index)
    });
  };

  const addWidget = () => {
    if (currentWidget.label) {
      const dashboard = plugin.dashboards[0] || { name: 'Main Dashboard', widgets: [] };
      dashboard.widgets = [...(dashboard.widgets || []), { ...currentWidget }];
      
      setPlugin({
        ...plugin,
        dashboards: [dashboard]
      });
      
      setCurrentWidget({
        type: 'button',
        label: '',
        command: '',
        config: {},
        position: { x: 0, y: 0, w: 1, h: 1 }
      });
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/plugins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plugin)
      });

      if (res.ok) {
        router.push('/plugins');
      }
    } catch (error) {
      console.error('Failed to save plugin:', error);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Create Custom Plugin</h1>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
        >
          <Save size={16} />
          Save Plugin
        </button>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div className="bg-surface rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-muted mb-2">Plugin Name</label>
              <input
                type="text"
                value={plugin.name}
                onChange={e => setPlugin({ ...plugin, name: e.target.value })}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
                placeholder="My Custom Plugin"
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-2">Description</label>
              <textarea
                value={plugin.description}
                onChange={e => setPlugin({ ...plugin, description: e.target.value })}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
                rows={3}
                placeholder="Describe what this plugin does..."
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-2">Device Type</label>
              <select
                value={plugin.deviceType}
                onChange={e => setPlugin({ ...plugin, deviceType: e.target.value as any })}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
              >
                <option value="serial">Serial (USB)</option>
                <option value="ble">Bluetooth BLE</option>
              </select>
            </div>
          </div>
        </div>

        {/* Functions */}
        <div className="bg-surface rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Preset Functions</h2>
          
          <div className="space-y-4 mb-4">
            {plugin.functions.map((func, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                <div>
                  <div className="font-semibold">{func.name}</div>
                  <div className="text-sm text-text-muted">{func.type} · {func.trigger}</div>
                </div>
                <button
                  onClick={() => removeFunction(index)}
                  className="p-2 text-danger hover:bg-surface-3 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="border border-border rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-text-muted mb-1">Function Name</label>
                <input
                  type="text"
                  value={currentFunction.name}
                  onChange={e => setCurrentFunction({ ...currentFunction, name: e.target.value })}
                  className="w-full px-2 py-1 bg-surface-2 border border-border rounded text-sm"
                  placeholder="Move Forward"
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">Trigger</label>
                <select
                  value={currentFunction.trigger}
                  onChange={e => setCurrentFunction({ ...currentFunction, trigger: e.target.value })}
                  className="w-full px-2 py-1 bg-surface-2 border border-border rounded text-sm"
                >
                  <option value="manual">Manual</option>
                  <option value="interval">Interval</option>
                  <option value="onData">On Data</option>
                  <option value="onConnect">On Connect</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">Code</label>
              <textarea
                value={currentFunction.code}
                onChange={e => setCurrentFunction({ ...currentFunction, code: e.target.value })}
                className="w-full px-2 py-1 bg-surface-2 border border-border rounded text-sm font-mono"
                rows={4}
                placeholder="await device.send('command');"
              />
            </div>

            <button
              onClick={addFunction}
              className="flex items-center gap-2 px-3 py-1 bg-accent text-white rounded text-sm hover:bg-blue-600"
            >
              <Plus size={14} />
              Add Function
            </button>
          </div>
        </div>

        {/* Dashboard Widgets */}
        <div className="bg-surface rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Dashboard Widgets</h2>
          
          <div className="space-y-4 mb-4">
            {plugin.dashboards[0]?.widgets?.map((widget: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-surface-2 rounded-lg">
                <div>
                  <div className="font-semibold">{widget.label}</div>
                  <div className="text-sm text-text-muted">{widget.type}</div>
                </div>
                <button
                  onClick={() => {
                    const dashboard = plugin.dashboards[0];
                    dashboard.widgets = dashboard.widgets.filter((_: any, i: number) => i !== index);
                    setPlugin({ ...plugin, dashboards: [dashboard] });
                  }}
                  className="p-2 text-danger hover:bg-surface-3 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="border border-border rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-text-muted mb-1">Widget Type</label>
                <select
                  value={currentWidget.type}
                  onChange={e => setCurrentWidget({ ...currentWidget, type: e.target.value })}
                  className="w-full px-2 py-1 bg-surface-2 border border-border rounded text-sm"
                >
                  <option value="button">Button</option>
                  <option value="slider">Slider</option>
                  <option value="toggle">Toggle</option>
                  <option value="gauge">Gauge</option>
                  <option value="display">Display</option>
                  <option value="joystick">Joystick</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">Label</label>
                <input
                  type="text"
                  value={currentWidget.label}
                  onChange={e => setCurrentWidget({ ...currentWidget, label: e.target.value })}
                  className="w-full px-2 py-1 bg-surface-2 border border-border rounded text-sm"
                  placeholder="Widget Label"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-text-muted mb-1">Command</label>
              <input
                type="text"
                value={currentWidget.command}
                onChange={e => setCurrentWidget({ ...currentWidget, command: e.target.value })}
                className="w-full px-2 py-1 bg-surface-2 border border-border rounded text-sm"
                placeholder='{"type":"move"}'
              />
            </div>

            <button
              onClick={addWidget}
              className="flex items-center gap-2 px-3 py-1 bg-accent text-white rounded text-sm hover:bg-blue-600"
            >
              <Plus size={14} />
              Add Widget
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
