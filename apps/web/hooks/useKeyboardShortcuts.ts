import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;

        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          altMatch
        ) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export function useGlobalShortcuts() {
  const router = useRouter();

  const shortcuts: Shortcut[] = [
    {
      key: 'h',
      ctrl: true,
      description: 'Go to home',
      action: () => router.push('/')
    },
    {
      key: 'p',
      ctrl: true,
      description: 'Browse plugins',
      action: () => router.push('/plugins')
    },
    {
      key: '/',
      ctrl: true,
      description: 'Search',
      action: () => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        searchInput?.focus();
      }
    }
  ];

  useKeyboardShortcuts(shortcuts);
}

export const EDITOR_SHORTCUTS: Shortcut[] = [
  {
    key: 's',
    ctrl: true,
    description: 'Save',
    action: () => {} // Will be overridden
  },
  {
    key: 'r',
    ctrl: true,
    description: 'Run',
    action: () => {} // Will be overridden
  },
  {
    key: 'e',
    ctrl: true,
    description: 'Toggle console',
    action: () => {} // Will be overridden
  }
];
