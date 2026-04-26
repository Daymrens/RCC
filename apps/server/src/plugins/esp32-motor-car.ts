export const esp32MotorCarPlugin = {
  id: 'esp32-motor-car',
  name: 'ESP32 Motor Car',
  description: 'Control an ESP32-based motor car with BLE',
  deviceType: 'ble',
  config: {
    protocol: 'uart',
    serviceUUID: '0000ffe0-0000-1000-8000-00805f9b34fb',
    writeCharUUID: '0000ffe1-0000-1000-8000-00805f9b34fb',
    notifyCharUUID: '0000ffe1-0000-1000-8000-00805f9b34fb'
  },
  functions: [
    {
      name: 'Move Forward',
      type: 'code',
      trigger: 'manual',
      code: `await device.send('{"type":"move","dir":"F","speed":200}');
device.log('Moving forward');`
    },
    {
      name: 'Stop',
      type: 'code',
      trigger: 'manual',
      code: `await device.send('{"type":"stop"}');
device.log('Stopped');`
    },
    {
      name: 'Lights On',
      type: 'code',
      trigger: 'manual',
      code: `await device.send('{"type":"lights","state":"on"}');
device.log('Lights on');`
    }
  ],
  dashboards: [
    {
      name: 'Main Control',
      widgets: [
        {
          type: 'joystick',
          label: 'Movement',
          command: '',
          config: { size: 150, sensitivity: 1 },
          position: { x: 0, y: 0, w: 2, h: 2 }
        },
        {
          type: 'button',
          label: 'Horn',
          command: '{"type":"horn"}',
          config: { color: 'warning' },
          position: { x: 2, y: 0, w: 1, h: 1 }
        },
        {
          type: 'toggle',
          label: 'Lights',
          command: '',
          config: {
            onCommand: '{"type":"lights","state":"on"}',
            offCommand: '{"type":"lights","state":"off"}'
          },
          position: { x: 2, y: 1, w: 1, h: 1 }
        },
        {
          type: 'slider',
          label: 'Speed',
          command: '{"type":"speed","value":',
          config: { min: 0, max: 255, step: 10 },
          position: { x: 0, y: 2, w: 3, h: 1 }
        }
      ]
    }
  ]
};
