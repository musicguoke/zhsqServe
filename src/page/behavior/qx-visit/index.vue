<template>
  <Content>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>资源管理</BreadcrumbItem>
      <BreadcrumbItem>用户访问</BreadcrumbItem>
    </Breadcrumb>
    <Card :style="{maxHeight: contentHeight}">
      <div id="service-analysis">
        <div class="head">
          <ul class="clearfix">
            <li class="head-item" v-for="(item, index) in tabs" :key="item.title" @click="getSearchDayData(index, item.day)" :class="{active:index===num}">
              {{item.title}}
            </li>
            <li class="date-box">
              <span>自定义日期:</span>
              <div class="block">
                <DatePicker :value="days" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="请选择开始结束时间" style="width: 200px" @on-change="getSearchDateData">
                </DatePicker>
              </div>
            </li>
          </ul>
          <div class="main">
            <div class="features clearfix">
              <span class="export" @click="export2excel">
                <span class="icon-download"></span>导出</span>
              <div class="breadcrumb">
                <span class="btn-item" v-for="(item, index) in btnTitle" :class="{active: 2 == index}" @click="getItemData(index)" :key="index">{{item}}</span>
              </div>
              <div class="search-box">
                <input type="search" class="search" v-model="searchContent" placeholder="搜索" />
                <span @click="search">搜索</span>
              </div>
            </div>
            <table border="1" style="table-layout: fixed;">
              <thead>
                <tr v-if="list">
                  <th>序号</th>
                  <th>区域名称</th>
                  <th>访问次数</th>
                </tr>
                <tr v-if="userList">
                  <th>序号</th>
                  <th>用户名称</th>
                  <th>访问次数</th>
                </tr>
                <tr v-if="visitList">
                  <th>序号</th>
                  <th>用户名称</th>
                  <th>系统名称</th>
                  <th>访问方式</th>
                  <th>数据名称</th>
                  <th>所属部门</th>
                  <th>访问时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="list" v-for="(item, index) in list" :key="index">
                  <td>{{index + params.start + 1}}</td>
                  <td>{{item.id}}</td>
                  <td class="hover" @click="getVisitTime(item.areacode)">{{item.total}}</td>
                </tr>
                <tr v-if="userList" v-for="(item, index) in userList" :key="index">
                  <td>{{index + params.start + 1}}</td>
                  <td>{{item.name}}</td>
                  <td class="hover" @click="getUserVisitTime(item.id)">{{item.total}}</td>
                </tr>
                <tr v-if="visitList" v-for="(item, index) in visitList" :key="index">
                  <td>{{index + params.start + 1}}</td>
                  <td>{{item.userName}}</td>
                  <td>{{item.sysName}}</td>
                  <td>{{item.visitType}}</td>
                  <td>{{item.visitName}}</td>
                  <td>{{item.branchName}}</td>
                  <td>{{format(item.visitTime)}}</td>
                </tr>
              </tbody>
            </table>
            <div class="pagination">
              <Page
                :total="total"
                :current.sync="currentPage"
                @on-change="handleList"
              >
              </Page>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </Content>
</template>

<script>
import { dayQxLogData, qxUserLogData, dateUserLogData } from '@/api/service-data'
export default {
  data() {
    return {
      searchContent: '',
      contentHeight: window.innerHeight - 174 + 'px',
      btnTitle: ['用户排行', '部门排行', '区县排行', '系统版本排行', '软件版本排行'],
      tabs: [
        { title: '全部', day: '-1' },
        { title: '今日', day: '0' },
        { title: '昨日', day: '1' },
        { title: '最近7日', day: '7' },
        { title: '最近30日', day: '30' }
      ],
      list: null,
      userList: null,
      visitList: null,
      total: '',
      currentPage: 1,
      num: '',
      areacode: '',
      params: {
        startDate: '',
        endDate: '',
        start: 0,
        rows: 10,
        type: 2
      }
    }
  },
  created() {
    this._getQxData(this.params)
  },
  methods: {
    add0(m) {
      return m < 10 ? '0' + m : m
    },
    format(time1) {
      let time = new Date(time1 * 1000)
      let y = time.getFullYear()
      let m = time.getMonth() + 1
      let d = time.getDate()
      let h = time.getHours()
      let mm = time.getMinutes()
      let s = time.getSeconds()
      return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
    },
    export2excel() {

    },
    getSearchDayData(index, day) {
      this.num = index
      if (day == -1) {
        this.params.endDate = ''
        this.params.startDate = ''
        this.handleList()
      } else {
        let now = new Date()
        this.params.endDate = this.currentTime
        this.params.startDate = this.cc(day)
        this.handleList()
      }
    },
    getSearchDateData() {
      console.log(1)
    },
    handleList(value) {
      let val = value || 1
      this.params.start = (val - 1) * 10
      if(this.list) {
        this._getQxData(this.params)
      } else if(this.userList) {
        this.params.type = 1
        this.params.areacode = this.areacode
        this._qxUserLogData(this.params)
      } else if(this.visitList) {
        this.params.type = 1
        this._dateUserLogData(this.params)
      }
    },
    getItemData(index) {
      this.$router.push({
        path: `user-statistics`,
        query: {
          id: index
        }
      })
    },
    search() {
      console.log(1)
    },
    getVisitTime(areacode) {
      this.areacode = areacode
      let data = {
        areacode: areacode
      }
      this._qxUserLogData(Object.assign({}, data, this.params))
    },
    getUserVisitTime(id) {
      let data = {
        userId: id
      }
      this._dateUserLogData(Object.assign({}, data, this.params))
    },
    _getQxData(data) {
      dayQxLogData(data).then(res => {
        this.userList = this.visitList = null
        this.list = res.data.data
        this.total = res.data.total
      })
    },
    _qxUserLogData(data) {
      qxUserLogData(data).then(res => {
        this.list = this.visitList = null
        this.userList = res.data.data
        this.total = res.data.total
      })
    },
    _dateUserLogData(data) {
      dateUserLogData(data).then(res => {
        this.list = this.userList = null
        this.visitList = res.data.data
        this.total = res.data.total
      })
    }
  }
}
</script>

<style scoped>
@import "../style.scss";
</style>
