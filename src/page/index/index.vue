<template>
  <Content>
    <Card style="margin: 17px 0">
      <div class="card-content">
        <div class="data-content">
          <div class="data-item">
            <div class="item">
              <span class="i-icon user-icon"></span>
              <div class="num">
                <p class="num-title">用户数量</p>
                <i>
                  <span class="num-green">{{result.user}}</span>
                  <b>人</b>
                </i>
              </div>
            </div>
            <div class="item">
              <span class="i-icon login-icon"></span>
              <div class="num">
                <p class="num-title">累计用户登陆次数</p>
                <i>
                  <span class="num-green">{{accessResult.login}}</span>
                  <b>次</b>
                </i>
              </div>
            </div>
          </div>
          <div class="data-item">
            <div class="item">
              <span class="i-icon data-icon"></span>
              <div class="num">
                <p class="num-title">图层数量</p>
                <i>
                  <span class="num-blue">{{result.data}}</span>
                  <b>条</b>
                </i>
              </div>
            </div>
            <div class="item">
              <span class="i-icon visit-icon"></span>
              <div class="num">
                <p class="num-title">累计数据调用次数</p>
                <i>
                  <span class="num-blue">{{accessResult.access}}</span>
                  <b>次</b>
                </i>
              </div>
            </div>
          </div>
          <div class="data-item">
            <div class="item">
              <span class="i-icon qx-icon"></span>
              <div class="num">
                <p class="num-title">区县数量</p>
                <i>
                  <span class="num-green">{{result.county}}</span>
                  <b>个</b>
                </i>
              </div>
            </div>
            <div class="item">
              <span class="i-icon sys-icon"></span>
              <div class="num">
                <p class="num-title">应用系统数量</p>
                <i>
                  <span class="num-blue">{{accessResult.system}}</span>
                  <b>个</b>
                </i>
              </div>
            </div>

          </div>
          <div class="data-item">
            <div class="item">
              <span class="i-icon login-icon"></span>
              <div class="num">
                <p class="num-title">今日用户登陆次数</p>
                <i>
                  <span class="num-green">{{accessResult.todayUser}}</span>
                  <b>次</b>
                </i>
              </div>
            </div>
            <div class="item">
              <span class="i-icon visit-icon"></span>
              <div class="num">
                <p class="num-title">今日数据调用次数</p>
                <i>
                  <span class="num-blue">{{accessResult.todayLogin}}</span>
                  <b>个</b>
                </i>
              </div>
            </div>
          </div>
          <!-- <div class="data-item data-right">
            <div class="item">
              <span class="item-title">今日动态</span>
              <span class="num user-num">
                <span class="num-title">用户访问：</span>
                <i>{{accessResult.todayUser}}
                  <b>人</b>
                </i>
              </span>
              <span class="num data-num">
                <span class="num-title">数据访问：</span>
                <i>{{accessResult.todayLogin}}
                  <b>条</b>
                </i>
              </span>
            </div>
          </div> -->
        </div>
        <div class="banner" ref="ebox"></div>
        <div class="data-content data-bot">
          <div class="data-item">
            <span class="item-title">终端分布</span>
            <div class="circle" ref="cbox"></div>
          </div>
          <div class="data-item">
            <span class="item-title">终端系统分布</span>
            <div class="circle" ref="cSysBox"></div>
          </div>
        </div>
        <div class="data-content data-bot">
          <div class="data-item data-table-item">
            <span class="item-title">系统运行状态</span>
            <div class="item-table">
              <Table border height="258" :row-class-name="rowClassName" :columns="columns1" :data="data1"></Table>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </Content>
</template>

<script>
import { getIndex, getLogStatistics, getMetaUrl } from '@/api/service'

