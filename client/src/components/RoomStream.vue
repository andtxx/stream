<script setup>
import { onBeforeUnmount, watch } from 'vue';
import useMedia from '@/lib/rtc/useMedia';
import useRtc from '@/lib/rtc/useRtc';
import useRoomStore from '@/store/room';

const roomStore = useRoomStore();
const { localMediaStreams, stopLocalVideoStream, setupVideoElement } = useMedia();
const { setupRtc } = useRtc();

watch(localMediaStreams, (streams) => {
  if (!streams.length) roomStore.closeRoom();
});

onBeforeUnmount(() => {
  stopLocalVideoStream();
});

setupRtc();
</script>

<template>
  <div class="room-stream">
    <div class="room-head mb-2">
      <div class="room-info">
        <span><b>name: </b> {{ roomStore.createdRoom.name }}</span>
        <span><b>id: </b>{{ roomStore.createdRoom.id }}</span>
      </div>
      <button @click="roomStore.closeRoom">close</button>
    </div>
    <div class="streams">
      <div class="stream" v-for="{ stream } in localMediaStreams" :key="stream.id">
        <video :ref="(el) => setupVideoElement(el, stream)" autoplay playsinline muted></video>
        <button @click="stopLocalVideoStream(stream.id)">delete</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.room-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.room-info {
  display: flex;
  flex-direction: column;
}

.streams {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px;
}

.stream video {
  width: 100%;
}
</style>
