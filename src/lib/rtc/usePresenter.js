import { onUnmounted } from 'vue';
import transport from '@/lib/transport';
import iceServers from '@/lib/rtc/iceServers';

const PEERS = {};

const dispose = (streamId) => {
	PEERS[streamId].dispose();
	delete PEERS[streamId];
};

const presenterResponse = (data) => {
	if (data.response != 'accepted') {
		const error = data.message ? data.message : 'Unknow error';
		console.warn('Call not accepted for the following reason: ' + error);
		dispose(data.streamId);
	} else {
		const webRtcPeer = PEERS[data.streamId];
		webRtcPeer.processAnswer(data.sdpAnswer);
	}
};

const onOfferPresenter = (error, sdpOffer, streamId) => {
	if (error) return console.error(error);

	transport.send({
		id: 'presenter',
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

const startPresent = async (stream, streamId) => {
	const options = {
		videoStream: stream,
		configuration: { iceServers },
		onicecandidate: (candidate) => onIceCandidate(candidate, streamId),
	};

	PEERS[streamId] = kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(options, function (error) {
		if (error) return console.error(error);

		this.generateOffer((error, sdpOffer) => onOfferPresenter(error, sdpOffer, streamId));
	});
};

const stopPresent = (streamId) => {
	transport.send({ id: 'stop', streamId });
	dispose(streamId);
};

const usePresenter = () => {
	transport.on('presenterResponse', presenterResponse);
	transport.on('stopCommunication', onStopCommunication);
	transport.on('iceCandidate', addIceCandidate);

	onUnmounted(() => {
		transport.off('presenterResponse');
		transport.off('stopCommunication');
		transport.off('iceCandidate');
	});

	return { startPresent, stopPresent };
};

export default usePresenter;
