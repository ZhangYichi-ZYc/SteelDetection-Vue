<template>
  <div class="overview-container">
    <!-- 新增标题 -->
    <div class="header-title">数字车间零件质检平台</div>
    <div class="main-content">
      <!-- 左侧区域 -->
      <div class="left-panel">
        <!-- 月生产计划表格 -->
        <div class="metric-card table-card">
          <div class="card-header">
            <h3 class="card-title">月生产计划</h3>
            <el-select v-model="selectedMonth" size="small" class="month-select" placeholder="请选择月份">
              
              <el-option 
                v-for="month in months" 
                :key="month" 
                :label="month" 
                :value="month"
              />
            </el-select>
          </div>

            <el-table 
              :data="productionData" 
              style="width: 100% "
              :header-cell-style="{background: '#1a2238', color: '#8F9BB3'}"
              :cell-style="{background: '#1a2238', color: '#fff'}"
            >
              
              <el-table-column prop="area" label="区域" width="120" />
              <el-table-column prop="product1" label="零件1" align="right" />
              <el-table-column prop="product2" label="零件2" align="right" />
              <el-table-column prop="product3" label="零件3" align="right" />
              <el-table-column prop="product4" label="零件4" align="right" />
              <el-table-column prop="product5" label="零件5" align="right" />
              <el-table-column prop="product6" label="零件6" align="right" />
              <el-table-column prop="total" label="汇总" align="right" width="100" />
            </el-table>
          </div>
 

        <!--月生产计划饼状图 -->
        <div class="metric-card completion-card">
          <div class="card-header">
            <h3 class="card-title">月生产计划</h3>
            <el-select v-model="selectedMonth" size="small" class="month-select">
              <el-option 
                v-for="month in months" 
                :key="month" 
                :label="month" 
                :value="month"
              />
            </el-select>
          </div>
          <div class="completion-wrapper">
            <div class="chart-container">
              <e-charts :option="completionChart" style="height: 250px; width: 250px;" ref="completionChart"/>
              <div class="stat-item">
                <div class="value">63%</div>
                <div class="label">已完成</div>
              </div>
            </div>
            <div class="stat-details">
              <div class="detail-item">
                <span class="dot completed"></span>
                <div class="content-group">
                  <span class="number glow-text">23,834</span>
                  <span class="text glow-text">实际完成</span>
                </div>
              </div>
              <div class="detail-item">
                <span class="dot uncompleted"></span>
                <div class="content-group">
                  <span class="number glow-text">14,131</span>
                  <span class="text glow-text">未完成</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间区域 -->
      <div class="center-panel">
        <!-- 客户满意度 -->
        <div class="metric-card">
          <div class="card-header">
            <h3 class="card-title">客户满意度 (%)</h3>
          </div>
          <e-charts :option="satisfactionChart" style="height: 240px" ref="satisfactionChart"/>
        </div>



        <!-- 检测完成率 -->
        <div class="metric-card-1">
          <div class="card-header-1">
            <h3 class="card-title-1">检测完成率</h3>
            <el-select 
              v-model="selectedDate"  
              size="small" 
              class="time-select"
              @change="handleDateChange"
            >
              <el-option 
                v-for="(date, index) in dateOptions" 
                :key="index" 
                :label="date.label" 
                :value="date.value"
              />
            </el-select>
          </div>
          <div class="progress-grid">
            <div 
              v-for="(item, index) in inspectionProgress" 
              :key="index" 
              class="progress-item"
            >
              <div class="progress-header">
                <span class="label">零件{{ index + 1 }}</span>
                <span class="ratio">{{ (item.completed/item.total*100).toFixed(1) }}%</span>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{width: `${(item.completed/item.total)*100}%`}"
                ></div>
              </div>
              <div class="progress-numbers">
                <span class="section">{{ item.completed.toLocaleString() }}</span>
                <span class="total">/{{ item.total.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>



        <!-- 零件库存 -->
        <div class="metric-card-2">
          <div class="card-header-2">
            <h3 class="card-title-2">零件库存总量</h3>
            <el-select 
              v-model="selectedDate"  
              size="small" 
              class="time-select"
              @change="handleDateChange"
            >
              <el-option 
                v-for="(date, index) in dateOptions" 
                :key="index" 
                :label="date.label" 
                :value="date.value"
              />
            </el-select>
          </div>
          <e-charts :option="inventoryChart" style="height: 240px" ref="inventoryChart"/>
        </div>
      </div>

      <!-- 右侧区域 -->
      <div class="right-panel">
        <!-- 残缺零件数 -->
        <div class="metric-card">
          <div class="card-header">
            <h3 class="card-title">残缺零件数</h3>
            <el-select 
              v-model="timeRange" 
              size="small" 
              class="time-select"
              @change="handleTimeRangeChange"
            >
              <el-option 
                v-for="range in timeRanges" 
                :key="range.value" 
                :label="range.label" 
                :value="range.value"
              />
            </el-select>
          </div>
          <e-charts :option="defectChart" style="height: 240px" ref="defectChart"/>
        </div>

        <!-- 告警信息 -->
          <div class="metric-card-1 alert-card">
    <div class="card-header-1">
      <h3 class="card-title-1">实时告警</h3>
    </div>
    <el-table 
      :data="alerts" 
      style="width: 100%"
      :row-style="{ height: '40px' }"
      class="alert-table"
       :border="false" 
    >
      <el-table-column prop="id" label="序号" width="60">
        <template #default="{ row }">
          <span class="alert-index">{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="message" label="告警信息" />
      <el-table-column prop="time" label="时间" width="120" />
      <el-table-column prop="machine" label="机位" width="70" />
    </el-table>
  </div>

        <!-- 检测方式对比 -->
        <div class="metric-card-2">
          <div class="card-header-2">
            <h3 class="card-title-2">零件检测数</h3>
            <el-select 
              v-model="timeRange" 
              size="small" 
              class="time-select"
              @change="handleTimeRangeChange"
            >
              <el-option 
                v-for="range in timeRanges" 
                :key="range.value" 
                :label="range.label" 
                :value="range.value"
              />
            </el-select>
          </div>
          <e-charts :option="inspectionChart" style="height: 250px" ref="inspectionChart"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import * as echarts from 'echarts'; // 关键：使用命名导入

const CardHeader = {
  props: ['title', 'align'],
  render(h) {
    return h('div', {
      class: ['card-header', this.align === 'right' ? 'right-align' : '']
    }, [
      h('h3', { class: 'card-title' }, this.title),
      h('div', { class: 'header-controls' }, this.$slots.default)
    ])
  }
};
// 数据映射关系
const REAL_TO_FAKE = {
  90: 70,   // 真实值90 → 映射到坐标70 (35%位置)
  95: 140    // 真实值95 → 映射到坐标140 (70%位置)
};


export default {
  data() {
    return {
      components: {
        CardHeader
      },
      selectedMonth:'25年2月' ,
      activeDate: 'today',
      timeRange: '5d',
      months: ['25年2月', '25年1月', '24年12月'],
      timeRanges: [
        { label: '近5天', value: '5d' },
        { label: '近7天', value: '7d' },
        { label: '本月', value: 'month' }
      ],
      selectedDate: 'today', 
      dateOptions: [ 
        { label: '今天', value: 'today' },
        { label: '昨天', value: 'yesterday' },
        { label: '前天', value: 'beforeYesterday' }
      ],
      productionData: [
        { area: '浙江', product1: '231', product2: '22333', product3: '1223',product4:'0',product5:'632',product6:'829', total: '25246' },
        { area: '江苏', product1: '0', product2: '0', product3: '4742',product4:'55325',product5:'23156',product6:'0', total: '83223' },
        { area: '天津', product1: '89', product2: '7870', product3: '90',product4:'100',product5:'97583',product6:'78297', total: '184029' },
        { area: '广西', product1: '789', product2: '4663', product3: '9832',product4:'3489',product5:'27358',product6:'3243', total: '49374' },
        { area: '山东', product1: '0', product2: '0', product3: '0',product4:'0',product5:'0',product6:'900', total: '900' }

      ],




      inspectionProgress: [
        { completed: 1000, total: 1832 },
        { completed: 800, total: 1500 },
        { completed: 1200, total: 2000 },
        { completed: 600, total: 1000 }
      ],
      alerts: [
        { id: '1', message: '钢板出现褶皱', time: '2025/2/12 10:03', machine: '机位1' },
        { id: '2', message: '传送带速度异常', time: '2025/2/12 09:45', machine: '机位3' },
        { id: '3', message: '温度传感器故障', time: '2025/2/12 08:12', machine: '机位2' },
        { id: '4', message: '气压不足报警', time: '2025/2/12 07:30', machine: '机位4' }
      ],
      // 图表配置优化
      completionChart: {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [{
          name: '生产进度',
          type: 'pie',
          radius: ['65%', '80%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          label: { show: false },
          itemStyle: {
            borderRadius: 5,
            borderColor: '#0A1633',
            borderWidth: 3
          },
          data: [
            { value: 23834, name: '已完成', itemStyle: { color: '#4A90E2' }},
            { value: 14131, name: '未完成', itemStyle: { color: '#2D3856' }}
          ]
        }]
      },


      satisfactionChart: {
        
        legend: {
          data: ['AI预测', '实际'],
          textStyle: { color: '#8F9BB3' },
          right: 20
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: '#4A90E2'
        },
        xAxis: {
          type: 'category',
          data: ['2/8', '2/9', '2/10', '2/11', '2/12', '2/13', '2/14'],
          axisLine: { lineStyle: { color: '#8F9BB3' } },
          axisTick: { show: false }
        },
        yAxis: {
          type: 'value',
          name: '满意度 (%)',
          min: 0,
          max: 140, // 关键调整：控制显示范围
          interval: 70, // 强制间隔70单位
          axisLabel: {
            color: '#8F9BB3',
            formatter: (value) => {
              if (value === 0) return '0';
              if (value === 70) return '90'; // 70单位位置显示90
              if (value === 140) return '95'; // 140单位位置显示95
              return '';
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: (value) => [0, 70, 140].includes(value) 
                ? 'rgba(143, 155, 179, 0.3)' 
                : 'transparent'
            }
          }
        },
        series: [
          {
            name: 'AI预测',
            type: 'line',
            
            data: [70, 97, 131, 73, 60, 140, 129], // 真实数据
            smooth: true,
            lineStyle: { 
              color: '#4A90E2',
              width: 2,
              curveness: 0.3 // 增加曲线弧度
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: 'rgba(74, 144, 226, 0.4)' },
                  { offset: 1, color: 'rgba(74, 144, 226, 0.1)' }
                ]
              )
            }
          },
          {
            name: '实际',
            type: 'line',
            data: [120, 102, 91, 136, 122, 111, 135], // 真实数据
            smooth: true,
            lineStyle: { 
              color: '#00D4FF',
              width: 2,
              curveness: 0.3
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: 'rgba(0, 212, 255, 0.4)' },
                  { offset: 1, color: 'rgba(0, 212, 255, 0.1)' }
                ]
              )
            }
          }
        ]
      },






            defectChart: {
          tooltip: {
              trigger: 'axis'
          },
          xAxis: {
              type: 'category',
              data: ['2/10', '2/11', '2/12', '2/13', '2/14'] ,
              
          },
          yAxis: {
              type: 'value',
              name: '零件数 (件)',
              min: 0,
              max: 50,
              interval: 10 ,// 10天一间隔
              splitLine: {
            show: false // 隐藏 y 轴网格线
        }
          },
          legend: {
              data: ['实际', '预测'],
              itemGap: 10,
              textStyle: { color: '#fff' },
              orient: 'horizontal', // 水平布局
              top: '5%', // 距离顶部 5%
              left: '70%' // 距离左侧 20%
          },
          series: [
              {
                  name: '实际',
                  type: 'bar',
                  data: [35, 42, 20, 33, 24], 
                  itemStyle: {
                      color: new echarts.graphic.LinearGradient(
                          0, 0, 0, 1,
                          [
                              { offset: 0, color: '#4A90E2' },
                              { offset: 1, color: '#2F6FCF' }
                          ]
                      )
                  },
                   barWidth: '20', // 调整柱子宽度，数值越小柱子越细
              },
              {
                  name: '预测',
                  type: 'line',
                  data: [20, 40, 25, 40, 20], // 调整数据匹配示例趋势
                  lineStyle: {
                      color: '#FFD700', // 更接近黄色
                      width: 2
                  },
                  symbol: 'circle',
                  symbolSize: 8,
                  itemStyle: { color: '#FFD700' }
              }
          ]
      },


    inventoryChart: {
      legend: {
        type: 'plain',
        orient: 'horizontal',
        bottom: 22,
        left: 'center',
        itemGap: 20,
        textStyle: { color: '#fff' },
        data: ['零件1', '零件2', '零件3', '零件4']
      },
      tooltip: {
        trigger: 'item',
        formatter: "{b}: {c}件 ({d}%)"
      },
      series: [
        {
          name: '零件库存',
          type: 'pie',
          radius: ['50%', '70%'],
          center: ['50%', '38%'], // 图形整体上移（通过调整 y 坐标，数值越小越靠上）
          roseType: 'radius', 
          data: [
            { value: 512, name: '零件1' },
            { value: 876, name: '零件2' },
            { value: 1000, name: '零件3' },
            { value: 1832, name: '零件4' }
          ],
          label: {
            show: true,
            formatter: "{c}\n{d}%", 
            fontStyle: 'normal', // 普通字体样式（非斜体）
            fontWeight: 'normal', // 普通字体粗细（非加粗）
            fontSize: 12, // 字体大小
            color: '#fff' // 明确字体颜色（避免与背景混淆）
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          },
          color: ['#4A90E2', '#6BA3FF', '#4CD964', '#FFD600'] 
        }
      ]
    },





    inspectionChart: {
    tooltip: {
        trigger: 'axis',
        formatter: function (params) {
            let result = params[0].name + '<br/>';
            for (let i = 0; i < params.length; i++) {
                result += params[i].seriesName + ': ' + params[i].value + '<br/>';
            }
            return result;
        }
    },
    xAxis: {
        type: 'category',
        data: ['2/10', '2/11', '2/12', '2/13', '2/14'] ,
        

    },
    yAxis: {
        type: 'value',
        name: '检测数 (件)',
        splitLine: { show: false }
    },
    legend: { 
      data: ['人工检', '机器检'], 
      textStyle: { color: '#fff' },
      orient: 'horizontal', // 水平布局
              top: '5%', // 距离顶部 5%
              left: '65%'  },
    grid: {
        top: '15%',       // 顶部边距
        bottom: '15%',    // 底部边距，给y轴名称留空间
        left: '8%',       // 左侧边距
        right: '8%',      // 右侧边距
        containLabel: true // 确保刻度标签包含在网格内
    },
    series: [
        {
            name: '人工检',
            type: 'bar',
            data: [300, 450, 550, 380, 520], 
            itemStyle: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        { offset: 0, color: '#00FFFF' },
                        { offset: 1, color: '#00BFFF' }
                    ]
                )
            },
            stack: 'total',
            barWidth: '30' // 调整柱子宽度，数值根据效果微调
        },
        {
            name: '机器检',
            type: 'bar',
            data: [550, 480, 620, 500, 590], 
            itemStyle: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        { offset: 0, color: '#4169E1' },
                        { offset: 1, color: '#191970' }
                    ]
                )
            },
            stack: 'total',
            barWidth: '30'
        }
    ]
}

    };
  },
