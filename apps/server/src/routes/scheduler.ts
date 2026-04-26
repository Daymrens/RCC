import { Router } from 'express';
import { prisma } from '../index';
import { CronJob } from 'cron';

const router = Router();
const activeJobs = new Map<string, CronJob>();

// Get all scheduled tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.scheduledTask.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create scheduled task
router.post('/', async (req, res) => {
  try {
    const task = await prisma.scheduledTask.create({
      data: req.body
    });

    if (task.isActive) {
      startTask(task);
    }

    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update scheduled task
router.put('/:id', async (req, res) => {
  try {
    const task = await prisma.scheduledTask.update({
      where: { id: req.params.id },
      data: req.body
    });

    // Restart job if active
    stopTask(req.params.id);
    if (task.isActive) {
      startTask(task);
    }

    res.json(task);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete scheduled task
router.delete('/:id', async (req, res) => {
  try {
    stopTask(req.params.id);
    await prisma.scheduledTask.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle task active status
router.post('/:id/toggle', async (req, res) => {
  try {
    const task = await prisma.scheduledTask.findUnique({
      where: { id: req.params.id }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updated = await prisma.scheduledTask.update({
      where: { id: req.params.id },
      data: { isActive: !task.isActive }
    });

    if (updated.isActive) {
      startTask(updated);
    } else {
      stopTask(req.params.id);
    }

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get task execution history
router.get('/:id/history', async (req, res) => {
  try {
    const executions = await prisma.taskExecution.findMany({
      where: { taskId: req.params.id },
      orderBy: { executedAt: 'desc' },
      take: 50
    });
    res.json(executions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

function startTask(task: any) {
  try {
    const job = new CronJob(task.schedule, async () => {
      await executeTask(task);
    });

    job.start();
    activeJobs.set(task.id, job);
  } catch (error) {
    console.error(`Failed to start task ${task.id}:`, error);
  }
}

function stopTask(taskId: string) {
  const job = activeJobs.get(taskId);
  if (job) {
    job.stop();
    activeJobs.delete(taskId);
  }
}

async function executeTask(task: any) {
  const startTime = Date.now();
  let status = 'success';
  let error = null;

  try {
    // Execute the task based on type
    if (task.type === 'function') {
      // Run a device function
      const func = await prisma.function.findUnique({
        where: { id: task.targetId }
      });
      
      if (func) {
        // Execute function logic here
        console.log(`Executing function: ${func.name}`);
      }
    } else if (task.type === 'flow') {
      // Run a flow
      console.log(`Executing flow: ${task.targetId}`);
    } else if (task.type === 'command') {
      // Send a command
      console.log(`Sending command: ${task.command}`);
    }

    // Update last execution
    await prisma.scheduledTask.update({
      where: { id: task.id },
      data: {
        lastExecutedAt: new Date(),
        executionCount: { increment: 1 }
      }
    });
  } catch (err: any) {
    status = 'failed';
    error = err.message;
  }

  // Record execution
  await prisma.taskExecution.create({
    data: {
      taskId: task.id,
      status,
      error,
      duration: Date.now() - startTime
    }
  });
}

// Initialize active tasks on server start
export async function initializeScheduler() {
  const tasks = await prisma.scheduledTask.findMany({
    where: { isActive: true }
  });

  tasks.forEach(task => startTask(task));
  console.log(`📅 Initialized ${tasks.length} scheduled tasks`);
}

export default router;
