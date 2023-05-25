import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes.js';

export default createRouter({
	history: createWebHistory(import.meta.env.VITE_BASE_URL),
	routes,
});
