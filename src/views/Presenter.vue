<script setup>
import { ref, reactive, computed, nextTick } from 'vue';
import useMedia from '@/lib/rtc/useMedia';
import usePresenter from '@/lib/rtc/usePresenter';
import MediaSelect from '@/components/MediaSelect.vue';

const STREAMS = ['room', 'dice'];

const { localMediaStreams, setupVideoElement, stopLocalMediaStream } = useMedia();
const { startPresent, stopPresent } = usePresenter();

const streaming = ref(false);
const videos = reactive({ room: null, dice: null });

const disabled = computed(() => !localMediaStreams.room || !localMediaStreams.dice);

const start = () => {
  streaming.value = true;

  STREAMS.forEach(async (streamId) => {
    const stream = localMediaStreams[streamId].stream;
    startPresent(stream, streamId);
    await nextTick();
    setupVideoElement(videos[streamId], stream);
  });
};

const stop = () => {
  STREAMS.forEach((streamId) => stopPresent(streamId));
  stopLocalMediaStream();
  streaming.value = false;
};
</script>

<template>
  <div class="root">
    <div v-if="!streaming" class="container">
      <MediaSelect :label="STREAMS[0]" class="mb-2" />
      <MediaSelect :label="STREAMS[1]" class="mb-2" />
      <button :disabled="disabled" class="btn" @click="start">start</button>
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
