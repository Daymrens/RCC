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
import exportRouter from './routes/export';
import analyticsRouter from './routes/analytics';
import schedulerRouter, { initializeScheduler } from './routes/scheduler';
import groupsRouter from './routes/groups';
import macrosRouter from './routes/macros';
import apiKeysRouter from './routes/api-keys';
import externalApiRouter from './routes/external-api';

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
app.use('/api/export', exportRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/scheduler', schedulerRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/macros', macrosRouter);
app.use('/api/keys', apiKeysRouter);
app.use('/api/v1', externalApiRouter);

setupDeviceSocket(io);
setupFlowSocket(io);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, async () => {
  console.log(`🚀 RoboDesk server running on http://localhost:${PORT}`);
  await initializeScheduler();
});

export { io };
