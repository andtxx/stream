const setupRtcController = (io, socket) => {
  socket.on('rtc:relay_sdp', ({ peerId, sessionDescription }) => {
    io.to(peerId).emit('rtc:session_description', {
      peerId: socket.id,
      sessionDescription,
    });
  });

  socket.on('rtc:relay_ice', ({ peerId, iceCandidate }) => {
    io.to(peerId).emit('rtc:ice_candidate', {
      peerId: socket.id,
      iceCandidate,
    });
  });
};

export default setupRtcController;
