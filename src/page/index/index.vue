<template>
  <Content>
    <Card>
      <div class="card-content">
        <div class="banner" ref="ebox"></div>
        <div class="container">
          <div class="data-content">
            <div class="data-item">
              <div class="item">
                <span class="icon"></span>
                <div class="num">
                  <p class="num-title">用户总数</p>
                  <i>998
                    <b>人</b>
                  </i>
                </div>
              </div>
              <div class="item">
                <span class="icon"></span>
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
                <span class="icon"></span>
                <div class="num">
                  <p class="num-title">数据总量</p>
                  <i>998
                    <b>人</b>
                  </i>
                </div>
              </div>
              <div class="item">
                <span class="icon"></span>
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
                <span class="icon"></span>
                <div class="num">
                  <p class="num-title">累计登陆</p>
                  <i>998
                    <b>人</b>
                  </i>
                </div>
              </div>
              <div class="item">
                <span class="icon"></span>
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
            </div>
            <div class="data-item">
              <span class="item-title">系统运行状态</span>
              <span class="more">更多>></span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </Content>
</template>

<script>
import * as echarts from 'echarts'

export default {
  mounted() {
    this.lineInitial()
  },
  methods: {
    lineInitial() {
      var myChart = echarts.init(this.$refs.ebox);
      var option = {
        title: {
          text: '系统访问趋势',
          // subtext: '纯属虚构'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['意向', '预购', '成交']
        },
        // toolbox: {
        //   show: true,
        //   feature: {
        //     mark: { show: true },
        //     dataView: { show: true, readOnly: false },
        //     magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
        //     restore: { show: true },
        //     saveAsImage: { show: true }
        //   }
        // },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '成交',
            type: 'line',
            smooth: true,
            symbol: '',
            itemStyle: { normal: { areaStyle: { type: 'default' } } },
            data: [10, 12, 21, 54, 260, 830, 710]
          },
          {
            name: '预购',
            type: 'line',
            smooth: true,
            itemStyle: { normal: { areaStyle: { type: 'default' } } },
            data: [30, 182, 434, 791, 390, 30, 10]
          },
          {
            name: '意向',
            type: 'line',
            smooth: true,
            itemStyle: { normal: { areaStyle: { type: 'default' } } },
            data: [1320, 1132, 601, 234, 120, 90, 20]
          }
        ]
      }

      myChart.setOption(option)
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
    background: url(../../assets/logo.png) #f7faff no-repeat center;
    background-size: 55px 55px;
    border-right: 1px solid #d8dcdf;
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
    background-color: #fff;
    border: 1px solid #d8dcdf;
    border-radius: 2px;
    position: relative;
  }
  .more {
    position: absolute;
    right: 20px;
    top: 20px;
  }
}
</style>

