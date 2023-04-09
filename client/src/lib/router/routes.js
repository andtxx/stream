import Admin from '@/views/Admin.vue';
import Room from '@/views/Room.vue';

export default [
  { path: '/', component: Admin },
  { path: '/:id', component: Room },
];
