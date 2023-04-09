<script setup>
import RoomCreate from '@/components/RoomCreate.vue';
import RoomStream from '@/components/RoomStream.vue';
import useRoomStore from '@/store/room';

const roomStore = useRoomStore();
</script>

<template>
  <RoomCreate v-if="!roomStore.createdRoom" />
  <RoomStream v-else />
</template>
