
<template>
  <div class="container">
    <!-- 顶部导航 -->
    <header class="header">
      <nav class="nav">
        <div class="nav-tags">
          <a href="#">使用说明</a>
          <a href="#">联系客服</a>
          <a href="#">设备购买</a>
          <a href="#">个性服务</a>
        </div>
      </nav>
    </header>

    <!-- 左侧文字 -->
    <div class="left-text">
      <div class="upper-text">
        <p class="gradient-text-1">/</p>
        <p class="gradient-text-2">智能，高效</p>
      </div>
      <div class="bottom-text">
        <p class="solid-text">以深度智能视觉技术</p>
        <p class="solid-text">为车辆零部件品质筑牢坚固防线</p>
      </div>
    </div>

    <!-- 中间内容 -->
    <main class="main">
      <!-- 卡片容器 -->
      <div class="card">
        <!-- 右上角切角按钮 -->
        <div class="qr-corner" @click="toggleQRCode">
          <img src="../../assets/qr-corner.png" alt="二维码切角">
        </div>

        <!-- 标题 -->
        <div class="logo">
          <h1></h1>
        </div>

        <!-- 登录选项 -->
        <div class="login-options" v-if="!showQRCode">
          <button :class="{ active: loginType === 'password' }" @click="loginType = 'password'">密码登录</button>
          <button :class="{ active: loginType === 'phone' }" @click="loginType = 'phone'">手机号登录</button>
        </div>

        <!-- 密码登录表单 -->
        <div v-if="loginType === 'password' && !showQRCode" class="login-form">
          <div class="form-group-1">
            <input type="text" id="username" v-model="username" placeholder="  请输入您的账号">
            <p v-if="error.username" class="error">{{ error.username }}</p>
          </div>
          <div class="form-group-2">
            <input type="password" id="password" v-model="password" placeholder="  请输入您的密码">
            <p v-if="error.password" class="error">{{ error.password }}</p>
          </div>
          <div class="form-group agreement">
            <input type="checkbox" id="agree" v-model="agree">
            <label for="agree">
              <span style="color: #1A1A1A;">我已阅读并同意</span>
              <span style="color: #0256FF;">《用户注册协议》</span>
            </label>
          </div>
          <button class="login-button" @click="handlePasswordLogin">登录</button>
        </div>

        <!-- 手机号登录表单 -->
        <div v-if="loginType === 'phone' && !showQRCode" class="login-form">
          <div class="form-group-3">
            <input type="text" id="phone" v-model="phone" placeholder="  请输入您的电话">
            <p v-if="error.phone" class="error">{{ error.phone }}</p>
          </div>
          <div class="form-group-4 code-group">
            <div class="code-input">
              <input type="text" id="code" v-model="code" placeholder="  请输入验证码">
            <button class="get-code" @click="getVerificationCode" :disabled="isCounting" :class="{ 'counting-style': isCounting }">
                {{ isCounting ? `${countdown}秒后重新发送` : '获取验证码' }}
            </button>
            </div>
            <p v-if="error.code" class="error">{{ error.code }}</p>
          </div>
          <div class="form-group agreement">
            <input type="checkbox" id="agree" v-model="agree">
            <label for="agree">
              <span style="color: #1A1A1A;">我已阅读并同意</span>
              <span style="color: #0256FF;">《用户注册协议》</span>
            </label>
          </div>
          <button class="login-button" @click="handlePhoneLogin">登录</button>
        </div>

        <!-- 二维码登录 -->
        <div v-if="showQRCode" class="qr-code-login">
            <p>请用微信扫码，扫描下方二维码</p>
            <div class="qr-code-container">
                <!-- 二维码图片 -->
                <div class="qr-code">
                    <img src="../../assets/qr-code.png" alt="二维码">
                </div>

                <!-- 超时遮罩层 -->
                <div v-if="qrCodeExpired" class="qr-mask" @click="refreshQRCode">
                          <!-- 静态刷新图标 -->
                        <div class="refresh-icon">
                            <svg viewBox="0 0 24 24" width="40" height="40">
                            <path fill="#fff" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                            </svg>
                        </div>
                    <!-- 提示文字 -->
                    <div class="expired-text">
                        <p>二维码超时已过期</p>
                        <p>请点击刷新</p>
                    </div>
                </div>
            </div>

            <!-- 协议勾选部分 -->
            <div class="form-group agreement-2">
                <input type="checkbox" id="agree" v-model="agree">
                <label >
                  <span style="color: #1A1A1A;">我已阅读并同意</span>
                  <span style="color: #0256FF;">《用户注册协议》</span>
                </label>
            </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginType: 'password', // 当前登录类型：password | phone
      showQRCode: false, // 是否显示二维码登录界面
      username: '',
      password: '',
      phone: '',
      code: '',
      agree: false,
      error: {
        username: '',
        password: '',
        phone: '',
        code: ''
      },
      countdown: 0, // 验证码倒计时
      isCounting: false, // 是否正在倒计时
      qrCodeExpired: false, // 二维码是否过期
      refreshTimer: null,
    };
  },
  methods: {
        // 切换二维码界面
    toggleQRCode() {
      this.showQRCode = !this.showQRCode;
      if (this.showQRCode) {
        this.startQRCodeTimer();
      } else {
        this.clearQRCodeTimer();
      }
    },
    // 启动二维码过期倒计时
    startQRCodeTimer() {
      this.clearQRCodeTimer(); // 先清除旧计时器
      this.refreshTimer = setTimeout(() => {
        this.qrCodeExpired = true;
      }, 5000); // 5秒后过期
    },
    // 清除计时器
    clearQRCodeTimer() {
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
        this.refreshTimer = null;
      }
    },
    // 刷新二维码
    refreshQRCode() {
      this.qrCodeExpired = false;
      this.startQRCodeTimer(); // 重新开始倒计时
      // 这里可以添加重新生成二维码的逻辑
    },
    // 获取验证码
    getVerificationCode() {
      if (!this.phone) {
        this.error.phone = '请输入手机号';
        return;
      }
      // 模拟发送验证码
      alert('验证码已发送');
      this.startCountdown();
    },
    // 开始倒计时
    startCountdown() {
      this.countdown = 60; // 设置倒计时时间（60秒）
      this.isCounting = true; // 开始倒计时
      const timer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(timer); // 停止倒计时
          this.isCounting = false; // 倒计时结束
        }
      }, 1000);
    },
    // 密码登录
    handlePasswordLogin() {
      this.error.username = '';
      this.error.password = '';
      if (!this.username) {
        this.error.username = '请输入账号';
        return;
      }
      if (!this.password) {
        this.error.password = '请输入密码';
        return;
      }
      if (!this.agree) {
        alert('请同意用户注册协议');
        return;
      }
      // 模拟登录成功
      if (this.username === 'admin' && this.password === '123456') {
        alert('登录成功');
        this.$router.push('/welcome'); // 跳转到初步流程页面
      } else {
        this.error.username = '您输入的账号不存在，请重新输入';
        this.error.password = '您输入的密码错误，请重新输入';
      }
    },
    // 手机号登录
    handlePhoneLogin() {
      this.error.phone = '';
      this.error.code = '';
      if (!this.phone) {
        this.error.phone = '请输入电话';
        return;
      }
      if (!this.code) {
        this.error.code = '请输入验证码';
        return;
      }
      // 模拟登录成功
      if (this.phone === '1234567890' && this.code === '1234') {
        alert('登录成功');
        this.$router.push('/welcome'); // 跳转到初步流程页面
      } else {
        this.error.phone = '您输入的电话不存在，请重新输入';
        this.error.code = '您输入的验证码错误，请重新输入';
      }
    },
    // 在登录成功后跳转
    handleLogin() {
    //...验证逻辑
    this.$router.push('/setup') // 跳转到安装流程
}
  },
};
</script>

