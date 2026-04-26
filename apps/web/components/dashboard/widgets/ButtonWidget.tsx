'use client';

import { useState } from 'react';

interface ButtonWidgetProps {
  label: string;
  command: string;
  config: { color?: string; size?: string };
  onSend: (command: string) => void;
}

export default function ButtonWidget({ label, command, config, onSend }: ButtonWidgetProps) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(true);
    onSend(command);
    setTimeout(() => setPressed(false), 200);
  };

  return (
    <div className="p-4 bg-surface-2 rounded-lg h-full flex flex-col items-center justify-center">
      <button
        onClick={handleClick}
        className={`w-full py-4 rounded-lg font-semibold transition-transform ${
          pressed ? 'scale-95' : 'scale-100'
        } ${config.color === 'success' ? 'bg-success' : 'bg-accent'} text-white hover:opacity-90`}
      >
        {label}
      </button>
    </div>
  );
}
