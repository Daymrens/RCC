import { Server } from 'socket.io';
import { DeviceManager } from '../services/DeviceManager';

const deviceManager = new DeviceManager();

export function setupDeviceSocket(io: Server) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('device:send', async ({ deviceId, command }) => {
      try {
        await deviceManager.send(deviceId, command);
      } catch (error: any) {
        socket.emit('device:error', { deviceId, error: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}
