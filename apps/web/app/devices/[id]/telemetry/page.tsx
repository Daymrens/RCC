'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { socket } from '@/lib/socket';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Pause, Play } from 'lucide-react';

export default function TelemetryPage() {
  const params = useParams();
  const [telemetryData, setTelemetryData] = useState<Record<string, any[]>>({});
  const [isPaused, setIsPaused] = useState(false);
  const [maxDataPoints, setMaxDataPoints] = useState(50);

  useEffect(() => {
    const handleData = (data: any) => {
      if (data.deviceId === params.id && !isPaused) {
        try {
          const parsed = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
          const timestamp = new Date().toLocaleTimeString();

          setTelemetryData(prev => {
            const updated = { ...prev };
            Object.keys(parsed).forEach(key => {
              if (typeof parsed[key] === 'number') {
                if (!updated[key]) updated[key] = [];
                updated[key] = [...updated[key], { time: timestamp, value: parsed[key] }].slice(-maxDataPoints);
              }
            });
            return updated;
          });
        } catch (e) {
          // Not JSON data, skip
        }
      }
    };

    socket.on('device:data', handleData);
    return () => {
      socket.off('device:data', handleData);
    };
  }, [params.id, isPaused, maxDataPoints]);

  const exportData = () => {
    const csv = Object.entries(telemetryData).map(([key, values]) => {
      const header = `${key},time,value\n`;
      const rows = values.map(v => `${key},${v.time},${v.value}`).join('\n');
      return header + rows;
    }).join('\n\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telemetry-${Date.now()}.csv`;
    a.click();
  };

  const clearData = () => {
    setTelemetryData({});
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Telemetry</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isPaused ? 'bg-success' : 'bg-warning'
            } text-white`}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={clearData}
            className="px-4 py-2 bg-surface-2 rounded-lg hover:bg-surface-3"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm text-text-muted">Max Data Points:</label>
        <select
          value={maxDataPoints}
          onChange={e => setMaxDataPoints(Number(e.target.value))}
          className="px-3 py-1 bg-surface-2 border border-border rounded"
        >
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
        </select>
      </div>

      {Object.keys(telemetryData).length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <p className="mb-2">No telemetry data yet</p>
          <p className="text-sm">Connect device and send JSON data with numeric values</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(telemetryData).map(([key, values]) => (
            <div key={key} className="bg-surface rounded-lg p-4">
              <h3 className="font-semibold mb-4 capitalize">{key}</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={values}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A30" />
                  <XAxis dataKey="time" stroke="#6B7280" fontSize={11} />
                  <YAxis stroke="#6B7280" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1A1A1E', border: '1px solid #2A2A30' }}
                    labelStyle={{ color: '#F0F0F5' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-2 text-sm text-text-muted text-center">
                Current: {values[values.length - 1]?.value.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
