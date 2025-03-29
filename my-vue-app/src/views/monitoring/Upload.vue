<template>
  <div class="upload-container">
    <!-- 上半部分 -->
    <div class="top-section">
      <!-- 上传区域 -->
      <div class="upload-area" @click="triggerFileUpload">
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          @change="handleFileUpload"
          style="display: none"
        />
        <div v-if="!imageUrl" class="upload-prompt">
          <i class="el-icon-upload">
            <img src="..\..\assets\upload1.png" alt="上传图标" class="upload-icon" />
          </i>
        </div>
        <div v-else class="preview-container">
          <img :src="imageUrl" ref="previewImage" class="preview-image" />
        </div>
      </div>

      <!-- 检测区域 -->
      <div class="curtain-container">
        <div class="detection-preview">
          <div v-if="imageUrl" class="detection-header">
            正在检测: 车门钢板 #{{ currentDetectionId }}
          </div>
          <div v-if="imageUrl" class="preview-container">
            <div class="image-wrapper">
              <img
                :src="imageUrl"
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
          <div v-else class="placeholder">请先上传图片以查看检测结果</div>
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
            <!-- <el-button
              v-if="detections.length > 1"
              type="success"
              size="small"
              class="pass-button"
              @click="handlePass"
            >
              通过
            </el-button>
            <el-button
              v-else-if="detections.length === 1"
              type="success"
              size="small"
              class="pass-button"
              @click="handleLastPass"
            >
              通过
            </el-button>
            <el-button
              v-else
              type="danger"
              size="small"
              class="defect-button"
              @click="handleDefect"
            >
              缺陷
            </el-button> -->
            <!-- 修改按钮逻辑 -->
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
            <el-button
              v-else
              type="danger"
              size="small"
              class="defect-button"
              @click="handleDefect"
            >
              缺陷
            </el-button>
          </div>
          <div v-else class="placeholder">
            {{ detections.length > 0 ? '点击红框查看检测结果' : '未检测到缺陷' }}
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
      imageUrl: null,
      detections: [],
      detectionTime: null,
      selectedDetection: null,
      historyItems: [],
      currentDetectionId: 'A12348',
      displayMetrics: {
        naturalWidth: 0,
        naturalHeight: 0,
        displayWidth: 0,
        displayHeight: 0
      },
      showPrompt: false,
      promptMessage: '',
      pendingAction: null
    }
  },
  methods: {
    handlePass() {
      if (!this.selectedDetection) {
        this.$message.warning('请先点击要处理的缺陷区域')
        return
      }

      this.showPrompt = true
      this.promptMessage = this.detections.length > 1 
        ? `系统检测出此处有${this.selectedDetection.class_name}缺陷，确认通过该检测项？`
        : `系统检测出此处有${this.selectedDetection.class_name}缺陷，这是最后一个缺陷，确认通过吗？`
      this.pendingAction = 'pass'
    },

    // // 更新检测编号
    // updateDetectionId() {
    //   const prefix = this.currentDetectionId.match(/[A-Za-z]+/)[0]
    //   const number = parseInt(this.currentDetectionId.match(/\d+/)[0])
    //   this.currentDetectionId = `${prefix}${number + 1}`
    // },
     // 修改更新ID方法
    updateDetectionId() {
      const match = this.currentDetectionId.match(/([A-Za-z]+)(\d+)/)
      if (match) {
        const prefix = match[1]
        const number = parseInt(match[2]) + 1
        this.currentDetectionId = `${prefix}${number.toString().padStart(3, '0')}`
      }
    },
    // 点击"通过"按钮（普通）
    handlePass() {
      if (!this.selectedDetection) return

      const index = this.detections.findIndex(
        detection => detection === this.selectedDetection
      )
      if (index !== -1) {
        this.detections.splice(index, 1)
      }
      this.selectedDetection = null
      this.saveToHistory()
    },

        // 点击"通过"按钮（最后一个）
    // handleLastPass() {
    //   if (!this.selectedDetection) {
    //     this.$message.warning('请先点击要处理的缺陷区域')
    //     return
    //   }
      
    //   this.showPrompt = true
    //   this.promptMessage = `系统检测出此处有${this.selectedDetection.class_name}缺陷，您确定这个零件没有缺陷吗？`
    //   this.pendingAction = 'lastPass'
    // },

    // 点击"缺陷"按钮
    handleDefect() {
      this.showPrompt = true
      this.promptMessage = `确认标记为${this.selectedDetection.class_name}缺陷？`
      this.pendingAction = 'markDefect'
    },

    // 确认操作
    // 确认操作
    // confirmOperation() {
    //   if (this.pendingAction === 'lastPass') {
    //     const index = this.detections.findIndex(
    //       detection => detection === this.selectedDetection
    //     )
    //     if (index !== -1) {
    //       this.detections.splice(index, 1)
    //       this.selectedDetection = null  // 关键修复1
    //       this.$nextTick(() => {
    //         this.$forceUpdate()  // 关键修复2
    //       })
    //     }
    //     this.saveToHistory()
    //     this.$message.success('所有缺陷已通过，检测完成！')
    //     this.updateDetectionId()
    //   }
    //   this.closePrompt()
    // },

        // 修改后的确认操作
    confirmOperation() {
      if (this.pendingAction === 'pass') {
        const index = this.detections.findIndex(
          detection => detection === this.selectedDetection
        )
        
        if (index !== -1) {
          this.detections.splice(index, 1)
          
          // 自动选择下一个缺陷（如果存在）
          if (this.detections.length > 0) {
            const newIndex = Math.min(index, this.detections.length - 1)
            this.selectedDetection = this.detections[newIndex]
          } else {
            this.selectedDetection = null
            this.updateDetectionId()
            this.$message.success('所有缺陷已处理完成')
          }
          
          // 强制更新视图
          this.$nextTick(() => {
            this.$forceUpdate()
            this.saveToHistory()
          })
        }
      }
      this.closePrompt()
    },

    // 手动标记缺陷
    markDefect(event) {
      if (!this.imageUrl) return

      const img = this.$refs.detectionImage
      const rect = img.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width
      const y = (event.clientY - rect.top) / rect.height

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
      }

      this.detections.push(newDetection)
      this.selectedDetection = newDetection
      this.saveToHistory()
    },

    // 状态显示逻辑
    getStatusText(detections) {
      if (detections.length === 0) return '通过'
      if (detections.length === 1) return detections[0].class_name
      const types = new Set(detections.map(d => d.class_name))
      return types.size > 1 ? '复合' : `${detections[0].class_name}×${detections.length}`
    },

    // 关闭提示框
    closePrompt() {
      this.showPrompt = false
      this.pendingAction = null
    },

    // 触发文件上传
    triggerFileUpload() {
      this.$refs.fileInput.click()
    },

    // 处理文件上传
    async handleFileUpload(e) {
      const file = e.target.files[0]
      if (!file) return

      this.imageUrl = URL.createObjectURL(file)
      this.detectionTime = this.getCurrentTime()

      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await axios.post(
          'https://autovision.zust.top/detect/image',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        )
        this.handleApiResponse(response)
      } catch (error) {
        console.error('上传或检测失败:', error)
        this.$message.error('检测失败，请重试！')
      }
    },

    // 处理API响应
    handleApiResponse(response) {
      if (response.data.status === 'success') {
        if (response.data.detections && Array.isArray(response.data.detections)) {
          const classCount = {}
          this.detections = response.data.detections.map(detection => {
            if (detection.class_name) {
              const chineseName = this.getChineseClassName(detection.class_name)
              classCount[chineseName] = (classCount[chineseName] || 0) + 1
              return {
                ...detection,
                class_name: chineseName,
                detection_id: `${chineseName}${classCount[chineseName]}`
              }
            }
            return detection
          })

          if (this.detections.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.detections.length)
            this.selectedDetection = this.detections[randomIndex]
          }
        } else {
          console.error('API返回数据格式错误:', response.data.detections)
          this.$message.error('检测结果格式错误！')
        }

        this.updateDetectionId()
        this.$nextTick(() => this.saveToHistory())
      } else {
        this.$message.error('检测失败，请检查服务状态！')
      }
    },

    // 类名翻译
    getChineseClassName(className) {
      const nameMap = {
        scratches: '划痕',
        inclusion: '凹陷',
        crack: '裂纹',
        rust: '锈蚀',
      }
      return nameMap[className] || className
    },

    // 图片加载处理
    handleImageLoad() {
      const img = this.$refs.detectionImage
      if (img) {
        this.displayMetrics = {
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          displayWidth: img.offsetWidth,
          displayHeight: img.offsetHeight
        }
      }
    },

    // 红框定位计算
    getBoxStyle(bbox) {
      if (!this.displayMetrics.naturalWidth) return {}
      const [x1, y1, x2, y2] = bbox
      const img = this.$refs.detectionImage
      const container = img.parentElement
      
      const scaleX = img.offsetWidth / img.naturalWidth
      const scaleY = img.offsetHeight / img.naturalHeight
      const offsetX = img.getBoundingClientRect().left - container.getBoundingClientRect().left
      const offsetY = img.getBoundingClientRect().top - container.getBoundingClientRect().top

      return {
        left: `${x1 * scaleX + offsetX}px`,
        top: `${y1 * scaleY + offsetY}px`,
        width: `${(x2 - x1) * scaleX}px`,
        height: `${(y2 - y1) * scaleY}px`,
        position: 'absolute',
        border: '2px solid #FF3B30',
        boxSizing: 'border-box'
      }
    },

    // 格式化坐标显示
    formatBbox(bbox) {
      const [x1, y1, x2, y2] = bbox
      return `X:${x1.toFixed(0)}-${x2.toFixed(0)} Y:${y1.toFixed(0)}-${y2.toFixed(0)}`
    },

    // 计算缺陷面积
    calculateArea(bbox) {
      const [x1, y1, x2, y2] = bbox
      const pixelArea = (x2 - x1) * (y2 - y1)
      return (pixelArea * 0.0007).toFixed(2)
    },

    // 获取当前时间
    getCurrentTime() {
      return new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(/\//g, '-')
    },

    // // 保存到历史记录
    // saveToHistory() {
    //   const existing = this.historyItems.find(item => item.id === this.currentDetectionId)
    //   if (existing) {
    //     existing.detections = [...this.detections]
    //     existing.timestamp = Date.now()
    //   } else {
    //     this.historyItems.unshift({
    //       id: this.currentDetectionId,
    //       thumb: this.imageUrl,
    //       fullImage: this.imageUrl,
    //       detections: [...this.detections],
    //       timestamp: Date.now()
    //     })
    //   }
    // },
        // 修改保存历史记录方法
    saveToHistory() {
      const existing = this.historyItems.find(item => item.id === this.currentDetectionId)
      const record = {
        id: this.currentDetectionId,
        thumb: this.imageUrl,
        fullImage: this.imageUrl,
        detections: JSON.parse(JSON.stringify(this.detections)), // 深拷贝
        timestamp: Date.now()
      }

      if (existing) {
        Object.assign(existing, record)
      } else {
        this.historyItems.unshift(record)
      }
    },
    // 选择检测结果
    selectDetection(detection) {
      this.selectedDetection = detection
    }
  }
}
</script>
<style scoped>
/* 保持您原有的样式，仅添加必要修改 */
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

