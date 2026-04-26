'use client';

import { useState, useEffect } from 'react';
import { Clock, Plus, Play, Pause, Trash2, History } from 'lucide-react';

export default function SchedulerPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    schedule: '0 * * * *',
    type: 'command',
    command: '',
    targetId: ''
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const res = await fetch('http://localhost:3001/api/scheduler');
    const data = await res.json();
    setTasks(data);
  };

  const handleCreate = async () => {
    await fetch('http://localhost:3001/api/scheduler', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    setShowCreateDialog(false);
    setFormData({
      name: '',
      description: '',
      schedule: '0 * * * *',
      type: 'command',
      command: '',
      targetId: ''
    });
    loadTasks();
  };

  const handleToggle = async (taskId: string) => {
    await fetch(`http://localhost:3001/api/scheduler/${taskId}/toggle`, {
      method: 'POST'
    });
    loadTasks();
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Delete this task?')) return;
    
    await fetch(`http://localhost:3001/api/scheduler/${taskId}`, {
      method: 'DELETE'
    });
    loadTasks();
  };

  const handleViewHistory = async (task: any) => {
    setSelectedTask(task);
    const res = await fetch(`http://localhost:3001/api/scheduler/${task.id}/history`);
    const data = await res.json();
    setHistory(data);
    setShowHistoryDialog(true);
  };

  const cronPresets = [
    { label: 'Every minute', value: '* * * * *' },
    { label: 'Every hour', value: '0 * * * *' },
    { label: 'Every day at midnight', value: '0 0 * * *' },
    { label: 'Every day at noon', value: '0 12 * * *' },
    { label: 'Every Monday at 9am', value: '0 9 * * 1' },
    { label: 'Every 5 minutes', value: '*/5 * * * *' },
    { label: 'Every 15 minutes', value: '*/15 * * * *' },
    { label: 'Every 30 minutes', value: '*/30 * * * *' }
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Clock size={28} />
            Scheduled Tasks
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Automate device operations with cron schedules
          </p>
        </div>
        <button
          onClick={() => setShowCreateDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={20} />
          New Task
        </button>
      </div>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="text-center py-16">
          <Clock size={64} className="mx-auto text-text-dim mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Scheduled Tasks</h3>
          <p className="text-text-muted mb-4">
            Create your first scheduled task to automate operations
          </p>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={20} />
            Create Task
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="bg-surface rounded-lg p-6 border border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{task.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.isActive ? 'bg-success/20 text-success' : 'bg-surface-2 text-text-muted'
                    }`}>
                      {task.isActive ? 'Active' : 'Paused'}
                    </span>
                    <span className="px-2 py-1 bg-surface-2 rounded text-xs">
                      {task.type}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-sm text-text-muted mb-3">{task.description}</p>
                  )}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-text-muted">Schedule:</span>
                      <code className="ml-2 px-2 py-1 bg-surface-2 rounded">{task.schedule}</code>
                    </div>
                    <div>
                      <span className="text-text-muted">Executions:</span>
                      <span className="ml-2">{task.executionCount}</span>
                    </div>
                    <div>
                      <span className="text-text-muted">Last Run:</span>
                      <span className="ml-2">
                        {task.lastExecutedAt 
                          ? new Date(task.lastExecutedAt).toLocaleString()
                          : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewHistory(task)}
                    className="p-2 hover:bg-surface-2 rounded"
                    title="View History"
                  >
                    <History size={18} />
                  </button>
                  <button
                    onClick={() => handleToggle(task.id)}
                    className="p-2 hover:bg-surface-2 rounded"
                    title={task.isActive ? 'Pause' : 'Resume'}
                  >
                    {task.isActive ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-2 hover:bg-surface-2 rounded text-danger"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg w-full max-w-2xl">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold">Create Scheduled Task</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-2">Task Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Daily sensor reading"
                  className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm text-text-muted mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What does this task do?"
                  rows={2}
                  className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-text-muted mb-2">Schedule (Cron) *</label>
                  <select
                    value={formData.schedule}
                    onChange={e => setFormData({ ...formData, schedule: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
                  >
                    {cronPresets.map(preset => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-text-muted mb-2">Type *</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg"
                  >
                    <option value="command">Send Command</option>
                    <option value="function">Run Function</option>
                    <option value="flow">Run Flow</option>
                  </select>
                </div>
              </div>

              {formData.type === 'command' && (
                <div>
                  <label className="block text-sm text-text-muted mb-2">Command (JSON) *</label>
                  <input
                    type="text"
                    value={formData.command}
                    onChange={e => setFormData({ ...formData, command: e.target.value })}
                    placeholder='{"type":"read","sensor":"temperature"}'
                    className="w-full px-3 py-2 bg-surface-2 border border-border rounded-lg font-mono text-sm"
                  />
                </div>
              )}
            </div>
            <div className="p-6 border-t border-border flex gap-2">
              <button
                onClick={handleCreate}
                disabled={!formData.name || !formData.schedule}
                className="flex-1 py-2 bg-accent text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Create Task
              </button>
              <button
                onClick={() => setShowCreateDialog(false)}
                className="px-6 py-2 bg-surface-2 rounded-lg hover:bg-surface-3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Dialog */}
      {showHistoryDialog && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-bold">Execution History: {selectedTask.name}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {history.length === 0 ? (
                <div className="text-center py-8 text-text-muted">
                  No execution history yet
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map(exec => (
                    <div key={exec.id} className="bg-surface-2 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              exec.status === 'success' 
                                ? 'bg-success/20 text-success' 
                                : 'bg-danger/20 text-danger'
                            }`}>
                              {exec.status}
                            </span>
                            <span className="text-sm text-text-muted">
                              {new Date(exec.executedAt).toLocaleString()}
                            </span>
                          </div>
                          {exec.error && (
                            <div className="text-sm text-danger mt-2">{exec.error}</div>
                          )}
                        </div>
                        {exec.duration && (
                          <div className="text-sm text-text-muted">
                            {exec.duration}ms
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 border-t border-border">
              <button
                onClick={() => setShowHistoryDialog(false)}
                className="w-full py-2 bg-surface-2 rounded-lg hover:bg-surface-3"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 bg-surface-2 rounded-lg border border-border">
        <h3 className="font-semibold mb-2">💡 Cron Schedule Format</h3>
        <div className="text-sm text-text-muted space-y-1">
          <div><code>* * * * *</code> = minute hour day month weekday</div>
          <div>Examples:</div>
          <ul className="ml-4 space-y-1">
            <li>• <code>0 * * * *</code> - Every hour</li>
            <li>• <code>*/5 * * * *</code> - Every 5 minutes</li>
            <li>• <code>0 9 * * 1-5</code> - 9am on weekdays</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
