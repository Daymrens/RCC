export const arduinoSensorBoardPlugin = {
  id: 'arduino-sensor-board',
  name: 'Arduino Sensor Board',
  description: 'Read sensors from Arduino via Serial',
  deviceType: 'serial',
  config: {
    baudRate: 115200,
    dataBits: 8,
    parity: 'none',
    stopBits: 1
  },
  functions: [
    {
      name: 'Read All Sensors',
      type: 'code',
      trigger: 'manual',
      code: `await device.send('READ_ALL');
device.log('Reading all sensors...');

device.onData((data) => {
  device.log('Sensor data: ' + data);
});`
    },
    {
      name: 'Auto Log',
      type: 'code',
      trigger: 'interval',
      intervalMs: 5000,
      code: `await device.send('READ_ALL');

device.onData((data) => {
  const parsed = JSON.parse(data);
  device.log(\`Temp: \${parsed.temp}°C, Humidity: \${parsed.humidity}%\`);
});`
    }
  ],
  dashboards: [
    {
      name: 'Telemetry',
      widgets: [
        {
          type: 'gauge',
          label: 'Temperature',
          command: '',
          config: { min: 0, max: 100, unit: '°C', dataKey: 'temp' },
          position: { x: 0, y: 0, w: 1, h: 2 }
        },
        {
          type: 'gauge',
          label: 'Humidity',
          command: '',
          config: { min: 0, max: 100, unit: '%', dataKey: 'humidity' },
          position: { x: 1, y: 0, w: 1, h: 2 }
        },
        {
          type: 'display',
          label: 'Light Level',
          command: '',
          config: { dataKey: 'light', unit: 'lux' },
          position: { x: 2, y: 0, w: 1, h: 1 }
        },
        {
          type: 'display',
          label: 'Pressure',
          command: '',
          config: { dataKey: 'pressure', unit: 'hPa' },
          position: { x: 2, y: 1, w: 1, h: 1 }
        }
      ]
    }
  ]
};