.preview-image {
  width: 100%;
  height: 100%;
  /* object-fit: cover; */
  transition: all 0.3s; /* 添加过渡效果 */
}
.detection-image{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  transition: all 0.3s; /* 添加过渡效果 */
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: visible; /* 确保内容不会被裁剪 */
}


/* 新增按钮禁用样式 */
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



/* .detection-box {
  position: absolute;
  box-shadow: 0 0 10px rgba(255, 59, 48, 0.5);
  cursor: pointer;
} */

.detection-label {
  position: absolute;
  top: -24px;
  left: 0;
  color: red;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  writing-mode: horizontal-tb; /* 使字体横着摆放 */
}

.curtain-container {
  position: absolute;
  left: calc(952px - 24px);   /* 原检测区左:952px - 扩展24px */
  top: calc(40px - 24px);     /* 原检测区上:40px - 扩展24px */
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border-radius: 20px;
  box-shadow: 
    0 0 0 1px rgba(255,255,255,0.1), /* 内发光 */
    0 16px 48px -16px rgba(0,0,0,0.05); /* 外阴影 */
  display: flex;
  gap: 20px;
}

/* 保持原有组件样式 */
.detection-preview {
  width: 552px;
  height: 540px;
  position: static;
  background: black !important; /* 强制保持原有背景 */
  border-radius: 12px; /* 与设计图一致 */
  box-shadow: 0 4px 24px rgba(0,0,0,0.08); /* 恢复原有阴影 */
}

