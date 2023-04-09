import { ref } from 'vue';
import { defineStore } from 'pinia';
import socket, { request } from '@/lib/socket';

const useRoomStore = defineStore('room', () => {
  const createdRoom = ref(null);
  const joinedRoom = ref(null);

  const createRoom = async ({ roomName }) => {
    const { error, result } = await request('room:create', { roomName });
    if (error) return alert(error.message);

    createdRoom.value = result.room;
  };

  const closeRoom = () => {
    socket.emit('room:close', { roomId: createdRoom.value.id });
    createdRoom.value = null;
  };

  const joinRoom = async ({ roomId }) => {
    const { error, result } = await request('room:join', { roomId });
    if (error) return alert(error.message);

    joinedRoom.value = result.room;
  };

  return {
    createdRoom,
    joinedRoom,
    createRoom,
    closeRoom,
    joinRoom,
  };
});

socket.on('disconnect', () => {
  const store = useRoomStore();
  store.createdRoom = null;
  store.joinedRoom = null;
});

export default useRoomStore;