export default {
  data() {
    return {
      contentHeight: window.innerHeight - 137 + 'px',
      columns1: [
        {
          title: '系统编码',
          key: 'systemCode'
        },
        {
          title: '系统名称',
          key: 'systemName'
        },
        {
          title: '正常（%）',
          key: 'successRate',
          className: 'normal-column'
        },
        {
          title: '异常',
          key: 'errorSize',
          className: 'error-column'
        },
        {
          title: '总量',
          key: 'totalSize',
          className: 'total-column'
        }
      ],
      data1: [],
      result: [],
      accessResult: {},
      dateArray: [],
      dataArray: [],
      loginArray: []
    }
  },
  mounted() {
    this._getIndex()
    this._getMetaUrl()
    this._getLogStatistics()
  },
  methods: {
    rowClassName(row, index) {
      if (index === 3) {
        return 'demo-table-error-row'
      }
      return ''
    },
    lineInitial() {
      var myChart = echarts.init(this.$refs.ebox);
      var option = {
        title: {
          // text: '系统访问趋势',
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
          textStyle: {
            color: '#fff',
            fontWeight: 'normal'
          },
          data: ['登录', '数据']
        },
        grid: {
          left: '5%',
          right: '5%',
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
              length: 1,
              show: false
            },
            data: this.dateArray.reverse()
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '登录',
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
          },
          {
            type: 'value',
            name: '数据',
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
            name: '登录',
            type: 'line',
            smooth: true,
            symbol: '',
            yAxisIndex: 0,
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
            data: this.loginArray.reverse()
          },
          {
            name: '数据',
            type: 'line',
            smooth: true,
            yAxisIndex: 1,
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
            data: this.dataArray.reverse()
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
          formatter: "{b}: {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          itemWidth: 20,
          itemHeight: 20,
          top: '25%',
          left: '12%',
          textStyle: {
            fontSize: '20'
          },
          data: ['PAD', 'Phone', 'PC']
        },
        series: [
          {
            type: 'pie',
            center: ['70%', '50%'],
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
                value: this.result.android_pad + this.result.ios_ipad,
                name: 'PAD',
                itemStyle: {
                  normal: {
                    color: '#f2637b'
                  }
                }
              },
              {
                value: this.result.ios_iphone + this.result.android_phone,
                name: 'Phone',
                itemStyle: {
                  normal: {
                    color: '#3aa0ff'
                  }
                }
              },
              {
                value: this.result.pc,
                name: 'PC',
                itemStyle: {
                  normal: {
                    color: '#fad337'
                  }
                }
              },
            ]
          }
        ]
      }
      myChart.setOption(option)
    },
    pie1Initial() {
      var myChart = echarts.init(this.$refs.cSysBox)
      var option = {
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: '7%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: ['IOS', 'Android'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '直接访问',
            type: 'bar',
            barWidth: '60%',
            data: [
              { value: this.result.ios_iphone + this.result.ios_ipad, name: 'IOS' },
              { value: this.result.android_phone + this.result.android_pad, name: 'Android' }
            ]
          }
        ]
      }
      myChart.setOption(option)
    },
    _getIndex() {
      getIndex().then(res => {
        if (res.code === 20000) {
          this.accessResult = res.data.aceessStatistical
          this.result = res.data
          this.pieInitial()
          this.pie1Initial()
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _getMetaUrl() {
      getMetaUrl().then(res => {
        if (res.code === 20000 && res.data) {
          res.data.result.map(v => {
            v.cellClassName = {
              errorSize: 'demo-table-info-cell-age'
            }
          })
          this.data1 = res.data.result
        }
      })
    },
    _getLogStatistics() {
      getLogStatistics().then(res => {
        if (res.code === 20000 && res.data) {
          this.dateArray = []
          this.dataArray = []
          this.loginArray = []
          res.data.barChart.map(v => {
            this.dateArray.push(v.date)
            this.dataArray.push(v.data.data)
            this.loginArray.push(v.data.login)
          })
          this.lineInitial()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.banner {
  width: 100%;
  height: 300px;
  margin: 17px 0;
  background-color: #4a7fcf;
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
    display: block;
    text-align: center;
    font-size: 16px;
    line-height: 60px;
    border-bottom: 1px solid #d8dcdf;
    background-color: #f7faff;
  }
  .item .i-icon {
    display: block;
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
    overflow: hidden;
  }
  .data-table-item {
    justify-content: flex-start;
    width: 100%;
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
  height: 100%;
  padding: 20px 15px 40px 15px;
}
</style>

