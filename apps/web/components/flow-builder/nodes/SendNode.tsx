import { Handle, Position } from '@xyflow/react';

export default function SendNode({ data }: any) {
  return (
    <div className="px-4 py-2 bg-surface border-2 border-accent rounded-lg min-w-[150px]">
      <Handle type="target" position={Position.Left} className="!bg-accent" />
      <div className="flex items-center gap-2 mb-2">
        <span>📤</span>
        <span className="font-semibold">Send</span>
      </div>
      <div className="text-xs text-text-muted font-mono">
        {data.command || 'command'}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-accent" />
    </div>
  );
}
