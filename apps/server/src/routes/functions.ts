import { Router } from 'express';
import { prisma } from '../index';
import { FunctionRunner } from '../services/FunctionRunner';

const router = Router();
const functionRunner = new FunctionRunner();

router.get('/devices/:deviceId/functions', async (req, res) => {
  const functions = await prisma.function.findMany({
    where: { deviceId: req.params.deviceId }
  });
  res.json(functions);
});

router.post('/devices/:deviceId/functions', async (req, res) => {
  const func = await prisma.function.create({
    data: { ...req.body, deviceId: req.params.deviceId }
  });
  res.json(func);
});

router.put('/:id', async (req, res) => {
  const func = await prisma.function.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(func);
});

router.delete('/:id', async (req, res) => {
  await prisma.function.delete({ where: { id: req.params.id } });
  res.json({ success: true });
});

router.post('/:id/run', async (req, res) => {
  try {
    const result = await functionRunner.run(req.params.id, req.body.params);
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
