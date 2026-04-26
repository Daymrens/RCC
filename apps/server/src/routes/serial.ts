import { Router } from 'express';
import { SerialPort } from 'serialport';

const router = Router();

router.get('/ports', async (req, res) => {
  try {
    const ports = await SerialPort.list();
    res.json(ports);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
