<template>
  <div class="settings-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <span>系统设置</span>
    </header>

    <!-- 主体内容 -->
    <div class="main-content">
      <!-- 左侧导航栏 -->
      <div class="sidebar">
        <el-menu>
          <el-menu-item index="1">连接教程</el-menu-item>
          <el-menu-item index="2">设备管理</el-menu-item>
          <el-menu-item index="3">设备购买</el-menu-item>
          <el-menu-item index="4">常见问题</el-menu-item>
        </el-menu>
      </div>

      <!-- 右侧内容区 -->
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMenu, ElMenuItem } from 'element-plus'

export default {
  components: { ElMenu, ElMenuItem }
}
</script>

<style scoped>
.settings-container {
  padding: 20px;
}

.header {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 20px;
}

.main-content {
  display: flex;
}

.sidebar {
  width: 200px;
  margin-right: 20px;
}

.content {
  flex: 1;
}
</style>