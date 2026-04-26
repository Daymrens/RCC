import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

// Get all code templates
router.get('/', async (req, res) => {
  try {
    const templates = await prisma.codeTemplate.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    res.json(templates);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single template
router.get('/:id', async (req, res) => {
  try {
    const template = await prisma.codeTemplate.findUnique({
      where: { id: req.params.id }
    });
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    res.json(template);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create new template
router.post('/', async (req, res) => {
  try {
    const template = await prisma.codeTemplate.create({
      data: req.body
    });
    res.json(template);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update template
router.put('/:id', async (req, res) => {
  try {
    const template = await prisma.codeTemplate.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(template);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete template
router.delete('/:id', async (req, res) => {
  try {
    await prisma.codeTemplate.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Apply template to device
router.post('/:id/apply/:deviceId', async (req, res) => {
  try {
    const template = await prisma.codeTemplate.findUnique({
      where: { id: req.params.id }
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const func = await prisma.function.create({
      data: {
        deviceId: req.params.deviceId,
        name: template.name,
        description: template.description,
        type: template.type,
        code: template.code,
        flowData: template.flowData,
        trigger: template.trigger,
        intervalMs: template.intervalMs
      }
    });

    res.json(func);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
