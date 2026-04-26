'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeviceSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const [device, setDevice] = useState<any>(null);
  const [name, setName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/api/devices/${params.id}`)
      .then(res => res.json())
      .then(device => {
        setDevice(device);
        setName(device.name);
      });
  }, [params.id]);

  const handleSave = async () => {
    await fetch(`http://localhost:3001/api/devices/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
  };

  const handleDelete = async () => {
    await fetch(`http://localhost:3001/api/devices/${params.id}`, {
      method: 'DELETE'
    });
    router.push('/');
  };

  const handleTestConnection = async () => {
    try {
      await fetch(`http://localhost:3001/api/devices/${params.id}/connect`, {
        method: 'POST'
      });
      alert('Connection successful!');
    } catch (error) {
      alert('Connection failed');
    }
  };

  if (!device) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Device Settings</h1>

      <div className="space-y-6">
        <div className="bg-surface rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">General</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-muted mb-2">Device Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
              />
            </div>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-surface rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Connection</h2>
          <div className="space-y-2 text-sm mb-4">
            <div>Type: {device.type}</div>
            <div>Status: {device.status}</div>
            {device.type === 'serial' && (
              <>
                <div>Port: {device.connectionConfig.port}</div>
                <div>Baud Rate: {device.connectionConfig.baudRate}</div>
              </>
            )}
          </div>
          <button
            onClick={handleTestConnection}
            className="px-4 py-2 bg-surface-2 rounded-lg hover:bg-surface-3"
          >
            Test Connection
          </button>
        </div>

        <div className="bg-surface rounded-lg p-6 border border-danger">
          <h2 className="text-lg font-semibold mb-4 text-danger">Danger Zone</h2>
          <p className="text-sm text-text-muted mb-4">
            Deleting this device will remove all associated functions, flows, and dashboards.
          </p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-600"
            >
              <Trash2 size={16} />
              Delete Device
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-semibold">Are you sure?</p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-600"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-surface-2 rounded-lg hover:bg-surface-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
