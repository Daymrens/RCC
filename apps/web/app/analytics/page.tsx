'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Download, RefreshCw } from 'lucide-react';

export default function AnalyticsPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [metrics, setMetrics] = useState<string[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [data, setData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<string>('1h');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDevices();
  }, []);

  useEffect(() => {
    if (selectedDevice) {
      loadMetrics();
    }
  }, [selectedDevice]);

  useEffect(() => {
    if (selectedDevice && selectedMetric) {
      loadData();
    }
  }, [selectedDevice, selectedMetric, timeRange]);

  const loadDevices = async () => {
    const res = await fetch('http://localhost:3001/api/devices');
    const devices = await res.json();
    setDevices(devices);
    if (devices.length > 0) {
      setSelectedDevice(devices[0].id);
    }
  };

  const loadMetrics = async () => {
    const res = await fetch(`http://localhost:3001/api/analytics/metrics/${selectedDevice}`);
    const metrics = await res.json();
    setMetrics(metrics);
    if (metrics.length > 0) {
      setSelectedMetric(metrics[0]);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const now = Date.now();
      const ranges: any = {
        '1h': 60 * 60 * 1000,
        '6h': 6 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      };

      const from = now - ranges[timeRange];
      const res = await fetch(
        `http://localhost:3001/api/analytics/data/${selectedDevice}?metric=${selectedMetric}&from=${from}&to=${now}`
      );
      const rawData = await res.json();

      // Format data for charts
      const formatted = rawData.map((d: any) => ({
        time: new Date(d.timestamp).toLocaleTimeString(),
        value: parseFloat(d.value),
        timestamp: d.timestamp
      }));

      setData(formatted);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const csv = [
      ['Timestamp', 'Time', 'Value'],
      ...data.map(d => [d.timestamp, d.time, d.value])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedMetric}-${Date.now()}.csv`;
    a.click();
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const chartComponents = {
      line: (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      ),
      bar: (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      ),
      area: (
        <AreaChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
        </AreaChart>
      )
    };

    return (
      <ResponsiveContainer width="100%" height={400}>
        {chartComponents[chartType]}
      </ResponsiveContainer>
    );
  };

  const stats = data.length > 0 ? {
    min: Math.min(...data.map(d => d.value)).toFixed(2),
    max: Math.max(...data.map(d => d.value)).toFixed(2),
    avg: (data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(2),
    latest: data[data.length - 1]?.value.toFixed(2)
  } : null;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp size={28} />
            Data Analytics
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Visualize and analyze device data
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadData}
            disabled={loading || !selectedDevice || !selectedMetric}
            className="flex items-center gap-2 px-4 py-2 bg-surface-2 rounded-lg hover:bg-surface-3 disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
            disabled={data.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-sm text-text-muted mb-2">Device</label>
          <select
            value={selectedDevice}
            onChange={e => setSelectedDevice(e.target.value)}
            className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
          >
            {devices.map(device => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-text-muted mb-2">Metric</label>
          <select
            value={selectedMetric}
            onChange={e => setSelectedMetric(e.target.value)}
            className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
          >
            {metrics.map(metric => (
              <option key={metric} value={metric}>
                {metric}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-text-muted mb-2">Chart Type</label>
          <select
            value={chartType}
            onChange={e => setChartType(e.target.value as any)}
            className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="area">Area Chart</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-text-muted mb-2">Time Range</label>
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
          >
            <option value="1h">Last Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-text-muted mb-2">Data Points</label>
          <div className="px-3 py-2 bg-surface-2 border border-border rounded-lg text-center">
            {data.length}
          </div>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-surface rounded-lg p-4">
            <div className="text-sm text-text-muted mb-1">Latest</div>
            <div className="text-2xl font-bold">{stats.latest}</div>
          </div>
          <div className="bg-surface rounded-lg p-4">
            <div className="text-sm text-text-muted mb-1">Average</div>
            <div className="text-2xl font-bold">{stats.avg}</div>
          </div>
          <div className="bg-surface rounded-lg p-4">
            <div className="text-sm text-text-muted mb-1">Minimum</div>
            <div className="text-2xl font-bold">{stats.min}</div>
          </div>
          <div className="bg-surface rounded-lg p-4">
            <div className="text-sm text-text-muted mb-1">Maximum</div>
            <div className="text-2xl font-bold">{stats.max}</div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-surface rounded-lg p-6">
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="text-text-muted">Loading data...</div>
          </div>
        ) : data.length === 0 ? (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp size={64} className="mx-auto text-text-dim mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
              <p className="text-text-muted">
                {!selectedDevice ? 'Select a device to view analytics' :
                 !selectedMetric ? 'No metrics found for this device' :
                 'No data in selected time range'}
              </p>
            </div>
          </div>
        ) : (
          renderChart()
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-surface-2 rounded-lg border border-border">
        <h3 className="font-semibold mb-2">💡 How to Use</h3>
        <ul className="text-sm text-text-muted space-y-1">
          <li>• Select a device and metric to visualize</li>
          <li>• Choose chart type (line, bar, area)</li>
          <li>• Adjust time range to see historical data</li>
          <li>• Export data as CSV for external analysis</li>
          <li>• Data is automatically collected from device logs</li>
        </ul>
      </div>
    </div>
  );
}
