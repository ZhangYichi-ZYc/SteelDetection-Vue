// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/login/index.vue';
import Steps from '../views/welcome/Steps.vue';

const routes = [
  // 登录页
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  // 安装引导流程
  {
    path: '/setup',
    name: 'Setup',
    component: Steps
  },
  
  // 核心功能区
  {
    path: '/monitoring',

    component: () => import('../views/monitoring/Main.vue'), // 父容器
    children: [
      // 数据监测子页面
      { path: '', 
        name:'Monitoring',
        redirect: {name:'Monitoring'} }, // 默认重定向
      { path: 'overview',
        name:'Overview',
        component: () => import('../views/monitoring/Overview.vue') }, // 数据全览
      { path: 'realtime',
        name: 'Realtime',
        component: () => import('../views/monitoring/Realtime.vue') }, // 实时监测
      { path: 'history', 
        name:'History',
        component: () => import('../views/monitoring/History.vue') }, // 历史记录
      { path: 'upload', 
        name:'Upload',
        component: () => import('../views/monitoring/Upload.vue') }, // 上传监测
      // 系统设置作为特殊子页面（独立嵌套）
      {
        path: 'settings',
        component: () => import('../views/settings/Main.vue'),
        children: [
          { path: '', 
            name:'SettingsBase',
            redirect: {name:'DeviceSettings'}}, // 默认重定向
          { path: 'device', 
            name:'DeviceSettings',
            component: () => import('../views/settings/Device.vue') }, // 设备管理
          { path: 'tutorial', 
            name: 'TutorialSettings',
            component: () => import('../views/settings/Tutorial.vue') }, // 连接教程
          { path: 'purchase', 
            name:'PurchaseSettings',
            component: () => import('../views/settings/Purchase.vue') }, // 设备购买
          { path: 'faq', 
            name:'FaqSettings',
            component: () => import('../views/settings/FAQ.vue') } // 常见问题
        ]
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;