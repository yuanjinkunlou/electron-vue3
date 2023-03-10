import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { devPlugin, getReplacer } from './plugins/devPlugin'
import optimizer from 'vite-plugin-optimizer'
import { buildPlugin } from './plugins/buildPlugin'


// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue(),
    devPlugin(),
    optimizer(getReplacer()),
    buildPlugin()
  ]
})
