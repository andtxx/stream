import { createRoom, closeRoom, joinRoom, leaveAllRooms } from './service.js';
import rooms from './model.js';

const setupRoomControler = (io, socket) => {
  socket.emit('room:list', { rooms: Array.from(rooms) });

  socket.on('room:create', (data, cb) => {
    const room = createRoom(io, socket, data);
    cb({ room });
  });

  socket.on('room:close', (data) => {
    closeRoom(io, socket, data);
  });

  socket.on('room:join', (data, cb) => {
    const room = joinRoom(io, socket, data);
    cb({ room });
  });

  socket.on('room:leave', () => {
    leaveAllRooms(io, socket);
  });

  socket.on('disconnecting', () => {
    leaveAllRooms(io, socket);
  });
};

export default setupRoomControler;
