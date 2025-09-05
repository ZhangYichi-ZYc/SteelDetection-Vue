<template>
  <div class="tutorial-container">
    <div class="tutorial-content">{{ tutorialContent }}</div>
  </div>
</template>

<script>
export default {
  name: 'Tutorial',
  data() {
    return {
      tutorialContent: `一、摄像头概述

摄像头是一种视频输入设备,又称为电脑相机、电脑眼等,广泛应用于视频会议、远程医疗及实时
监控等领域。随着互联网技术的发展和感光成像器件技术的成熟,摄像头的价格逐渐降低,成为普
通人可以承受的设备,人们可以通过摄像头在网络上进行音视频交流和沟通,同时还可以用于数码
影像、影音处理等方面。


二、摄像头的分类

根据数字信号处理方式的不同,摄像头可以分为数字摄像头和模拟摄像头两大类。

2.1模拟摄像头

模拟摄像头可以将视频采集设备产生的模拟视频信号转换成数字信号,并将其储存在计算机中。模
拟摄像头捕捉到的视频信号必须经过特定的视频捕捉卡将模拟信号转换成数字模式,并加以压缩后
才可以转换到计算机上运用。模拟摄像头的整体成本较高,目前


2.2 数字摄像头

数字摄像头直接输出数字图像信号，通过内置的图像传感器（如CMOS或CCD）和图像处理芯片对光
信号进行捕捉和数字化处理，无需额外的视频采集卡。其优点是安装简便、兼容性强、成本较低，
并可支持高清甚至超高清画质。数字摄像头广泛用于笔记本电脑、智能手机、视频会议、网络直播、
智能家居等领域，是目前主流消费级摄像设备。根据使用方式和外观结构，还可进一步分为内置摄
像头（如笔记本摄像头）与外置摄像头（如USB摄像头、网络摄像机等）。

三、摄像头的工作原理

摄像头的基本工作原理是：景物通过镜头（Lens）生成光学图像，投射到图像传感器（Sensor）上，
然后转为电信号。电信号经过模数转换（A/D）变为数字图像信号，再送到数字信号处理芯片（DSP）
中进行色彩校正、降噪、压缩等处理，最终通过接口（如USB、HDMI、网络等）输出到显示设备或
计算机中。`
    }
  }
}
</script>

<style scoped>
.tutorial-container {
  width: 100%;
  height: 100%;
  padding: 16px;
}

.tutorial-content {
  width: 100%;
  background: #ffffff;
  color: #303133;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 20px;
  line-height: 1.8;
  white-space: pre-line;
  font-size: 34px;
  max-height: 80vh;
  overflow-y: auto;
  text-align: justify;
  text-justify: inter-ideograph;
}
</style>