<style scoped>
.container {
    /* 垂直水平居中必备 */
    display: flex;          /* 触发弹性布局 */
    justify-content: center; /* 主轴对齐 */
    align-items: center;    /* 交叉轴对齐 */
    min-height: 100vh;      /* 保证容器撑满屏幕 */
    position: relative;
    width: 1920px;
    height: 1080px;
    opacity: 1;
        
    background: #0F0B30;

}
/* 顶部导航 */
.header {
 position: absolute;
left: 0px;
top: 0px;
width: 1920px;
height: 146.12px;
opacity: 1;
    
background: radial-gradient(261% 161% at 49% -62%, rgba(0, 240, 255, 0) 0%, rgba(15, 11, 48, 0.04) 100%);
      
}
.nav-tags {
  position: absolute;
  left: 993px;
  top: 38px;
  width: 729px;
  height: 35.53px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
  /* position: absolute;
left: 993px;
top: 38px;
width: 729px;
height: 35.53px;
opacity: 1;
    
background: #FFFFFF; */
.nav-tags a {
  /* color: #FFFFFF;
  font-family: Poppins;
  font-size: 20px;
  font-weight: 500;
  text-decoration: none; */
  left: 648px;
top: 0px;
width: 81px;
height: 34.53px;
opacity: 1;
    
font-family: Poppins;
font-size: 20px;
font-weight: 500;
line-height: 28px;
letter-spacing: 0px;
    
color: #FFFFFF;
  
}
/* position: absolute;
left: 648px;
top: 0px;
width: 81px;
height: 34.53px;
opacity: 1;
    
font-family: Poppins;
font-size: 20px;
font-weight: 500;
line-height: 28px;
letter-spacing: 0px;
    
color: #FFFFFF; */
    
.upper-text {
  position: absolute;
  left: 169px;
  top: 391px;
  display: flex; /* 使用 Flex 布局 */
  align-items: baseline; /* 垂直居中 */
  gap: 20px; /* 调整斜杠和文字间距 */
}
.gradient-text-1 {
  font-family: Poppins;
  font-weight: 400;
  font-size: 120px; /* 调大字体 */
  line-height: 1; /* 确保行高不干扰对齐 */
  color: #28F1FA; /* 或使用渐变 */
  margin: 0;
  /* transform: translateY(5px); 微调位置 */
}
.gradient-text-2 {
  font-family: YouSheBiaoTiHei;
  font-weight: 400;
  font-size: 110px;
  line-height: 1; /* 统一行高 */
  background: linear-gradient(135deg, #1B0852 -10%, #00F0FF 115%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}
.bottom-text{
position: absolute;
left: 170px;
top: 559px;
width: 846px;
height: 167px;
opacity: 1;
}
.solid-text {   
font-family: YouSheBiaoTiHei;
font-size: 64px;
font-weight: normal;
line-height: 1.1;
letter-spacing: 0em;
    
font-variation-settings: "opsz" auto;
color: #FFFFFF;
margin: 0 0 20px 0; /* 调整段落间距 */
    
}
.main {
    position: absolute;
left: 1159px;
top: 243px;
width: 549px;
height: 673px;
border-radius: 20px;
opacity: 1;
    
background: rgba(255, 255, 255, 0.9);
    
box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
    
}
/* .qr-corner {
position: absolute;
left: 395px;
top: 0px;
width: 154px;
height: 162px;
border-radius: 15px;
opacity: 1;
    
background: #1B7EF2;
    
}
.qr-corner img {
width: 154px;
height: 162px;
} */
.card {
  position: relative;
  width: 549px; /* 卡片宽度 */
  height: 673px; /* 卡片高度 */
  background: rgba(255, 255, 255, 0.9); /* 卡片背景 */
  border-radius: 20px; /* 卡片圆角 */
  overflow: hidden; /* 隐藏超出部分 */
}
.qr-corner {
  position: absolute;
  left: 395px;
  width: 154px;
  height: 162px;
  clip-path: polygon(100% 0, 100% 50%, 50% 0); /* 裁剪图形，只显示右上角 */
}
.qr-corner img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保图片填充容器 */
}
 
.logo h1 {
  position: absolute;
  left: 16px;
  top: 20px;
  width: 206px;
  height: 63px;
  opacity: 1;
  
  background: url('../../assets/AutoVsionLOGO.png') no-repeat;
  background-color: transparent;
  background-position: top left; /* 根据需要调整这个值来显示图片的一个角 */
  background-size: cover; /* 调整背景图片大小以覆盖整个元素 */
  overflow: hidden; /* 隐藏超出元素边界的背景图片部分 */
}

.login-options {
  display: flex;
  gap: 58px;
}
.login-options button {
 
position: relative;
left: 74px;
top: 145px;  
  top: 165px;
  font-family: Poppins;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0px;
  color: #000000;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 20px; /* 默认字体大小 */
}
.login-options button.active {
  font-size: 24px; /* 放大字体 */
  /* 可以添加其他样式，如颜色变化等 */
  position: relative; /* 如果需要添加下划线效果，需要设置相对定位 */
}
.login-options button.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px; /* 根据需要调整位置 */
  width: 100%;
  height: 0px;
  border: 1px solid #1B7EF2;
}

/* .login-form {
    width: 100%;
} */
.form-group-1 input {
position: absolute;
left: 58px;
top: 234px;
width: 433px;
height: 75px;
border-radius: 8px;
opacity: 1;
    
background: #FFFFFF;
font-family: Source Han Sans;
font-size: 18px;
font-weight: bold;
line-height: 90px;
letter-spacing: 0px;
font-variation-settings: "opsz" auto;
font-feature-settings: "kern" on;
color: #979797;
    
}
.form-group-2 input{
position: absolute;
left: 58px;
top: 351px;
width: 433px;
height: 75px;
border-radius: 8px;
opacity: 1;
    
background: #FFFFFF;
font-family: Source Han Sans;
font-size: 18px;
font-weight: bold;
line-height: 90px;
letter-spacing: 0px;
font-variation-settings: "opsz" auto;
font-feature-settings: "kern" on;
color: #979797;
    
}
/* .form-group label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
    color: #333;
} */
/* .form-group input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 5px;
} */
.form-group-3 input{
    position: absolute;
left: 58px;
top: 234px;
width: 433px;
height: 80px;
border-radius: 8px;
opacity: 1;
    
background: #FFFFFF;
font-family: Source Han Sans;
font-size: 18px;
font-weight: bold;
line-height: 90px;
letter-spacing: 0px;
font-variation-settings: "opsz" auto;
font-feature-settings: "kern" on;
color: #979797; 
}
.form-group-4 input{
    position: absolute;
left: 58px;
top: 351px;
width: 274px;
height: 80px;
border-radius: 8px;
opacity: 1;
    
background: #FFFFFF;
font-family: Source Han Sans;
font-size: 18px;
font-weight: bold;
line-height: 90px;
letter-spacing: 0px;
font-variation-settings: "opsz" auto;
font-feature-settings: "kern" on;
color: #979797;
}
/* 默认样式 */
.get-code {
  position: absolute;
  left: 353px;
  top: 356px;
  width: 133px;
  height: 70px;
  border-radius: 8px;
  opacity: 1;
  background: #1B7EF2;
  box-sizing: border-box;
  border: 1px solid #D8D8D8;
  font-family: Source Han Sans;
  font-size: 18px;
  font-weight: bold;
  line-height: 9px;
  letter-spacing: 0px;
  font-variation-settings: "opsz" auto;
  font-feature-settings: "kern" on;
  color: #FFFFFF;
  cursor: pointer; /* 鼠标指针为手型 */
}

/* 倒计时样式 */
.get-code.counting-style {
   font-size: 16px; 
  background: #979797; /* 倒计时时的背景色 */
  cursor: not-allowed; /* 禁用时的鼠标样式 */
}
.form-group-1 .error {
position: absolute;
left: 68px;
top: 310px;
width: 349px;
height: 26px;
opacity: 1;
    
font-family: Source Han Sans;
font-size: 12px;
font-weight: normal;
line-height: normal;
letter-spacing: 0em;
    
font-variation-settings: "opsz" auto;
font-feature-settings: "kern" on;
color: #FF0000;
    
}
.form-group-2 .error{
position: absolute;
left: 68px;
top: 430px;
width: 349px;
height: 26px;
opacity: 1;
    
font-family: Source Han Sans;
font-size: 12px;
font-weight: normal;
line-height: normal;
letter-spacing: 0em;
    
font-variation-settings: "opsz" auto;
font-feature-settings: "kern" on;
color: #FF0000;
    
}
.form-group-3 .error{
    position: absolute;
left: 68px;
top: 310px;
width: 349px;
height: 26px;
opacity: 1;
    
font-family: Source Han Sans;
font-size: 12px;
font-weight: normal;
line-height: normal;
letter-spacing: 0em;
    
font-variation-settings: "opsz" auto;
font-feature-settings: "kern" on;
color: #FF0000;
    
}
.form-group-4 .error{
    position: absolute;
left: 68px;
top: 430px;
width: 349px;
height: 26px;
opacity: 1;
    
font-family: Source Han Sans;
font-size: 12px;
font-weight: normal;
line-height: normal;
letter-spacing: 0em;
    
font-variation-settings: "opsz" auto;
font-feature-settings: "kern" on;
color: #FF0000;
    
}
.login-button {
position: absolute;
left: 119px;
top: 535px;
width: 310px;
height: 79.62px;
border-radius: 50px;
opacity: 1;
    
/* botao */
box-shadow: 4px 4px 4px 0px rgba(0, 0, 0, 0.25);
background: linear-gradient(104deg, #1B0852 -13%, #00F0FF 113%);
font-family: Poppins;
font-size: 27px;
font-weight: bold;
line-height: 43.2px;
text-align: center;
letter-spacing: 0px;
color: #FFFFFF;
}
.qr-code-login p {
position: absolute;
left: 128px;
top: 124px;
width: 294px;
height: 24px;
opacity: 1;
    
font-family: Poppins;
font-size: 20px;
font-weight: 500;
line-height: 28px;
letter-spacing: 0px;
    
color: #000000;
    
}
/* .qr-code  {
position: absolute;
left: 110px;
top: 189px;
width: 329px;
height: 333px;
opacity: 1;
    
background: url(image.png);
    
} */

/* 二维码容器 */
.qr-code-container {
  position: relative;
  width: 329px;
  height: 333px;
}

/* 二维码图片 */
.qr-code {
  position: absolute;
  left: 110px;
  top: 189px;
  width: 329px;
  height: 333px;
}

/* 超时遮罩层 */
.qr-mask {
  position: absolute;
  top: 189px;
  left: 110px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6); /* 半透明黑色遮罩 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 10px;
}

/* 旋转刷新图标 */
.refresh-icon svg {
  animation: rotate 1.5s linear infinite; /* 旋转动画 */
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 过期提示文字 */
.expired-text {
  /* text-align: center;
  color: white;
  margin-top: 15px;
  font-family: '思源黑体'; */


left: 38px;
top: 176px;
width: 255px;
height: 71px;
opacity: 1;
	
font-family: Source Han Sans;
font-size: 24px;
font-weight: bold;
line-height: normal;
text-align: center;
letter-spacing: 0em;
	
font-variation-settings: "opsz" auto;
font-feature-settings: "kern" on;
color: #FFFFFF;
	
}

.expired-text p:first-child {

	left: 22px;
top: 150px;
font-family: Source Han Sans;
font-size: 24px;
font-weight: bold;
line-height: normal;
text-align: center;
letter-spacing: 0em;
	
font-variation-settings: "opsz" auto;
font-feature-settings: "kern" on;
color: #FFFFFF;
	
}
.expired-text p:last-child {

    left: 22px;
    top: 180px;
font-family: Source Han Sans;
font-size: 24px;
font-weight: bold;
line-height: normal;
text-align: center;
letter-spacing: 0em;

font-variation-settings: "opsz" auto;
font-feature-settings: "kern" on;
color: #FFFFFF;
}
.register-link {
    margin-top: 20px;
    text-align: center;
    font-size: 14px;
}
.register-link a {
    color: #007bff;
    text-decoration: none;
}
.register-link a:hover {
    text-decoration: underline;
}
.agreement {
position: absolute;
left: 70px;
top: 463px;
width: 276px;
height: 24px;
opacity: 1;
    
/* 自动布局 */
display: flex;
flex-direction: row;
align-items: center;
padding: 0px;
gap: 8px;
    
    
}
.agreement-2{
    position: absolute;
left: 137px;
top: 563px;
width: 276px;
height: 24px;
opacity: 1;
    
/* 自动布局 */
display: flex;
flex-direction: row;
align-items: center;
padding: 0px;
gap: 8px;
    
}
.agreement label{
    /* 自动布局子元素 */
position: static;
left: 32px;
top: 0.5px;
width: 244px;
height: 23px;
opacity: 1;
    
/* 中文 /正文/正文文本 */
/* 样式描述：中文 */
font-family: 思源黑体;
font-size: 16px;
font-weight: normal;
line-height: normal;
letter-spacing: 0px;
    
z-index: 1;
/* 我已阅读并同意  */ 
color: #1A1A1A ;
/* 《用户注册协议》 */ 
color: #0256FF 
}
.code-group .code-input {
    display: flex;
    align-items: center;
}
.code-group .code-input input {
    flex: 1;
    margin-right: 10px;
}
</style>
