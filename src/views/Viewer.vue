<script setup>
import { ref, reactive, nextTick } from 'vue';
import useViewer from '@/lib/rtc/useViewer';

const STREAMS = ['room', 'dice'];

const { startView, stopView } = useViewer();

const watching = ref(false);
const videos = reactive({ room: null, dice: null });

const start = () => {
  watching.value = true;
  STREAMS.forEach(async (streamId) => {
    await nextTick();
    startView(videos[streamId], streamId);
  });
};

const stop = () => {
  STREAMS.forEach((streamId) => stopView(streamId));
  watching.value = false;
};
</script>

<template>
  <div class="root">
    <div v-if="!watching" class="container">
      <button class="btn" @click="start">start</button>
    </div>
    <div v-else class="container">
      <video :ref="(el) => (videos[STREAMS[0]] = el)" autoplay muted class="mb-2"></video>
      <video :ref="(el) => (videos[STREAMS[1]] = el)" autoplay muted class="mb-2"></video>
      <button class="btn" @click="stop">stop</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

video {
  width: 100%;
}

.btn {
  width: 100%;
}
</style>
