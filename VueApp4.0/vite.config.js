import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import 'bootstrap/scss/bootstrap';
import 'bootstrap/dist/js/bootstrap';
import * as bootstrap from'bootstrap';
import { Modal } from 'bootstrap'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
