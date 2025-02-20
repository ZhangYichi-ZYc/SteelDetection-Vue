<template>
  <div class="settings-container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <router-link :to="{ name: 'Tutorial' }">连接教程</router-link>
      <router-link :to="{ name: 'Device' }">设备管理</router-link>
      <router-link :to="{ name: 'Purchase' }">设备购买</router-link>
      <router-link :to="{ name: 'FAQ' }">常见问题</router-link>
    </div>

    <!-- 子页面出口 -->
    <router-view></router-view>
  </div>
</template>