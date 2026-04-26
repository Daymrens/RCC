import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

// Get all macros
router.get('/', async (req, res) => {
  try {
    const macros = await prisma.macro.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(macros);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single macro
router.get('/:id', async (req, res) => {
  try {
    const macro = await prisma.macro.findUnique({
      where: { id: req.params.id }
    });
    
    if (!macro) {
      return res.status(404).json({ error: 'Macro not found' });
    }
    
    res.json(macro);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create macro
router.post('/', async (req, res) => {
  try {
    const { name, description, actions, deviceId } = req.body;
    
    const macro = await prisma.macro.create({
      data: {
        name,
        description,
        actions: JSON.stringify(actions || []),
        deviceId
      }
    });
    
    res.json(macro);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update macro
router.put('/:id', async (req, res) => {
  try {
    const { name, description, actions, deviceId } = req.body;
    
    const macro = await prisma.macro.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        actions: actions ? JSON.stringify(actions) : undefined,
        deviceId
      }
    });
    
    res.json(macro);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete macro
router.delete('/:id', async (req, res) => {
  try {
    await prisma.macro.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Execute macro
router.post('/:id/execute', async (req, res) => {
  try {
    const macro = await prisma.macro.findUnique({
      where: { id: req.params.id }
    });
    
    if (!macro) {
      return res.status(404).json({ error: 'Macro not found' });
    }
    
    const actions = JSON.parse(macro.actions);
    const results = [];
    
    for (const action of actions) {
      try {
        // Execute action based on type
        switch (action.type) {
          case 'command':
            // Send command to device
            if (macro.deviceId) {
              await prisma.deviceLog.create({
                data: {
                  deviceId: macro.deviceId,
                  direction: 'sent',
                  data: action.data
                }
              });
            }
            results.push({ action: action.type, success: true });
            break;
            
          case 'delay':
            // Wait for specified time
            await new Promise(resolve => setTimeout(resolve, action.duration || 1000));
            results.push({ action: action.type, success: true });
            break;
            
          case 'log':
            // Log message
            console.log(`[Macro ${macro.name}] ${action.message}`);
            results.push({ action: action.type, success: true });
            break;
            
          default:
            results.push({ action: action.type, success: false, error: 'Unknown action type' });
        }
      } catch (error: any) {
        results.push({ action: action.type, success: false, error: error.message });
      }
    }
    
    res.json({ success: true, results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
