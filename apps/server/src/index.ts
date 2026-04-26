import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import devicesRouter from './routes/devices';
import functionsRouter from './routes/functions';
import flowsRouter from './routes/flows';
import dashboardsRouter from './routes/dashboards';
import serialRouter from './routes/serial';
import pluginsRouter from './routes/plugins';
import templatesRouter from './routes/templates';
import { setupDeviceSocket } from './socket/deviceSocket';
import { setupFlowSocket } from './socket/flowSocket';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:3000', credentials: true }
});

export const prisma = new PrismaClient();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/devices', devicesRouter);
app.use('/api/functions', functionsRouter);
app.use('/api/flows', flowsRouter);
app.use('/api/dashboards', dashboardsRouter);
app.use('/api/serial', serialRouter);
app.use('/api/plugins', pluginsRouter);
app.use('/api/templates', templatesRouter);

setupDeviceSocket(io);
setupFlowSocket(io);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🚀 RoboDesk server running on http://localhost:${PORT}`);
});

export { io };
