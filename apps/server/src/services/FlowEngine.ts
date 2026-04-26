import { prisma, io } from '../index';
import { DeviceManager } from './DeviceManager';

interface FlowNode {
  id: string;
  type: string;
  data: any;
}

interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
}

export class FlowEngine {
  private deviceManager = new DeviceManager();
  private activeFlows = new Map<string, NodeJS.Timeout>();

  async start(flowId: string) {
    const flow = await prisma.flow.findUnique({ where: { id: flowId } });
    if (!flow) throw new Error('Flow not found');

    await prisma.flow.update({
      where: { id: flowId },
      data: { isActive: true }
    });

    const nodes = flow.nodes as FlowNode[];
    const edges = flow.edges as FlowEdge[];

    // Find trigger node
    const triggerNode = nodes.find(n => n.type === 'trigger');
    if (!triggerNode) throw new Error('No trigger node found');

    if (triggerNode.data.triggerType === 'interval') {
      const interval = setInterval(() => {
        this.executeFlow(flowId, flow.deviceId, nodes, edges);
      }, triggerNode.data.intervalMs || 1000);
      
      this.activeFlows.set(flowId, interval);
    } else if (triggerNode.data.triggerType === 'manual') {
      await this.executeFlow(flowId, flow.deviceId, nodes, edges);
    }
  }

  async stop(flowId: string) {
    const interval = this.activeFlows.get(flowId);
    if (interval) {
      clearInterval(interval);
      this.activeFlows.delete(flowId);
    }

    await prisma.flow.update({
      where: { id: flowId },
      data: { isActive: false }
    });
  }

  private async executeFlow(flowId: string, deviceId: string, nodes: FlowNode[], edges: FlowEdge[]) {
    const executionOrder = this.topologicalSort(nodes, edges);
    let flowData: any = {};

    for (const nodeId of executionOrder) {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) continue;

      try {
        flowData = await this.executeNode(node, deviceId, flowData, flowId);
        
        // Check for conditional branching
        if (node.type === 'condition' && typeof flowData.conditionResult === 'boolean') {
          const nextEdge = edges.find(e => 
            e.source === nodeId && 
            e.sourceHandle === (flowData.conditionResult ? 'true' : 'false')
          );
          if (!nextEdge) break;
        }
      } catch (error: any) {
        io.emit('flow:log', { flowId, nodeId, message: `Error: ${error.message}`, level: 'error' });
        break;
      }
    }
  }

  private async executeNode(node: FlowNode, deviceId: string, flowData: any, flowId: string): Promise<any> {
    io.emit('flow:log', { flowId, nodeId: node.id, message: `Executing ${node.type}`, level: 'info' });

    switch (node.type) {
      case 'trigger':
        return flowData;

      case 'send':
        const command = this.interpolate(node.data.command, flowData);
        await this.deviceManager.send(deviceId, command);
        io.emit('flow:log', { flowId, nodeId: node.id, message: `Sent: ${command}`, level: 'info' });
        return flowData;

      case 'delay':
        await new Promise(resolve => setTimeout(resolve, node.data.delayMs || 1000));
        return flowData;

      case 'condition':
        const expression = this.interpolate(node.data.expression, flowData);
        const result = eval(expression);
        io.emit('flow:log', { flowId, nodeId: node.id, message: `Condition: ${result}`, level: 'info' });
        return { ...flowData, conditionResult: result };

      case 'transform':
        const transformCode = node.data.code || 'data';
        const transformed = eval(`(data) => ${transformCode}`)(flowData);
        return { ...flowData, ...transformed };

      case 'log':
        const message = this.interpolate(node.data.message, flowData);
        io.emit('flow:log', { flowId, nodeId: node.id, message, level: 'info' });
        return flowData;

      default:
        return flowData;
    }
  }

  private topologicalSort(nodes: FlowNode[], edges: FlowEdge[]): string[] {
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    nodes.forEach(node => {
      graph.set(node.id, []);
      inDegree.set(node.id, 0);
    });

    edges.forEach(edge => {
      graph.get(edge.source)?.push(edge.target);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    });

    const queue: string[] = [];
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) queue.push(nodeId);
    });

    const result: string[] = [];
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      result.push(nodeId);

      graph.get(nodeId)?.forEach(neighbor => {
        const newDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, newDegree);
        if (newDegree === 0) queue.push(neighbor);
      });
    }

    return result;
  }

  private interpolate(template: string, data: any): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
  }
}
