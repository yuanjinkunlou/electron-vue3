import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { devPlugin, getReplacer } from './plugins/devPlugin'
import optimizer from 'vite-plugin-optimizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    devPlugin({
      entry: './electron/main/index.ts',
      outfile: './dist-electron/main/index.js'
    }),
    optimizer(getReplacer())
  ]
})
