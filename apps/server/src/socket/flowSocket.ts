import { Server } from 'socket.io';

export function setupFlowSocket(io: Server) {
  io.on('connection', (socket) => {
    socket.on('flow:start', ({ flowId }) => {
      console.log('Starting flow:', flowId);
      // Flow engine implementation
    });

    socket.on('flow:stop', ({ flowId }) => {
      console.log('Stopping flow:', flowId);
    });
  });
}
