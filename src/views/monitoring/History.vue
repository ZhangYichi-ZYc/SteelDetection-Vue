<template>
  <div class="overview-container">
    <!-- AI 对话组件 -->
    <div class="ai-chat-container" :class="{ 'expanded': isChatExpanded }">
      <div class="chat-header" v-if="isChatExpanded">
        <span>AI助手</span>
        <el-button type="text" @click="toggleChat">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      <div class="chat-content" v-if="isChatExpanded">
        <div v-for="(msg, index) in chatMessages" :key="index" :class="['message', msg.role]">
          <div class="message-content">{{ msg.content }}</div>
        </div>
        <div v-if="isLoading" class="loading-indicator">
          <el-icon class="is-loading"><Loading /></el-icon>
        </div>
      </div>
      <div class="chat-input" v-if="isChatExpanded">
        <el-input
          v-model="userInput"
          placeholder="请输入您的问题..."
          @keyup.enter="sendMessage"
          :disabled="isLoading"
        >
          <template #append>
            <el-button @click="sendMessage" :loading="isLoading">发送</el-button>
          </template>
        </el-input>
      </div>
      <div class="chat-toggle" @click="toggleChat" v-if="!isChatExpanded">
        <el-icon><ChatDotRound /></el-icon>
      </div>
    </div>

    <!-- 顶部功能区 -->
    <el-row :gutter="20" class="top-bar">
      <el-col :span="6">
        <el-input v-model="searchQuery" placeholder="搜索记录" clearable />
      </el-col>
      <el-col :span="6">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 100%"
        />
      </el-col>
      <el-col :span="4">
        <el-select v-model="lineFilter" placeholder="生产线筛选">
          <el-option label="全部生产线" value="all" />
          <el-option v-for="line in productionLines" :key="line" :label="line" :value="line" />
        </el-select>
      </el-col>
      <el-col :span="4" class="report-button">
        <el-button type="primary" icon="el-icon-plus">生成报告</el-button>
      </el-col>
    </el-row>

    <!-- 中部可视化模块区 -->
    <el-row :gutter="20" class="data-section">
      <!-- 生产效率趋势 -->
      <el-col :span="6">
        <el-card header="生产效率趋势">
          <v-chart :option="productivityChartOption" style="height: 200px" />
        </el-card>
      </el-col>

      <!-- 质量检测分布 -->
      <el-col :span="6">
        <el-card header="质量检测分布">
          <v-chart :option="qualityChartOption" style="height: 200px" />
        </el-card>
      </el-col>

      <!-- 设备运行状态 -->
      <el-col :span="6">
        <el-card header="设备运行状态">
          <v-chart :option="equipmentStatusOption" style="height: 200px" />
        </el-card>
      </el-col>

      <!-- 检测零件数 -->
      <el-col :span="6">
        <el-card header="检测零件数">
          <v-chart :option="inspectionCountOption" style="height: 200px" />
          <div class="inspection-details">
            <span>实际完成: 23834</span>
            <span>未完成: 14131</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部详细记录表格区 -->
    <el-card class="table-card">
      <el-table :data="historyData" stripe style="width: 100%">
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="line" label="生产线" width="180" />
        <el-table-column prop="batch" label="生产批次" width="200" />
        <el-table-column prop="output" label="产量" align="right" />
        <el-table-column prop="rate" label="合格率" align="right">
          <template #default="{ row }">
            <el-tag :type="row.rate > 97 ? 'success' : 'danger'">
              {{ row.rate }}%
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-icon :color="statusColor[row.status]">
              <component :is="statusIcon[row.status]" />
            </el-icon>
            {{ row.status }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default>
            <el-button type="primary" size="small">查看详情</el-button>
            <el-button type="success" size="small">导出报告</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <span>显示 1 到 5 条，共 28 条记录</span>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="28"
          :page-size="5"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
import { ElCard, ElRow, ElCol, ElTable, ElTableColumn, ElInput, ElButton, ElPagination } from 'element-plus'
import { ChatDotRound, Close, Loading } from '@element-plus/icons-vue'
import axios from 'axios'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart, BarChart, GaugeChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  PieChart,
  BarChart,
  GaugeChart,
  GridComponent,
  TooltipComponent,
  LegendComponent
])

