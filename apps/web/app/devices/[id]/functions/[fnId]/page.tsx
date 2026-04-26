'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import FunctionToolbar from '@/components/function-editor/FunctionToolbar';
import OutputConsole from '@/components/function-editor/OutputConsole';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const DEFAULT_CODE = `// Available: device.send(), device.log(), delay(), console.log()

async function main() {
  device.log('Function started');
  await device.send('{"type":"ping"}');
  
  device.onData((data) => {
    device.log('Received: ' + data);
  });
}

main();`;

export default function FunctionEditorPage() {
  const params = useParams();
  const [func, setFunc] = useState<any>(null);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const [trigger, setTrigger] = useState('manual');
  const [intervalMs, setIntervalMs] = useState(1000);

  useEffect(() => {
    if (params.fnId !== 'new') {
      fetch(`http://localhost:3001/api/functions/${params.fnId}`)
        .then(res => res.json())
        .then(data => {
          setFunc(data);
          setCode(data.code || DEFAULT_CODE);
          setTrigger(data.trigger || 'manual');
          setIntervalMs(data.intervalMs || 1000);
        });
    }
  }, [params.fnId]);

  const handleRun = async () => {
    setOutput(['Running...']);
    try {
      const res = await fetch(`http://localhost:3001/api/functions/${params.fnId}/run`, {
        method: 'POST'
      });
      const result = await res.json();
      setOutput(result.result?.logs || ['Completed']);
    } catch (error: any) {
      setOutput([`Error: ${error.message}`]);
    }
  };

  const handleSave = async () => {
    const data = {
      name: func?.name || 'New Function',
      type: 'code',
      code,
      trigger,
      intervalMs: trigger === 'interval' ? intervalMs : undefined,
      deviceId: params.id
    };

    if (params.fnId === 'new') {
      const res = await fetch(`http://localhost:3001/api/devices/${params.id}/functions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const created = await res.json();
      window.location.href = `/devices/${params.id}/functions/${created.id}`;
    } else {
      await fetch(`http://localhost:3001/api/functions/${params.fnId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, trigger, intervalMs })
      });
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <FunctionToolbar
        onRun={handleRun}
        onSave={handleSave}
        trigger={trigger}
        intervalMs={intervalMs}
        onTriggerChange={setTrigger}
        onIntervalChange={setIntervalMs}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1">
          <MonacoEditor
            height="100%"
            language="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: 'Geist Mono, monospace',
              lineHeight: 1.6,
              tabSize: 2,
              formatOnSave: true
            }}
          />
        </div>

        <div className="w-96 bg-surface border-l border-border">
          <OutputConsole output={output} onClear={() => setOutput([])} />
        </div>
      </div>
    </div>
  );
}
