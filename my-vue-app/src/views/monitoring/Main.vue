<template>
  <div class="monitoring-layout">
    <!-- 顶部导航 -->
    <nav class="top-nav">
        
      <router-link to="/monitoring/overview">数据全览</router-link>
      <router-link to="/monitoring/realtime">实时监测</router-link>
      <router-link to="/monitoring/settings">系统设置</router-link>
    </nav>
    
    <!-- 子页面显示区 -->
    <router-view></router-view>
  </div>
</template>