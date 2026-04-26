import noble from '@abandonware/noble';
import { io } from '../index';

export class BleService {
  private devices = new Map<string, any>();
  private characteristics = new Map<string, any>();

  async scan(serviceUUID?: string): Promise<any[]> {
    return new Promise((resolve) => {
      const devices: any[] = [];
      
      noble.on('stateChange', (state) => {
        if (state === 'poweredOn') {
          noble.startScanning(serviceUUID ? [serviceUUID] : [], false);
        }
      });

      noble.on('discover', (peripheral) => {
        devices.push({
          id: peripheral.id,
          name: peripheral.advertisement.localName || 'Unknown',
          rssi: peripheral.rssi,
          address: peripheral.address
        });
      });

      setTimeout(() => {
        noble.stopScanning();
        resolve(devices);
      }, 5000);
    });
  }

  async connect(deviceId: string, config: any) {
    return new Promise((resolve, reject) => {
      noble.on('discover', async (peripheral) => {
        if (peripheral.id === config.peripheralId) {
          await peripheral.connectAsync();
          this.devices.set(deviceId, peripheral);

          const services = await peripheral.discoverServicesAsync([config.serviceUUID]);
          const characteristics = await services[0].discoverCharacteristicsAsync([
            config.writeCharUUID,
            config.notifyCharUUID
          ]);

          const writeChar = characteristics.find((c: any) => c.uuid === config.writeCharUUID);
          const notifyChar = characteristics.find((c: any) => c.uuid === config.notifyCharUUID);

          this.characteristics.set(deviceId, { write: writeChar, notify: notifyChar });

          if (notifyChar) {
            await notifyChar.subscribeAsync();
            notifyChar.on('data', (data: Buffer) => {
              const dataStr = data.toString();
              io.emit('device:data', { deviceId, data: dataStr, timestamp: new Date() });
            });
          }

          resolve(true);
        }
      });

      noble.startScanning();
      setTimeout(() => reject(new Error('Connection timeout')), 10000);
    });
  }

  async disconnect(deviceId: string) {
    const peripheral = this.devices.get(deviceId);
    if (peripheral) {
      await peripheral.disconnectAsync();
      this.devices.delete(deviceId);
      this.characteristics.delete(deviceId);
    }
  }

  async send(deviceId: string, data: string) {
    const chars = this.characteristics.get(deviceId);
    if (!chars?.write) throw new Error('Device not connected');
    
    await chars.write.writeAsync(Buffer.from(data), false);
  }
}
