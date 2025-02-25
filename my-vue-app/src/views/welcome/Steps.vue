<template>
  <div class="setup-container">
    <!-- 新增导航栏 -->
    <div class="setup-navbar">
      <div class="nav-left">
        <img src="../../assets/AutoVsionLOGO@1x.png" class="nav-logo" alt="AutoVision">
        
      </div>
      <div class="nav-right">
       
        <img src="../../assets/touxiang.png" alt="头像">
      </div>
    </div>

 

    <!-- 新增欢迎页面（步骤0） -->
    <div v-if="currentStep === 0" class="welcome-card">
         <!-- 进度条 -->
      <div class="progress-container">
        <div class="progress-bar" :style="{ width: progressWidth }"></div>
      </div>
      <img src="../../assets/step0.png" alt="欢迎图片">
      <div class="text">
        <p>欢迎来到AutoVision</p>
        <p>接下来我将会帮助你完成设备安装配置</p>
        <el-icon :size="30" color="#1B7EF2" class="arrow-button" @click="nextStep">
          <Right />
        </el-icon>
      </div>
    </div>

    <!-- 步骤1：安装摄像头 -->
    <div v-if="currentStep === 1" class="step-card">
         <!-- 进度条 -->
      <div class="progress-container">
        <div class="progress-bar" :style="{ width: progressWidth }"></div>
      </div>
      <h1 class="title">第一步：按照图示安装好配套的摄像头至你的流水线的检测环节</h1>
      <div class="content-1">
        <img src="../../assets/step1.png" alt="安装示意图1">
        <div class="instructions-1">
          <p>先将摄像头xxxxxxxxxxxxxxxxxxxxx
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          </p>
        </div>
      </div>
      <div class="content-2">
        <img src="../../assets/step1.png" alt="安装示意图2">
        <div class="instructions-2">
          <p>先将摄像头xxxxxxxxxxxxxxxxxxxxx
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          </p>
        </div>
      </div>
      <div class="content-3">
        <img src="../../assets/step1.png" alt="安装示意图3">
        <div class="instructions-3">
          <p>先将摄像头xxxxxxxxxxxxxxxxxxxxx
            xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
          </p>
        </div>
      </div>

      <div class="action-buttons">
        <el-icon :size="30" color="#1B7EF2" class="arrow-button" @click="nextStep">
          <Right />
        </el-icon>
        <button @click="showSkipDialog = true">跳过</button>

      </div>
    </div>

    <!-- 步骤2：连接主机 -->
    <div v-if="currentStep === 2" class="step-card">
         <!-- 进度条 -->
      <div class="progress-container">
        <div class="progress-bar" :style="{ width: progressWidth }"></div>
      </div>
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
         <!-- 进度条 -->
      <div class="progress-container">
        <div class="progress-bar" :style="{ width: progressWidth }"></div>
      </div>
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
    <div v-if="currentStep === 4" class="completion-card">
         <!-- 进度条 -->
      <div class="progress-container">
        <div class="progress-bar" :style="{ width: progressWidth }"></div>
      </div>
      <img src="../../assets/step4.png" alt="结束图片">
      <div class="text-2">
        <h1>🎉 安装完成!</h1>
        <p>现在可以开始使用AutoVision进行智能检测</p>
        <button class="primary" @click="gotoMonitoring">进入数据监测</button>
      </div>
    </div>

    <!-- 跳过安装对话框 -->
    <div v-if="showSkipDialog" class="dialog-overlay">
      <div class="dialog">
        <p>安装后才可进行零件的实时监测，</p>
        <p>您确定跳过摄像头安装教学吗？</p>
        <p>可在“系统设置”中学习摄像头安装流程。</p>
        <div class="dialog-buttons">
          <button class="warning" @click="skipInstallation">确认</button>
          <button class="yes" @click="showSkipDialog = false">取消</button>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ArrowRight } from '@element-plus/icons-vue'
import { Right } from '@element-plus/icons-vue'


