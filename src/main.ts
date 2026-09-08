import App from './App.vue';
import './assets/main.css';
import PiniaConfig from './PiniaConfig.js';
import router from './router/index.js';
import { createApp } from 'vue';

const app = createApp(App);

app.use(PiniaConfig.init());
app.use(router);

app.mount('#app');
