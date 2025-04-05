<template>
  <div class="upload-container">
    <!-- 上半部分 -->
    <div class="top-section">
      <!-- 上传区域 - 视频播放区 -->
      <div class="upload-area" @click="triggerFileUpload">
        <input
          type="file"
          ref="fileInput"
          accept="video/*"
          @change="handleVideoUpload"
          style="display: none"
        />
        <div v-if="!videoUrl" class="upload-prompt">
          <i class="el-icon-upload">
            <img src="..\..\assets\upload1.png" alt="上传图标" class="upload-icon" />
          </i>
          <div class="upload-text">点击上传视频</div>
        </div>
        <div v-else class="preview-container">
          <video
            ref="videoPlayer"
            class="preview-video"
            controls
            autoplay
            @loadeddata="handleVideoLoaded"
          >
            <source :src="videoUrl" type="video/mp4">
            您的浏览器不支持视频播放
          </video>
        </div>
      </div>

      <!-- 检测区域 -->
      <div class="curtain-container">
        <div class="detection-preview">
          <div v-if="currentScreenshot" class="detection-header">
            实时检测: 车门钢板 #{{ currentDetectionId }}
            <div class="timestamp">{{ screenshotTime }}</div>
          </div>
          <div v-if="currentScreenshot" class="preview-container">
            <div class="image-wrapper">
              <img
                :src="currentScreenshot"
                ref="detectionImage"
                class="detection-image"
                @load="handleImageLoad"
                @click="markDefect"
              />
              <div
                v-for="(detection, index) in detections"
                :key="index"
                class="detection-box"
                :style="getBoxStyle(detection.bbox)"
                @click.stop="selectDetection(detection)"
              >
                <span class="detection-label">{{ detection.detection_id }}</span>
              </div>
            </div>
          </div>
          <div v-else class="placeholder">等待视频截图</div>
        </div>

        <!-- 检测结果 -->
        <div class="result-area">
          <div v-if="selectedDetection" class="result-details">
            <div class="info-row">
              <span class="label-1">检测结果：</span>
              <span class="test-result">{{ selectedDetection.detection_id }}</span>
            </div>
            <div class="info-row">
              <span class="label">检测时间：</span>
              <span>{{ detectionTime }}</span>
            </div>
            <div class="info-row">
              <span class="label">缺陷类型：</span>
              <el-tag type="danger">{{ selectedDetection.class_name }}</el-tag>
            </div>
            <div class="info-row">
              <span class="label">缺陷位置：</span>
              <span>{{ formatBbox(selectedDetection.bbox) }}</span>
            </div>
            <div class="info-row">
              <span class="label">缺陷面积：</span>
              <span>{{ calculateArea(selectedDetection.bbox) }} cm²</span>
            </div>
            <el-button
              v-if="detections.length > 0"
              type="success"
              size="small"
              class="pass-button"
              @click="handlePass"
              :disabled="!selectedDetection"
            >
              通过
            </el-button>
          </div>
          <div v-else class="placeholder">
            {{ detections.length > 0 ? '点击红框查看检测结果' : '未检测到缺陷' }}
          </div>
          
          <!-- 额外控制按钮 -->
          <div class="control-buttons">
            <el-button 
              :type="isCapturing ? 'danger' : 'success'" 
              @click="toggleScreenshotInterval" 
              class="capture-button"
              size="large"
              :icon="isCapturing ? 'el-icon-video-pause' : 'el-icon-video-play'"
            >
              {{ isCapturing ? '暂停检测' : '开始检测' }}
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 下半部分 -->
    <div class="bottom-section">
      <div class="history-list">
        <div
          v-for="(item, index) in historyItems"
          :key="index"
          class="history-item"
        >
          <div class="image-wrapper">
            <img :src="item.thumb" class="history-image" />
            <div class="history-header">
              #{{ item.id }}
              <el-tag :type="item.detections.length > 0 ? 'danger' : 'success'">
                {{ getStatusText(item.detections) }}
              </el-tag>
            </div>
            <div class="history-info">
              <span>{{ new Date(item.timestamp).toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 确认对话框 -->
    <el-dialog
      v-model:visible="showPrompt"
      width="400px"
      :before-close="closePrompt"
    >
      <span>{{ promptMessage }}</span>
      <template v-slot:footer>
        <el-button @click="closePrompt">取消</el-button>
        <el-button type="primary" @click="confirmOperation">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      videoUrl: null,
      currentScreenshot: null,
      detections: [],
      detectionTime: null,
      screenshotTime: null,
      selectedDetection: null,
      historyItems: [],
      currentDetectionId: 'V001',
      displayMetrics: {
        naturalWidth: 0,
        naturalHeight: 0,
        displayWidth: 0,
        displayHeight: 0
      },
      showPrompt: false,
      promptMessage: '',
      pendingAction: null,
      captureTimer: null,
      isCapturing: false,
      screenshotInterval: 1000, // 默认1秒
      screenshotCount: 0
    }
  },
  mounted() {
    // 组件挂载时，初始化相关操作
  },
  beforeUnmount() {
    // 组件销毁前，清理定时器
    this.stopScreenshotCapture();
  },
  methods: {
    // 切换截图状态
    toggleScreenshotInterval() {
      if (this.isCapturing) {
        this.stopScreenshotCapture();
      } else {
        this.startScreenshotCapture();
      }
    },
    
    // 开始截图
    startScreenshotCapture() {
      if (!this.videoUrl) {
        this.$message.warning('请先上传视频');
        return;
      }
      
      if (this.captureTimer) {
        clearInterval(this.captureTimer);
      }
      
      this.isCapturing = true;
      this.captureTimer = setInterval(() => {
        this.captureScreenshot();
      }, this.screenshotInterval);
      
      this.$message.success('已开始自动检测');
    },
    
    // 停止截图
    stopScreenshotCapture() {
      if (this.captureTimer) {
        clearInterval(this.captureTimer);
        this.captureTimer = null;
      }
      this.isCapturing = false;
      this.$message.info('已暂停检测');
    },
    
    // 截取视频帧
    captureScreenshot() {
      const video = this.$refs.videoPlayer;
      if (!video || video.paused || video.ended) {
        return;
      }
      
      this.screenshotCount++;
      
      // 创建canvas进行截图
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // 绘制当前视频帧
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 将截图转为Blob以便上传
      canvas.toBlob(blob => {
        this.sendScreenshotForAnalysis(blob);
      }, 'image/jpeg', 0.95);
      
      // 更新截图时间
      this.screenshotTime = this.getCurrentTime();
    },
    
    // 发送截图进行分析
    async sendScreenshotForAnalysis(blob) {
      // 更新预览图
      this.currentScreenshot = URL.createObjectURL(blob);
      this.detectionTime = this.getCurrentTime();
      
      // 准备发送到API
      const formData = new FormData();
      formData.append('file', blob, `screenshot_${this.screenshotCount}.jpg`);
      
      try {
        const response = await axios.post(
          'https://autovision.zust.top/detect/image',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        
        // 为该截图创建独立的检测ID
        this.updateDetectionId();
        
        // 使用既有的API响应处理逻辑
        this.handleApiResponse(response);
      } catch (error) {
        console.error('截图分析失败:', error);
        this.$message.error('检测失败，请重试！');
      }
    },
    
    // 视频加载完成处理
    handleVideoLoaded() {
      console.log('视频加载完成');
      const video = this.$refs.videoPlayer;
      if (video) {
        this.$message.success('视频已加载，可以开始截图检测');
      }
    },
    
    // 触发文件上传
    triggerFileUpload() {
      if (this.isCapturing) {
        this.$message.warning('请先停止当前检测');
        return;
      }
      this.$refs.fileInput.click();
    },
    
    // 处理视频上传
    async handleVideoUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      // 检查文件类型
      if (!file.type.startsWith('video/')) {
        this.$message.error('请上传视频文件');
        return;
      }
      
      // 清空先前的数据
      this.stopScreenshotCapture();
      this.videoUrl = null;
      this.currentScreenshot = null;
      this.detections = [];
      this.selectedDetection = null;
      
      // 设置新视频URL
      this.$nextTick(() => {
        this.videoUrl = URL.createObjectURL(file);
        this.$message.success('视频已上传，请点击"开始检测"按钮进行检测');
      });
    },
    
    // 处理API响应 - 从Upload.vue复用，但有调整
    handleApiResponse(response) {
      if (response.data.status === 'success') {
        // 首先清空之前的检测结果
        this.detections = [];
        this.selectedDetection = null;
        
        if (response.data.detections && Array.isArray(response.data.detections) && response.data.detections.length > 0) {
          const classCount = {};
          this.detections = response.data.detections.map(detection => {
            if (detection.class_name) {
              const chineseName = this.getChineseClassName(detection.class_name);
              classCount[chineseName] = (classCount[chineseName] || 0) + 1;
              return {
                ...detection,
                class_name: chineseName,
                detection_id: `${chineseName}${classCount[chineseName]}`
              };
            }
            return detection;
          });

          if (this.detections.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.detections.length);
            this.selectedDetection = this.detections[randomIndex];
          }
        } else {
          console.log('无缺陷检测结果');
          // 确保selectedDetection为null，表示无缺陷
          this.selectedDetection = null;
        }

        this.$nextTick(() => this.saveToHistory());
      } else {
        this.$message.error('检测失败，请检查服务状态！');
      }
    },

    // --- 以下方法基本从Upload.vue复用 ---
    
    handlePass() {
      if (!this.selectedDetection) {
        this.$message.warning('请先点击要处理的缺陷区域');
        return;
      }

      this.showPrompt = true;
      this.promptMessage = this.detections.length > 1 
        ? `系统检测出此处有${this.selectedDetection.class_name}缺陷，确认通过该检测项？`
        : `系统检测出此处有${this.selectedDetection.class_name}缺陷，这是最后一个缺陷，确认通过吗？`;
      this.pendingAction = 'pass';
    },

    updateDetectionId() {
      const match = this.currentDetectionId.match(/([A-Za-z]+)(\d+)/);
      if (match) {
        const prefix = match[1];
        const number = parseInt(match[2]) + 1;
        this.currentDetectionId = `${prefix}${number.toString().padStart(3, '0')}`;
      }
    },

    confirmOperation() {
      if (this.pendingAction === 'pass') {
        const index = this.detections.findIndex(
          detection => detection === this.selectedDetection
        );
        
        if (index !== -1) {
          this.detections.splice(index, 1);
          
          if (this.detections.length > 0) {
            const newIndex = Math.min(index, this.detections.length - 1);
            this.selectedDetection = this.detections[newIndex];
          } else {
            this.selectedDetection = null;
            this.updateDetectionId();
            this.$message.success('所有缺陷已处理完成');
          }
          
          this.$nextTick(() => {
            this.$forceUpdate();
            this.saveToHistory();
          });
        }
      }
      this.closePrompt();
    },

    markDefect(event) {
      if (!this.currentScreenshot) return;

      const img = this.$refs.detectionImage;
      const rect = img.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const newDetection = {
        bbox: [
          x * this.displayMetrics.naturalWidth - 50,
          y * this.displayMetrics.naturalHeight - 50,
          x * this.displayMetrics.naturalWidth + 50,
          y * this.displayMetrics.naturalHeight + 50,
        ],
        class_name: '自定义缺陷',
        confidence: 0.99,
        detection_id: `缺陷${this.detections.length + 1}`,
      };

      this.detections.push(newDetection);
      this.selectedDetection = newDetection;
      this.saveToHistory();
    },

    getStatusText(detections) {
      if (detections.length === 0) return '通过';
      if (detections.length === 1) return detections[0].class_name;
      const types = new Set(detections.map(d => d.class_name));
      return types.size > 1 ? '复合' : `${detections[0].class_name}×${detections.length}`;
    },

    closePrompt() {
      this.showPrompt = false;
      this.pendingAction = null;
    },

    getChineseClassName(className) {
      const nameMap = {
        scratches: '划痕',
        inclusion: '凹陷',
        crack: '裂纹',
        rust: '锈蚀',
      };
      return nameMap[className] || className;
    },

    handleImageLoad() {
      const img = this.$refs.detectionImage;
      if (img) {
        this.displayMetrics = {
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          displayWidth: img.offsetWidth,
          displayHeight: img.offsetHeight
        };
      }
    },

    getBoxStyle(bbox) {
      if (!this.displayMetrics.naturalWidth) return {};
      const [x1, y1, x2, y2] = bbox;
      const img = this.$refs.detectionImage;
      const container = img.parentElement;
      
      const scaleX = img.offsetWidth / img.naturalWidth;
      const scaleY = img.offsetHeight / img.naturalHeight;
      const offsetX = img.getBoundingClientRect().left - container.getBoundingClientRect().left;
      const offsetY = img.getBoundingClientRect().top - container.getBoundingClientRect().top;

      return {
        left: `${x1 * scaleX + offsetX}px`,
        top: `${y1 * scaleY + offsetY}px`,
        width: `${(x2 - x1) * scaleX}px`,
        height: `${(y2 - y1) * scaleY}px`,
        position: 'absolute',
        border: '2px solid #FF3B30',
        boxSizing: 'border-box'
      };
    },

    formatBbox(bbox) {
      const [x1, y1, x2, y2] = bbox;
      return `X:${x1.toFixed(0)}-${x2.toFixed(0)} Y:${y1.toFixed(0)}-${y2.toFixed(0)}`;
    },

    calculateArea(bbox) {
      const [x1, y1, x2, y2] = bbox;
      const pixelArea = (x2 - x1) * (y2 - y1);
      return (pixelArea * 0.0007).toFixed(2);
    },

    getCurrentTime() {
      return new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '-');
    },

    saveToHistory() {
      const existing = this.historyItems.find(item => item.id === this.currentDetectionId);
      const record = {
        id: this.currentDetectionId,
        thumb: this.currentScreenshot,
        fullImage: this.currentScreenshot,
        detections: JSON.parse(JSON.stringify(this.detections)), // 深拷贝
        timestamp: Date.now()
      };

      if (existing) {
        Object.assign(existing, record);
      } else {
        this.historyItems.unshift(record);
      }
    },
    
    selectDetection(detection) {
      this.selectedDetection = detection;
    }
  }
}
</script>

