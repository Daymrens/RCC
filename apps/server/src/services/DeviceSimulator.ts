import { EventEmitter } from 'events';

export class DeviceSimulator extends EventEmitter {
  private deviceId: string;
  private isRunning: boolean = false;
  private interval: NodeJS.Timeout | null = null;
  private sensorValues: Map<string, number> = new Map();

  constructor(deviceId: string) {
    super();
    this.deviceId = deviceId;
    this.initializeSensors();
  }

  private initializeSensors() {
    this.sensorValues.set('temperature', 25);
    this.sensorValues.set('humidity', 50);
    this.sensorValues.set('distance', 100);
    this.sensorValues.set('light', 500);
    this.sensorValues.set('speed', 0);
    this.sensorValues.set('battery', 100);
  }

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.emit('status', 'connected');
    
    // Simulate sensor data updates
    this.interval = setInterval(() => {
      this.updateSensors();
      this.sendSensorData();
    }, 1000);
  }

  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.emit('status', 'disconnected');
  }

  send(data: string) {
    if (!this.isRunning) {
      throw new Error('Simulator not running');
    }

    try {
      const command = JSON.parse(data);
      this.handleCommand(command);
    } catch (e) {
      // Handle non-JSON commands
      this.emit('log', `Received: ${data}`);
    }
  }

  private handleCommand(command: any) {
    this.emit('log', `Command: ${JSON.stringify(command)}`);

    switch (command.type) {
      case 'move':
        this.handleMove(command);
        break;
      case 'stop':
        this.sensorValues.set('speed', 0);
        this.emit('data', JSON.stringify({ type: 'status', message: 'Stopped' }));
        break;
      case 'lights':
        this.emit('data', JSON.stringify({ type: 'lights', state: command.state }));
        break;
      case 'horn':
        this.emit('data', JSON.stringify({ type: 'horn', active: true }));
        setTimeout(() => {
          this.emit('data', JSON.stringify({ type: 'horn', active: false }));
        }, 500);
        break;
      case 'speed':
        this.sensorValues.set('speed', command.value || 0);
        break;
      case 'read':
        this.sendSensorData();
        break;
      default:
        this.emit('data', JSON.stringify({ type: 'echo', command }));
    }
  }

  private handleMove(command: any) {
    const direction = command.direction || command.dir;
    const speed = command.speed || 100;
    
    this.sensorValues.set('speed', speed);
    
    this.emit('data', JSON.stringify({
      type: 'movement',
      direction,
      speed
    }));
  }

  private updateSensors() {
    // Simulate realistic sensor changes
    const temp = this.sensorValues.get('temperature')!;
    this.sensorValues.set('temperature', temp + (Math.random() - 0.5) * 2);

    const humidity = this.sensorValues.get('humidity')!;
    this.sensorValues.set('humidity', Math.max(0, Math.min(100, humidity + (Math.random() - 0.5) * 5)));

    const distance = this.sensorValues.get('distance')!;
    this.sensorValues.set('distance', Math.max(0, distance + (Math.random() - 0.5) * 20));

    const light = this.sensorValues.get('light')!;
    this.sensorValues.set('light', Math.max(0, light + (Math.random() - 0.5) * 50));

    const battery = this.sensorValues.get('battery')!;
    this.sensorValues.set('battery', Math.max(0, Math.min(100, battery - 0.01)));
  }

  private sendSensorData() {
    const data = {
      type: 'sensors',
      timestamp: Date.now(),
      temperature: Math.round(this.sensorValues.get('temperature')! * 10) / 10,
      humidity: Math.round(this.sensorValues.get('humidity')! * 10) / 10,
      distance: Math.round(this.sensorValues.get('distance')!),
      light: Math.round(this.sensorValues.get('light')!),
      speed: Math.round(this.sensorValues.get('speed')!),
      battery: Math.round(this.sensorValues.get('battery')! * 10) / 10
    };

    this.emit('data', JSON.stringify(data));
  }

  isConnected() {
    return this.isRunning;
  }
}
