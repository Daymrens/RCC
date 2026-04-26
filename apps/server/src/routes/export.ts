import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

// Export single template
router.get('/template/:id', async (req, res) => {
  try {
    const template = await prisma.codeTemplate.findUnique({
      where: { id: req.params.id }
    });
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${template.name}.json"`);
    res.json(template);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Export all templates
router.get('/templates', async (req, res) => {
  try {
    const templates = await prisma.codeTemplate.findMany();
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="templates.json"');
    res.json(templates);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Import templates
router.post('/templates', async (req, res) => {
  try {
    const templates = Array.isArray(req.body) ? req.body : [req.body];
    const imported = [];

    for (const template of templates) {
      const { id, createdAt, updatedAt, ...data } = template;
      const created = await prisma.codeTemplate.create({ data });
      imported.push(created);
    }

    res.json({ success: true, count: imported.length, templates: imported });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Export device configuration
router.get('/device/:id', async (req, res) => {
  try {
    const device = await prisma.device.findUnique({
      where: { id: req.params.id },
      include: {
        functions: true,
        flows: true,
        dashboards: {
          include: { widgets: true }
        }
      }
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${device.name}-config.json"`);
    res.json(device);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Export plugin
router.get('/plugin/:id', async (req, res) => {
  try {
    const plugin = await prisma.plugin.findUnique({
      where: { id: req.params.id }
    });

    if (!plugin) {
      return res.status(404).json({ error: 'Plugin not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${plugin.name}.json"`);
    res.json(plugin);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
