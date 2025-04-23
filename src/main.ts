import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App)

app.use(createPinia())
app.use(router)

const options = {
    position: 'top-right',
    timeout: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnFocusLoss: false,
    pauseOnHover: true,
}

app.use(Toast, options);

app.mount('#app')
