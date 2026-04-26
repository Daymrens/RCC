'use client';

import { useEffect, useState } from 'react';

interface GaugeWidgetProps {
  label: string;
  config: { min: number; max: number; unit: string; dataKey: string };
  value?: number;
}

export default function GaugeWidget({ label, config, value = 0 }: GaugeWidgetProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const percentage = ((displayValue - config.min) / (config.max - config.min)) * 100;
  const angle = (percentage / 100) * 180 - 90;

  return (
    <div className="p-4 bg-surface-2 rounded-lg h-full flex flex-col items-center justify-center">
      <div className="text-sm font-semibold mb-2">{label}</div>
      
      <div className="relative w-32 h-16">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <path
            d="M 10 45 A 40 40 0 0 1 90 45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-surface-3"
          />
          <path
            d="M 10 45 A 40 40 0 0 1 90 45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={`${percentage * 1.26} 126`}
            className="text-accent"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-mono font-bold">{displayValue.toFixed(0)}</span>
        </div>
      </div>
      
      <div className="text-xs text-text-muted mt-2">
        {config.min}{config.unit} - {config.max}{config.unit}
      </div>
    </div>
  );
}
