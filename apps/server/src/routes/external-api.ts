import { Router } from 'express';
import { prisma } from '../index';
import { verifyApiKey } from './api-keys';

const router = Router();

// Apply API key verification to all routes
router.use(verifyApiKey);

// Get all devices
router.get('/devices', async (req, res) => {
  try {
    const devices = await prisma.device.findMany();
    res.json(devices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get device by ID
router.get('/devices/:id', async (req, res) => {
  try {
    const device = await prisma.device.findUnique({
      where: { id: req.params.id }
    });
    
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    
    res.json(device);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Send command to device
router.post('/devices/:id/command', async (req, res) => {
  try {
    const { command } = req.body;
    
    await prisma.deviceLog.create({
      data: {
        deviceId: req.params.id,
        direction: 'sent',
        data: command
      }
    });
    
    res.json({ success: true, message: 'Command sent' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get device logs
router.get('/devices/:id/logs', async (req, res) => {
  try {
    const { limit = 100 } = req.query;
    
    const logs = await prisma.deviceLog.findMany({
      where: { deviceId: req.params.id },
      orderBy: { timestamp: 'desc' },
      take: parseInt(limit as string)
    });
    
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get device functions
router.get('/devices/:id/functions', async (req, res) => {
  try {
    const functions = await prisma.function.findMany({
      where: { deviceId: req.params.id }
    });
    
    res.json(functions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Execute function
router.post('/devices/:deviceId/functions/:functionId/execute', async (req, res) => {
  try {
    const func = await prisma.function.findUnique({
      where: { id: req.params.functionId }
    });
    
    if (!func) {
      return res.status(404).json({ error: 'Function not found' });
    }
    
    // Here you would execute the function
    // For now, just return success
    res.json({ success: true, message: 'Function execution started' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics data
router.get('/devices/:id/analytics', async (req, res) => {
  try {
    const { metric, from, to } = req.query;
    
    const where: any = {
      deviceId: req.params.id,
      direction: 'received'
    };
    
    if (from || to) {
      where.timestamp = {};
      if (from) where.timestamp.gte = new Date(from as string);
      if (to) where.timestamp.lte = new Date(to as string);
    }
    
    const logs = await prisma.deviceLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 1000
    });
    
    const data = logs
      .map(log => {
        try {
          const parsed = JSON.parse(log.data);
          return {
            timestamp: log.timestamp.getTime(),
            metric: parsed.metric,
            value: parsed.value
          };
        } catch {
          return null;
        }
      })
      .filter(d => d && (!metric || d.metric === metric));
    
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint
router.post('/webhook', async (req, res) => {
  try {
    const { deviceId, event, data } = req.body;
    
    // Log webhook event
    await prisma.deviceLog.create({
      data: {
        deviceId,
        direction: 'received',
        data: JSON.stringify({ event, data, source: 'webhook' })
      }
    });
    
    res.json({ success: true, message: 'Webhook received' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
