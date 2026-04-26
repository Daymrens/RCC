'use client';

import { useState, useEffect } from 'react';
import { Keyboard, X } from 'lucide-react';

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const shortcuts: Shortcut[] = [
  { keys: ['Ctrl', 'K'], description: 'Open command palette', category: 'Global' },
  { keys: ['Ctrl', 'H'], description: 'Go to home', category: 'Navigation' },
  { keys: ['Ctrl', 'P'], description: 'Browse plugins', category: 'Navigation' },
  { keys: ['Ctrl', 'S'], description: 'Save (in editor)', category: 'Editor' },
  { keys: ['Ctrl', 'R'], description: 'Run (in editor)', category: 'Editor' },
  { keys: ['Ctrl', 'E'], description: 'Toggle console', category: 'Editor' },
  { keys: ['Ctrl', '/'], description: 'Search', category: 'Global' },
  { keys: ['ESC'], description: 'Close dialogs', category: 'Global' },
  { keys: ['?'], description: 'Show shortcuts', category: 'Global' }
];

export default function ShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setIsOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-3 bg-surface border border-border rounded-full shadow-lg hover:bg-surface-2"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard size={20} />
      </button>
    );
  }

  const categories = Array.from(new Set(shortcuts.map(s => s.category)));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h2 className="text-lg font-bold">Keyboard Shortcuts</h2>
          <button onClick={() => setIsOpen(false)} className="text-text-muted hover:text-text">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          {categories.map(category => (
            <div key={category} className="mb-6">
              <h3 className="font-semibold mb-3 text-accent">{category}</h3>
              <div className="space-y-2">
                {shortcuts
                  .filter(s => s.category === category)
                  .map((shortcut, i) => (
                    <div key={i} className="flex justify-between items-center py-2">
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, j) => (
                          <kbd
                            key={j}
                            className="px-2 py-1 bg-surface-2 border border-border rounded text-xs font-mono"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border text-xs text-text-muted text-center">
          Press <kbd className="px-1.5 py-0.5 bg-surface-2 rounded">?</kbd> anytime to show this help
        </div>
      </div>
    </div>
  );
}
