'use client';

import { useState } from 'react';

interface SliderWidgetProps {
  label: string;
  command: string;
  config: { min: number; max: number; step: number };
  onSend: (command: string) => void;
}

export default function SliderWidget({ label, command, config, onSend }: SliderWidgetProps) {
  const [value, setValue] = useState(config.min);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setValue(newValue);
    onSend(`${command}${newValue}`);
  };

  return (
    <div className="p-4 bg-surface-2 rounded-lg h-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold">{label}</span>
        <span className="font-mono text-sm">{value}</span>
      </div>
      <input
        type="range"
        min={config.min}
        max={config.max}
        step={config.step}
        value={value}
        onChange={handleChange}
        className="w-full accent-accent"
      />
      <div className="flex justify-between text-xs text-text-muted mt-1">
        <span>{config.min}</span>
        <span>{config.max}</span>
      </div>
    </div>
  );
}
