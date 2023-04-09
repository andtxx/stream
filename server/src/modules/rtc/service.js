function addPeer(io, socketId, roomId) {
  io.sockets.adapter.rooms.get(roomId).forEach((clientId) => {
    io.to(clientId).emit('rtc:peer_add', {
      peerId: socketId,
      createOffer: false,
    });
    io.to(socketId).emit('rtc:peer_add', { peerId: clientId, createOffer: true });
  });
}

function removePeer(io, socketId, roomId) {
  io.sockets.adapter.rooms.get(roomId).forEach((clientId) => {
    io.to(clientId).emit('rtc:peer_remove', { peerId: socketId });
    io.to(socketId).emit('rtc:peer_remove', { peerId: clientId });
  });
}

function removeAllPeers(io, roomId) {
  io.sockets.adapter.rooms.get(roomId).forEach((clientId) => {
    io.to(clientId).emit('rtc:peer_remove', { all: true });
  });
}

export { addPeer, removePeer, removeAllPeers };
