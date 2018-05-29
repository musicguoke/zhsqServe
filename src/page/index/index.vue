<template>
  <Content>
    <Card>
      <div class="card-content">
        <div class="banner" ref="ebox"></div>
        <div class="data-content">
          <div class="data-item">
            <div class="item">
              <span class="icon user-icon"></span>
              <div class="num">
                <p class="num-title">用户总数</p>
                <i>998
                  <b>人</b>
                </i>
              </div>
            </div>
            <div class="item">
              <span class="icon visit-icon"></span>
              <div class="num">
                <p class="num-title">累计访问次数</p>
                <i>998
                  <b>人</b>
                </i>
              </div>
            </div>
          </div>
          <div class="data-item">
            <div class="item">
              <span class="icon data-icon"></span>
              <div class="num">
                <p class="num-title">数据总量</p>
                <i>998
                  <b>人</b>
                </i>
              </div>
            </div>
            <div class="item">
              <span class="icon qx-icon"></span>
              <div class="num">
                <p class="num-title">部署区县</p>
                <i>998
                  <b>人</b>
                </i>
              </div>
            </div>
          </div>
          <div class="data-item">
            <div class="item">
              <span class="icon login-icon"></span>
              <div class="num">
                <p class="num-title">累计登陆</p>
                <i>998
                  <b>人</b>
                </i>
              </div>
            </div>
            <div class="item">
              <span class="icon sys-icon"></span>
              <div class="num">
                <p class="num-title">系统数量</p>
                <i>998
                  <b>人</b>
                </i>
              </div>
            </div>
          </div>
          <div class="data-item data-right">
            <div class="item">
              <span class="item-title">今日动态</span>
              <span class="num user-num">
                <span class="num-title">用户访问：</span>
                <i>998
                  <b>人</b>
                </i>
              </span>
              <span class="num data-num">
                <span class="num-title">数据访问：</span>
                <i>998
                  <b>人</b>
                </i>
              </span>
            </div>
          </div>
        </div>
        <div class="data-content data-bot">
          <div class="data-item">
            <span class="item-title">终端分布</span>
            <div class="circle" ref="cbox"></div>
          </div>
          <div class="data-item">
            <span class="item-title">系统运行状态</span>
            <span class="more">更多>></span>
            <div class="item-table">
              <Table :row-class-name="rowClassName" :columns="columns1" :data="data1"></Table>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </Content>
</template>

<script>
import * as echarts from 'echarts'
import { getIndex } from '@/api/service'

