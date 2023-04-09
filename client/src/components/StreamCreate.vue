<script setup>
import { ref, computed } from 'vue';
import useMedia from '@/lib/rtc/useMedia';

const {
  localMediaStreams,
  localMediaError,
  videoInputs,
  audioInputs,
  setLocalVideoStream,
  stopLocalVideoStream,
  getMediaInputs,
} = useMedia();

const videoInputId = ref(null);
const audioInputId = ref(null);

const disabled = computed(() => localMediaStreams.value.length);

const setStream = async () => {
  await setLocalVideoStream(videoInputId.value, audioInputId.value);

  if (localMediaError.value) {
    alert(localMediaError.value);
  }
};

const setupMediaInputs = async () => {
  await getMediaInputs();

  if (localMediaError.value) {
    alert(localMediaError.value);
    return;
  }

  videoInputId.value = videoInputs.value[0].deviceId;
  audioInputId.value = audioInputs.value[0].deviceId;
};

setupMediaInputs();
</script>

<template>
  <div class="stream-form">
    <div class="streams-list">
      <div
        class="stream mb-1"
        v-for="{ stream, description } in localMediaStreams"
        :key="stream.id"
      >
        <div class="stream-info">
          <span><b>video:</b> {{ description.video }}</span>
          <span><b>audio:</b> {{ description.audio }}</span>
        </div>
        <button class="stream-stop" @click="stopLocalVideoStream(stream.id)">delete</button>
      </div>
    </div>

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

    <button @click="setStream" :disabled="disabled">add media</button>
  </div>
</template>

<style scoped>
.stream-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: #474646;
  padding: 12px;
  border-radius: 12px;
}

.stream {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2f2d2d;
  padding: 8px;
  border-radius: 8px;
}
.stream-info {
  display: flex;
  flex-direction: column;
}

.field select {
  width: 100%;
}
</style>
