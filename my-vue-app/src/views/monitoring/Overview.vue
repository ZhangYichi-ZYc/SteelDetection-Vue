<template>
  <div class="overview-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-left">
        <span>数字车间零件质检平台</span>
      </div>
      <div class="header-right">
        <span>{{ currentDateTime }}</span>
        <el-avatar src="https://example.com/avatar.png" />
      </div>
    </header>

    <!-- 核心数据展示 -->
    <el-row :gutter="20" class="data-section">
      <!-- 左侧三个组件 -->
      <el-col :span="12">
        <!-- 零件检测趋势 -->
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>零件检测趋势</span>
              <el-button type="text">切换时间</el-button>
            </div>
          </template>
          <e-charts :option="trendChartOption" style="height: 300px" />
        </el-card>

        <!-- 检测完成率 -->
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>检测完成率</span>
              <el-button type="text">切换时间</el-button>
            </div>
          </template>
          <e-charts :option="completionRateChartOption" style="height: 300px" />
        </el-card>

        <!-- 零件库存总量 -->
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>零件库存总量</span>
              <el-button type="text">切换时间</el-button>
            </div>
          </template>
          <e-charts :option="inventoryChartOption" style="height: 300px" />
        </el-card>
      </el-col>

      <!-- 右侧三个组件 -->
      <el-col :span="12">
        <!-- 残缺零件数 -->
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>残缺零件数（近五天）</span>
            </div>
          </template>
          <e-charts :option="defectiveChartOption" style="height: 300px" />
        </el-card>

        <!-- 告警信息 -->
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>告警信息</span>
            </div>
          </template>
          <el-table :data="alerts" stripe style="width: 100%">
            <el-table-column prop="id" label="序号" width="80" />
            <el-table-column prop="message" label="告警信息" />
            <el-table-column prop="time" label="时间" width="120" />
            <el-table-column prop="location" label="机位" width="100" />
          </el-table>
        </el-card>

        <!-- 新增与累积容量 -->
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>新增与累积容量</span>
            </div>
          </template>
          <e-charts :option="capacityChartOption" style="height: 300px" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ElCard, ElRow, ElCol, ElButton, ElTable, ElTableColumn, ElAvatar } from 'element-plus'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, LineChart, BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent])

export default {
  components: {
    ElCard,
    ElRow,
    ElCol,
    ElButton,
    ElTable,
    ElTableColumn,
    ElAvatar,
    'e-charts': VChart
  },
  data() {
    return {
      currentDateTime: new Date().toLocaleString(),
      trendChartOption: {
        xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月'] },
        yAxis: { type: 'value' },
        series: [
          { name: '零件1', data: [80, 85, 90, 88], type: 'line' },
          { name: '零件2', data: [75, 78, 82, 80], type: 'line' }
        ]
      },
      completionRateChartOption: {
        xAxis: { type: 'category', data: ['零件10', '零件20', '零件30', '零件40'] },
        yAxis: { type: 'value' },
        series: [{ data: [95, 90, 85, 80], type: 'bar' }]
      },
      inventoryChartOption: {
        series: [
          {
            type: 'pie',
            data: [
              { value: 1048, name: '零件10' },
              { value: 735, name: '零件20' },
              { value: 580, name: '零件30' },
              { value: 484, name: '零件40' }
            ]
          }
        ]
      },
      defectiveChartOption: {
        xAxis: { type: 'category', data: ['2月10日', '2月11日', '2月12日', '2月13日', '2月14日'] },
        yAxis: { type: 'value' },
        series: [
          { name: '实际', data: [120, 132, 101, 134, 90], type: 'bar' },
          { name: '预测', data: [110, 125, 95, 130, 85], type: 'line' }
        ]
      },
      alerts: [
        { id: 1, message: '零件10检测异常', time: '10:15', location: 'A1' },
        { id: 2, message: '零件20库存不足', time: '11:30', location: 'B2' }
      ],
      capacityChartOption: {
        xAxis: { type: 'category', data: ['2011', '2012', '2013', '2014', '2015'] },
        yAxis: { type: 'value' },
        series: [
          { name: '新增容量', data: [100, 120, 150, 180, 200], type: 'bar' },
          { name: '累积容量', data: [100, 220, 370, 550, 750], type: 'line' }
        ]
      }
    }
  }
}
</script>

<style scoped>
.overview-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  font-size: 1.5em;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.data-section {
  margin-top: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>