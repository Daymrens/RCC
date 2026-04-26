export async function connectBLE(serviceUUID: string, writeCharUUID: string, notifyCharUUID: string) {
  if (!('bluetooth' in navigator)) {
    throw new Error('Web Bluetooth API not supported');
  }

  const device = await (navigator as any).bluetooth.requestDevice({
    filters: [{ services: [serviceUUID] }]
  });

  const server = await device.gatt.connect();
  const service = await server.getPrimaryService(serviceUUID);
  
  const writeChar = await service.getCharacteristic(writeCharUUID);
  const notifyChar = await service.getCharacteristic(notifyCharUUID);

  return { device, server, writeChar, notifyChar };
}

export async function disconnectBLE(device: any) {
  if (device?.gatt?.connected) {
    await device.gatt.disconnect();
  }
}

export async function sendBLE(characteristic: any, data: string) {
  const encoder = new TextEncoder();
  await characteristic.writeValue(encoder.encode(data));
}

export async function subscribeBLE(characteristic: any, callback: (data: string) => void) {
  await characteristic.startNotifications();
  
  characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
    const decoder = new TextDecoder();
    const value = decoder.decode(event.target.value);
    callback(value);
  });
}
