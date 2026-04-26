'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Eye, X } from 'lucide-react';

export default function PluginsPage() {
  const router = useRouter();
  const [plugins, setPlugins] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
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

  const openDetailsDialog = (plugin: any) => {
    setSelectedPlugin(plugin);
    setShowDetailsDialog(true);
  };

  const parsePluginData = (plugin: any) => {
    try {
      return {
        config: JSON.parse(plugin.config || '{}'),
        functions: JSON.parse(plugin.functions || '[]'),
        dashboards: JSON.parse(plugin.dashboards || '[]')
      };
    } catch {
      return { config: {}, functions: [], dashboards: [] };
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Plugins</h1>
          <p className="text-sm text-text-muted mt-1">
            Browse and explore plugins - no device required
          </p>
        </div>
        <Link
          href="/plugins/create"
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={20} />
          Create Plugin
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plugins.map(plugin => {
          const data = parsePluginData(plugin);
          return (
            <div key={plugin.id} className="p-6 bg-surface rounded-lg border border-border hover:border-accent transition-colors">
              <div className="text-3xl mb-3">
                {plugin.deviceType === 'serial' ? '🔌' : '📡'}
              </div>
              <h3 className="font-semibold mb-2">{plugin.name}</h3>
              <p className="text-sm text-text-muted mb-4">{plugin.description}</p>
              
              <div className="space-y-2 mb-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-text-dim">Type:</span>
                  <span className="px-2 py-1 bg-surface-2 rounded">{plugin.deviceType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-dim">Functions:</span>
                  <span className="text-accent">{data.functions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-dim">Dashboards:</span>
                  <span className="text-accent">{data.dashboards.length}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openDetailsDialog(plugin)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-surface-2 text-sm rounded hover:bg-surface-3"
                >
                  <Eye size={16} />
                  View Details
                </button>
                <button
                  onClick={() => openApplyDialog(plugin)}
                  className="flex-1 px-3 py-2 bg-accent text-white text-sm rounded hover:bg-blue-600"
                >
                  Apply
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Dialog */}
      {showDetailsDialog && selectedPlugin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-bold">{selectedPlugin.name}</h2>
                <p className="text-sm text-text-muted mt-1">{selectedPlugin.description}</p>
              </div>
              <button
                onClick={() => setShowDetailsDialog(false)}
                className="p-2 hover:bg-surface-2 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {(() => {
                const data = parsePluginData(selectedPlugin);
                return (
                  <div className="space-y-6">
                    {/* Plugin Info */}
                    <div>
                      <h3 className="font-semibold mb-3">Plugin Information</h3>
                      <div className="bg-surface-2 rounded-lg p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-text-muted">Device Type:</span>
                          <span>{selectedPlugin.deviceType === 'serial' ? 'Serial (USB)' : 'Bluetooth BLE'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Functions:</span>
                          <span>{data.functions.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-muted">Dashboards:</span>
                          <span>{data.dashboards.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Connection Config */}
                    {Object.keys(data.config).length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">Connection Configuration</h3>
                        <div className="bg-surface-2 rounded-lg p-4">
                          <pre className="text-xs overflow-x-auto">
                            {JSON.stringify(data.config, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Functions */}
                    {data.functions.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">Included Functions ({data.functions.length})</h3>
                        <div className="space-y-3">
                          {data.functions.map((func: any, idx: number) => (
                            <div key={idx} className="bg-surface-2 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="font-semibold">{func.name}</div>
                                  {func.description && (
                                    <div className="text-xs text-text-muted mt-1">{func.description}</div>
                                  )}
                                </div>
                                <span className="text-xs px-2 py-1 bg-surface rounded">
                                  {func.trigger}
                                </span>
                              </div>
                              {func.code && (
                                <details className="mt-2">
                                  <summary className="text-xs text-accent cursor-pointer">View Code</summary>
                                  <pre className="text-xs mt-2 p-2 bg-surface rounded overflow-x-auto">
                                    {func.code}
                                  </pre>
                                </details>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dashboards */}
                    {data.dashboards.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">Dashboard Widgets ({data.dashboards.length})</h3>
                        <div className="space-y-3">
                          {data.dashboards.map((widget: any, idx: number) => (
                            <div key={idx} className="bg-surface-2 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-semibold">{widget.label}</div>
                                  <div className="text-xs text-text-muted mt-1">
                                    Type: {widget.type}
                                  </div>
                                </div>
                                <div className="text-2xl">
                                  {widget.type === 'button' && '🔘'}
                                  {widget.type === 'slider' && '🎚️'}
                                  {widget.type === 'toggle' && '🔄'}
                                  {widget.type === 'gauge' && '📊'}
                                  {widget.type === 'display' && '📺'}
                                  {widget.type === 'joystick' && '🕹️'}
                                </div>
                              </div>
                              {widget.command && (
                                <div className="mt-2 text-xs">
                                  <span className="text-text-muted">Command:</span>
                                  <code className="ml-2 px-2 py-1 bg-surface rounded">{widget.command}</code>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="p-6 border-t border-border flex gap-2">
              <button
                onClick={() => {
                  setShowDetailsDialog(false);
                  openApplyDialog(selectedPlugin);
                }}
                className="flex-1 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
              >
                Apply to Device
              </button>
              <button
                onClick={() => setShowDetailsDialog(false)}
                className="px-6 py-2 bg-surface-2 rounded-lg hover:bg-surface-3"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Dialog */}
      {showApplyDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Apply Plugin</h2>
            <p className="text-sm text-text-muted mb-4">
              Apply {selectedPlugin?.name} to a device
            </p>
            
            {devices.filter(d => d.type === selectedPlugin?.deviceType).length === 0 ? (
              <div className="mb-6 p-4 bg-surface-2 rounded-lg border border-warning">
                <p className="text-sm text-warning mb-2">⚠️ No compatible devices found</p>
                <p className="text-xs text-text-muted">
                  Create a {selectedPlugin?.deviceType === 'serial' ? 'Serial (USB)' : 'Bluetooth BLE'} device first to use this plugin.
                </p>
              </div>
            ) : (
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
            )}

            <div className="flex gap-2">
              {devices.filter(d => d.type === selectedPlugin?.deviceType).length > 0 && (
                <button
                  onClick={handleApply}
                  disabled={!selectedDevice}
                  className="flex-1 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  Apply Plugin
                </button>
              )}
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
