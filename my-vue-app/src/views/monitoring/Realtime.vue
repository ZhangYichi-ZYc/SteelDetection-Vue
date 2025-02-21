<template>
  <div class="realtime-container">
    <!-- 时间状态栏 -->
    <el-card class="status-bar">
      <el-row justify="space-between" align="middle">
        <el-col :span="12">
          <div class="time-display">
            <span class="date">{{ currentDate }}</span>
            <span class="time">{{ currentTime }}</span>
          </div>
        </el-col>
        <el-col :span="12" class="text-right">
          <el-statistic title="检测速度" :value="85" suffix="ms/张" />
        </el-col>
      </el-row>
    </el-card>

    <!-- 核心指标面板 -->
    <el-row :gutter="20" class="metric-panel">
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>合格率</span>
              <el-tag type="success">+2.5%</el-tag>
            </div>
          </template>
          <div class="metric-value">95.8%</div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>总站数</span>
            </div>
          </template>
          <div class="metric-value">24</div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>当前批次</span>
              <el-tag>#A123</el-tag>
            </div>
          </template>
          <div class="metric-value">2,450件</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 站点状态时间线 -->
    <el-card class="timeline-card">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in stationStatus"
          :key="index"
          :timestamp="item.time"
          placement="top"
        >
          <el-card>
            <h4>{{ item.station }}</h4>
            <el-tag :type="item.status === 'normal' ? 'success' : 'danger'">
              {{ item.status === 'normal' ? '正常' : '异常' }}
            </el-tag>
            <p>检测次数: {{ item.count }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script>
import { ElTimeline, ElTimelineItem } from 'element-plus'

export default {
  components: { ElTimeline, ElTimelineItem },
  data() {
    return {
      currentDate: new Date().toLocaleDateString(),
      currentTime: new Date().toLocaleTimeString(),
      stationStatus: [1,2,3] // 站点状态数据
    }
  }
}
</script>

<style scoped>
.realtime-container {
  padding: 20px;
}

.status-bar {
  margin-bottom: 20px;
}

.time-display {
  font-size: 1.2em;
}
.time-display .date {
  margin-right: 15px;
}

.metric-panel {
  margin-bottom: 20px;
}
.metric-panel .metric-value {
  font-size: 2.5em;
  text-align: center;
  color: #409eff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timeline-card {
  margin-top: 20px;
}
</style>