/* 结果区域 */
.result-area {
  width: 320px;
  height: 543px;
  position: static;
  background: #F9FAFB !important; /* 恢复原有背景色 */
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
}

/* 结果详情 */
.result-details{
  position: relative;
  left: 16px;
  top: 10px;
  width: 288px;
  height: 220px;
  opacity: 1;
  background: rgba(0, 0, 0, 0);
}

/* 每一

/* 每一行信息 */
.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px; /* 行间距 */
}

/* 标签样式 */
.label {
  font-size: 16px;
  color: #666; /* 标签文字颜色 */
  font-weight: 500;
}

/* 第一行标签样式 */
.label-1 {
  font-size: 18px;
  color: #333; /* 第一行文字颜色 */
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

/* 百分比样式 */
.percentage {

	
font-family: Roboto;
font-size: 16px;
font-weight: 500;
line-height: 24px;
letter-spacing: 0px;
	
font-feature-settings: "kern" on;
color: #22C55E;
	
}

/* 通过按钮样式 */
.pass-button {
  position: absolute;
  
  bottom: 16px;
  right: 16px;
  background: #00DE91; /* 按钮背景色 */
  color: #FFF; /* 按钮文字颜色 */
  border-radius: 4px; /* 按钮圆角 */

  left: 206px;
top: 484px;
width: 89px;
height: 41px;
border-radius: 8px;
opacity: 1;
}

/* 占位符样式 */
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 16px;
  color: #999;
}



/* 中间组件编号样式 */
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
  z-index: 10; /* 确保显示在图片上方 */

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
  min-width: 150px; /* 设置最小宽度 */
  padding: 12px;
  background: #F9FAFB;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 300px;
    height: 201px;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
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
  z-index: 10; /* 确保显示在图片上方 */
  color: #2563EB
}

.history-info {
  position: absolute;
  
  left: 50%; /* 水平居中 */
  transform: translate(-50%, 50%); /* 确保绝对定位居中 */
  width: 126px;
  height: 20px;
  font-family: 思源黑体, sans-serif;
  font-size: 14px;
  font-weight: normal;
  color: #3D3D3D;
  text-align: center; /* 文本水平居中 */
  line-height: 20px; /* 文本垂直居中 */
  }

.el-tag {
  font-size: 20px;
   text-shadow: none; /* 移除文本阴影 */
}
</style>
