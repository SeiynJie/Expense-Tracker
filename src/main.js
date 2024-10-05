import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const app = createApp(App)

const plugins = [router, Toast]; // Array of plugins

plugins.forEach(plugin => app.use(plugin));

app.mount('#app')