<style scoped>
/* 保持大部分原来的样式，添加视频相关样式 */
.top-section {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 560px;
  margin-top: -30px;
}

.upload-area {
  position: absolute;
  left: 27px;
  top: 28px;
  width: 855px;
  height: 560px;
  border-radius: 12px;
  opacity: 1;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-container {
  width: 100%;
  height: 100%;
  position: relative;
}

/* 新增视频样式 */
.preview-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

.upload-text {
  margin-top: 12px;
  color: #fff;
  font-size: 16px;
}

.upload-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.upload-icon {
  width: 64px;
  height: 64px;
}

.timestamp {
  margin-top: 4px;
  font-size: 12px;
  color: #666;
}

/* 控制按钮区域 */
.control-buttons {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
}

/* 美化按钮样式 */
.capture-button {
  width: 160px;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 1px;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.capture-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.capture-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.detection-image{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  transition: all 0.3s;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.pass-button:disabled {
  background: #e0e0e0 !important;
  cursor: not-allowed;
  opacity: 0.7;
}

.detection-box {
  transition: border-color 0.2s ease, transform 0.2s ease;
  border: 2px solid #FF3B30;
}

.detection-box:hover {
  transform: scale(1.02);
  box-shadow: 0 0 15px rgba(255, 59, 48, 0.3);
}

.detection-box.active {
  border-width: 3px;
  z-index: 100;
  border-color: #FF0000;
}

.detection-label {
  position: absolute;
  top: -24px;
  left: 0;
  color: red;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  writing-mode: horizontal-tb;
}

.curtain-container {
  position: absolute;
  left: calc(952px - 24px);
  top: calc(40px - 24px);
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  box-shadow: 
    0 0 0 1px rgba(255,255,255,0.1),
    0 16px 48px -16px rgba(0,0,0,0.05);
  display: flex;
  gap: 20px;
}

.detection-preview {
  width: 552px;
  height: 540px;
  position: static;
  background: black !important;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
}

.result-area {
  width: 320px;
  height: 543px;
  position: static;
  background: #F9FAFB !important;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
}

.result-details{
  position: relative;
  left: 16px;
  top: 10px;
  width: 288px;
  height: 220px;
  opacity: 1;
  background: rgba(0, 0, 0, 0);
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.label {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.label-1 {
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.test-result{
  width: 48px;
  height: 28px;
  font-family: Source Han Sans;
  font-size: 14px;
  font-weight: bold;
  line-height: 30px;
  text-align: center;
  letter-spacing: 0px;
  font-feature-settings: "kern" on;
  color: #FF0000;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 16px;
  color: #999;
}

.detection-header {
  position: absolute;
  top: 40px;
  left: 56px;
  font-size: 12px;
  font-weight: 600;
  color: #333;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  font-family: Roboto;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0px;
  font-feature-settings: "kern" on;
  color: #2563EB;
}

.bottom-section {
  position: absolute;
  left: 27px;
  top: 625px;
  width: 1825px;
  height: 297px;
  border-radius: 12px;
  background: #FFFFFF;
  padding: 16px;
}

.history-list {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  height: 241px;
  margin-top: 38px;
}

.history-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  min-width: 150px;
  padding: 12px;
  background: #F9FAFB;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
  height: 201px;
}

.history-image {
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.history-header {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 500;
  color: #333;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  color: #2563EB
}

.history-info {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 50%);
  width: 126px;
  height: 20px;
  font-family: 思源黑体, sans-serif;
  font-size: 14px;
  font-weight: normal;
  color: #3D3D3D;
  text-align: center;
  line-height: 20px;
}

.el-tag {
  font-size: 20px;
  text-shadow: none;
}

.pass-button {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: #00DE91;
  color: #FFF;
  border-radius: 4px;
  left: 206px;
  top: 484px;
  width: 89px;
  height: 41px;
  border-radius: 8px;
  opacity: 1;
}
</style>
