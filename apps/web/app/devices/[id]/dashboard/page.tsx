'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import DashboardGrid from '@/components/dashboard/DashboardGrid';
import AddWidgetDialog from '@/components/dashboard/AddWidgetDialog';

export default function DashboardPage() {
  const params = useParams();
  const [dashboards, setDashboards] = useState<any[]>([]);
  const [widgets, setWidgets] = useState<any[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDashboard, setCurrentDashboard] = useState<any>(null);

  useEffect(() => {
    loadDashboards();
  }, [params.id]);

  const loadDashboards = async () => {
    const res = await fetch(`http://localhost:3001/api/devices/${params.id}/dashboards`);
    const data = await res.json();
    setDashboards(data);
    
    if (data.length > 0) {
      setCurrentDashboard(data[0]);
      setWidgets(data[0].widgets || []);
    } else {
      // Create default dashboard
      const newDashboard = await fetch(`http://localhost:3001/api/devices/${params.id}/dashboards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Main Dashboard', layout: {} })
      }).then(r => r.json());
      
      setCurrentDashboard(newDashboard);
      setDashboards([newDashboard]);
    }
  };

  const handleAddWidget = (widget: any) => {
    setWidgets([...widgets, widget]);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-4 py-2 bg-surface-2 rounded-lg hover:bg-surface-3"
          >
            {editMode ? 'Done' : 'Edit Layout'}
          </button>
          <button
            onClick={() => setShowAddDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={20} />
            Add Widget
          </button>
        </div>
      </div>

      {widgets.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <p className="mb-4">Empty dashboard</p>
          <button
            onClick={() => setShowAddDialog(true)}
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-blue-600"
          >
            Add your first widget
          </button>
        </div>
      ) : (
        <DashboardGrid
          widgets={widgets}
          deviceId={params.id as string}
          editMode={editMode}
        />
      )}

      {showAddDialog && currentDashboard && (
        <AddWidgetDialog
          dashboardId={currentDashboard.id}
          onClose={() => setShowAddDialog(false)}
          onAdd={handleAddWidget}
        />
      )}
    </div>
  );
}
