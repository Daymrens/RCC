'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useDevice } from '@/hooks/useDevice';
import DeviceStatusBadge from '@/components/devices/DeviceStatusBadge';

export default function DevicePage() {
  const params = useParams();
  const { device, status, connect, disconnect } = useDevice(params.id as string);
  const [stats, setStats] = useState({ uptime: 0, sent: 0, received: 0 });

  if (!device) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{device.name}</h1>
        <div className="flex items-center gap-4">
          <DeviceStatusBadge status={status as any} />
          {status === 'connected' ? (
            <button
              onClick={disconnect}
              className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-600"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={connect}
              className="px-4 py-2 bg-success text-white rounded-lg hover:bg-green-600"
            >
              Connect
            </button>
          )}
        </div>
      </div>
      
      <div className="flex gap-4 mb-8 border-b border-border">
        <Link
          href={`/devices/${device.id}/dashboard`}
          className="px-4 py-2 hover:text-accent border-b-2 border-transparent hover:border-accent"
        >
          Dashboard
        </Link>
        <Link
          href={`/devices/${device.id}/functions`}
          className="px-4 py-2 hover:text-accent border-b-2 border-transparent hover:border-accent"
        >
          Functions
        </Link>
        <Link
          href={`/devices/${device.id}/flows`}
          className="px-4 py-2 hover:text-accent border-b-2 border-transparent hover:border-accent"
        >
          Flows
        </Link>
        <Link
          href={`/devices/${device.id}/logs`}
          className="px-4 py-2 hover:text-accent border-b-2 border-transparent hover:border-accent"
        >
          Logs
        </Link>
        <Link
          href={`/devices/${device.id}/settings`}
          className="px-4 py-2 hover:text-accent border-b-2 border-transparent hover:border-accent"
        >
          Settings
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface rounded-lg p-4">
          <div className="text-sm text-text-muted mb-1">Uptime</div>
          <div className="text-2xl font-bold">{stats.uptime}s</div>
        </div>
        <div className="bg-surface rounded-lg p-4">
          <div className="text-sm text-text-muted mb-1">Messages Sent</div>
          <div className="text-2xl font-bold">{stats.sent}</div>
        </div>
        <div className="bg-surface rounded-lg p-4">
          <div className="text-sm text-text-muted mb-1">Messages Received</div>
          <div className="text-2xl font-bold">{stats.received}</div>
        </div>
      </div>

      <div className="bg-surface rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Device Info</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Type:</span>
            <span>{device.type === 'serial' ? 'Serial (USB)' : 'Bluetooth BLE'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Status:</span>
            <span>{status}</span>
          </div>
          {device.pluginId && (
            <div className="flex justify-between">
              <span className="text-text-muted">Plugin:</span>
              <span>{device.pluginId}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-text-muted">Created:</span>
            <span>{new Date(device.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
