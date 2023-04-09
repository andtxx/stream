import { v4 } from 'uuid';
import { addPeer, removePeer, removeAllPeers } from '../rtc/service.js';
import rooms from './model.js';

function createRoom(io, socket, { roomName }) {
  leaveAllRooms(io, socket);

  const roomId = v4();
  const room = { id: roomId, name: roomName };

  rooms.add(room);
  socket.join(roomId);

  shareRoomsInfo(io);

  return room;
}

async function closeRoom(io, socket, { roomId }) {
  if (!io.sockets.adapter.rooms.get(roomId)) {
    return console.log('[error] Room does not exist');
  }

  removeAllPeers(io, roomId);

  const clients = await io.in(roomId).fetchSockets();

  clients.forEach((client) => {
    client.leave(roomId);
    client.emit('room:leaved');
  });

  console.log(`[info] Room ${roomId} closed by ${socket.id}`);

  shareRoomsInfo(io);
}

function joinRoom(io, socket, { roomId }) {
  if (!io.sockets.adapter.rooms.get(roomId)) {
    return console.log('[error] Room does not exist');
  }

  if (socket.rooms.has(roomId)) {
    return console.log('[error] Client already in the room');
  }

  leaveAllRooms(io, socket);
  addPeer(io, socket.id, roomId);

  socket.join(roomId);

  let joinedRoom = null;
  rooms.forEach((room) => {
    if (room.id === roomId) joinedRoom = room;
  });

  return joinedRoom;
}

function leaveAllRooms(io, socket) {
  socket.rooms.forEach((roomId) => {
    if (roomId === socket.id) return;

    socket.leave(roomId);
    socket.emit('room:leaved', { roomId });

    if (io.sockets.adapter.rooms.get(roomId)) {
      removePeer(io, socket.id, roomId);
    } else {
      shareRoomsInfo(io);
    }
  });
}

function shareRoomsInfo(io) {
  for (const room of rooms) {
    if (!io.sockets.adapter.rooms.get(room.id)) {
      rooms.delete(room);
    }
  }

  io.emit('room:list', { rooms: Array.from(rooms) });
}

export { createRoom, closeRoom, joinRoom, leaveAllRooms };
