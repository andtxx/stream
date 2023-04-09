import { ref } from 'vue';

const NO_INPUT = { deviceId: null, label: 'No' };
const DISPLAY_INPUT = { deviceId: 'display', label: 'Display' };

const localMediaStreams = ref([]);
const localMediaError = ref(null);

const videoInputs = ref([DISPLAY_INPUT, NO_INPUT]);
const audioInputs = ref([NO_INPUT]);

const setLocalVideoStream = async (videoInputId = null, audioInputId = null) => {
  const useDisplay = videoInputId === 'display';

  const mediaMethod = useDisplay ? 'getDisplayMedia' : 'getUserMedia';

  const constraints = {
    video: useDisplay ? true : !!videoInputId && { deviceId: videoInputId },
    audio: !!audioInputId && { deviceId: audioInputId },
  };

  try {
    const stream = await navigator.mediaDevices[mediaMethod](constraints);

    const description = {
      video: videoInputs.value.find((input) => input.deviceId === videoInputId).label,
      audio: audioInputs.value.find((input) => input.deviceId === audioInputId).label,
    };

    localMediaStreams.value.push({
      stream,
      description,
    });
  } catch (e) {
    localMediaError.value = e;
  }
};

const stopLocalVideoStream = (id) => {
  localMediaStreams.value = localMediaStreams.value.filter(({ stream }) => {
    if (id && stream.id !== id) return true;

    stream.getTracks().forEach((track) => track.stop());
    return false;
  });
};

const getMediaInputs = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();

    videoInputs.value = [];
    audioInputs.value = [];

    devices.forEach(({ kind, deviceId, label }) => {
      if (kind === 'videoinput') {
        videoInputs.value.push({ deviceId, label });
      } else if (kind === 'audioinput') {
        audioInputs.value.push({ deviceId, label });
      }
    });

    videoInputs.value = [...videoInputs.value, DISPLAY_INPUT, NO_INPUT];
    audioInputs.value = [...audioInputs.value, NO_INPUT];
  } catch (e) {
    localMediaError.value = e;
  }
};

const setupVideoElement = (el, stream) => {
  if (!el || el.srcObject) return;
  el.srcObject = stream;
  el.volume = 0;
};

const useMediaStream = () => {
  return {
    localMediaStreams,
    localMediaError,
    videoInputs,
    audioInputs,
    setLocalVideoStream,
    stopLocalVideoStream,
    getMediaInputs,
    setupVideoElement,
  };
};

export default useMediaStream;
