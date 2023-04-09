import { onUnmounted, reactive, ref } from 'vue';
import socket from '@/lib/socket';
import useMedia from '@/lib/rtc/useMedia';

const iceServers = ref(null);

const getServers = async () => {
  if (iceServers.value) return;

  const response = await fetch(
    'https://pixmove.metered.live/api/v1/turn/credentials?apiKey=e31d80b05e38f0e1df196704a3e481cdc249'
  );

  iceServers.value = await response.json();
};

const useRtc = () => {
  const { localMediaStreams } = useMedia();
  const clients = reactive({});

  const onPeerAdd = async ({ peerId, createOffer }) => {
    if (clients[peerId]) return;

    clients[peerId] = { id: peerId };

    clients[peerId].peerConnection = new RTCPeerConnection({
      iceServers: iceServers.value,
    });

    clients[peerId].peerConnection.onicecandidate = ({ candidate }) => {
      if (!candidate) return;

      socket.emit('rtc:relay_ice', {
        peerId,
        iceCandidate: candidate,
      });
    };

    clients[peerId].peerConnection.ontrack = ({ streams }) => {
      if (!clients[peerId].videoElement) return;
      clients[peerId].videoElement.srcObject = streams[0];
    };

    localMediaStreams.value.forEach(({ stream }) => {
      stream.getTracks().forEach((track) => {
        clients[peerId].peerConnection.addTrack(track, stream);
      });
    });

    if (createOffer) {
      const offer = await clients[peerId].peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });

      await clients[peerId].peerConnection.setLocalDescription(offer);

      socket.emit('rtc:relay_sdp', {
        peerId,
        sessionDescription: offer,
      });
    }
  };

  const onSessionDescription = async ({ peerId, sessionDescription }) => {
    await clients[peerId].peerConnection.setRemoteDescription(
      new RTCSessionDescription(sessionDescription)
    );

    if (sessionDescription.type === 'offer') {
      const answer = await clients[peerId].peerConnection.createAnswer();
      await clients[peerId].peerConnection.setLocalDescription(answer);

      socket.emit('rtc:relay_sdp', {
        peerId,
        sessionDescription: answer,
      });
    }
  };

  const onIceCandidate = ({ peerId, iceCandidate }) => {
    clients[peerId].peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
  };

  const onPeerRemove = ({ peerId, all }) => {
    if (all) {
      Object.keys(clients).forEach((peerId) => onPeerRemove({ peerId }));
      return;
    }

    clients[peerId].peerConnection.close();
    delete clients[peerId];
  };

  const setRemoteVideoElement = (peerId, videoElement) => {
    if (!clients[peerId]) return;
    clients[peerId].videoElement = videoElement;
  };

  const setupRtc = async () => {
    await getServers();

    socket.on('rtc:peer_add', onPeerAdd);
    socket.on('rtc:session_description', onSessionDescription);
    socket.on('rtc:ice_candidate', onIceCandidate);
    socket.on('rtc:peer_remove', onPeerRemove);
  };

  onUnmounted(() => {
    socket.off('rtc:peer_add', onPeerAdd);
    socket.off('rtc:session_description', onSessionDescription);
    socket.off('rtc:ice_candidate', onIceCandidate);
    socket.off('rtc:peer_remove', onPeerRemove);

    Object.keys(clients).forEach((peerId) => onPeerRemove({ peerId }));
  });

  return {
    clients,
    setRemoteVideoElement,
    setupRtc,
  };
};

export default useRtc;
