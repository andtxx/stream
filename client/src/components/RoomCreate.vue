<script setup>
import { ref, computed } from 'vue';
import useRoomStore from '@/store/room';
import useMedia from '@/lib/rtc/useMedia';
import StreamCreate from '@/components/StreamCreate.vue';

const { localMediaStreams } = useMedia();
const roomStore = useRoomStore();

const roomName = ref('');
const disabled = computed(() => !roomName.value || !localMediaStreams.value.length);

const createRoom = () => {
  roomStore.createRoom({ roomName: roomName.value });
};
</script>

<template>
  <div class="room-create">
    <h1 class="mb-2">Create room</h1>
    <div class="form">
      <div class="field mb-1">
        <label>Room name:</label>
        <input type="text" v-model="roomName" />
      </div>
      <StreamCreate class="mb-2" />
      <button :disabled="disabled" class="submit" @click="createRoom">create room</button>
    </div>
  </div>
</template>

<style scoped>
.form {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.field {
  display: flex;
  flex-direction: column;
}

.submit {
  width: 100%;
}
</style>
