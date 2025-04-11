<template>
  <div class="main-container">
    <header class="global-header">
      <!-- 左侧Logo -->
      <div class="header-left">
        <img src="../../assets/AutoVsionLOGO@1x.png" class="logo">
      </div>

      <!-- 中间导航栏 -->
      <nav class="top-nav">
        <router-link 
          v-for="item in navItems" 
          :key="item.path" 
          :to="{ name: item.name }"
          active-class="active-nav"
        >
          <el-icon :size="20" class="nav-icon">
            <component :is="item.icon" />
          </el-icon>
          {{ item.title }}
        </router-link>
      </nav>

      <!-- 右侧时间+头像 -->
      <div class="header-right">
        <div class="system-time">
          <div class="date-week">
            <span class="date">{{ dateStr }}</span>
            <span class="week">{{ weekStr }}</span>
            <span class="time">{{ timeStr }}</span>
          </div>
        </div>
        <el-avatar :src="userAvatar" size="default" />
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content" :class="{ 'overview-bg': isOverview }">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { 
  Monitor, 
  Clock, 
  Upload, 
  Histogram,
  Setting 
} from '@element-plus/icons-vue'

export default {
  components: { Monitor, Clock, Upload, Histogram, Setting },
  data() {
    return {
      navItems: [
        { title: '数据全览', name: 'Overview', icon: 'Monitor' },
        { title: '实时监测', name: 'Realtime', icon: 'Clock' },
        { title: '上传监测', name: 'Upload', icon: 'Upload' },
        { title: '历史记录', name: 'History', icon: 'Histogram' },
        { title: '系统设置', name: 'SettingsBase', icon: 'Setting' }
      ],
      dateStr: '',
      weekStr: '',
      timeStr: '',
      userAvatar: new URL('../../assets/touxiang.png', import.meta.url).href
    }
  },
  mounted() {
    this.updateTime()
    this.timer = setInterval(this.updateTime, 1000)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
  methods: {
    updateTime() {
      const date = new Date()
      const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }
      const weekOptions = { weekday: 'long' }
      const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }

      this.dateStr = date.toLocaleDateString('zh-CN', dateOptions).replace(/\//g, '-')
      this.weekStr = date.toLocaleDateString('zh-CN', weekOptions)
      this.timeStr = date.toLocaleTimeString('zh-CN', timeOptions)
    }
  },
  computed: {
    isOverview() {
      return this.$route.name === 'Overview'
    }
  }
}
</script>

<style scoped>
.main-container {
  width: 1920px;
  height: 1080px;
  background: #0F0B30;
  position: relative;
}

.global-header {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  background: #FFFFFF;
}

/* 导航栏样式 */
.top-nav {
  display: flex;
  gap: 40px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-family: Inter;
  font-size: 18px;
  font-weight: 500;
  line-height: 11.64px;
  letter-spacing: 0.05px;
}

.top-nav a {
  color: #AAAAAA;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 6px;
  transition: all 0.3s;
  position: relative;
}

.active-nav {
  color: #0256FF !important;
}

.active-nav::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 55%;
  transform: translateX(-50%);
  width: 60%;
  height: 3px;
  background: #1B7EF2;
  border-radius: 2px;
}

/* 右侧时间样式 */
.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
  color: #45A2FF;
}

.system-time {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.date-week {
  display: flex;
  gap: 16px;
  font-size: 20px;

  font-weight: 500;
  line-height: 30px;

}


/* 背景图片 */
.main-content {
  position: relative;
  height: calc(100% - 80px);
  padding: 30px;
  overflow-y: auto;
  background: #0F0B30;
}

.main-content.overview-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('../../assets/overview-bg.png');
  background-size: cover;
  background-position: center;
  opacity: 0.3;
  z-index: 0;
}

.main-content > * {
  position: relative;
  z-index: 1;
}
</style>