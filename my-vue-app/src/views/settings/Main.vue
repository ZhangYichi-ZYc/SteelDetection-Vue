<!-- src/views/settings/Main.vue -->
<template>
  <div class="settings-wrapper">
    <!-- 左侧导航 -->
    <div class="sidebar">
      <router-link to="/monitoring/settings/device">设备管理</router-link>
      <router-link to="/monitoring/settings/tutorial">连接教程</router-link>
    </div>

    <!-- 右侧内容区 -->
    <div class="content">
      <router-view></router-view> <!-- 嵌套路由出口 -->
    </div>
  </div>
</template>