export default {
  components: { 
    ElCard, 
    ElRow, 
    ElCol, 
    ElTable, 
    ElTableColumn,
    ElInput,
    ElButton,
    ElPagination,
    ChatDotRound,
    Close,
    Loading,
    VChart
  },
  data() {
    return {
      searchQuery: '',
      dateRange: '',
      lineFilter: 'all',
      productionLines: ['流水线1', '流水线2', '流水线3', '流水线4', '流水线5'],
      statusColor: {
        '正常': '#67C23A',
        '待优化': '#E6A23C',
        '异常': '#F56C6C'
      },
      statusIcon: {
        '正常': 'Check',
        '待优化': 'Warning',
        '异常': 'Close'
      },
      productivityChartOption: {
        xAxis: { type: 'category', data: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'] },
        yAxis: { type: 'value' },
        series: [{ data: [80, 90, 85, 95, 100], type: 'line' }]
      },
      qualityChartOption: {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          data: [
            { value: 1048, name: '合格' },
            { value: 100, name: '待复检' },
            { value: 50, name: '不合格' }
          ]
        }]
      },
      equipmentStatusOption: {
        xAxis: { type: 'category', data: ['A线', 'B线', 'C线', 'D线'] },
        yAxis: { type: 'value' },
        series: [{ data: [95, 98, 97, 96], type: 'bar' }]
      },
      inspectionCountOption: {
        series: [{
          type: 'gauge',
          detail: { formatter: '{value}%' },
          data: [{ value: 37, name: '已完成' }]
        }]
      },
      historyData: [
        { time: '2024-01-15 14:30', line: '流水线1', batch: 'BATCH-20240115-001', output: 2450, rate: 98.5, status: '正常' },
        { time: '2024-01-15 13:15', line: '流水线2', batch: 'BATCH-20240115-002', output: 1800, rate: 97.2, status: '待优化' },
        { time: '2024-01-15 11:45', line: '流水线3', batch: 'BATCH-20240115-003', output: 320, rate: 99.1, status: '正常' },
        { time: '2024-01-15 10:20', line: '流水线4', batch: 'BATCH-20240115-004', output: 198, rate: 96.8, status: '异常' },
        { time: '2024-01-15 09:00', line: '流水线5', batch: 'BATCH-20240115-005', output: 2751, rate: 98.9, status: '正常' }
      ],
      isChatExpanded: false,
      userInput: '',
      chatMessages: [],
      isLoading: false,
      apiKey: 'sk-temG8svNtRWytx1TIIkgHL6yNbXIO6edjx9mio3Lj7iQ0W5j'
    }
  },
  methods: {
    toggleChat() {
      this.isChatExpanded = !this.isChatExpanded
      if (this.isChatExpanded) {
        // 展开时滚动到底部
        this.$nextTick(() => {
          const chatContent = document.querySelector('.chat-content')
          if (chatContent) {
            chatContent.scrollTop = chatContent.scrollHeight
          }
        })
      }
    },
    async sendMessage() {
      if (!this.userInput.trim() || this.isLoading) return
      
      this.isLoading = true
      
      // 添加用户消息
      this.chatMessages.push({
        role: 'user',
        content: this.userInput
      })
      
      const userMessage = this.userInput
      this.userInput = ''
      
      try {
        const response = await axios.post('https://gpt.api.zhangyichi.cn/v1/chat/completions', {
          model: 'deepseek-chat',
          messages: [
            { 
              role: 'system', 
              content: `你是一个专业的工业缺陷检测助手，可以帮助用户分析生产数据、解释检测结果、提供改进建议。请用专业但易懂的语言回答用户的问题。

当前系统数据如下：

1. 生产线数据：
   - 5条生产线：流水线1-5
   - 每条生产线都有具体的生产批次、产量和合格率数据

2. 检测数据：
   - 实际完成检测：23834件
   - 未完成检测：14131件
   - 合格率分布：合格(1048)、待复检(100)、不合格(50)

3. 设备运行状态：
   - A线：95%
   - B线：98%
   - C线：97%
   - D线：96%

4. 生产效率趋势：
   - 时间点：10:00-15:00
   - 效率值：80-100%

5. 历史记录数据：
   - 包含时间、生产线、批次、产量、合格率、状态等信息
   - 状态分为：正常、待优化、异常

请基于这些数据，为用户提供有关生产效率、质量检测、设备运行状态和历史记录的分析和建议。`
            },
            ...this.chatMessages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          stream: false
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        })
        
        // 添加 AI 回复
        this.chatMessages.push({
          role: 'assistant',
          content: response.data.choices[0].message.content
        })
        
        // 滚动到底部
        this.$nextTick(() => {
          const chatContent = document.querySelector('.chat-content')
          if (chatContent) {
            chatContent.scrollTop = chatContent.scrollHeight
          }
        })
      } catch (error) {
        console.error('发送消息失败:', error)
        this.chatMessages.push({
          role: 'assistant',
          content: '抱歉，发生错误，请稍后重试。'
        })
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
/* 全局变量 */
:root {
  --primary-color: #409EFF;
  --page-background: #1a1a2e;
  --component-background: #fff;
  --component-header: #F5F7FA;
  --border-color: #DCDFE6;
  --text-color: #303133;
  --text-color-light: #606266;
  --shadow-color: rgba(0, 0, 0, 0.1);
}

/* 全局容器 */
.overview-container {
  padding: 20px;
  background: var(--page-background);
  min-height: 100vh;

  /* 移除原有的负边距 */
  :deep(.el-row) {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}

/* 数据卡片区域 */
.data-section {
  margin-bottom: 20px;
  .el-card {
    height: 100%;
    background: white;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 var(--shadow-color);
    margin-bottom: 20px;

    :deep(.el-card__header) {
      padding: 15px;
      border-bottom: 1px solid var(--border-color);
      background: white;
      color: var(--text-color);
      font-weight: 500;
      font-size: 14px;
    }

    :deep(.el-card__body) {
      padding: 20px;
      background: white;
    }
  }
}

/* 图表容器样式 */
:deep(.echarts) {
  background: white;
  border-radius: 4px;
}

/* 表格样式调整 */
:deep(.el-table) {
  background: white;
  
  /* 调整表格行高 */
  .el-table__row {
    height: 20px !important;
  }

  /* 调整单元格内边距和对齐方式 */
  .el-table__cell {
    padding: 0 !important;
    height: 20px !important;
    line-height: 20px !important;
  }

  th.el-table__cell {
    background: white;
    color: var(--text-color);
    font-weight: 500;
    height: 20px !important;
    padding: 0 !important;
  }

  td.el-table__cell {
    background: white;
    color: var(--text-color);
  }

  /* 调整单元格内容对齐 */
  .cell {
    line-height: 20px !important;
    padding: 0 8px !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/* 表格卡片样式 */
.table-card {
  background: white;
  border-radius: 8px;
  margin-top: 20px;
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 12px 0 var(--shadow-color);
  margin-bottom: 60px; /* 为AI搜索球留出空间 */

  /* 控制表格容器高度 */
  :deep(.el-table__body-wrapper) {
    max-height: 300px !important; /* 限制表格体最大高度 */
    overflow-y: auto;
  }
}

/* 顶部工具栏 */
.top-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 20px; /* 添加组件之间的间距 */
  align-items: center;
  
  .el-col {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 var(--shadow-color);
    height: 100%;
    display: flex;
    align-items: center;

    /* 调整搜索框列宽 */
    &:first-child {
      flex: 0 0 250px;
    }

    /* 调整日期选择器列宽 */
    &:nth-child(2) {
      flex: 0 0 350px;
    }

    /* 调整生产线筛选列宽 */
    &:nth-child(3) {
      flex: 0 0 200px;
    }

    /* 调整生成报告按钮列宽 */
    &:last-child {
      flex: 0 0 120px;
      justify-content: center;
    }
  }

  :deep(.el-input__wrapper),
  :deep(.el-select .el-input__wrapper),
  :deep(.el-date-editor.el-input__wrapper) {
    background: white;
    box-shadow: 0 0 0 1px var(--border-color) inset !important;
    width: 100%;
  }

  :deep(.el-input__inner) {
    color: var(--text-color);
  }

  :deep(.el-button) {
    background: var(--primary-color);
    border-color: var(--primary-color);
    color: white;
    height: 32px;
    width: 100%;
  }

  /* 移除原有的栅格间距 */
  :deep(.el-row--flex) {
    margin: 0 !important;
  }
}

/* 检测零件数详情 */
.inspection-details {
  margin-top: 10px;
  text-align: center;
  color: var(--text-color);
  font-size: 14px;

  span {
    margin: 0 10px;
  }
}

/* 状态标签样式 */
:deep(.el-tag) {
  &.success {
    background: #67C23A;
    color: white;
    border: none;
  }

  &.warning {
    background: #E6A23C;
    color: white;
    border: none;
  }

  &.danger {
    background: #F56C6C;
    color: white;
    border: none;
  }
}

/* 按钮样式增强 */
.el-button {
  background: var(--primary-color);
  border: 1px solid var(--primary-color);
  color: white;
  height: 40px;
  padding: 0 16px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
}

/* 标签样式 */
.el-tag {
  background: var(--component-background);
  border: none;
  font-weight: 500;
  
  &.success {
    background: #67C23A;
    color: white;
  }
  &.danger {
    background: #F56C6C;
    color: white;
  }
}

/* AI 对话组件样式 */
.ai-chat-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chat-toggle {
  width: 50px;
  height: 50px;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 12px 0 var(--shadow-color);
  transition: transform 0.3s ease;
}

.chat-toggle:hover {
  transform: scale(1.1);
}

.chat-toggle .el-icon {
  color: white;
  font-size: 24px;
}

:deep(.ai-chat-container.expanded ){
  background:rgb(35, 49, 70)!important; /* 调整背景颜色以区分主背景 */
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 var(--shadow-color);
  max-height: 80vh; /* 允许大小可调节 */
  overflow-y: auto;

  .chat-header {
    background: rgb(65, 100, 148)!important;
    border-bottom: 1px solid var(--border-color);
    color: var(--text-color);
  }

  .chat-content {
    background: rgb(75, 109, 160)!important;
    color: var(--text-color);
    white-space: pre-wrap; /* 支持Markdown格式 */

    .message {
      .message-content {
        background: #f5f7fa;
        color: var(--text-color);
      }

      &.user .message-content {
        background: #f0f2f5;
        color: #000000;
        border: 1px solid #e4e7ed;
      }

      &.assistant .message-content {
        background: #f5f7fa;
        border: 1px solid var(--border-color);
        color: var(--text-color);
      }
    }
  }

  .chat-input {
    background: white;
    border-top: 1px solid var(--border-color);
  }
}

.chat-header {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--component-header);
  border-radius: 8px 8px 0 0;
  color: var(--text-color);
}

.chat-content {
  height: calc(100% - 120px);
  overflow-y: auto;
  padding: 16px;
  background: var(--component-background);
  color: var(--text-color);
}

.message {
  margin-bottom: 16px;
  max-width: 80%;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.user {
  margin-left: auto;
}

.message-content {
  padding: 12px 16px;
  border-radius: 8px;
  background: var(--component-header);
  color: var(--text-color);
  word-break: break-word;
}

.message.user .message-content {
  background: var(--primary-color);
  color: white;
}

.message.assistant .message-content {
  background: var(--component-header);
  border: 1px solid var(--border-color);
}

.chat-input {
  padding: 16px;
  border-top: 1px solid var(--border-color);
  background: var(--component-header);
  border-radius: 0 0 8px 8px;
}

.loading-indicator {
  text-align: center;
  padding: 10px;
  color: var(--primary-color);
}

.loading-indicator .el-icon {
  font-size: 24px;
}

/* 输入框样式 */
:deep(.el-input__wrapper) {
  background: var(--component-background);
  box-shadow: 0 0 0 1px var(--border-color) inset !important;
  border-radius: 4px;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--primary-color) inset !important;
}

:deep(.el-input__inner) {
  color: var(--text-color);
}

:deep(.el-input__inner::placeholder) {
  color: var(--text-color-light);
}

/* 表格样式 */
:deep(.el-table) {
  background: var(--component-background);
  color: var(--text-color);

  th.el-table__cell {
    background: var(--component-header);
    color: var(--text-color);
    font-weight: 500;
  }

  td.el-table__cell {
    background: var(--component-background);
    color: var(--text-color);
  }

  tr:hover > td.el-table__cell {
    background: var(--component-header);
  }
}

/* 标签样式 */
:deep(.el-tag) {
  &.success {
    background: #67C23A;
    color: white;
    border: none;
  }

  &.warning {
    background: #E6A23C;
    color: white;
    border: none;
  }

  &.danger {
    background: #F56C6C;
    color: white;
    border: none;
  }
}

/* 分页器样式调整 */
.pagination {
  padding: 8px 20px !important;
  background: white;
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>