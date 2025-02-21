

<template>
  <div class="overview-container">
    <!-- 顶部筛选栏 -->
    <el-card class="filter-card">
      <el-row :gutter="20">
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
          <el-select v-model="batchFilter" placeholder="生产批次">
            <el-option label="全部批次" value="all" />
            <el-option v-for="b in batches" :key="b" :label="b" :value="b" />
          </el-select>
        </el-col>
      </el-row>
    </el-card>

    <!-- 核心数据展示 -->
    <el-row :gutter="20" class="data-section">
      <!-- 生产效率趋势图 -->
      <el-col :span="16">
        <el-card header="生产效率趋势">
          <e-charts :option="productivityChartOption" style="height: 400px" />
        </el-card>
      </el-col>

      <!-- 质量分布环形图 -->
      <el-col :span="8">
        <el-card header="质量检测分布">
          <e-charts :option="qualityChartOption" style="height: 400px" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 详细数据表格 -->
    <el-card class="table-card">
      <el-table :data="historyData" stripe style="width: 100%">
        <el-table-column prop="time" label="时间" width="180" />
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
    </el-card>
  </div>
</template>

<script>
import { ElCard, ElRow, ElCol, ElTable, ElTableColumn } from 'element-plus'

export default {
  components: { ElCard, ElRow, ElCol, ElTable, ElTableColumn },
  data() {
    return {
      dateRange: '',
      batchFilter: 'all',
      productivityChartOption: {
        xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
        yAxis: { type: 'value' },
        series: [{ data: [820, 932, 901, 934, 1290], type: 'line' }]
      },
      qualityChartOption: {
        tooltip: { trigger: 'item' },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          data: [
            { value: 1048, name: '合格' },
            { value: 735, name: '不合格' }
          ]
        }]
      },
      historyData: [1,2,3] // 表格数据
    }
  }
}
</script>

<style scoped>
.overview-container {
  padding: 20px;
  background: #f5f7fa;
}

.filter-card {
  margin-bottom: 20px;
}

.data-section {
  margin-bottom: 20px;
}

.table-card {
  margin-top: 20px;
}
</style>