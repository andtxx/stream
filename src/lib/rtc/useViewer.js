import { onUnmounted } from 'vue';
import transport from '@/lib/transport';
import iceServers from '@/lib/rtc/iceServers';

const PEERS = {};

const dispose = (streamId) => {
	PEERS[streamId].dispose();
	delete PEERS[streamId];
};

const viewerResponse = (data) => {
	if (data.response != 'accepted') {
		const errorMsg = data.message ? data.message : 'Unknow error';
		console.warn('Call not accepted for the following reason: ' + errorMsg);
		dispose(data.streamId);
	} else {
		const webRtcPeer = PEERS[data.streamId];
		webRtcPeer.processAnswer(data.sdpAnswer);
	}
};

const onOfferViewer = (error, sdpOffer, streamId) => {
	if (error) return console.error(error);

	transport.send({
		id: 'viewer',
		streamId,
		sdpOffer,
	});
};

const onIceCandidate = (candidate, streamId) => {
	console.log('Local candidate' + JSON.stringify(candidate));

	transport.send({
		id: 'onIceCandidate',
		streamId,
		candidate,
	});
};

const addIceCandidate = ({ candidate, streamId }) => {
	PEERS[streamId].addIceCandidate(candidate);
};

const onStopCommunication = ({ streamId }) => dispose(streamId);

const startView = (video, streamId) => {
	const options = {
		remoteVideo: video,
		configuration: { iceServers },
		onicecandidate: (candidate) => onIceCandidate(candidate, streamId),
	};

	PEERS[streamId] = kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(options, function (error) {
		if (error) return console.error(error);

		this.generateOffer((error, sdpOffer) => onOfferViewer(error, sdpOffer, streamId));
	});
};

const stopView = (streamId) => {
	transport.send({ id: 'stop', streamId });
	dispose(streamId);
};

const usePresenter = () => {
	transport.on('viewerResponse', viewerResponse);
	transport.on('stopCommunication', onStopCommunication);
	transport.on('iceCandidate', addIceCandidate);

	onUnmounted(() => {
		transport.off('viewerResponse');
		transport.off('stopCommunication');
		transport.off('iceCandidate');
	});

	return { startView, stopView };
};

export default usePresenter;
