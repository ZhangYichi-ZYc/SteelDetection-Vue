<template>
  <div class="setup-container">
    <!-- 新增欢迎页面（步骤0） -->
    <div v-if="currentStep === 0" class="welcome-card">
      <h1>欢迎来到AutoVision</h1>
      <p>接下来我将会帮助你完成设备安装配置</p>
      <button class="primary" @click="nextStep">开始配置</button>
    </div>

    <!-- 步骤1：安装摄像头 -->
    <div v-if="currentStep === 1" class="step-card">
      <h1 class="title">第一步：安装摄像头</h1>
      <div class="content">
        <img src="../../assets/step1.png" alt="安装示意图">
        <div class="instructions">
          <p>1. 将摄像头支架固定在流水线检测位置</p>
          <p>2. 调整摄像头角度至45°仰角</p>
          <p>3. 用螺丝固定底座</p>
        </div>
      </div>
      <div class="action-buttons">
        <button @click="showSkipDialog = true">跳过安装</button>
        <button class="primary" @click="nextStep">下一步</button>
      </div>
    </div>

    <!-- 步骤2：连接主机 -->
    <div v-if="currentStep === 2" class="step-card">
      <h1 class="title">第二步：连接检测主机</h1>
      <div class="content">
        <img src="../../assets/step2.png" alt="连接示意图">
        <div class="instructions">
          <p>1. 使用USB3.0数据线连接设备</p>
          <p>2. 确认主机识别到摄像头</p>
          <p>3. 检查设备管理器中的连接状态</p>
        </div>
      </div>
      <div class="action-buttons">
        <button @click="prevStep">上一步</button>
        <button class="primary" @click="nextStep">下一步</button>
      </div>
    </div>

    <!-- 步骤3：调试角度 -->
    <div v-if="currentStep === 3" class="step-card">
      <h1 class="title">第三步：调试摄像头</h1>
      <div class="instructions">
        <p>参考示意图调整角度：</p>
        <div class="comparison">
          <img src="../../assets/step3.png" alt="标准角度">
          <img :src="currentCameraView" alt="当前视角">
        </div>
      </div>
      <div class="action-buttons">
        <button @click="prevStep">上一步</button>
        <button class="primary" @click="completeSetup">完成调试</button>
      </div>
    </div>

    <!-- 完成页面 -->
    <div v-if="currentStep === 4" class="completion">
      <h1>🎉 安装完成!</h1>
      <p>现在可以开始使用AutoVision进行智能检测</p>
      <button class="primary" @click="gotoMonitoring">进入数据监测</button>
    </div>

    <!-- 跳过安装对话框 -->
    <div v-if="showSkipDialog" class="dialog-overlay">
      <div class="dialog">
        <h3>确定跳过摄像头安装？</h3>
        <p>跳过将无法使用实时监测功能</p>
        <div class="dialog-buttons">
          <button @click="showSkipDialog = false">取消</button>
          <button class="warning" @click="skipInstallation">确认跳过</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentStep: 0,
      showSkipDialog: false,
      currentCameraView: import('../../assets/current-view.png')
    }
  },
  methods: {
    nextStep() {
      if (this.currentStep < 4) this.currentStep++
    },
    prevStep() {
      if (this.currentStep > 1) this.currentStep--
    },
    skipInstallation() {
      this.showSkipDialog = false
      this.currentStep = 4
    },
    completeSetup() {
      this.currentStep = 4
    },
    gotoMonitoring() {
      this.$router.push('/monitoring')
    },

    mounted() {
  console.log('当前路由信息:', {
    path: this.$route.path,
    matched: this.$route.matched.map(r => r.path)
  })
}
  }
}
</script>

<style scoped>
.setup-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f5f7fa;
  border-radius: 12px;
}

/* 新增欢迎页面样式 */
.welcome-card {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
.welcome-card h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.welcome-card button {
  margin-top: 2rem;
  padding: 1rem 3rem;
}

.step-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.title {
  color: #2c3e50;
  font-family: 'YouSheBiaoTiHei';
  margin-bottom: 1.5rem;
}

.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.instructions p {
  font-size: 16px;
  line-height: 1.6;
  color: #34495e;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.primary {
  background: #1B7EF2;
  color: white;
}

.warning {
  background: #ff4757;
  color: white;
}

.comparison {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin: 2rem 0;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  min-width: 400px;
}

/* 卡片动效 */
.step-card {
  transition: transform 0.3s ease;
}
.step-card:hover {
  transform: translateY(-5px);
}

</style>