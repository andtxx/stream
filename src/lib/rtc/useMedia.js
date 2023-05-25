import { reactive, ref } from 'vue';

const NO_INPUT = { deviceId: null, label: 'No' };
const DISPLAY_INPUT = { deviceId: 'display', label: 'Display' };

const localMediaStreams = reactive({});

const videoInputs = ref([DISPLAY_INPUT, NO_INPUT]);
const audioInputs = ref([NO_INPUT]);

const setLocalMediaStream = async (label, videoInputId = null, audioInputId = null) => {
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

    localMediaStreams[label] = {
      stream,
      description,
    };
  } catch (err) {
    return err;
  }
};

const stopLocalMediaStream = (id) => {
  for (const label in localMediaStreams) {
    const stream = localMediaStreams[label].stream;

    if (id && stream.id !== id) continue;

    stream.getTracks().forEach((track) => track.stop());
    delete localMediaStreams[label];
  }
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
  } catch (err) {
    return err;
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
    videoInputs,
    audioInputs,
    setLocalMediaStream,
    stopLocalMediaStream,
    getMediaInputs,
    setupVideoElement,
  };
};

export default useMediaStream;
