'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Code, Trash2, Copy, Download, Upload, Search, Filter } from 'lucide-react';

export default function LibraryPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadTemplates();
    loadDevices();
  }, []);

  const loadTemplates = () => {
    fetch('http://localhost:3001/api/templates')
      .then(res => res.json())
      .then(setTemplates);
  };

  const loadDevices = () => {
    fetch('http://localhost:3001/api/devices')
      .then(res => res.json())
      .then(setDevices);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this template?')) return;
    
    await fetch(`http://localhost:3001/api/templates/${id}`, {
      method: 'DELETE'
    });
    
    loadTemplates();
  };

  const handleApply = async () => {
    if (!selectedDevice || !selectedTemplate) return;

    await fetch(`http://localhost:3001/api/templates/${selectedTemplate.id}/apply/${selectedDevice}`, {
      method: 'POST'
    });

    setShowApplyDialog(false);
    router.push(`/devices/${selectedDevice}/functions`);
  };

  const openApplyDialog = (template: any) => {
    setSelectedTemplate(template);
    setShowApplyDialog(true);
  };

  const handleExport = async (template: any) => {
    const response = await fetch(`http://localhost:3001/api/export/template/${template.id}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name}.json`;
    a.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const data = JSON.parse(text);

    await fetch('http://localhost:3001/api/export/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    loadTemplates();
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(templates.map(t => t.category).filter(Boolean))];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Code Library</h1>
          <p className="text-sm text-text-muted mt-1">
            Create reusable code templates and apply them to any device
          </p>
        </div>
        <div className="flex gap-2">
          <label className="flex items-center gap-2 px-4 py-2 bg-surface-2 rounded-lg hover:bg-surface-3 cursor-pointer">
            <Upload size={20} />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <Link
            href="/library/create"
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={20} />
            New Template
          </Link>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={20} />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-2 border border-border rounded-lg"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-text-muted" />
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-surface-2 border border-border rounded-lg"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-16">
          <Code size={64} className="mx-auto text-text-dim mb-4" />
          <h3 className="text-lg font-semibold mb-2">No templates yet</h3>
          <p className="text-text-muted mb-4">
            Create your first code template to get started
          </p>
          <Link
            href="/library/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={20} />
            Create Template
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className="p-6 bg-surface rounded-lg border border-border hover:border-accent transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">
                  {template.type === 'code' ? '📝' : '🔄'}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExport(template)}
                    className="p-1 hover:bg-surface-2 rounded"
                    title="Export"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => router.push(`/library/${template.id}`)}
                    className="p-1 hover:bg-surface-2 rounded"
                    title="Edit"
                  >
                    <Code size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-1 hover:bg-surface-2 rounded text-danger"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold mb-2">{template.name}</h3>
              <p className="text-sm text-text-muted mb-4 line-clamp-2">
                {template.description || 'No description'}
              </p>

              <div className="flex items-center justify-between text-xs">
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-surface-2 rounded">
                    {template.type}
                  </span>
                  {template.category && (
                    <span className="px-2 py-1 bg-surface-2 rounded">
                      {template.category}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => openApplyDialog(template)}
                  className="flex items-center gap-1 px-3 py-1 bg-accent text-white rounded hover:bg-blue-600"
                >
                  <Copy size={14} />
                  Apply
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-border text-xs text-text-dim">
                Updated {new Date(template.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {showApplyDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Apply Template</h2>
            <p className="text-sm text-text-muted mb-4">
              Apply "{selectedTemplate?.name}" to a device
            </p>

            <div className="mb-6">
              <label className="block text-sm text-text-muted mb-2">
                Select Device
              </label>
              <select
                value={selectedDevice}
                onChange={e => setSelectedDevice(e.target.value)}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
              >
                <option value="">Choose a device...</option>
                {devices.map(device => (
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
                Apply to Device
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
