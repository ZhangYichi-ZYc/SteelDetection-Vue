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

  // 欢迎页模块（安装引导流程）
  {
    path: '/welcome',
    name:'Welcome',
    component: () => import('../views/welcome/Steps.vue'),
    
  },

  // 数据监测模块（首页）
  {
    path: '/monitoring',
    component: () => import('../views/monitoring/Main.vue'),
    children: [
      // 默认重定向到数据全览
      {
        path: '', // 匹配 /monitoring
        name: 'MonitoringBase',
        redirect: { name: 'Overview' }
      },
      // 数据全览
      {
        path: 'overview', // 匹配 /monitoring/overview
        name: 'Overview',
        component: () => import('../views/monitoring/Overview.vue')
      },
      // 实时监测
      {
        path: 'realtime', // 匹配 /monitoring/realtime
        name: 'Realtime',
        component: () => import('../views/monitoring/Realtime.vue')
      },
      // 上传监测
      {
        path: 'upload', // 匹配 /monitoring/upload
        name: 'Upload',
        component: () => import('../views/monitoring/Upload.vue')
      },
      // 历史记录
      {
        path: 'history', // 匹配 /monitoring/history
        name: 'History',
        component: () => import('../views/monitoring/History.vue')
      },
      // 系统设置
      {
        path: 'settings', // 匹配 /monitoring/settings
        component: () => import('../views/settings/Main.vue'),
        children: [
          // 默认重定向到连接教程
          {
            path: '', // 匹配 /monitoring/settings
            name: 'SettingsBase',
            redirect: { name: 'Tutorial' }
          },
          // 连接教程
          {
            path: 'tutorial', // 匹配 /monitoring/settings/tutorial
            name: 'Tutorial',
            component: () => import('../views/settings/Tutorial.vue')
          },
          // 设备管理
          {
            path: 'device', // 匹配 /monitoring/settings/device
            name: 'Device',
            component: () => import('../views/settings/Device.vue')
          },
          // 设备购买
          {
            path: 'purchase', // 匹配 /monitoring/settings/purchase
            name: 'Purchase',
            component: () => import('../views/settings/Purchase.vue')
          },
          // 常见问题
          {
            path: 'faq', // 匹配 /monitoring/settings/faq
            name: 'FAQ',
            component: () => import('../views/settings/FAQ.vue')
          }
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