mounted() {
    this.$nextTick(() => {
        const chartRefs = ['completionChart', 'satisfactionChart', 'inventoryChart', 'defectChart', 'inspectionChart'];

        chartRefs.forEach(chartName => {
            const chartComponent = this.$refs[chartName];
            if (chartComponent) {
                const chartInstance = chartComponent.$echarts || chartComponent.getEchartsInstance();
                if (chartInstance) {
                    // 尝试使用 disableMouseWheelZoom 方法
                    if (typeof chartInstance.disableMouseWheelZoom === 'function') {
                        chartInstance.disableMouseWheelZoom();
                        console.log(`成功使用 disableMouseWheelZoom 禁用 ${chartName} 的鼠标滚轮缩放`);
                    } else {
                        // 获取当前配置
                        const option = chartInstance.getOption();
                        // 确保 option 有 dataZoom 属性
                        option.dataZoom = option.dataZoom || [];
                        // 检查是否已经存在 inside 类型的 dataZoom
                        let insideDataZoomExists = false;
                        option.dataZoom.forEach(dataZoom => {
                            if (dataZoom.type === 'inside') {
                                dataZoom.disabled = true;
                                insideDataZoomExists = true;
                            }
                        });
                        // 如果不存在，添加一个
                        if (!insideDataZoomExists) {
                            option.dataZoom.push({ type: 'inside', disabled: true });
                        }
                        // 确保 slider 类型的 dataZoom 也被禁用
                        option.dataZoom.forEach(dataZoom => {
                            if (dataZoom.type === 'slider') {
                                dataZoom.disabled = true;
                            }
                        });
                        // 更新图表配置
                        chartInstance.setOption(option, true);
                        console.log(`通过 option 配置禁用 ${chartName} 的缩放`);
                    }
                } else {
                    console.log(`未获取到 ${chartName} 的 ECharts 实例`);
                }
            }
        });

        // 设置各个图表的配置选项
        this.$refs.completionChart.setOption(this.completionChart);
        this.$refs.satisfactionChart.setOption(this.satisfactionChart);
        this.$refs.inventoryChart.setOption(this.inventoryChart);
        this.$refs.defectChart.setOption(this.defectChart);
        this.$refs.inspectionChart.setOption(this.inspectionChart);
    });
},
  methods: {
     handleDateChange(value) {
    this.activeDate = value;
    let date = new Date();
    switch(value) {
      case 'yesterday':
        date.setDate(date.getDate() - 1);
        break;
      case 'beforeYesterday':
        date.setDate(date.getDate() - 2);
        break;
      default:
        date = new Date();
    }
    const formattedDate = date.toISOString().split('T')[0];
    // 调用API加载对应数据
    axios.get('/api/inspection-counts', { params: { date: formattedDate } })
      .then(response => {
        this.inspectionCounts = response.data;
        this.inspectionChart.xAxis.data = this.inspectionCounts.map(item => item.date);
        this.inspectionChart.series[0].data = this.inspectionCounts.map(item => item.manualCount);
        this.inspectionChart.series[1].data = this.inspectionCounts.map(item => item.machineCount);
        this.$nextTick(() => {
          this.$refs.inspectionChart.setOption(this.inspectionChart);
        });
      })
      .catch(error => {
        console.error(error);
      });
  },
    handleTimeRangeChange() {
      console.log('Selected time range:', this.timeRange);
      // this.timeRange = this.timeRangeInspection;
      axios.get('/api/defective-parts', { params: { timeRange: this.timeRange } })
       .then(response => {
          this.defectivePartsData = response.data;
          this.defectChart.xAxis.data = this.defectivePartsData.map(item => item.date);
          this.defectChart.series[0].data = this.defectivePartsData.map(item => item.actualCount);
          this.defectChart.series[1].data = this.defectivePartsData.map(item => item.predictCount);
          this.$nextTick(() => {
            this.$refs.defectChart.setOption(this.defectChart);
          });
        })
       .catch(error => {
          console.error(error);
        });
      axios.get('/api/inspection-counts', { params: { timeRange: this.timeRange } })
       .then(response => {
          this.inspectionCounts = response.data;
          this.inspectionChart.xAxis.data = this.inspectionCounts.map(item => item.date);
          this.inspectionChart.series[0].data = this.inspectionCounts.map(item => item.manualCount);
          this.inspectionChart.series[1].data = this.inspectionCounts.map(item => item.machineCount);
          this.$nextTick(() => {
            this.$refs.inspectionChart.setOption(this.inspectionChart);
          });
        })
       .catch(error => {
          console.error(error);
        });
    }
  }
};
</script>

