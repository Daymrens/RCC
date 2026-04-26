'use client';

import { useState, useEffect } from 'react';
import { Film, Plus, Play, Trash2, Circle } from 'lucide-react';

export default function MacrosPage() {
  const [macros, setMacros] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [recording, setRecording] = useState(false);
  const [actions, setActions] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deviceId: ''
  });

  useEffect(() => {
    loadMacros();
    loadDevices();
  }, []);

  const loadMacros = async () => {
    const res = await fetch('http://localhost:3001/api/macros');
    const data = await res.json();
    setMacros(data);
  };

  const loadDevices = async () => {
    const res = await fetch('http://localhost:3001/api/devices');
    const data = await res.json();
    setDevices(data);
  };

  const handleCreate = async () => {
    await fetch('http://localhost:3001/api/macros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        actions
      })
    });

    setShowCreateDialog(false);
    setFormData({ name: '', description: '', deviceId: '' });
    setActions([]);
    loadMacros();
  };

  const handleDelete = async (macroId: string) => {
    if (!confirm('Delete this macro?')) return;
    
    await fetch(`http://localhost:3001/api/macros/${macroId}`, {
      method: 'DELETE'
    });
    loadMacros();
  };

  const handleExecute = async (macroId: string) => {
    await fetch(`http://localhost:3001/api/macros/${macroId}/execute`, {
      method: 'POST'
    });
  };

  const addAction = (type: string) => {
    const action: any = { type };
    
    switch (type) {
      case 'command':
        action.data = '{"type":"example"}';
        break;
      case 'delay':
        action.duration = 1000;
        break;
      case 'log':
        action.message = 'Action executed';
        break;
    }
    
    setActions([...actions, action]);
  };

  const removeAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const updateAction = (index: number, field: string, value: any) => {
    const updated = [...actions];
    updated[index] = { ...updated[index], [field]: value };
    setActions(updated);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Film size={28} />
            Macros
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Record and replay action sequences
          </p>
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={20} />
          New Macro
        </button>
      </div>

      {/* Macros List */}
      {macros.length === 0 ? (
        <div className="text-center py-16">
          <Film size={64} className="mx-auto text-text-dim mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Macros</h3>
          <p className="text-text-muted mb-4">
            Create a macro to automate action sequences
          </p>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={20} />
            Create Macro
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {macros.map(macro => {
            const actions = JSON.parse(macro.actions || '[]');
            return (
              <div key={macro.id} className="bg-surface rounded-lg p-6 border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{macro.name}</h3>
                    {macro.description && (
                      <p className="text-sm text-text-muted">{macro.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExecute(macro.id)}
                      className="p-2 hover:bg-surface-2 rounded text-success"
                      title="Execute"
                    >
                      <Play size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(macro.id)}
                      className="p-2 hover:bg-surface-2 rounded text-danger"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-text-muted">
                    {actions.length} actions
                  </div>
                  <div className="space-y-1">
                    {actions.slice(0, 3).map((action: any, idx: number) => (
                      <div key={idx} className="text-xs px-2 py-1 bg-surface-2 rounded flex items-center gap-2">
                        <Circle size={8} className="fill-current" />
                        {action.type}
                      </div>
                    ))}
                    {actions.length > 3 && (
                      <div className="text-xs text-text-muted">
                        +{actions.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold">Create Macro</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-muted mb-2">Macro Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Morning Routine"
                    className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-muted mb-2">Device (Optional)</label>
                  <select
                    value={formData.deviceId}
                    onChange={e => setFormData({ ...formData, deviceId: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
                  >
                    <option value="">No specific device</option>
                    {devices.map(device => (
                      <option key={device.id} value={device.id}>
                        {device.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What does this macro do?"
                  rows={2}
                  className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-text-muted">Actions ({actions.length})</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => addAction('command')}
                      className="px-3 py-1 bg-surface-2 rounded text-sm hover:bg-surface-3"
                    >
                      + Command
                    </button>
                    <button
                      onClick={() => addAction('delay')}
                      className="px-3 py-1 bg-surface-2 rounded text-sm hover:bg-surface-3"
                    >
                      + Delay
                    </button>
                    <button
                      onClick={() => addAction('log')}
                      className="px-3 py-1 bg-surface-2 rounded text-sm hover:bg-surface-3"
                    >
                      + Log
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {actions.length === 0 ? (
                    <div className="text-center py-8 text-text-muted text-sm">
                      No actions yet. Add actions using the buttons above.
                    </div>
                  ) : (
                    actions.map((action, idx) => (
                      <div key={idx} className="bg-surface-2 rounded-lg p-3">
                        <div className="flex items-start gap-3">
                          <div className="text-sm font-semibold mt-2">#{idx + 1}</div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold">{action.type}</span>
                              <button
                                onClick={() => removeAction(idx)}
                                className="text-danger hover:bg-surface rounded p-1"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            {action.type === 'command' && (
                              <input
                                type="text"
                                value={action.data}
                                onChange={e => updateAction(idx, 'data', e.target.value)}
                                placeholder='{"type":"example"}'
                                className="w-full px-2 py-1 bg-surface border border-border rounded text-sm font-mono"
                              />
                            )}

                            {action.type === 'delay' && (
                              <input
                                type="number"
                                value={action.duration}
                                onChange={e => updateAction(idx, 'duration', parseInt(e.target.value))}
                                placeholder="Duration (ms)"
                                className="w-full px-2 py-1 bg-surface border border-border rounded text-sm"
                              />
                            )}

                            {action.type === 'log' && (
                              <input
                                type="text"
                                value={action.message}
                                onChange={e => updateAction(idx, 'message', e.target.value)}
                                placeholder="Log message"
                                className="w-full px-2 py-1 bg-surface border border-border rounded text-sm"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border flex gap-2">
              <button
                onClick={handleCreate}
                disabled={!formData.name || actions.length === 0}
                className="flex-1 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Create Macro
              </button>
              <button
                onClick={() => setShowCreateDialog(false)}
                className="px-6 py-2 bg-surface-2 rounded-lg hover:bg-surface-3"
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
