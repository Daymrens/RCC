'use client';

import { useEffect, useState } from 'react';

interface DisplayWidgetProps {
  label: string;
  config: { dataKey: string; unit: string; fontSize?: string };
  value?: string | number;
}

export default function DisplayWidget({ label, config, value = '-' }: DisplayWidgetProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setFlash(true);
      setDisplayValue(value);
      setTimeout(() => setFlash(false), 300);
    }
  }, [value]);

  return (
    <div className="p-4 bg-surface-2 rounded-lg h-full flex flex-col items-center justify-center">
      <div className="text-sm font-semibold text-text-muted mb-2">{label}</div>
      <div
        className={`text-3xl font-mono font-bold transition-colors ${
          flash ? 'text-accent' : 'text-text'
        }`}
      >
        {displayValue}
        {config.unit && <span className="text-lg text-text-muted ml-1">{config.unit}</span>}
      </div>
    </div>
  );
}
