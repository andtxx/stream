<script setup>
import { onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import useRoomStore from '@/store/room';
import useRtc from '@/lib/rtc/useRtc';
import socket from '@/lib/socket';

const route = useRoute();
const roomStore = useRoomStore();
const { clients, setRemoteVideoElement, setupRtc } = useRtc();

const loading = ref(true);

const joinRoom = async () => {
  await setupRtc();
  await roomStore.joinRoom({ roomId: route.params.id });
  loading.value = false;
};

joinRoom();

// onUnmounted(() => {
//   socket.emit('room:leave');
// });
</script>

<template>
  <div class="room">
    <div v-if="loading">Loading...</div>
    <template v-else>
      <div class="room-header mb-2">
        <h1>Room {{ roomStore.joinedRoom.name }}</h1>
        <div class="controls">
          <button>enable sound</button>
          <RouterLink to="/">LEAVE</RouterLink>
        </div>
      </div>

      <div class="room-clients">
        <div v-for="client in clients" :key="client.id" class="client">
          <span class="client-id mb-1">{{ client.id }}</span>
          <video
            :ref="(el) => setRemoteVideoElement(client.id, el)"
            autoplay
            playsinline
            muted
            class="video"
          ></video>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.room-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.controls * {
  margin: 6px;
}
.local {
  position: fixed;
  bottom: 20px;
  right: 20px;
  max-width: calc(100% - 40px);
  max-height: 30vh;
  width: 300px;
}

.video {
  display: block;
  object-fit: contain;
  background: black;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
}
.room-clients {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
}

.client {
  max-width: 400px;
  max-height: 50vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #4d4848;
  border-radius: 16px;
}

.client-id {
  font-size: 1rem;
}
</style>
