'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Circle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/devices')
      .then(res => res.json())
      .then(setDevices);
  }, []);

  const statusColor = (status: string) => ({
    connected: 'text-success',
    connecting: 'text-warning',
    disconnected: 'text-text-dim',
    error: 'text-danger'
  }[status] || 'text-text-dim');

  return (
    <aside className={`bg-surface border-r border-border transition-all ${collapsed ? 'w-14' : 'w-56'}`}>
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <h1 className="text-xl font-bold text-accent">RoboDesk</h1>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-surface-2 rounded"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="p-4">
        {!collapsed && <div className="text-xs text-text-muted mb-2">DEVICES</div>}
        <div className="space-y-1">
          {devices.map(device => (
            <Link
              key={device.id}
              href={`/devices/${device.id}`}
              className="flex items-center gap-2 py-2 px-3 rounded hover:bg-surface-2"
              title={collapsed ? device.name : undefined}
            >
              <Circle className={`${statusColor(device.status)} fill-current`} size={8} />
              {!collapsed && <span className="text-sm truncate">{device.name}</span>}
            </Link>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          {!collapsed && <div className="text-xs text-text-muted mb-2">WORKSPACE</div>}
          <Link
            href="/simulator"
            className="flex items-center gap-2 py-2 px-3 rounded hover:bg-surface-2"
            title={collapsed ? 'Simulator' : undefined}
          >
            <span>🎮</span>
            {!collapsed && <span className="text-sm">Simulator</span>}
          </Link>
          <Link
            href="/library"
            className="flex items-center gap-2 py-2 px-3 rounded hover:bg-surface-2"
            title={collapsed ? 'Code Library' : undefined}
          >
            <span>📚</span>
            {!collapsed && <span className="text-sm">Code Library</span>}
          </Link>
          <Link
            href="/analytics"
            className="flex items-center gap-2 py-2 px-3 rounded hover:bg-surface-2"
            title={collapsed ? 'Analytics' : undefined}
          >
            <span>📊</span>
            {!collapsed && <span className="text-sm">Analytics</span>}
          </Link>
          <Link
            href="/scheduler"
            className="flex items-center gap-2 py-2 px-3 rounded hover:bg-surface-2"
            title={collapsed ? 'Scheduler' : undefined}
          >
            <span>⏰</span>
            {!collapsed && <span className="text-sm">Scheduler</span>}
          </Link>
          <Link
            href="/plugins"
            className="flex items-center gap-2 py-2 px-3 rounded hover:bg-surface-2"
            title={collapsed ? 'Plugins' : undefined}
          >
            <span>🧩</span>
            {!collapsed && <span className="text-sm">Plugins</span>}
          </Link>
          <Link
            href="/multi-control"
            className="flex items-center gap-2 py-2 px-3 rounded hover:bg-surface-2"
            title={collapsed ? 'Multi-Control' : undefined}
          >
            <span>🕹️</span>
            {!collapsed && <span className="text-sm">Multi-Control</span>}
          </Link>
        </div>
      </nav>
    </aside>
  );
}
