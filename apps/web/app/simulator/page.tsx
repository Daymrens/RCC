'use client';

import { useState, useEffect } from 'react';
import { Play, Square, Zap, Activity } from 'lucide-react';

export default function SimulatorPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [sensors, setSensors] = useState({
    temperature: 25,
    humidity: 50,
    distance: 100,
    light: 500,
    speed: 0,
    battery: 100
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [command, setCommand] = useState('');

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        // Simulate sensor updates
        setSensors(prev => ({
          temperature: prev.temperature + (Math.random() - 0.5) * 2,
          humidity: Math.max(0, Math.min(100, prev.humidity + (Math.random() - 0.5) * 5)),
          distance: Math.max(0, prev.distance + (Math.random() - 0.5) * 20),
          light: Math.max(0, prev.light + (Math.random() - 0.5) * 50),
          speed: prev.speed,
          battery: Math.max(0, Math.min(100, prev.battery - 0.01))
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
    addLog('✅ Simulator started');
  };

  const handleStop = () => {
    setIsRunning(false);
    addLog('⏹️ Simulator stopped');
  };

  const handleSendCommand = () => {
    if (!command.trim()) return;
    
    addLog(`📤 Sent: ${command}`);
    
    try {
      const cmd = JSON.parse(command);
      handleCommand(cmd);
    } catch {
      addLog(`📥 Echo: ${command}`);
    }
    
    setCommand('');
  };

  const handleCommand = (cmd: any) => {
    switch (cmd.type) {
      case 'move':
        setSensors(prev => ({ ...prev, speed: cmd.speed || 100 }));
        addLog(`🚗 Moving ${cmd.direction} at speed ${cmd.speed}`);
        break;
      case 'stop':
        setSensors(prev => ({ ...prev, speed: 0 }));
        addLog('🛑 Stopped');
        break;
      case 'lights':
        addLog(`💡 Lights ${cmd.state}`);
        break;
      case 'horn':
        addLog('📢 Horn activated');
        break;
      default:
        addLog(`📥 Received: ${JSON.stringify(cmd)}`);
    }
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-49), `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const quickCommands = [
    { label: 'Move Forward', cmd: '{"type":"move","direction":"forward","speed":200}' },
    { label: 'Stop', cmd: '{"type":"stop"}' },
    { label: 'Lights On', cmd: '{"type":"lights","state":"on"}' },
    { label: 'Horn', cmd: '{"type":"horn"}' }
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Device Simulator</h1>
          <p className="text-sm text-text-muted mt-1">
            Test your code without physical hardware
          </p>
        </div>
        <div className="flex gap-2">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-green-600"
            >
              <Play size={20} />
              Start Simulator
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="flex items-center gap-2 px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-600"
            >
              <Square size={20} />
              Stop Simulator
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sensor Dashboard */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Activity size={20} />
            Virtual Sensors
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface rounded-lg p-4">
              <div className="text-sm text-text-muted mb-1">Temperature</div>
              <div className="text-2xl font-bold">{sensors.temperature.toFixed(1)}°C</div>
            </div>
            
            <div className="bg-surface rounded-lg p-4">
              <div className="text-sm text-text-muted mb-1">Humidity</div>
              <div className="text-2xl font-bold">{sensors.humidity.toFixed(1)}%</div>
            </div>
            
            <div className="bg-surface rounded-lg p-4">
              <div className="text-sm text-text-muted mb-1">Distance</div>
              <div className="text-2xl font-bold">{sensors.distance.toFixed(0)}cm</div>
            </div>
            
            <div className="bg-surface rounded-lg p-4">
              <div className="text-sm text-text-muted mb-1">Light</div>
              <div className="text-2xl font-bold">{sensors.light.toFixed(0)}lux</div>
            </div>
            
            <div className="bg-surface rounded-lg p-4">
              <div className="text-sm text-text-muted mb-1">Speed</div>
              <div className="text-2xl font-bold">{sensors.speed.toFixed(0)}</div>
            </div>
            
            <div className="bg-surface rounded-lg p-4">
              <div className="text-sm text-text-muted mb-1">Battery</div>
              <div className="text-2xl font-bold">{sensors.battery.toFixed(1)}%</div>
            </div>
          </div>

          {/* Quick Commands */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Quick Commands</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickCommands.map((qc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCommand(qc.cmd);
                    setTimeout(() => handleSendCommand(), 100);
                  }}
                  disabled={!isRunning}
                  className="px-3 py-2 bg-surface-2 rounded hover:bg-surface-3 disabled:opacity-50 text-sm"
                >
                  {qc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Command Interface */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Zap size={20} />
            Command Interface
          </h2>
          
          <div className="bg-surface rounded-lg p-4">
            <label className="block text-sm text-text-muted mb-2">
              Send Command (JSON)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={command}
                onChange={e => setCommand(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendCommand()}
                placeholder='{"type":"move","speed":200}'
                disabled={!isRunning}
                className="flex-1 px-3 py-2 bg-surface-2 border border-border rounded-lg disabled:opacity-50"
              />
              <button
                onClick={handleSendCommand}
                disabled={!isRunning || !command.trim()}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>

          {/* Logs */}
          <div className="bg-surface rounded-lg p-4">
            <div className="text-sm font-semibold mb-2">Activity Log</div>
            <div className="h-96 overflow-y-auto bg-surface-2 rounded p-2 font-mono text-xs space-y-1">
              {logs.length === 0 ? (
                <div className="text-text-muted">No activity yet. Start the simulator to begin.</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="text-text-primary">{log}</div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-surface-2 rounded-lg border border-border">
        <h3 className="font-semibold mb-2">💡 How to Use</h3>
        <ul className="text-sm text-text-muted space-y-1">
          <li>• Click "Start Simulator" to begin virtual device</li>
          <li>• Sensors update automatically every second</li>
          <li>• Send JSON commands to test device responses</li>
          <li>• Use quick commands for common operations</li>
          <li>• Perfect for testing code before connecting real hardware</li>
        </ul>
      </div>
    </div>
  );
}
