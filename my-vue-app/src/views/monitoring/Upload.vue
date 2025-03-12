<template>
  <div class="upload-container">
    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 左侧上传区域 -->
      <div class="upload-area" @click="triggerFileUpload">
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          @change="handleFileUpload"
          style="display: none"
        />
        <div v-if="!imageUrl" class="upload-prompt">
          <i class="el-icon-upload"></i>
          <div>点击上传检测图片</div>
        </div>
        <div v-else class="preview-container">
          <!-- 图片预览 -->
          <img :src="imageUrl" ref="previewImage" class="preview-image" />

          <!-- 绘制检测框 -->
          <div
            v-for="(detection, index) in detections"
            :key="index"
            class="detection-box"
            :style="adjustBoundingBoxes(detection.bbox)"
          >
            <span class="detection-label">
              {{ detection.class_name }} {{ (detection.confidence * 100).toFixed(1) }}%
            </span>
          </div>
        </div>
      </div>

      <!-- 右侧结果区域 -->
      <div class="result-area">
        <div class="result-header">
          <h3>检测结果（共{{ detections?.length || 0 }}处缺陷）</h3>
          <div class="detection-time">
            <el-icon><Clock /></el-icon>
            <span>{{ detectionTime }}</span>
          </div>
        </div>
        
        <div v-if="detections" class="detection-list">
          <div 
            v-for="(det, index) in detections" 
            :key="index" 
            class="detection-item"
          >
            <div class="defect-info">
              <div class="info-row">
                <span class="label">缺陷类型：</span>
                <el-tag type="danger">{{ det.class_name }}</el-tag>
              </div>
              <div class="info-row">
                <span class="label">位置坐标：</span>
                <span>{{ formatBbox(det.bbox) }}</span>
              </div>
              <div class="info-row">
                <span class="label">缺陷面积：</span>
                <span>{{ calculateArea(det.bbox) }} cm²</span>
              </div>
              <div class="info-row">
                <span class="label">置信度：</span>
                <el-progress 
                  :percentage="det.confidence * 100" 
                  :show-text="false"
                  status="exception"
                  class="confidence-bar"
                />
                <span class="percentage">{{ (det.confidence * 100).toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      imageUrl: null, // 图片预览地址
      detections: null, // 检测结果
      detectionTime: null, // 检测时间
      historyItems: [], // 历史记录
      scaleFactor: 1 // 图片缩放比例
    }
  },
  methods: {
    // 触发文件上传
    triggerFileUpload() {
      this.$refs.fileInput.click()
    },

    // 上传文件并处理
    async handleFileUpload(e) {
      const file = e.target.files[0]
      if (!file) return

      // 显示预览图
      this.imageUrl = URL.createObjectURL(file)
      this.detectionTime = this.getCurrentTime()

      // 上传到后端API
      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await axios.post('https://autovision.zust.top/detect/image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        // 处理API响应
        this.handleApiResponse(response)
      } catch (error) {
        console.error('上传或检测失败:', error)
        this.$message.error('检测失败，请重试！')
      }
    },

    // 处理API响应
    handleApiResponse(response) {
      if (response.data.status === 'success') {
        this.detections = response.data.detections
        this.$nextTick(() => {
          this.saveToHistory()
        })
      } else {
        this.$message.error('检测失败，请检查图片或服务状态！')
      }
    },

    // 调整 bbox 的样式
    adjustBoundingBoxes(bbox) {
      const img = this.$refs.previewImage
      if (!img) return {}

      // 计算缩放比例
      this.scaleFactor = img.clientWidth / img.naturalWidth

      // 转换 bbox 坐标为像素值
      const [x1, y1, x2, y2] = bbox.map(v => v * this.scaleFactor)
      const width = x2 - x1
      const height = y2 - y1

      return {
        left: `${x1}px`,
        top: `${y1}px`,
        width: `${width}px`,
        height: `${height}px`
      }
    },

    // 格式化边界框坐标
    formatBbox(bbox) {
      const [x1, y1, x2, y2] = bbox
      return `X:${x1}-${x2} Y:${y1}-${y2}`
    },

    // 计算缺陷面积（示例换算）
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

    // 保存到历史记录
    saveToHistory() {
      this.historyItems.unshift({
        id: Date.now(),
        thumb: this.imageUrl,
        fullImage: this.imageUrl,
        detections: [...this.detections],
        timestamp: Date.now()
      })
    }
  }
}
</script>

<style scoped>
.upload-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  margin-bottom: 40px;
}

.upload-area {
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  min-height: 600px;
  position: relative;
}

.preview-container {
  position: relative;
}

.preview-image {
  max-width: 100%;
  display: block;
}

.detection-box {
  position: absolute;
  border: 2px solid #FF3B30;
  box-shadow: 0 0 10px rgba(255, 59, 48, 0.5);
}

.detection-label {
  position: absolute;
  top: -24px;
  left: 0;
  background-color: #FF3B30;
  color: #FFF;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

.result-area {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.detection-time {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #909399;
}

.detection-item {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.info-row {
  display: flex;
  align-items: center;
  margin: 8px 0;
  gap: 12px;
}

.label {
  color: #606266;
  min-width: 80px;
}

.confidence-bar {
  flex: 1;
  max-width: 120px;
}

.percentage {
  color: #f56c6c;
  min-width: 60px;
  text-align: right;
}
</style>
