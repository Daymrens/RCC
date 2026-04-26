import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

// Store data point
router.post('/data/:deviceId', async (req, res) => {
  try {
    const { metric, value, timestamp } = req.body;
    
    await prisma.deviceLog.create({
      data: {
        deviceId: req.params.deviceId,
        direction: 'received',
        data: JSON.stringify({ metric, value, timestamp: timestamp || Date.now() }),
        timestamp: new Date(timestamp || Date.now())
      }
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics data
router.get('/data/:deviceId', async (req, res) => {
  try {
    const { metric, from, to, limit } = req.query;
    
    const where: any = {
      deviceId: req.params.deviceId,
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
      take: limit ? parseInt(limit as string) : 1000
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
      .filter(d => d && (!metric || d.metric === metric))
      .reverse();

    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get available metrics
router.get('/metrics/:deviceId', async (req, res) => {
  try {
    const logs = await prisma.deviceLog.findMany({
      where: {
        deviceId: req.params.deviceId,
        direction: 'received'
      },
      take: 1000,
      orderBy: { timestamp: 'desc' }
    });

    const metrics = new Set<string>();
    logs.forEach(log => {
      try {
        const parsed = JSON.parse(log.data);
        if (parsed.metric) metrics.add(parsed.metric);
      } catch {}
    });

    res.json(Array.from(metrics));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Clear old data
router.delete('/data/:deviceId', async (req, res) => {
  try {
    const { before } = req.query;
    
    await prisma.deviceLog.deleteMany({
      where: {
        deviceId: req.params.deviceId,
        timestamp: {
          lt: new Date(before as string || Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