export default {
  data() {
    return {
      columns1: [
        {
          title: '服务器名称',
          key: 'name'
        },
        {
          title: '状态',
          key: 'status'
        },
        {
          title: '时间',
          key: 'date'
        }
      ],
      data1: [
        {
          name: 'John Brown',
          status: 18,
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          status: 24,
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          status: 30,
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          status: 26,
          date: '2016-10-04'
        }
      ],
    }
  },
  mounted() {
    this._getIndex()
    this.lineInitial()
    this.pieInitial()
  },
  methods: {
    rowClassName(row, index) {
      if (index === 3) {
        return 'demo-table-error-row';
      }
      return '';
    },
    lineInitial() {
      var myChart = echarts.init(this.$refs.ebox);
      var option = {
        title: {
          text: '系统访问趋势',
          // subtext: '纯属虚构',
          top: 10,
          left: 10,
          textStyle: {
            color: '#fff',
            fontWeight: 'normal'
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          icon: 'rect',
          itemWidth: 10,
          itemHeight: 10,
          right: 10,
          top: 10,
          textStyle: {
            color: '#fff',
            fontWeight: 'normal'
          },
          data: ['预购', '成交']
        },
        grid: {
          left: '5%',
          right: '2%',
          bottom: '15%'
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '成交',
            type: 'line',
            smooth: true,
            symbol: '',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#89e636' },
                    { offset: 0.5, color: '#7ed94d' },
                    { offset: 1, color: '#8ee064' }
                  ]
                )
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#5aa3b6' },
                    { offset: 0.5, color: '#5ea7b0' },
                    { offset: 1, color: '#71b994' }
                  ]
                )
              }
            },
            data: [400, 342, 576, 123, 342, 423, 710]
          },
          {
            name: '预购',
            type: 'line',
            smooth: true,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#59b0f7' },
                    { offset: 0.5, color: '#4795dd' },
                    { offset: 1, color: '#37b4ec' }
                  ]
                )
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#4a88d1' },
                    { offset: 0.5, color: '#4b98e8' },
                    { offset: 1, color: '#43a9e5' }
                  ]
                )
              }
            },
            data: [200, 182, 434, 791, 390, 30, 10]
          }
        ]
      }
      myChart.setOption(option)
    },
    pieInitial() {
      var myChart = echarts.init(this.$refs.cbox)
      var option = {
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          itemWidth: 10,
          itemHeight: 10,
          top: '30%',
          left: '12%',
          data: ['iPhone', 'iPad', 'PC', 'Android Phone', 'Android Pad']
        },
        series: [
          {
            name: 'iPhone',
            type: 'pie',
            radius: ['35%', '70%'],
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
            itemStyle: {
              normal: {
                borderColor: "#FFF",
                borderWidth: 5
              }
            },
            data: [
              {
                value: 335,
                name: 'iPhone',
                itemStyle: {
                  normal: {
                    color: 'rgb(1,175,80)'
                  }

                }
              },
              { value: 310, name: 'iPad' },
              { value: 234, name: 'PC' },
              { value: 135, name: 'Android Phone' },
              { value: 1548, name: 'Android Pad' }
            ]
          }
        ]
      }
      myChart.setOption(option)
    },
    _getIndex() {
      getIndex().then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.banner {
  width: 100%;
  height: 300px;
  margin-bottom: 17px;
  background-color: #4a7fcf;
}
.ivu-table .demo-table-error-row td {
  background-color: #ff6600;
  color: #fff;
}
.data-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  .data-item {
    width: 23%;
    height: 170px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #5a5a5a;
  }
  .item {
    display: flex;
    height: 80px;
    background-color: #fff;
    border: 1px solid #d8dcdf;
    border-radius: 2px;
  }
  .item-title {
    text-align: center;
    font-size: 16px;
    line-height: 60px;
    border-bottom: 1px solid #d8dcdf;
    background-color: #f7faff;
  }
  .item .icon {
    width: 108px;
    border-right: 1px solid #d8dcdf;
  }
  .user-icon {
    background: url(../../assets/user.png) #f7faff no-repeat center;
    background-size: 55px 55px;
  }
  .visit-icon {
    background: url(../../assets/visit.png) #f7faff no-repeat center;
    background-size: 60px 55px;
  }
  .data-icon {
    background: url(../../assets/data.png) #f7faff no-repeat center;
    background-size: 55px 55px;
  }
  .qx-icon {
    background: url(../../assets/qx.png) #f7faff no-repeat center;
    background-size: 60px 55px;
  }
  .login-icon {
    background: url(../../assets/login.png) #f7faff no-repeat center;
    background-size: 55px 55px;
  }
  .sys-icon {
    background: url(../../assets/sys.png) #f7faff no-repeat center;
    background-size: 60px 55px;
  }
  .num {
    padding-top: 16px;
    padding-left: 20px;
  }
  .num .num-title {
    font-size: 16px;
  }
  .num i {
    font-size: 18px;
    font-style: italic;
  }
  .num b {
    font-size: 12px;
    font-style: normal;
  }
  .data-right .item {
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    span {
      width: 100%;
      height: 33.33%;
      line-height: 60px;
    }
    .num {
      padding: 0;
      text-align: center;
    }
    .user-num {
      border-bottom: 1px dashed #d8dcdf;
    }
    .user-num i {
      font-weight: bold;
      color: #1979df;
    }
    .data-num i {
      font-weight: bold;
      color: #43c815;
    }
  }
}
.data-bot {
  margin-top: 23px;
  .data-item {
    width: 48.6%;
    height: 360px;
    background-color: #fff;
    border: 1px solid #d8dcdf;
    border-radius: 2px;
    position: relative;
  }
  .circle {
    height: 300px;
  }
  .more {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
.item-table {
  padding: 0 15px;
  padding-bottom: 40px;
}
</style>