<style scoped>
/* 优化后的样式 */
.overview-container {
  /* background: #0a1633;
  height: 100vh;
  padding: 16px;
  color: #fff; */
    background: #0a1633 url('/src/assets/cityscape.png') no-repeat center center fixed; 
  background-size: cover;
  height: 100vh;
  padding: 16px;
  color: #fff;
  position: relative; /* 新增 */
}
/* 新增标题样式 */
.header-title {
    position: absolute; /* 改为绝对定位 */
  /* position: fixed; */
  top:0px;
  left: 50%;
  transform: translateX(-50%);
  letter-spacing: 8px; /* 新增字符间距 */
 font-family: 优设标题黑;
font-size: 54px;
  text-shadow: 0 0 10px #4A90E2, 0 0 20px #4A90E2;
  /* font-weight: bold; */
  z-index: 1000;
}

.main-content {
  position: absolute;
  display: grid;
  gap: 16px;
  left: 0;
  top: 0;
  width: 1921px;
  height: 1091px;
  background: linear-gradient(90deg, #000000 0%, rgba(0, 0, 0, 0.81) 59%, rgba(0, 0, 0, 0) 100%);
}

.left-panel {
  position: absolute;
  left: 8px;
  top: 67px;
  width: 749px;
  height: 868px;
  overflow: visible; /* 关键修改 */
}

.metric-card {
  position: relative;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  height: 357px; 
  
}

.card-header {
  position: relative;
  background: #1a2238;
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  border-radius: 12px 12px 0 0;

}

.card-title {
  position: relative;
  left: 20px;
  font-size: 24px;
  color: white;
  margin: 6px;
  font-weight: 500;
  padding: 6px;
}

/* 下拉框修复部分 */
.month-select {
  position: absolute;
  left: 620px;
  top: 14px;
  width: 120px !important;
  height: 32px;
  z-index: 1000;
}

::v-deep(.el-select__wrapper) {
  align-items: center;
  border-radius: 12px;
  box-shadow: 0 0 0 1px #1B7EF2 inset !important;
  display: flex;
  font-size: 14px !important;
  gap: 8px;
  min-height: 32px !important;
  padding: 0 12px !important;
      background: white!important;

  width: 90px;
}

::v-deep(.el-select__placeholder) {
  color: black !important;
  font-size: 12px !important;
  z-index: 1 !important;
}

::v-deep(.el-select-dropdown) {
  background: #1a2238 !important;
  border: 1px solid #1B7EF2 !important;
  border-radius: 12px !important;
}

::v-deep(.el-select-dropdown__item) {
  color: #fff !important;
  padding: 0 20px !important;
}

::v-deep(.el-select-dropdown__item:hover) {
  background: rgba(27, 126, 242, 0.3) !important;
}

::v-deep(.el-select-dropdown__item.selected) {
  color: #1B7EF2 !important;
}

::v-deep .el-table {
  position: relative;
  width: 100%;
  margin-top: 20px;
  
}
::v-deep(.el-table .cell ){
    box-sizing: border-box;
    line-height: 45px;
    overflow: hidden;
    overflow-wrap: break-word;
    padding: 0 12px;
    text-overflow: ellipsis;
    white-space: normal;
    display: flex
;
    align-items: center;
    justify-content: center;
    text-align: center !important;
      line-height: 1.2; /* 确保行高与字体大小成比例 */
  padding: 8px; 
}
::v-deep .el-table {
      height: 81%; /* 表格高度占满父容器 */
  background: #1a2238; /* 设置背景颜色，避免出现白色部分 */
}

::v-deep .el-table__inner-wrapper {
  height: 100%; /* 确保内部 wrapper 的高度也占满父容器 */
  background: inherit; /* 继承背景颜色 */
  
}

.stat-item{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 24px;
    z-index: 10;
    pointer-events: none;
}
.stat-details{
      position: absolute;
      right: 20px;
    bottom: 20px;
}

.stat-details {
  text-align: right;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  margin-right: 8px;
}
.completed{
  background: #409eff;
}
.uncompleted { 
  background: rgb(102, 102, 102); /* 未完成图标颜色 */
}

.content-group {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
}

.glow-text {
  color: rgb(121.3, 187.1, 255);
  text-shadow: 0 0 3px rgb(121.3, 187.1, 255), 
               0 0 6px rgb(121.3, 187.1, 255); /* 降低荧光强度 */
  font-weight: bold;
}


/* 未完成部分样式 */
.detail-item:nth-child(2) .glow-text {
  color: rgb(102, 102, 102); /* 未完成文字颜色 */
  text-shadow: 0 0 3px rgb(102, 102, 102), 
               0 0 6px rgb(102, 102, 102);
}
/* 其他面板 */
.center-panel,
.right-panel {
  position: absolute;
  width: 508px;
  height: 868px;
  top: 67px;
  /* background: #1B7EF2; */
}
.center-panel { left: 800px; }
.right-panel { left: 1350px; }


.time-select{
position: absolute;
    left: 380px;
}

.metric-card-1{
  position: relative;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      top: -150px;
    height: 237px;
  
}
.card-header-1 {
    position: relative;
    background: #1a2238;
    display: grid
;
    grid-template-columns: auto auto;
    align-items: center;
    border-radius: 12px 12px 0 0;
}

.card-title-1 {
    position: relative;
    left: 20px;
    font-size: 24px;
    color: white;
    margin: 6px;
    font-weight: 500;
    padding: 6px;
}


.metric-card-2{
  position: relative;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      top: -150px;
    height: 237px;
  
}
.card-header-2[data-v-719460df] {
    position: relative;
    background: #1a2238;
    display: grid
;
    grid-template-columns: auto auto;
    align-items: center;
    border-radius: 12px 12px 0 0;
}

.card-title-2 {
    position: relative;
    left: 20px;
    font-size: 24px;
    color: white;
    margin: 6px;
    font-weight: 500;
    padding: 6px;
}

.today-select{
    position: absolute;
  left: 340px;
  top: 14px;
  width: 120px !important;
  height: 32px;
  z-index: 1000;
}


.completion-wrapper{
    position: relative;
  width: 100%;
      height: 85%;
  margin-top: 20px;
    background: #1a2238;
    border-radius: 0 0 12px 12px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
}

.chart-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
/* 进度条 */
.progress-bar {
  height: 8px;
  background: #252F4D;
  border-radius: 12px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4A90E2 0%, #6BA3FF 100%);
  transition: width 0.3s ease;

}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #8F9BB3;
  margin-bottom: 4px;
}

