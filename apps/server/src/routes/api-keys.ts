import { Router } from 'express';
import { prisma } from '../index';
import crypto from 'crypto';

const router = Router();

// Generate API key
function generateApiKey(): string {
  return 'rdk_' + crypto.randomBytes(32).toString('hex');
}

// Get all API keys
router.get('/', async (req, res) => {
  try {
    const keys = await prisma.apiKey.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Don't send full keys, only partial
    const safeKeys = keys.map(key => ({
      ...key,
      key: key.key.substring(0, 12) + '...'
    }));
    
    res.json(safeKeys);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create API key
router.post('/', async (req, res) => {
  try {
    const { name, permissions, expiresAt } = req.body;
    
    const key = generateApiKey();
    
    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        key,
        permissions: JSON.stringify(permissions || ['read']),
        expiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });
    
    // Return full key only on creation
    res.json(apiKey);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update API key
router.put('/:id', async (req, res) => {
  try {
    const { name, permissions, isActive, expiresAt } = req.body;
    
    const apiKey = await prisma.apiKey.update({
      where: { id: req.params.id },
      data: {
        name,
        permissions: permissions ? JSON.stringify(permissions) : undefined,
        isActive,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined
      }
    });
    
    res.json({
      ...apiKey,
      key: apiKey.key.substring(0, 12) + '...'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete API key
router.delete('/:id', async (req, res) => {
  try {
    await prisma.apiKey.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Verify API key middleware
export async function verifyApiKey(req: any, res: any, next: any) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }
  
  try {
    const key = await prisma.apiKey.findUnique({
      where: { key: apiKey as string }
    });
    
    if (!key) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    if (!key.isActive) {
      return res.status(401).json({ error: 'API key is inactive' });
    }
    
    if (key.expiresAt && key.expiresAt < new Date()) {
      return res.status(401).json({ error: 'API key has expired' });
    }
    
    // Update last used
    await prisma.apiKey.update({
      where: { id: key.id },
      data: { lastUsedAt: new Date() }
    });
    
    req.apiKey = key;
    next();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export default router;
