import { Router } from 'express';
import { prisma } from '../index';
import { esp32MotorCarPlugin } from '../plugins/esp32-motor-car';
import { arduinoSensorBoardPlugin } from '../plugins/arduino-sensor-board';

const router = Router();

const builtInPlugins = [
  esp32MotorCarPlugin,
  arduinoSensorBoardPlugin,
  {
    id: 'generic-ble',
    name: 'Generic BLE UART',
    description: 'Basic send/receive for any BLE UART device',
    deviceType: 'ble',
    config: { protocol: 'uart' },
    functions: [],
    dashboards: []
  },
  {
    id: 'generic-serial',
    name: 'Generic Serial',
    description: 'Terminal-style interface for any serial device',
    deviceType: 'serial',
    config: { baudRate: 115200 },
    functions: [],
    dashboards: []
  }
];

router.get('/', async (req, res) => {
  const builtIn = builtInPlugins;
  const custom = await prisma.plugin.findMany();
  res.json([...builtIn, ...custom]);
});

router.post('/', async (req, res) => {
  const plugin = await prisma.plugin.create({
    data: {
      ...req.body,
      config: JSON.stringify(req.body.config),
      functions: JSON.stringify(req.body.functions),
      dashboards: JSON.stringify(req.body.dashboards)
    }
  });
  res.json(plugin);
});

router.post('/:pluginId/apply/:deviceId', async (req, res) => {
  try {
    const plugin = builtInPlugins.find(p => p.id === req.params.pluginId);
    if (!plugin) {
      return res.status(404).json({ error: 'Plugin not found' });
    }

    const device = await prisma.device.findUnique({
      where: { id: req.params.deviceId }
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    // Update device with plugin config
    await prisma.device.update({
      where: { id: req.params.deviceId },
      data: {
        pluginId: plugin.id,
        connectionConfig: { ...device.connectionConfig, ...plugin.config }
      }
    });

    // Create preset functions
    for (const func of plugin.functions) {
      await prisma.function.create({
        data: {
          ...func,
          deviceId: req.params.deviceId
        }
      });
    }

    // Create preset dashboards
    for (const dashboard of plugin.dashboards) {
      const createdDashboard = await prisma.dashboard.create({
        data: {
          name: dashboard.name,
          deviceId: req.params.deviceId,
          layout: {}
        }
      });

      // Create widgets
      for (const widget of dashboard.widgets) {
        await prisma.widget.create({
          data: {
            ...widget,
            dashboardId: createdDashboard.id
          }
        });
      }
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
