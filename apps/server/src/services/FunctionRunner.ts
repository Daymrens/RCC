import { prisma, io } from '../index';
import { DeviceManager } from './DeviceManager';
import vm from 'vm';

export class FunctionRunner {
  private deviceManager = new DeviceManager();

  async run(functionId: string, params?: any) {
    const func = await prisma.function.findUnique({ where: { id: functionId } });
    if (!func) throw new Error('Function not found');

    if (func.type === 'code' && func.code) {
      return this.runCode(func.deviceId, func.code);
    }
    throw new Error('Unsupported function type');
  }

  private async runCode(deviceId: string, code: string) {
    const logs: string[] = [];
    
    const sandbox = {
      device: {
        send: async (cmd: string) => {
          await this.deviceManager.send(deviceId, cmd);
          logs.push(`Sent: ${cmd}`);
        },
        log: (msg: string) => {
          logs.push(msg);
          io.emit('function:log', { deviceId, message: msg });
        }
      },
      delay: (ms: number) => new Promise(r => setTimeout(r, ms)),
      console: {
        log: (...args: any[]) => {
          const msg = args.join(' ');
          logs.push(msg);
          io.emit('function:log', { deviceId, message: msg });
        }
      }
    };

    try {
      vm.createContext(sandbox);
      vm.runInContext(code, sandbox, { timeout: 30000 });
      return { success: true, logs };
    } catch (error: any) {
      return { success: false, error: error.message, logs };
    }
  }
}
