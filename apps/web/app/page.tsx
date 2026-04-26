'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import DeviceCard from '@/components/devices/DeviceCard';
import AddDeviceDialog from '@/components/devices/AddDeviceDialog';

export default function HomePage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/devices')
      .then(res => res.json())
      .then(setDevices);
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Devices</h1>
        <button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-blue-600"
        >
          <Plus size={20} />
          New Device
        </button>
      </div>

      {devices.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-text-muted text-lg mb-4">No devices yet</p>
          <button
            onClick={() => setShowAddDialog(true)}
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-blue-600"
          >
            Add your first device
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map(device => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      )}

      {showAddDialog && (
        <AddDeviceDialog onClose={() => setShowAddDialog(false)} />
      )}
    </div>
  );
}
