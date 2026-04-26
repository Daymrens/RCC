'use client';

import { useState } from 'react';

interface ToggleWidgetProps {
  label: string;
  config: { onCommand: string; offCommand: string };
  onSend: (command: string) => void;
}

export default function ToggleWidget({ label, config, onSend }: ToggleWidgetProps) {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    const newState = !isOn;
    setIsOn(newState);
    onSend(newState ? config.onCommand : config.offCommand);
  };

  return (
    <div className="p-4 bg-surface-2 rounded-lg h-full flex flex-col items-center justify-center">
      <div className="text-sm font-semibold mb-4">{label}</div>
      <button
        onClick={handleToggle}
        className={`w-16 h-8 rounded-full transition-colors relative ${
          isOn ? 'bg-success' : 'bg-surface-3'
        }`}
      >
        <div
          className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
            isOn ? 'translate-x-9' : 'translate-x-1'
          }`}
        />
      </button>
      <div className="text-xs text-text-muted mt-2">{isOn ? 'ON' : 'OFF'}</div>
    </div>
  );
}