/* 表格优化 */
.table-card :deep(.el-table) {
  --el-table-border-color: transparent;
  --el-table-row-hover-bg-color: #252F4D;
}

.table-card :deep(.el-table__cell) {
  padding: 10px 0;
}





/* 表格整体样式 */
.alert-table {
  background: transparent !important;
  font-size: 12px;
  color: #fff;
}
.alert-table ::v-deep .el-table__header th {
  color: #4A90E2;
  font-weight: normal;
  border-bottom: 1px solid #2D3856;
  background: transparent !important;
}
.alert-table ::v-deep .el-table__body tr {
  border-bottom: 1px solid #2D3856;
  background: transparent !important;
}
.alert-table ::v-deep .el-table__body td {
  color: #fff;
  padding: 0 10px;
}

/* 序号样式 */
.alert-index {
  display: inline-block;
  padding: 2px 8px;
  background: #D16700;
  color: #fff;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
}

/* 卡片样式 */
.alert-card {
  background: transparent !important;
  
}

/* 针对表格主体行 */
::v-deep .el-table__body tr {
  background-color: transparent !important;
}

/* 若表头也需要处理 */
::v-deep .el-table__header tr {
  background: rgba(2, 49, 100, 0.2) !important;
}

/* 深度选择器移除所有边框 */
.alert-table ::v-deep .el-table__header,
.alert-table ::v-deep .el-table__body {
  border: 0 !important;
}
.alert-table ::v-deep .el-table__header th,
.alert-table ::v-deep .el-table__body tr {
  border-bottom: 0 !important;
  border-right: 0 !important;
}
.alert-table ::v-deep .el-table__body td {
  color: #fff;
  padding: 0 10px;
  border: 0 !important;
}

.alert-table ::v-deep .el-table__body tr {
  border-bottom: none !important;
   --el-table-border-color: none !important;
}
</style>