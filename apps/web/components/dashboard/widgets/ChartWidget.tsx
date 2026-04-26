'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartWidgetProps {
  label: string;
  config: {
    dataKey: string;
    chartType: 'line' | 'area' | 'bar';
    maxDataPoints: number;
    color: string;
    unit?: string;
  };
  value?: number;
}

export default function ChartWidget({ label, config, value }: ChartWidgetProps) {
  const [data, setData] = useState<Array<{ time: string; value: number }>>([]);

  useEffect(() => {
    if (value !== undefined) {
      const timestamp = new Date().toLocaleTimeString();
      setData(prev => {
        const newData = [...prev, { time: timestamp, value }];
        return newData.slice(-config.maxDataPoints);
      });
    }
  }, [value, config.maxDataPoints]);

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 5, left: 0, bottom: 5 }
    };

    switch (config.chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A30" />
            <XAxis dataKey="time" stroke="#6B7280" fontSize={10} />
            <YAxis stroke="#6B7280" fontSize={10} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1A1A1E', border: '1px solid #2A2A30' }}
              labelStyle={{ color: '#F0F0F5' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={config.color}
              fill={config.color}
              fillOpacity={0.3}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A30" />
            <XAxis dataKey="time" stroke="#6B7280" fontSize={10} />
            <YAxis stroke="#6B7280" fontSize={10} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1A1A1E', border: '1px solid #2A2A30' }}
              labelStyle={{ color: '#F0F0F5' }}
            />
            <Bar dataKey="value" fill={config.color} />
          </BarChart>
        );

      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A30" />
            <XAxis dataKey="time" stroke="#6B7280" fontSize={10} />
            <YAxis stroke="#6B7280" fontSize={10} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1A1A1E', border: '1px solid #2A2A30' }}
              labelStyle={{ color: '#F0F0F5' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={config.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="p-4 bg-surface-2 rounded-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-xs text-text-muted">
          {data.length > 0 && `${data[data.length - 1].value}${config.unit || ''}`}
        </span>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
