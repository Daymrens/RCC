'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Play, Square, Save } from 'lucide-react';
import TriggerNode from '@/components/flow-builder/nodes/TriggerNode';
import SendNode from '@/components/flow-builder/nodes/SendNode';
import ConditionNode from '@/components/flow-builder/nodes/ConditionNode';
import DelayNode from '@/components/flow-builder/nodes/DelayNode';
import TransformNode from '@/components/flow-builder/nodes/TransformNode';
import LogNode from '@/components/flow-builder/nodes/LogNode';

const nodeTypes = {
  trigger: TriggerNode,
  send: SendNode,
  condition: ConditionNode,
  delay: DelayNode,
  transform: TransformNode,
  log: LogNode
};

export default function FlowBuilderPage() {
  const params = useParams();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isActive, setIsActive] = useState(false);
  const [flowName, setFlowName] = useState('New Flow');

  useEffect(() => {
    if (params.flowId !== 'new') {
      fetch(`http://localhost:3001/api/flows/${params.flowId}`)
        .then(res => res.json())
        .then(flow => {
          setFlowName(flow.name);
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);
          setIsActive(flow.isActive);
        });
    }
  }, [params.flowId, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const handleSave = async () => {
    const data = {
      name: flowName,
      nodes,
      edges,
      deviceId: params.id
    };

    if (params.flowId === 'new') {
      await fetch(`http://localhost:3001/api/devices/${params.id}/flows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } else {
      await fetch(`http://localhost:3001/api/flows/${params.flowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges })
      });
    }
  };

  const handleToggle = async () => {
    const action = isActive ? 'stop' : 'start';
    await fetch(`http://localhost:3001/api/flows/${params.flowId}/${action}`, { method: 'POST' });
    setIsActive(!isActive);
  };

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: type.charAt(0).toUpperCase() + type.slice(1) }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={flowName}
            onChange={e => setFlowName(e.target.value)}
            className="px-3 py-2 bg-surface-2 border border-border rounded-lg"
          />
          <button
            onClick={handleToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isActive ? 'bg-danger' : 'bg-success'
            } text-white`}
          >
            {isActive ? <Square size={16} /> : <Play size={16} />}
            {isActive ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg"
          >
            <Save size={16} />
            Save
          </button>
        </div>
        <div className="text-sm">
          Status: <span className={isActive ? 'text-success' : 'text-text-muted'}>
            {isActive ? '● Active' : '○ Inactive'}
          </span>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="w-48 bg-surface border-r border-border p-4">
          <h3 className="font-semibold mb-4">Nodes</h3>
          <div className="space-y-2">
            {['trigger', 'send', 'condition', 'delay', 'transform', 'log'].map(type => (
              <button
                key={type}
                onClick={() => addNode(type)}
                className="w-full px-3 py-2 bg-surface-2 rounded hover:bg-surface-3 text-left text-sm"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
