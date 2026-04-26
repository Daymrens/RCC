import { Router } from 'express';
import { prisma } from '../index';
import { DeviceManager } from '../services/DeviceManager';

const router = Router();
const deviceManager = new DeviceManager();

router.get('/', async (req, res) => {
  const devices = await prisma.device.findMany();
  res.json(devices);
});

router.post('/', async (req, res) => {
  const device = await prisma.device.create({ data: req.body });
  res.json(device);
});

router.get('/:id', async (req, res) => {
  const device = await prisma.device.findUnique({ where: { id: req.params.id } });
  res.json(device);
});

router.put('/:id', async (req, res) => {
  const device = await prisma.device.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(device);
});

router.delete('/:id', async (req, res) => {
  await prisma.device.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

router.post('/:id/connect', async (req, res) => {
  try {
    await deviceManager.connect(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/disconnect', async (req, res) => {
  await deviceManager.disconnect(req.params.id);
  res.json({ success: true });
});

router.post('/:id/send', async (req, res) => {
  try {
    await deviceManager.send(req.params.id, req.body.command);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
