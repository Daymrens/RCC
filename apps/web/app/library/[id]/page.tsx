'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('code');
  const [code, setCode] = useState('');
  const [trigger, setTrigger] = useState('manual');
  const [intervalMs, setIntervalMs] = useState(1000);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    const res = await fetch(`http://localhost:3001/api/templates/${params.id}`);
    const template = await res.json();
    
    setName(template.name);
    setDescription(template.description || '');
    setType(template.type);
    setCode(template.code || '');
    setTrigger(template.trigger);
    setIntervalMs(template.intervalMs || 1000);
    setCategory(template.category || '');
    setTags(template.tags || '');
    setLoading(false);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a template name');
      return;
    }

    const template = {
      name,
      description,
      type,
      code: type === 'code' ? code : null,
      trigger,
      intervalMs: trigger === 'interval' ? intervalMs : null,
      category: category || null,
      tags: tags || null
    };

    const res = await fetch(`http://localhost:3001/api/templates/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template)
    });

    if (res.ok) {
      router.push('/library');
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link
            href="/library"
            className="p-2 hover:bg-surface-2 rounded"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-semibold">Edit Template</h1>
            <p className="text-xs text-text-muted">{name}</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Settings Panel */}
        <div className="w-80 border-r border-border p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-muted mb-2">
                Template Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg resize-none"
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-2">
                Type
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
              >
                <option value="code">Code Function</option>
                <option value="flow">Visual Flow</option>
              </select>
            </div>

            {type === 'code' && (
              <>
                <div>
                  <label className="block text-sm text-text-muted mb-2">
                    Trigger
                  </label>
                  <select
                    value={trigger}
                    onChange={e => setTrigger(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
                  >
                    <option value="manual">Manual</option>
                    <option value="interval">Interval</option>
                    <option value="event">Event</option>
                  </select>
                </div>

                {trigger === 'interval' && (
                  <div>
                    <label className="block text-sm text-text-muted mb-2">
                      Interval (ms)
                    </label>
                    <input
                      type="number"
                      value={intervalMs}
                      onChange={e => setIntervalMs(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
                    />
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm text-text-muted mb-2">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          {type === 'code' ? (
            <>
              <div className="h-10 border-b border-border flex items-center px-4 text-sm text-text-muted">
                Code Editor
              </div>
              <div className="flex-1">
                <MonacoEditor
                  height="100%"
                  language="javascript"
                  theme="vs-dark"
                  value={code}
                  onChange={value => setCode(value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-text-muted">
              <div className="text-center">
                <p className="mb-2">Visual flow editor coming soon</p>
                <p className="text-sm">For now, edit code templates</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
