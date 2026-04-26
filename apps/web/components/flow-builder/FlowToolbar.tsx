import { Play, Square, Save, Maximize } from 'lucide-react';

interface FlowToolbarProps {
  isActive: boolean;
  onToggle: () => void;
  onSave: () => void;
  onAutoLayout: () => void;
  nodeCount: number;
  edgeCount: number;
}

export default function FlowToolbar({
  isActive,
  onToggle,
  onSave,
  onAutoLayout,
  nodeCount,
  edgeCount
}: FlowToolbarProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
            isActive ? 'bg-danger hover:bg-red-600' : 'bg-success hover:bg-green-600'
          }`}
        >
          {isActive ? <Square size={16} /> : <Play size={16} />}
          {isActive ? 'Stop' : 'Start'}
        </button>

        <button
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
        >
          <Save size={16} />
          Save
        </button>

        <button
          onClick={onAutoLayout}
          className="flex items-center gap-2 px-4 py-2 bg-surface-2 rounded-lg hover:bg-surface-3"
        >
          <Maximize size={16} />
          Auto-layout
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="text-text-muted">
          Nodes: {nodeCount} · Edges: {edgeCount}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-text-muted">Status:</span>
          <span className={isActive ? 'text-success' : 'text-text-muted'}>
            {isActive ? '● Active' : '○ Inactive'}
          </span>
        </div>
      </div>
    </div>
  );
}
