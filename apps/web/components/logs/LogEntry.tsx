interface LogEntryProps {
  log: {
    timestamp: Date;
    direction: 'in' | 'out';
    data: string;
  };
}

export default function LogEntry({ log }: LogEntryProps) {
  const directionColor = log.direction === 'out' ? 'text-blue-400' : 'text-green-400';
  const directionIcon = log.direction === 'out' ? '→' : '←';

  return (
    <div className="flex gap-4 hover:bg-surface-2 px-2 py-1 rounded font-mono text-sm">
      <span className="text-text-dim text-xs">
        {new Date(log.timestamp).toLocaleTimeString()}
      </span>
      <span className={directionColor}>{directionIcon}</span>
      <span className="flex-1 break-all">{log.data}</span>
    </div>
  );
}
