'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function PluginsPage() {
  const router = useRouter();
  const [plugins, setPlugins] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/plugins')
      .then(res => res.json())
      .then(setPlugins);

    fetch('http://localhost:3001/api/devices')
      .then(res => res.json())
      .then(setDevices);
  }, []);

  const handleApply = async () => {
    if (!selectedDevice || !selectedPlugin) return;

    await fetch(`http://localhost:3001/api/plugins/${selectedPlugin.id}/apply/${selectedDevice}`, {
      method: 'POST'
    });

    setShowApplyDialog(false);
    router.push(`/devices/${selectedDevice}`);
  };

  const openApplyDialog = (plugin: any) => {
    setSelectedPlugin(plugin);
    setShowApplyDialog(true);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Plugins</h1>
        <Link
          href="/plugins/create"
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={20} />
          Create Plugin
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plugins.map(plugin => (
          <div key={plugin.id} className="p-6 bg-surface rounded-lg border border-border hover:border-accent transition-colors">
            <div className="text-3xl mb-3">
              {plugin.deviceType === 'serial' ? '🔌' : '📡'}
            </div>
            <h3 className="font-semibold mb-2">{plugin.name}</h3>
            <p className="text-sm text-text-muted mb-4">{plugin.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-dim">{plugin.deviceType}</span>
              <button
                onClick={() => openApplyDialog(plugin)}
                className="px-3 py-1 bg-accent text-white text-sm rounded hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>

      {showApplyDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Apply Plugin</h2>
            <p className="text-sm text-text-muted mb-4">
              Apply {selectedPlugin?.name} to a device
            </p>
            
            <div className="mb-6">
              <label className="block text-sm text-text-muted mb-2">Select Device</label>
              <select
                value={selectedDevice}
                onChange={e => setSelectedDevice(e.target.value)}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
              >
                <option value="">Choose a device...</option>
                {devices
                  .filter(d => d.type === selectedPlugin?.deviceType)
                  .map(device => (
                    <option key={device.id} value={device.id}>
                      {device.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleApply}
                disabled={!selectedDevice}
                className="flex-1 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Apply Plugin
              </button>
              <button
                onClick={() => setShowApplyDialog(false)}
                className="px-4 py-2 bg-surface-2 rounded-lg hover:bg-surface-3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
