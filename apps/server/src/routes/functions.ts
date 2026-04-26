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
    data: { ...req.body, deviceId: req.params.deviceId, version: 1 }
  });
  
  // Create initial version
  await prisma.functionVersion.create({
    data: {
      functionId: func.id,
      version: 1,
      code: func.code,
      flowData: func.flowData,
      trigger: func.trigger,
      intervalMs: func.intervalMs,
      comment: 'Initial version'
    }
  });
  
  res.json(func);
});

router.put('/:id', async (req, res) => {
  const currentFunc = await prisma.function.findUnique({ where: { id: req.params.id } });
  if (!currentFunc) return res.status(404).json({ error: 'Function not found' });

  const newVersion = currentFunc.version + 1;
  
  // Create version snapshot
  await prisma.functionVersion.create({
    data: {
      functionId: currentFunc.id,
      version: newVersion,
      code: req.body.code || currentFunc.code,
      flowData: req.body.flowData || currentFunc.flowData,
      trigger: req.body.trigger || currentFunc.trigger,
      intervalMs: req.body.intervalMs || currentFunc.intervalMs,
      comment: req.body.versionComment || `Version ${newVersion}`
    }
  });

  // Update function
  const func = await prisma.function.update({
    where: { id: req.params.id },
    data: { ...req.body, version: newVersion }
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

router.get('/:id/versions', async (req, res) => {
  const versions = await prisma.functionVersion.findMany({
    where: { functionId: req.params.id },
    orderBy: { version: 'desc' }
  });
  res.json(versions);
});

router.post('/:id/restore/:versionId', async (req, res) => {
  const version = await prisma.functionVersion.findUnique({
    where: { id: req.params.versionId }
  });
  
  if (!version) return res.status(404).json({ error: 'Version not found' });

  const func = await prisma.function.update({
    where: { id: req.params.id },
    data: {
      code: version.code,
      flowData: version.flowData,
      trigger: version.trigger,
      intervalMs: version.intervalMs
    }
  });
  
  res.json(func);
});

export default router;
