'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Send, Trash2, Edit } from 'lucide-react';

export default function GroupsPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCommandDialog, setShowCommandDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [command, setCommand] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deviceIds: [] as string[]
  });

  useEffect(() => {
    loadGroups();
    loadDevices();
  }, []);

  const loadGroups = async () => {
    const res = await fetch('http://localhost:3001/api/groups');
    const data = await res.json();
    setGroups(data);
  };

  const loadDevices = async () => {
    const res = await fetch('http://localhost:3001/api/devices');
    const data = await res.json();
    setDevices(data);
  };

  const handleCreate = async () => {
    await fetch('http://localhost:3001/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    setShowCreateDialog(false);
    setFormData({ name: '', description: '', deviceIds: [] });
    loadGroups();
  };

  const handleDelete = async (groupId: string) => {
    if (!confirm('Delete this group?')) return;
    
    await fetch(`http://localhost:3001/api/groups/${groupId}`, {
      method: 'DELETE'
    });
    loadGroups();
  };

  const handleSendCommand = async () => {
    if (!selectedGroup || !command.trim()) return;

    await fetch(`http://localhost:3001/api/groups/${selectedGroup.id}/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command })
    });

    setShowCommandDialog(false);
    setCommand('');
  };

  const toggleDevice = (deviceId: string) => {
    setFormData(prev => ({
      ...prev,
      deviceIds: prev.deviceIds.includes(deviceId)
        ? prev.deviceIds.filter(id => id !== deviceId)
        : [...prev.deviceIds, deviceId]
    }));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users size={28} />
            Device Groups
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Manage multiple devices as a group
          </p>
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={20} />
          New Group
        </button>
      </div>

      {/* Groups List */}
      {groups.length === 0 ? (
        <div className="text-center py-16">
          <Users size={64} className="mx-auto text-text-dim mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Device Groups</h3>
          <p className="text-text-muted mb-4">
            Create a group to manage multiple devices together
          </p>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={20} />
            Create Group
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map(group => (
            <div key={group.id} className="bg-surface rounded-lg p-6 border border-border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{group.name}</h3>
                  {group.description && (
                    <p className="text-sm text-text-muted">{group.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedGroup(group);
                      setShowCommandDialog(true);
                    }}
                    className="p-2 hover:bg-surface-2 rounded"
                    title="Send Command"
                  >
                    <Send size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(group.id)}
                    className="p-2 hover:bg-surface-2 rounded text-danger"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-text-muted">
                  {group.devices?.length || 0} devices
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.devices?.map((device: any) => (
                    <span
                      key={device.id}
                      className="px-2 py-1 bg-surface-2 rounded text-xs"
                    >
                      {device.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg w-full max-w-2xl">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold">Create Device Group</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">Group Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Living Room Sensors"
                  className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What is this group for?"
                  rows={2}
                  className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-2">
                  Select Devices ({formData.deviceIds.length} selected)
                </label>
                <div className="max-h-64 overflow-y-auto space-y-2 border border-border rounded-lg p-3">
                  {devices.map(device => (
                    <label
                      key={device.id}
                      className="flex items-center gap-2 p-2 hover:bg-surface-2 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.deviceIds.includes(device.id)}
                        onChange={() => toggleDevice(device.id)}
                        className="w-4 h-4"
                      />
                      <span>{device.name}</span>
                      <span className="text-xs text-text-muted">({device.type})</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border flex gap-2">
              <button
                onClick={handleCreate}
                disabled={!formData.name || formData.deviceIds.length === 0}
                className="flex-1 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Create Group
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

      {/* Command Dialog */}
      {showCommandDialog && selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg w-full max-w-md">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold">Send Command to Group</h2>
              <p className="text-sm text-text-muted mt-1">
                {selectedGroup.name} ({selectedGroup.devices?.length} devices)
              </p>
            </div>
            <div className="p-6">
              <label className="block text-sm text-text-muted mb-2">Command (JSON)</label>
              <textarea
                value={command}
                onChange={e => setCommand(e.target.value)}
                placeholder='{"type":"read","sensor":"temperature"}'
                rows={4}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg resize-none font-mono text-sm"
              />
            </div>
            <div className="p-6 border-t border-border flex gap-2">
              <button
                onClick={handleSendCommand}
                disabled={!command.trim()}
                className="flex-1 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Send to All Devices
              </button>
              <button
                onClick={() => setShowCommandDialog(false)}
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