export default {
  components: { ArrowRight },
  data() {
    return {
      currentStep: 0,
      showSkipDialog: false,
      currentCameraView: import('../../assets/current-view.png'),
      totalSteps: 4 // 总步骤数
    }
  },
  computed: {
    // 计算进度条宽度
    progressWidth() {
      return `${((this.currentStep + 1) / this.totalSteps) * 100}%`
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
 /* 垂直水平居中必备 */
    display: flex;          /* 触发弹性布局 */
    justify-content: center; /* 主轴对齐 */
    align-items: center;    /* 交叉轴对齐 */
    min-height: 100vh;      /* 保证容器撑满屏幕 */
    position: relative;
    width: 1920px;
    height: 146.12px;
    opacity: 1;
        
    background:#0A0721;

	

	
}

/* 新增导航栏样式 */
.setup-navbar {
 position: absolute;
left: 0px;
top: 0px;
width: 1920px;
height: 146.12px;
opacity: 1;
}

.nav-left {



  position: absolute;
left: 58px;
top: 23px;
width: 271px;
height: 83px;
opacity: 1;
}

.nav-right{
position: absolute;
left: 1804px;
top: 35px;
width: 71px;
height: 71px;
border-radius: 100px;
opacity: 1;
}

/* 进度条样式 */
.progress-container {
position: absolute;
left: 81px;
top: 54px;
width: 854px;
height: 8px;
border-radius: 8px;
opacity: 1;
	
background: rgba(112, 112, 112, 0.2314);
	
}

.progress-bar {
  height: 100%;
  background: #1B7EF2;
  transition: width 0.3s ease;
}


/* 新增欢迎页面样式 */
.welcome-card {
  background: white;
position: absolute;
left: 452px;
top: 202px;
width: 1016px;
height: 687px;
border-radius: 15px;
opacity: 1;
	
background: #FFFFFF;
	
box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
	
}
.welcome-card img{
  position: absolute;
left: 376px;
top: 181px;
width: 275px;
height: 236px;
opacity: 1;
	
}

.text  {
position: absolute;
left: 183px;
top: 460px;
width: 660px;
height: 117px;
opacity: 1;
	
font-family: Source Han Sans;
font-size: 33px;
font-weight: normal;
line-height: normal;
text-align: center;
letter-spacing: 0em;
	
font-variation-settings: "opsz" auto;
font-feature-settings: "kern" on;
color: #000000;
line-height: 15px;
	
}
/* 箭头按钮样式 */
 .text .arrow-button {
  position: absolute;
  left: 618px;
top: 72px;
  cursor: pointer; /* 鼠标悬停时显示手型 */
  transition: opacity 0.3s ease; /* 添加悬停效果 */
  margin-top: 2px; /* 与文字间距 */
}

.arrow-button:hover {
  opacity: 0.8; /* 悬停时轻微透明 */
}

.welcome-card button {
  margin-top: 2rem;
  padding: 1rem 3rem;
}

.step-card {
position: absolute;
left: 452px;
top: 197px;
width: 1016px;
height: 687px;
border-radius: 15px;
opacity: 1;
	
background: #FFFFFF;
	
box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
	
}

.title {
position: absolute;
left: 52px;
top: 115px;
width: 912px;
height: 52px;
opacity: 1;
	
font-family: Source Han Sans;
font-size: 28px;
font-weight: normal;
line-height: normal;
text-align: center;
letter-spacing: 0em;
	
font-variation-settings: "opsz" auto;
font-feature-settings: "kern" on;
color: #000000;
	
}
.content-1 img{
  position: absolute;
left: 37px;
top: 220px;
width: 297px;
height: 219px;
opacity: 1;
}

.instructions-1 p {
position: absolute;
left: 41px;
top: 473px;
width: 293px;
height: 106px;
opacity: 1;
	
font-family: Source Han Sans;
font-size: 20px;

	
font-variation-settings: "opsz" auto;
font-feature-settings: "kern" on;
color: #000000;
	
}

.content-2 img{
  position: absolute;
left: 360px;
top: 220px;
width: 297px;
height: 219px;
opacity: 1;

}

.instructions-2 p{
  position: absolute;
left: 360px;
top: 474px;
width: 293px;
height: 106px;
opacity: 1;
	
font-family: Source Han Sans;
font-size: 20px;

	
font-variation-settings: "opsz" auto;
font-feature-settings: "kern" on;
color: #000000;
	
}
.content-3 img{
  position: absolute;
left: 683px;
top: 220px;
width: 297px;
height: 219px;
opacity: 1;
}
.instructions-3 p{
  
position: absolute;
left: 683px;
top: 475px;
width: 293px;
height: 106px;
opacity: 1;
	
font-family: Source Han Sans;
font-size: 20px;

	
font-variation-settings: "opsz" auto;
font-feature-settings: "kern" on;
color: #000000;
	
}
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

button {

position: absolute;
left: 932px;
top: 630px;
width: 75px;
height: 42px;
opacity: 1;

font-family: Source Han Sans;
font-size: 18px;
font-weight: normal;
line-height: 43.2px;
text-align: center;
letter-spacing: 0px;

font-variation-settings: "opsz" auto;
font-feature-settings: "kern" on;
color: #979797;
}
/* 箭头按钮样式 */
 .action-buttons .arrow-button {
  position: absolute;
  left: 890px;
top: 637px;
  cursor: pointer; /* 鼠标悬停时显示手型 */
  transition: opacity 0.3s ease; /* 添加悬停效果 */
  margin-top: 2px; /* 与文字间距 */
}

.primary {
  background: #1B7EF2;
  color: white;
}

/* 新增结束页面样式 */
.completion-card {
  background: white;
position: absolute;
left: 452px;
top: 202px;
width: 1016px;
height: 687px;
border-radius: 15px;
opacity: 1;
	
background: #FFFFFF;
	
box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
	
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
position: absolute;
left:581px;
top: 380px;
width: 759px;
height: 301px;
border-radius: 15px;
opacity: 1;

background: #FFFFFF;
}
.dialog p{
  position: relative;
left: 141px;
top: 30px;
width: 478px;
height: 25px;
opacity: 1;
	
font-family: Source Han Sans;
font-size: 24px;
font-weight: bold;
line-height: 50px;
text-align: center;
letter-spacing: 0px;

	
font-variation-settings: "opsz" auto;
font-feature-settings: "kern" on;
color: #3D3D3D;

	
}
.yes{
position: absolute;
left: 554px;
top: 239px;
width: 85px;
height: 44px;
opacity: 1;
	
font-family: Source Han Sans;
font-size: 18px;
font-weight: 500;
line-height: 50px;
text-align: center;
letter-spacing: 0px;
	
font-variation-settings: "opsz" auto;
font-feature-settings: "kern" on;
color: #979797;
	
}
.warning{
  position: absolute;
left: 639px;
top: 242px;
width: 89px;
height: 41px;
border-radius: 8px;
opacity: 1;
	
background: #1B7EF2;
	
}
/* 卡片动效 */
.step-card {
  transition: transform 0.3s ease;
}
.step-card:hover {
  transform: translateY(-5px);
}

</style>