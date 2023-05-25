import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env = { ...process.env, ...loadEnv(process.env.NODE_ENV, process.cwd()) };

export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	define: {
		global: 'window',
	},
	base: process.env.VITE_BASE_URL,
});
