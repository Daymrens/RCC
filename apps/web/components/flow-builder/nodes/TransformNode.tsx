import { Handle, Position } from '@xyflow/react';

export default function TransformNode({ data }: any) {
  return (
    <div className="px-4 py-2 bg-surface border-2 border-teal-500 rounded-lg min-w-[150px]">
      <Handle type="target" position={Position.Left} className="!bg-accent" />
      <div className="flex items-center gap-2 mb-2">
        <span>⚙</span>
        <span className="font-semibold">Transform</span>
      </div>
      <div className="text-xs text-text-muted font-mono">
        {data.code || 'transform'}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-accent" />
    </div>
  );
}
