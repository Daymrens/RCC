import { Handle, Position } from '@xyflow/react';

export default function ConditionNode({ data }: any) {
  return (
    <div className="px-4 py-2 bg-surface border-2 border-purple-500 rounded-lg min-w-[150px]">
      <Handle type="target" position={Position.Left} className="!bg-accent" />
      <div className="flex items-center gap-2 mb-2">
        <span>🔀</span>
        <span className="font-semibold">Condition</span>
      </div>
      <div className="text-xs text-text-muted font-mono">
        {data.expression || 'condition'}
      </div>
      <Handle type="source" position={Position.Right} id="true" className="!bg-success !top-[30%]" />
      <Handle type="source" position={Position.Right} id="false" className="!bg-danger !top-[70%]" />
    </div>
  );
}
