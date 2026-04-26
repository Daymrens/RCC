import { Handle, Position } from '@xyflow/react';

export default function TriggerNode({ data }: any) {
  return (
    <div className="px-4 py-2 bg-surface border-2 border-warning rounded-lg min-w-[150px]">
      <div className="flex items-center gap-2 mb-2">
        <span>⚡</span>
        <span className="font-semibold">Trigger</span>
      </div>
      <div className="text-xs text-text-muted">
        {data.triggerType || 'manual'}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-accent" />
    </div>
  );
}
