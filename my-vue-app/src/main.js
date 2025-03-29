import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import ECharts from 'vue-echarts';
import 'echarts';

const app = createApp(App);
app.use(router);

// 注册 Element Plus
app.use(ElementPlus)

// 注册图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册 ECharts 组件
app.component('e-charts', ECharts);
app.mount('#app');
