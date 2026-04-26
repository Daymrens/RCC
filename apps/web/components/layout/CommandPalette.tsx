'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Zap, Code, GitBranch, LayoutDashboard, FileText, Settings, Plus } from 'lucide-react';

interface Command {
  id: string;
  label: string;
  icon: any;
  action: () => void;
  keywords: string[];
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [devices, setDevices] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:3001/api/devices')
        .then(res => res.json())
        .then(setDevices);
    }
  }, [isOpen]);

  const commands: Command[] = [
    {
      id: 'new-device',
      label: 'Add New Device',
      icon: Plus,
      action: () => router.push('/?addDevice=true'),
      keywords: ['add', 'new', 'device', 'create']
    },
    {
      id: 'plugins',
      label: 'Browse Plugins',
      icon: Zap,
      action: () => router.push('/plugins'),
      keywords: ['plugins', 'browse', 'marketplace']
    },
    ...devices.map(device => ({
      id: `device-${device.id}`,
      label: `Go to ${device.name}`,
      icon: LayoutDashboard,
      action: () => router.push(`/devices/${device.id}`),
      keywords: ['device', device.name.toLowerCase(), 'go']
    })),
    ...devices.map(device => ({
      id: `functions-${device.id}`,
      label: `${device.name} - Functions`,
      icon: Code,
      action: () => router.push(`/devices/${device.id}/functions`),
      keywords: ['functions', 'code', device.name.toLowerCase()]
    })),
    ...devices.map(device => ({
      id: `flows-${device.id}`,
      label: `${device.name} - Flows`,
      icon: GitBranch,
      action: () => router.push(`/devices/${device.id}/flows`),
      keywords: ['flows', 'visual', device.name.toLowerCase()]
    })),
    ...devices.map(device => ({
      id: `dashboard-${device.id}`,
      label: `${device.name} - Dashboard`,
      icon: LayoutDashboard,
      action: () => router.push(`/devices/${device.id}/dashboard`),
      keywords: ['dashboard', 'widgets', device.name.toLowerCase()]
    })),
    ...devices.map(device => ({
      id: `logs-${device.id}`,
      label: `${device.name} - Logs`,
      icon: FileText,
      action: () => router.push(`/devices/${device.id}/logs`),
      keywords: ['logs', 'console', device.name.toLowerCase()]
    })),
    ...devices.map(device => ({
      id: `settings-${device.id}`,
      label: `${device.name} - Settings`,
      icon: Settings,
      action: () => router.push(`/devices/${device.id}/settings`),
      keywords: ['settings', 'config', device.name.toLowerCase()]
    }))
  ];

  const filteredCommands = commands.filter(cmd => {
    const searchLower = search.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(searchLower) ||
      cmd.keywords.some(kw => kw.includes(searchLower))
    );
  });

  const handleSelect = (command: Command) => {
    command.action();
    setIsOpen(false);
    setSearch('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50">
      <div className="bg-surface rounded-lg w-full max-w-2xl shadow-lg">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search size={20} className="text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent outline-none"
            autoFocus
          />
          <kbd className="px-2 py-1 bg-surface-2 rounded text-xs text-text-muted">ESC</kbd>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-text-muted">
              No commands found
            </div>
          ) : (
            filteredCommands.slice(0, 10).map((command, index) => {
              const Icon = command.icon;
              return (
                <button
                  key={command.id}
                  onClick={() => handleSelect(command)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-surface-2 text-left"
                >
                  <Icon size={18} className="text-text-muted" />
                  <span>{command.label}</span>
                </button>
              );
            })
          )}
        </div>

        <div className="p-3 border-t border-border text-xs text-text-muted flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-surface-2 rounded">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-surface-2 rounded">↵</kbd> Select
            </span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-surface-2 rounded">Ctrl</kbd>
            <kbd className="px-1.5 py-0.5 bg-surface-2 rounded">K</kbd> to open
          </span>
        </div>
      </div>
    </div>
  );
}
