import { ref } from 'vue';
import { defineStore } from 'pinia';
import socket from '@/lib/socket';

const useSocketStore = defineStore('socket', () => {
	const connected = ref();
	const id = ref();

	return {
		connected,
		id,
	};
});

socket.on('connect', () => {
	const store = useSocketStore();
	store.connected = true;
	store.id = socket.id;
});

socket.on('disconnect', () => {
	const store = useSocketStore();
	store.connected = false;
	store.id = null;
});

export default useSocketStore;
