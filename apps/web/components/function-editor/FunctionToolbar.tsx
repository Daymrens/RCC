import { Play, Save, MoreVertical } from 'lucide-react';

interface FunctionToolbarProps {
  onRun: () => void;
  onSave: () => void;
  trigger: string;
  intervalMs?: number;
  onTriggerChange: (trigger: string) => void;
  onIntervalChange: (ms: number) => void;
}

export default function FunctionToolbar({
  onRun,
  onSave,
  trigger,
  intervalMs = 1000,
  onTriggerChange,
  onIntervalChange
}: FunctionToolbarProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border bg-surface">
      <button
        onClick={onRun}
        className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
      >
        <Play size={16} />
        Run
      </button>

      <button
        onClick={onSave}
        className="flex items-center gap-2 px-4 py-2 bg-surface-2 rounded-lg hover:bg-surface-3"
      >
        <Save size={16} />
        Save
      </button>

      <div className="flex items-center gap-2">
        <label className="text-sm text-text-muted">Trigger:</label>
        <select
          value={trigger}
          onChange={e => onTriggerChange(e.target.value)}
          className="px-3 py-1 bg-surface-2 border border-border rounded text-sm"
        >
          <option value="manual">Manual</option>
          <option value="interval">Interval</option>
          <option value="onData">On Data</option>
          <option value="onConnect">On Connect</option>
        </select>
      </div>

      {trigger === 'interval' && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-text-muted">Interval:</label>
          <input
            type="number"
            value={intervalMs}
            onChange={e => onIntervalChange(Number(e.target.value))}
            className="w-24 px-3 py-1 bg-surface-2 border border-border rounded text-sm"
          />
          <span className="text-sm text-text-muted">ms</span>
        </div>
      )}
    </div>
  );
}
