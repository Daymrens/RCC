'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function CreateTemplatePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('code');
  const [code, setCode] = useState(`// Write your device code here
// Available API:
// - device.send(data)
// - device.onData(callback)
// - device.log(message)
// - delay(ms)

async function main() {
  device.log('Function started');
  
  // Your code here
  
  device.log('Function completed');
}

main();`);
  const [trigger, setTrigger] = useState('manual');
  const [intervalMs, setIntervalMs] = useState(1000);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');

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

    const res = await fetch('http://localhost:3001/api/templates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template)
    });

    if (res.ok) {
      router.push('/library');
    }
  };

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
            <h1 className="font-semibold">New Code Template</h1>
            <p className="text-xs text-text-muted">
              Create a reusable code template
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
        >
          <Save size={18} />
          Save Template
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
                placeholder="e.g., Motor Control"
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
                placeholder="What does this template do?"
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
                placeholder="e.g., Motors, Sensors"
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
                placeholder="e.g., arduino, esp32"
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
                <p className="text-sm">For now, create code templates</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
