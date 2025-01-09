<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <github-corner class="github-corner" />

      <panel-group @handleSetLineChartData="handleSetLineChartData" />

      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart :chart-data="lineChartData" />
      </el-row>
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <radar-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <pie-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <bar-chart />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RadarChart from '@/components/Echarts/RadarChart'
import PieChart from '@/components/Echarts/PieChart'
import BarChart from '@/components/Echarts/BarChart'
import crudStatistics from '@/api/statistics'

const lineChartData = {
  newLogin: {
    times: [],
    failData: [],
    successData: [],
    keys: ['失败', '成功']
  },
  amountOfMonth: {
    times: [],
    failData: [],
    successData: [],
    keys: ['未支付', '已支付']
  },
  amountOfPre: {
    times: [],
    failData: [],
    successData: [],
    keys: ['未支付', '已支付']
  },
  amount: {
    times: [],
    failData: [],
    successData: [],
    keys: ['未支付', '已支付']
  },
  amountOfHour: {
    times: [],
    failData: [],
    successData: [],
    keys: ['未支付', '已支付']
  }
}

export default {
  name: 'Dashboard',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RadarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      lineChartData: lineChartData.newLogin
    }
  },
  mounted() {
  },
  created() {
    this.getLogs()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    getLogs() {
      crudStatistics.loginLogs(true).then(res => {
        lineChartData.newLogin.successData = []
        lineChartData.newLogin.times = []
        res.forEach(item => {
          lineChartData.newLogin.successData.push(item['num'])
          lineChartData.newLogin.times.push(item['times'])
        })
      }).catch(() => {})
      crudStatistics.loginLogs(false).then(res => {
        lineChartData.newLogin.failData = []
        res.forEach(item => {
          lineChartData.newLogin.failData.push(item['num'])
        })
      }).catch(() => {})
      // 每日(上月)
      crudStatistics.orderLogsOfPre(0).then(res => {
        lineChartData.amount.successData = []
        lineChartData.amount.times = []
        res.forEach(item => {
          lineChartData.amount.successData.push(item['num'])
          lineChartData.amount.times.push(item['times'])
        })
      }).catch(() => {})
      crudStatistics.orderLogsOfPre(2).then(res => {
        lineChartData.amount.failData = []
        res.forEach(item => {
          lineChartData.amount.failData.push(item['num'])
        })
      }).catch(() => {})
      // 每日(本月)
      crudStatistics.orderLogs(0).then(res => {
        lineChartData.amountOfPre.successData = []
        lineChartData.amountOfPre.times = []
        res.forEach(item => {
          lineChartData.amountOfPre.successData.push(item['num'])
          lineChartData.amountOfPre.times.push(item['times'])
        })
      }).catch(() => {})
      crudStatistics.orderLogs(2).then(res => {
        lineChartData.amountOfPre.failData = []
        res.forEach(item => {
          lineChartData.amountOfPre.failData.push(item['num'])
        })
      }).catch(() => {})
      // 每月
      crudStatistics.orderLogsOfMonth(0).then(res => {
        lineChartData.amountOfMonth.successData = []
        lineChartData.amountOfMonth.times = []
        res.forEach(item => {
          lineChartData.amountOfMonth.successData.push(item['num'])
          lineChartData.amountOfMonth.times.push(item['times'])
        })
      }).catch(() => {})
      crudStatistics.orderLogsOfMonth(2).then(res => {
        lineChartData.amountOfMonth.failData = []
        res.forEach(item => {
          lineChartData.amountOfMonth.failData.push(item['num'])
        })
      }).catch(() => {})
      // 每小时
      crudStatistics.orderLogsOfHour(0).then(res => {
        lineChartData.amountOfHour.successData = []
        lineChartData.amountOfHour.times = []
        res.forEach(item => {
          lineChartData.amountOfHour.successData.push(item['num'])
          lineChartData.amountOfHour.times.push(item['times'])
        })
      }).catch(() => {})
      crudStatistics.orderLogsOfHour(2).then(res => {
        lineChartData.amountOfHour.failData = []
        res.forEach(item => {
          lineChartData.amountOfHour.failData.push(item['num'])
        })
      }).catch(() => {})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
