import { Router } from 'express';
import { prisma } from '../index';
import { FlowEngine } from '../services/FlowEngine';

const router = Router();
const flowEngine = new FlowEngine();

router.get('/devices/:deviceId/flows', async (req, res) => {
  const flows = await prisma.flow.findMany({
    where: { deviceId: req.params.deviceId }
  });
  res.json(flows);
});

router.post('/devices/:deviceId/flows', async (req, res) => {
  const flow = await prisma.flow.create({
    data: { ...req.body, deviceId: req.params.deviceId }
  });
  res.json(flow);
});

router.get('/:id', async (req, res) => {
  const flow = await prisma.flow.findUnique({ where: { id: req.params.id } });
  res.json(flow);
});

router.put('/:id', async (req, res) => {
  const flow = await prisma.flow.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(flow);
});

router.delete('/:id', async (req, res) => {
  await prisma.flow.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

router.post('/:id/start', async (req, res) => {
  try {
    await flowEngine.start(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/stop', async (req, res) => {
  try {
    await flowEngine.stop(req.params.id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
