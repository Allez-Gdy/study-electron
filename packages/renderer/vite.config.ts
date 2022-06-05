import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/renderer'
import resolve, { lib2esm } from 'vite-plugin-resolve'
import pkg from '../../package.json'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  mode: process.env.NODE_ENV,
  root: __dirname,
  plugins: [
    vue(),
    electron(),
    resolve(
      {
        'electron-store': 'export default require("electron-store");',
        sqlite3: lib2esm('sqlite3', { format: 'cjs' }),
        serialport: lib2esm(
          'serialport',
          [
            'SerialPort',
            'SerialPortMock',
          ],
          { format: 'cjs' },
        )
      }
    )
  ],
  base: './',
  build: {
    outDir: '../../dist/renderer',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        format: "cjs"
      }
    }
  },
  server: {
    host: pkg.env.VITE_DEV_SERVER_HOST,
    port: pkg.env.VITE_DEV_SERVER_PORT
  }
})