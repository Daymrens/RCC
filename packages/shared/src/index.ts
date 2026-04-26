export interface Device {
  id: string;
  name: string;
  type: 'serial' | 'ble';
  connectionConfig: SerialConfig | BleConfig;
  pluginId?: string;
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  createdAt: Date;
  updatedAt: Date;
}

export interface SerialConfig {
  port: string;
  baudRate: number;
  dataBits?: 8 | 7 | 6 | 5;
  parity?: 'none' | 'even' | 'odd';
  stopBits?: 1 | 2;
}

export interface BleConfig {
  deviceName: string;
  serviceUUID: string;
  writeCharUUID: string;
  notifyCharUUID: string;
  protocol: 'uart' | 'custom';
}

export interface FunctionType {
  id: string;
  deviceId: string;
  name: string;
  description?: string;
  type: 'code' | 'flow';
  code?: string;
  flowData?: any;
  trigger: 'manual' | 'interval' | 'onData' | 'onConnect';
  intervalMs?: number;
}

export interface WidgetType {
  id: string;
  type: 'button' | 'slider' | 'toggle' | 'gauge' | 'display' | 'joystick';
  label: string;
  command: string;
  config: any;
  position: { x: number; y: number; w: number; h: number };
}

export interface DeviceLog {
  id: string;
  deviceId: string;
  direction: 'in' | 'out';
  data: string;
  timestamp: Date;
}
