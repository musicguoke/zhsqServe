<template>
  <div id="wrapper">
    <nav class="navbar">
      <div class="content-container navbar-container">
        <div class="navbar-header">
          <span class="navbar-brand"></span>
          <span class="navbar-title">重庆市综合市情管理系统—<small>管理平台</small></span>
        </div>
        <div class="navbar-right">
          <ul>
            <li class="navbar-list"><span>首页</span></li>
            <li class="navbar-list"><span>运行监控</span></li>
            <li class="navbar-list"><span>权限管理</span></li>
            <li class="navbar-list border-none"><span>目录管理</span></li>
          </ul>
          <div class="user-box">
            <div class="user-info">
              <span class="user-img"></span>
              <span class="user-name">超级管理员</span>
              <span class="msg-icon">
                <i>99+</i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <div class="content-container">
      <div class="content-header">
        <div class="data-count-item">
          <span class="item-content">
            <i class="item-title">系统用户数</i>
            <i>57<b>个</b></i>
          </span>
        </div>
        <div class="data-count-item">
          <span>
            <i>系统用户数</i>
            <i>57<b>个</b></i>
          </span>
        </div>
        <div class="data-count-item">
          <span>
            <i>系统用户数</i>
            <i>57<b>个</b></i>
          </span>
        </div>
        <div class="data-count-item">
          <span>
            <i>系统用户数</i>
            <i>57<b>个</b></i>
          </span>
        </div>
      </div>
      <div class="content-body">
        <div class="content-item">
          <span class="content-item-title">用户访问趋势</span>
          <div ref="userVisit" :style="{width: '100%', height: '300px'}"></div>
        </div>
        <div class="content-item right">
          <div class="item">
            <span class="content-item-title">服务巡检（{{new Date()}}）</span>
            <div ref="service" :style="{width: '100%', height: '300px'}"></div>
          </div>
          <div class="item">
            <span class="content-item-title">区县使用情况</span>
            <Table highlight-row ref="currentRowTable" :columns="columns3" :data="data1"></Table>
          </div>
        </div>
        <div class="content-item">
          <span class="content-item-title">部门使用排名</span>
          <div ref="department" :style="{width: '100%', height: '300px'}"></div>
        </div>
        <div class="content-item">
          <span class="content-item-title">服务使用排名</span>
          <div ref="serviceRank" :style="{width: '100%', height: '300px'}"></div>
        </div>
        <div class="content-item">
          <div class="item-top">
            <span class="content-item-title">反馈问题处理</span>
            <span class="more"></span>
          </div>
          <Table highlight-row ref="currentRowTable" :columns="columns3" :data="data1"></Table>
        </div>
        <div class="content-item">
          <div class="item-top">
            <span class="content-item-title">待审核资源</span>
            <span class="more"></span>
          </div>
          <Table highlight-row ref="currentRowTable" :columns="columns3" :data="data1"></Table>
        </div>
      </div>
    </div>
    <footer>
      <div class="content-container">
        <p>建设单位：重庆市地理信息中心 | 技术支持：重庆知行宏图科技有限公司</p>
        <p>邮箱：cqzhsq@qq.com | 联系电话：023-67033881 | 地址：重庆市渝北区冉家坝规划测绘创新基地1001室</p>
      </div>
    </footer>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  data() {
    return {
      columns3: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        }
      ],
      data1: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park'
        }
      ]
    }
  },
  mounted() {
    this.initChart()
    this.initPieChart()
    this.initBarChart()
    this.initServiceBarChart()
  },
  methods: {
    initChart() {
      var myChart = echarts.init(this.$refs.userVisit)
      // 绘制图表
      myChart.setOption({
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line'
        }]
      })
    },
    initPieChart() {
      var myChart = echarts.init(this.$refs.service)
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: 'horizontal',
          y: 'bottom',
          data: ['可用服务', '出错服务']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: 335, name: '可用服务' },
              { value: 310, name: '出错服务' }
            ]
          }
        ]
      })
    },
    initServiceBarChart() {
      var myChart = echarts.init(this.$refs.department)
      // 绘制图表
      myChart.setOption({
        legend: {
          data: ['支出', '收入']
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar'
        }]
      })
    },
    initBarChart() {
      var myChart = echarts.init(this.$refs.serviceRank)
      // 绘制图表
      myChart.setOption({
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar'
        }]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#wrapper {
  width: 100%;
  height: 100%;
  font-size: 14px;
  background-color: #f5f5f5;
}
.content-container {
  width: 1250px;
  margin: 0 auto;
}
.navbar {
  width: 100%;
  height: 90px;
  color: #fff;
  background-color: #2b9bda;
  .navbar-container {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .navbar-header {
    display: flex;
    align-items: center;
    .navbar-brand {
      display: block;
      width: 85px;
      height: 46px;
      background: url("../../assets/logo.png") no-repeat;
      background-size: 100%;
    }
    .navbar-title {
      font-size: 18px;
      font-weight: bold;
      margin-left: 14px;
    }
  }
  .navbar-right {
    display: flex;
  }
  ul {
    display: flex;
    align-items: center;
    .navbar-list {
      padding: 0 32px;
      border-right: 2px solid #fff;
      span {
        cursor: pointer;
      }
    }
    .border-none {
      border-right: 0;
    }
  }
  .user-box {
    display: flex;
  }
  .user-info {
    display: flex;
    align-items: center;
    .user-img {
      display: block;
      width: 39px;
      height: 39px;
      background-color: #fff;
      border-radius: 100%;
    }
    .user-name {
      font-weight: bold;
      margin-left: 10px;
      margin-right: 30px;
      position: relative;
      &:after {
        content: "";
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 6px solid #fff;
        position: absolute;
        top: 5px;
        right: -18px;
      }
    }
    .msg-icon {
      display: flex;
      width: 22px;
      height: 22px;
      background: url("../../assets/msg.png") no-repeat;
      background-size: 100%;
      position: relative;
      i {
        position: absolute;
        top: 0;
        left: 20px;
        display: block;
        font-size: 12px;
        background-color: #fd9828;
      }
    }
  }
}
.content-header {
  display: flex;
  justify-content: space-between;
  margin-top: 46px;
  margin-bottom: 20px;
  .data-count-item {
    width: 290px;
    height: 100px;
    background-color: #04a9fd;
    color: #fff;
  }
}
.content-body {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .content-item {
    width: 610px;
    padding: 25px 20px;
    margin-bottom: 20px;
    background-color: #fff;
  }
  .right {
    width: 610px;
    padding: 0;
    display: flex;
    justify-content: space-between;
    background-color: transparent;
    .item {
      width: 290px;
      padding: 25px 20px;
      background-color: #fff;
    }
  }
  .item-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .content-item-title {
    font-size: 16px;
    font-weight: bold;
    color: #003632;
  }
  .more {
    display: block;
    width: 31px;
    height: 4px;
    background: url('../../assets/more.png') no-repeat;
    background-size: 100%;
    cursor: pointer;
  }
}
footer {
  width: 100%;
  background-color: #4c5260;
  color: #fff;
  padding-top: 25px;
  padding-bottom: 22px;
  p {
    text-align: center;
  }
}
</style>
