import Link from 'next/link';
import { Circle } from 'lucide-react';

export default function DeviceCard({ device }: { device: any }) {
  const statusColor = {
    connected: 'text-success',
    connecting: 'text-warning',
    disconnected: 'text-text-dim',
    error: 'text-danger'
  }[device.status] || 'text-text-dim';

  return (
    <Link href={`/devices/${device.id}`}>
      <div className="p-6 bg-surface rounded-lg border border-border hover:bg-surface-2 transition-colors cursor-pointer">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Circle className={`${statusColor} fill-current`} size={12} />
            <h3 className="font-semibold">{device.name}</h3>
          </div>
        </div>
        <p className="text-sm text-text-muted">
          {device.type === 'serial' ? 'Serial' : 'Bluetooth'} · {device.status}
        </p>
      </div>
    </Link>
  );
}
