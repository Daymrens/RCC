import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

router.get('/devices/:deviceId/dashboards', async (req, res) => {
  const dashboards = await prisma.dashboard.findMany({
    where: { deviceId: req.params.deviceId },
    include: { widgets: true }
  });
  res.json(dashboards);
});

router.post('/devices/:deviceId/dashboards', async (req, res) => {
  const dashboard = await prisma.dashboard.create({
    data: { ...req.body, deviceId: req.params.deviceId }
  });
  res.json(dashboard);
});

router.put('/:id', async (req, res) => {
  const dashboard = await prisma.dashboard.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(dashboard);
});

router.delete('/:id', async (req, res) => {
  await prisma.dashboard.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

router.post('/:dashboardId/widgets', async (req, res) => {
  const widget = await prisma.widget.create({
    data: req.body
  });
  res.json(widget);
});

router.put('/widgets/:id', async (req, res) => {
  const widget = await prisma.widget.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(widget);
});

router.delete('/widgets/:id', async (req, res) => {
  await prisma.widget.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

export default router;
