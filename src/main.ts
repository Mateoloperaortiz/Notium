import App from './App.vue';
import './assets/main.css';
import PiniaConfig from './PiniaConfig.js';
import router from './router/index.js';
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import DataTablesCore from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import DataTable from 'datatables.net-vue3';
import { createApp } from 'vue';

ChartJS.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
);
DataTable.use(DataTablesCore);

const app = createApp(App);

app.use(PiniaConfig.init());
app.use(router);

app.mount('#app');
