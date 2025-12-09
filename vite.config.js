import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
    build: {
        outDir: 'dist',
    },
    resolve: {
        alias: {
            '@utils': path.resolve(__dirname, './js/utils'),
            '@api': path.resolve(__dirname, './js/utils/api-client.js'),
            '@endpoints': path.resolve(__dirname, './js/utils/endpoints.js'),
            '@token-service': path.resolve(__dirname, './js/utils/token-service.js'),
            '@auth-service': path.resolve(__dirname, './js/services/auth-service.js'),
            '@user-service': path.resolve(__dirname, './js/services/user-service.js')
        }
    },
    server: {
        open: true, // Auto-open browser on start
        port: 3000,
        allowedHosts: ['pagina-rolapet.onrender.com'],
    },
});
