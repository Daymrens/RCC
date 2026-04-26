import { Handle, Position } from '@xyflow/react';

export default function DelayNode({ data }: any) {
  return (
    <div className="px-4 py-2 bg-surface border-2 border-orange-500 rounded-lg min-w-[150px]">
      <Handle type="target" position={Position.Left} className="!bg-accent" />
      <div className="flex items-center gap-2 mb-2">
        <span>⏱</span>
        <span className="font-semibold">Delay</span>
      </div>
      <div className="text-xs text-text-muted">
        {data.delayMs || 1000}ms
      </div>
      <Handle type="source" position={Position.Right} className="!bg-accent" />
    </div>
  );
}
