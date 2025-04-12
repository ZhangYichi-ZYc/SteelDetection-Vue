<template>
  <el-container class="settings-container">
    <el-container>
      <!-- 左侧导航栏（包含用户信息） -->
      <el-aside width="260px" class="left-panel">
        <!-- 用户信息区域 -->
        <div class="user-info">
          <el-avatar 
            :size="64" 
            src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            class="user-avatar"
          />
          <div class="user-meta">
            <div class="user-id">检测员ID：{{ userId }}</div>
            <div class="system-name">设备监测系统</div>
          </div>
        </div>

        <!-- 导航菜单 -->
        <el-menu
          router
          :default-active="activeMenu"
          class="nav-menu"
          @select="handleMenuSelect"
        > 
          <el-menu-item index="/monitoring/settings/ai">
            <el-icon><chat-dot-round /></el-icon>
            <span>AI对话</span>
          </el-menu-item>
          <el-menu-item index="/monitoring/settings/tutorial">
            <template #title>
              <el-icon><connection /></el-icon>
              <span>连接教程</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/monitoring/settings/device">
            <el-icon><cpu /></el-icon>
            <span>设备管理</span>
          </el-menu-item>
          <el-menu-item index="/monitoring/settings/purchase">
            <el-icon><shopping-cart /></el-icon>
            <span>设备购买</span>
          </el-menu-item>
          <el-menu-item index="/monitoring/settings/faq">
            <el-icon><question-filled /></el-icon>
            <span>常见问题</span>
          </el-menu-item>
          
        </el-menu>
      </el-aside>

      <!-- 右侧内容区域 -->
      <el-main class="right-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <component 
              :is="Component" 
              class="content-wrapper"
              :key="$route.path"
            />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Connection,
  Cpu,
  ShoppingCart,
  QuestionFilled,
  ChatDotRound
} from '@element-plus/icons-vue'

const userId = ref('DET-20230001')
const route = useRoute()

const activeMenu = computed(() => {
  return route.path
})

const handleMenuSelect = (index) => {
  console.log('当前选中菜单:', index)
}
</script>

<style scoped lang="scss">
.settings-container {
  height: calc(100vh - 60px); // 根据实际导航栏高度调整
  background: #f5f7fa;

  .left-panel {
    background: #ffffff;
    border-right: 1px solid #e4e7ed;
    display: flex;
    flex-direction: column;

    .user-info {
      padding: 24px;
      border-bottom: 1px solid #e4e7ed;
      
      .user-avatar {
        margin-bottom: 16px;
      }

      .user-meta {
        .user-id {
          font-size: 14px;
          color: #606266;
          line-height: 1.5;
        }

        .system-name {
          font-size: 16px;
          color: #303133;
          font-weight: 500;
          margin-top: 8px;
        }
      }
    }

    .nav-menu {
      flex: 1;
      border-right: none;
      
      &:deep(.el-menu-item) {
        height: 48px;
        line-height: 48px;
        margin: 4px 12px;
        border-radius: 6px;
        
        &.is-active {
          background-color: #ecf5ff;
          color: #409eff;
        }

        .el-icon {
          margin-right: 8px;
          font-size: 18px;
        }
      }
    }
  }

  .right-main {
    padding: 20px;
    background: #f5f7fa;
    overflow-y: auto; // 自动出现滚动条

    .content-wrapper {
      background: #ffffff;
      border-radius: 8px;
      padding: 24px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
      min-height: calc(100% - 40px); // 保证内容高度
    }
  }
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s ease;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>