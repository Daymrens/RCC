import { SerialPort } from 'serialport';
import { prisma, io } from '../index';

export class DeviceManager {
  private connections = new Map<string, SerialPort>();

  async connect(deviceId: string) {
    const device = await prisma.device.findUnique({ where: { id: deviceId } });
    if (!device) throw new Error('Device not found');

    const config = device.connectionConfig as any;
    
    if (device.type === 'serial') {
      const port = new SerialPort({
        path: config.port,
        baudRate: config.baudRate || 115200
      });

      port.on('data', (data) => {
        const dataStr = data.toString();
        io.emit('device:data', { deviceId, data: dataStr, timestamp: new Date() });
        prisma.deviceLog.create({
          data: { deviceId, direction: 'in', data: dataStr }
        });
      });

      this.connections.set(deviceId, port);
      await prisma.device.update({
        where: { id: deviceId },
        data: { status: 'connected' }
      });
      io.emit('device:status', { deviceId, status: 'connected' });
    }
  }

  async disconnect(deviceId: string) {
    const port = this.connections.get(deviceId);
    if (port) {
      port.close();
      this.connections.delete(deviceId);
    }
    await prisma.device.update({
      where: { id: deviceId },
      data: { status: 'disconnected' }
    });
    io.emit('device:status', { deviceId, status: 'disconnected' });
  }

  async send(deviceId: string, command: string) {
    const port = this.connections.get(deviceId);
    if (!port) throw new Error('Device not connected');
    
    port.write(command);
    await prisma.deviceLog.create({
      data: { deviceId, direction: 'out', data: command }
    });
    io.emit('device:log', { deviceId, direction: 'out', data: command });
  }
}
