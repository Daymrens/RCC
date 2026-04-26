'use client';

import { useState, useEffect } from 'react';
import { Key, Plus, Copy, Trash2, Eye, EyeOff } from 'lucide-react';

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    permissions: ['read'] as string[],
    expiresAt: ''
  });

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    const res = await fetch('http://localhost:3001/api/keys');
    const data = await res.json();
    setKeys(data);
  };

  const handleCreate = async () => {
    const res = await fetch('http://localhost:3001/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    setNewKey(data.key);
    setFormData({ name: '', permissions: ['read'], expiresAt: '' });
    loadKeys();
  };

  const handleDelete = async (keyId: string) => {
    if (!confirm('Delete this API key? This cannot be undone.')) return;
    
    await fetch(`http://localhost:3001/api/keys/${keyId}`, {
      method: 'DELETE'
    });
    loadKeys();
  };

  const handleToggle = async (key: any) => {
    await fetch(`http://localhost:3001/api/keys/${key.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !key.isActive })
    });
    loadKeys();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const togglePermission = (perm: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  const permissions = ['read', 'write', 'execute', 'admin'];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Key size={28} />
            API Keys
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Manage external API access
          </p>
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={20} />
          New API Key
        </button>
      </div>

      {/* API Documentation */}
      <div className="mb-6 p-4 bg-surface-2 rounded-lg border border-border">
        <h3 className="font-semibold mb-2">📚 API Documentation</h3>
        <div className="text-sm text-text-muted space-y-1">
          <div><strong>Base URL:</strong> <code>http://localhost:3001/api/v1</code></div>
          <div><strong>Authentication:</strong> Add header <code>X-API-Key: your_key_here</code></div>
          <div><strong>Endpoints:</strong></div>
          <ul className="ml-4 space-y-1">
            <li>• <code>GET /devices</code> - List all devices</li>
            <li>• <code>POST /devices/:id/command</code> - Send command</li>
            <li>• <code>GET /devices/:id/logs</code> - Get device logs</li>
            <li>• <code>GET /devices/:id/analytics</code> - Get analytics data</li>
          </ul>
        </div>
      </div>

      {/* Keys List */}
      {keys.length === 0 ? (
        <div className="text-center py-16">
          <Key size={64} className="mx-auto text-text-dim mb-4" />
          <h3 className="text-lg font-semibold mb-2">No API Keys</h3>
          <p className="text-text-muted mb-4">
            Create an API key to access RoboDesk externally
          </p>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={20} />
            Create API Key
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {keys.map(key => {
            const permissions = JSON.parse(key.permissions || '[]');
            return (
              <div key={key.id} className="bg-surface rounded-lg p-6 border border-border">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{key.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        key.isActive ? 'bg-success/20 text-success' : 'bg-surface-2 text-text-muted'
                      }`}>
                        {key.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-text-muted">Key:</span>
                        <code className="px-2 py-1 bg-surface-2 rounded font-mono">
                          {key.key}
                        </code>
                        <button
                          onClick={() => copyToClipboard(key.key)}
                          className="p-1 hover:bg-surface-2 rounded"
                          title="Copy"
                        >
                          <Copy size={14} />
                        </button>
                      </div>

                      <div>
                        <span className="text-text-muted">Permissions:</span>
                        <div className="flex gap-2 mt-1">
                          {permissions.map((perm: string) => (
                            <span key={perm} className="px-2 py-1 bg-surface-2 rounded text-xs">
                              {perm}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div>
                          <span className="text-text-muted">Created:</span>
                          <span className="ml-2">{new Date(key.createdAt).toLocaleDateString()}</span>
                        </div>
                        {key.lastUsedAt && (
                          <div>
                            <span className="text-text-muted">Last Used:</span>
                            <span className="ml-2">{new Date(key.lastUsedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                        {key.expiresAt && (
                          <div>
                            <span className="text-text-muted">Expires:</span>
                            <span className="ml-2">{new Date(key.expiresAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggle(key)}
                      className="p-2 hover:bg-surface-2 rounded"
                      title={key.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {key.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button
                      onClick={() => handleDelete(key.id)}
                      className="p-2 hover:bg-surface-2 rounded text-danger"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
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
          <div className="bg-surface rounded-lg w-full max-w-2xl">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold">Create API Key</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">Key Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Production API"
                  className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-2">
                  Permissions ({formData.permissions.length} selected)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {permissions.map(perm => (
                    <label
                      key={perm}
                      className="flex items-center gap-2 p-2 hover:bg-surface-2 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(perm)}
                        onChange={() => togglePermission(perm)}
                        className="w-4 h-4"
                      />
                      <span className="capitalize">{perm}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-2">
                  Expiration Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.expiresAt}
                  onChange={e => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
                />
              </div>
            </div>
            <div className="p-6 border-t border-border flex gap-2">
              <button
                onClick={handleCreate}
                disabled={!formData.name || formData.permissions.length === 0}
                className="flex-1 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Generate API Key
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

      {/* New Key Dialog */}
      {newKey && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg w-full max-w-2xl">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold">API Key Created!</h2>
            </div>
            <div className="p-6">
              <div className="p-4 bg-warning/20 border border-warning rounded-lg mb-4">
                <p className="text-sm text-warning">
                  ⚠️ Save this key now! You won't be able to see it again.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-surface-2 rounded font-mono text-sm break-all">
                  {newKey}
                </code>
                <button
                  onClick={() => copyToClipboard(newKey)}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>
            <div className="p-6 border-t border-border">
              <button
                onClick={() => {
                  setNewKey(null);
                  setShowCreateDialog(false);
                }}
                className="w-full py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
