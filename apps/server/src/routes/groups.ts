import { Router } from 'express';
import { prisma } from '../index';

const router = Router();

// Get all groups
router.get('/', async (req, res) => {
  try {
    const groups = await prisma.deviceGroup.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Parse deviceIds and attach device info
    const groupsWithDevices = await Promise.all(
      groups.map(async (group) => {
        const deviceIds = JSON.parse(group.deviceIds);
        const devices = await prisma.device.findMany({
          where: { id: { in: deviceIds } }
        });
        return { ...group, devices };
      })
    );
    
    res.json(groupsWithDevices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single group
router.get('/:id', async (req, res) => {
  try {
    const group = await prisma.deviceGroup.findUnique({
      where: { id: req.params.id }
    });
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    const deviceIds = JSON.parse(group.deviceIds);
    const devices = await prisma.device.findMany({
      where: { id: { in: deviceIds } }
    });
    
    res.json({ ...group, devices });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create group
router.post('/', async (req, res) => {
  try {
    const { name, description, deviceIds } = req.body;
    
    const group = await prisma.deviceGroup.create({
      data: {
        name,
        description,
        deviceIds: JSON.stringify(deviceIds || [])
      }
    });
    
    res.json(group);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update group
router.put('/:id', async (req, res) => {
  try {
    const { name, description, deviceIds } = req.body;
    
    const group = await prisma.deviceGroup.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        deviceIds: deviceIds ? JSON.stringify(deviceIds) : undefined
      }
    });
    
    res.json(group);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete group
router.delete('/:id', async (req, res) => {
  try {
    await prisma.deviceGroup.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Send command to all devices in group
router.post('/:id/command', async (req, res) => {
  try {
    const group = await prisma.deviceGroup.findUnique({
      where: { id: req.params.id }
    });
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    const deviceIds = JSON.parse(group.deviceIds);
    const { command } = req.body;
    
    // Send command to all devices
    const results = await Promise.all(
      deviceIds.map(async (deviceId: string) => {
        try {
          // Here you would send the actual command to the device
          // For now, just log it
          await prisma.deviceLog.create({
            data: {
              deviceId,
              direction: 'sent',
              data: command
            }
          });
          return { deviceId, success: true };
        } catch (error: any) {
          return { deviceId, success: false, error: error.message };
        }
      })
    );
    
    res.json({ results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
