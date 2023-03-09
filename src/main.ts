import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { ipcRenderer } from 'electron'
console.log(ipcRenderer);


createApp(App).mount('#app')
