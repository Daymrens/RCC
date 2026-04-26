import { Circle } from 'lucide-react';

interface DeviceStatusBadgeProps {
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
}

export default function DeviceStatusBadge({ status }: DeviceStatusBadgeProps) {
  const config = {
    connected: {
      color: 'text-success',
      label: 'Connected',
      animate: 'animate-pulse'
    },
    connecting: {
      color: 'text-warning',
      label: 'Connecting…',
      animate: 'animate-spin'
    },
    disconnected: {
      color: 'text-text-dim',
      label: 'Disconnected',
      animate: ''
    },
    error: {
      color: 'text-danger',
      label: 'Error',
      animate: ''
    }
  }[status];

  return (
    <div className="flex items-center gap-2">
      <Circle className={`${config.color} fill-current ${config.animate}`} size={12} />
      <span className="text-sm">{config.label}</span>
    </div>
  );
}
