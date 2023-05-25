<script setup>
import { ref, computed } from 'vue';
import useMedia from '@/lib/rtc/useMedia';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
});

const {
  localMediaStreams,
  videoInputs,
  audioInputs,
  setLocalMediaStream,
  stopLocalMediaStream,
  getMediaInputs,
} = useMedia();

const videoInputId = ref(null);
const audioInputId = ref(null);

const selectedMedia = computed(() => localMediaStreams[props.label]);

const setMedia = async () => {
  const error = await setLocalMediaStream(props.label, videoInputId.value, audioInputId.value);
  if (error) alert(error);
};

const setupMediaInputs = async () => {
  const error = await getMediaInputs();

  if (error) return alert(error);

  videoInputId.value = videoInputs.value[0].deviceId;
  audioInputId.value = audioInputs.value[0].deviceId;
};

setupMediaInputs();
</script>

<template>
  <div class="media-select">
    <div class="label">{{ label }}</div>

    <div class="selected" v-if="selectedMedia">
      <div class="selected-info">
        <span><b>video:</b> {{ selectedMedia.description.video }}</span>
        <span><b>audio:</b> {{ selectedMedia.description.audio }}</span>
      </div>
      <button class="selected-stop" @click="stopLocalMediaStream(selectedMedia.stream.id)">
        delete
      </button>
    </div>

    <template v-else>
      <div class="field mb-1">
        <label>Video input:</label>
        <select v-model="videoInputId">
          <option
            v-for="(videoInput, i) in videoInputs"
            :key="videoInput.deviceId"
            :value="videoInput.deviceId"
          >
            {{ videoInput.label }}
          </option>
        </select>
      </div>

      <div class="field mb-1">
        <label>Audio input:</label>
        <select v-model="audioInputId">
          <option
            v-for="(audioInput, i) in audioInputs"
            :key="audioInput.deviceId"
            :value="audioInput.deviceId"
          >
            {{ audioInput.label }}
          </option>
        </select>
      </div>

      <button @click="setMedia">add media</button>
    </template>
  </div>
</template>

<style scoped>
.media-select {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: #474646;
  padding: 12px;
  border-radius: 12px;
}

.label {
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.selected {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2f2d2d;
  padding: 8px;
  border-radius: 8px;
}
.selected-info {
  display: flex;
  flex-direction: column;
}

.field select {
  width: 100%;
}
</style>
