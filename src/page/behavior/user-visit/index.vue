<template>
  <Content>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>资源管理</BreadcrumbItem>
      <BreadcrumbItem>资源列表</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <div id="service-analysis">
        <div class="head">
          <ul class="clearfix" v-if="config.search && !config.userId">
            <li class="head-item" v-for="(item, index) in tabs" :key="item.title" @click="getSearchDayData(index, item.day)" :class="{active:index===num}">
              {{item.title}}
            </li>
            <li class="date-box">
              <span>自定义日期:</span>
              <div class="block">
                <DatePicker :value="days" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="请选择开始结束时间" style="width: 200px" @on-change="getSearchDateData"></DatePicker>
              </div>
            </li>
          </ul>
          <ul class="clearfix" v-else-if="config.bId && config.userId">
            <li class="head-item" v-for="(item, index) in tabs" :key="item.title" @click="getBidandUserIdDayData(index, item.day)" :class="{active:index===num}">
              {{item.title}}
            </li>
            <li class="date-box">
              <span>自定义日期:</span>
              <div class="block">
                <DatePicker :value="days" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="请选择开始结束时间" style="width: 200px" @on-change="getBidandUserIdDateData"></DatePicker>
              </div>
            </li>
          </ul>
          <ul class="clearfix" v-else-if="config.bId && !config.userId">
            <li class="head-item" v-for="(item, index) in tabs" :key="item.title" @click="getBidDayData(index, item.day)" :class="{active:index===num}">
              {{item.title}}
            </li>
            <li class="date-box">
              <span>自定义日期:</span>
              <div class="block">
                <DatePicker :value="days" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="请选择开始结束时间" style="width: 200px" @on-change="getBidDateData"></DatePicker>
              </div>
            </li>
          </ul>
          <ul class="clearfix" v-else-if="config.userId && !config.bId">
            <li class="head-item" v-for="(item, index) in tabs" :key="item.title" @click="getUserIdDayData(index, item.day)" :class="{active:index===num}">
              {{item.title}}
            </li>
            <li class="date-box">
              <span>自定义日期:</span>
              <div class="block">
                <DatePicker :value="days" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="请选择开始结束时间" style="width: 200px" @on-change="getUserIdDateData"></DatePicker>
              </div>
            </li>
          </ul>
          <ul class="clearfix" v-else-if="config.sysVersion">
            <li class="head-item" v-for="(item, index) in tabs" :key="item.title" @click="getSysVersionDayData(index, item.day)" :class="{active:index===num}">
              {{item.title}}
            </li>
            <li class="date-box">
              <span>自定义日期:</span>
              <div class="block">
                <DatePicker :value="days" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="请选择开始结束时间" style="width: 200px" @on-change="getSysVersionDateData"></DatePicker>
              </div>
            </li>
          </ul>
          <ul class="clearfix" v-else-if="config.softVersion">
            <li class="head-item" v-for="(item, index) in tabs" :key="item.title" @click="getSoftVersionDayData(index, item.day)" :class="{active:index===num}">
              {{item.title}}
            </li>
            <li class="date-box">
              <span>自定义日期:</span>
              <div class="block">
                <DatePicker :value="days" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="请选择开始结束时间" style="width: 200px" @on-change="getSoftVersionDateData"></DatePicker>
              </div>
            </li>
          </ul>
          <ul class="clearfix" v-else>
            <li class="head-item" v-for="(item, index) in tabs" :key="item.title" @click="getDayData(index, item.day)" :class="{active:index===num}">
              {{item.title}}
            </li>
            <li class="date-box">
              <span>自定义日期:</span>
              <div class="block">
                <DatePicker :value="days" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="请选择开始结束时间" style="width: 200px" @on-change="getDateData"></DatePicker>
              </div>
            </li>
          </ul>
        </div>
        <div class="main">
          <div class="features clearfix">
            <span class="export" @click="export2excel">
              <span class="icon-download"></span>导出</span>
            <div class="breadcrumb">
              <span class="btn-item" v-for="(item, index) in btnTitle" :class="{active: cur == index}" @click="getItemData(index)">{{item}}</span>
            </div>
            <div class="search-box">
              <input type="search" class="search" v-model="searchContent" placeholder="搜索" />
              <span @click="search">搜索</span>
            </div>
          </div>
          <table border="1" style="table-layout: fixed;">
            <thead>
              <tr v-if="data.length > 0" class="three">
                <th>序号
                  <i class="icon-sort"></i>
                </th>
                <th v-if="type == 4">系统版本
                  <i class="icon-sort"></i>
                </th>
                <th v-else-if="type == 5">软件版本
                  <i class="icon-sort"></i>
                </th>
                <th v-if="type == 1 || type == 2 && departmentObj == null">部门名称
                  <i class="icon-sort"></i>
                </th>
                <th v-if="type == 2">用户名
                  <i class="icon-sort"></i>
                </th>
                <th v-if="type == 2 && departmentObj !== null">部门
                  <i class="icon-sort"></i>
                </th>
                <th v-if="type == 2 && dataObj !== null">软件版本
                  <i class="icon-sort"></i>
                </th>
                <th v-else-if="type == 2 && dataObj !== null">系统版本
                  <i class="icon-sort"></i>
                </th>
                <th v-if="type == 3 && userObj !== null">用户名
                  <i class="icon-sort"></i>
                </th>
                <th v-if="type == 3 && userObj !== null">数据名称
                  <i class="icon-sort"></i>
                </th>
                <th v-if="type == 3 && userObj !== null">数据编码
                  <i class="icon-sort"></i>
                </th>
                <th>访问次数
                  <i class="icon-sort"></i>
                </th>
              </tr>
              <tr v-else>
                <th>序号
                  <i class="icon-sort"></i>
                </th>
                <th>用户名
                  <i class="icon-sort"></i>
                </th>
                <th>系统名称
                  <i class="icon-sort"></i>
                </th>
                <th v-if="type == 1">数据名称
                  <i class="icon-sort"></i>
                </th>
                <th>访问方式
                  <i class="icon-sort"></i>
                </th>
                <th v-if="type == 2">系统版本
                  <i class="icon-sort"></i>
                </th>
                <th v-if="type == 2">软件版本
                  <i class="icon-sort"></i>
                </th>
                <th>所在部门
                  <i class="icon-sort"></i>
                </th>
                <th>访问时间
                  <i class="icon-sort"></i>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in data">
                <td>{{index + params.start + 1}}</td>
                <td v-if="type == 4 || type == 5">{{item.id}}</td>
                <td v-if="type == 2 && departmentObj == null">{{item.branch}}</td>
                <td v-if="type == 1" class="hover" @click="getDepartment(item.id, item.name)">{{item.name}}</td>
                <td v-else-if="type == 2">{{item.name}}</td>
                <td v-if="type == 2 && departmentObj !== null">{{departmentObj.name}}
                  <i class="icon-sort"></i>
                </td>
                <td v-if="type == 2 && dataObj !== null && dataObj.softVersion">{{dataObj.softVersion}}
                  <i class="icon-sort"></i>
                </td>
                <td v-else-if="type == 2 && dataObj !== null && dataObj.sysVersion">{{dataObj.sysVersion}}
                  <i class="icon-sort"></i>
                </td>
                <td v-if="type == 3 && userObj !== null">{{userObj.name}}
                  <i class="icon-sort"></i>
                </td>
                <td v-if="type == 3 && userObj !== null">{{item.name}}
                  <i class="icon-sort"></i>
                </td>
                <td v-if="type == 3 && userObj !== null">{{item.id}}
                  <i class="icon-sort"></i>
                </td>
                <td v-if="type == 2 && dataObj !== null" class="hover" @click="getvisitobj(item.id, item.type, item.name)">{{item.total}}
                  <i class="icon-sort"></i>
                </td>
                <td v-else-if="type == 3 && userObj !== null" class="hover" @click="getuserobj(item.id, item.type, item.name)">{{item.total}}
                  <i class="icon-sort"></i>
                </td>
                <td v-else class="hover" @click="getVisitTimes(item.id, item.type, item.name)">{{item.total}}</td>
              </tr>
              <tr v-for="(item, index) in userData">
                <td>{{index + params.start + 1}}</td>
                <td>{{item.arTrueName}}</td>
                <td>{{item.system}}</td>
                <td v-if="type == 1">{{item.visitName}}</td>
                <td>{{item.visitType}}</td>
                <td v-if="type == 2">{{item.sysVersion}}</td>
                <td v-if="type == 2">{{item.softVersion}}</td>
                <td>{{item.arBranchName}}</td>
                <td>{{format(item.visitTime)}}</td>
              </tr>
            </tbody>
          </table>
          <div class="block pagination">
            <Page v-if="config.search && !config.userId" :total="total" :current.sync="currentPage" @on-change="handleSearch"></Page>
            <Page v-else-if="config.bId && config.userId" :total="total" :current.sync="currentPage" @on-change="handleBidandUserId"></Page>
            <Page v-else-if="config.bId && !config.userId" :total="total" :current.sync="currentPage" @on-change="handleBid"></Page>
            <Page v-else-if="config.userId && !config.bId" :total="total" :current.sync="currentPage" @on-change="handleUserId"></Page>
            <Page v-else-if="config.sysVersion" :total="total" :current.sync="currentPage" @on-change="handleSysVersion"></Page>
            <Page v-else-if="config.softVersion" :total="total" :current.sync="currentPage" @on-change="handleSoftVersion"></Page>
            <Page v-else :total="total" :current.sync="currentPage" @on-change="handleCurrentChange"></Page>
          </div>
        </div>
      </div>
    </Card>
  </Content>
</template>
<script>
import { dayData, dateData, dayLogData, dateLogData, dayUserLogData, dateUserLogData, getDataCount, filterCommon, getSysGroup, getSoftGroup, getUserGroupSearchByDate, getBranchSearchByDate } from '@/api/service-data'

export default {
  name: 'service-analysis',
  data: function () {
    return {
      tabs: [
        { title: '全部', day: '-1' },
        { title: '今日', day: '0' },
        { title: '昨日', day: '1' },
        { title: '最近7日', day: '7' },
        { title: '最近30日', day: '30' }
      ],
      btnTitle: ['用户排行', '部门排行', '系统版本排行', '软件版本排行'],
      num: 0,
      days: '',
      currentDays: 30,
      data: [],
      userData: [],
      type: '',
      total: 0,
      obj: {},
      departmentObj: null,
      dataObj: null,
      userObj: null,
      cur: 0,
      params: {
        startDate: '',
        endDate: '',
        start: 0,
        rows: 10
      },
      config: {
        bId: '',
        userId: '',
        sysVersion: '',
        softVersion: '',
        search: ''
      },
      currentPage: 1,
      searchContent: ''
    }
  },
  computed: {
    currentTime() {
      let now = new Date()
      return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
    }
  },
  created() {
    this.getItemData()
  },
  methods: {
    export2excel() {
      let wb = XLSX.utils.table_to_book(document.getElementById('out-table'))
      let wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' })

      saveAs(new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }), 'sheet.xlsx')
    },
    s2ab(s) {
      if (typeof ArrayBuffer !== 'undefined') {
        let buf = new ArrayBuffer(s.length)
        let view = new Uint8Array(buf)
        for (let i = 0; i != s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      } else {
        let buf = new ArrayBuffer(s.length)
        for (let i = 0; i != s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
      }
    },
    search() {
      const data = {
        type: 1
      }
      this.config.search = this.searchContent
      if (this.cur == 0) {
        this._getUserGroupSearchByDate(Object.assign({}, this.config, this.params, data))
      } else if (this.cur == 1) {
        this._getBranchSearchByDate(Object.assign({}, this.config, this.params, data))
      }
    },
    getItemData(index) {
      this.cur = index || 0
      this.currentPage = 1
      this.departmentObj = null
      this.dataObj = null
      this.userObj = null
      this.config = {
        userId: '',
        visitCode: '',
        bId: '',
        search: ''
      }
      this.params.start = 0
      if (this.cur == 0) {
        const data = {
          type: 1
        }
        this._filterCommon(Object.assign({}, this.params, data))
      } else if (this.cur == 1) {
        const data = {
          type: 1,
          bId: -1
        }
        this._getDateData(Object.assign({}, this.params, data))
      } else if (this.cur == 2) {
        this._getSysGroup(this.params)
      } else if (this.cur == 3) {
        this._getSoftGroup(this.params)
      }
    },
    getItemDataPage(index) {
      this.cur = index || 0
      this.config = {
        userId: '',
        visitCode: '',
        bId: '',
        search: ''
      }
      if (this.cur == 0) {
        const data = {
          type: 1
        }
        this._filterCommon(Object.assign({}, this.params, data))
      } else if (this.cur == 1) {
        const data = {
          type: 1,
          bId: -1
        }
        this._getDateData(Object.assign({}, this.params, data))
      } else if (this.cur == 2) {
        this._getSysGroup(this.params)
      } else if (this.cur == 3) {
        this._getSoftGroup(this.params)
      }
    },
    getDateData(date) {
      let d = this.days
      this.params.startDate = date[0]
      this.params.endDate = date[1]
      this.getItemDataPage(this.cur)
    },
    getDayData(index, day) {
      this.num = index
      if (day == -1) {
        this.params.endDate = ''
        this.params.startDate = ''
        this.getItemDataPage(this.cur)
      } else {
        let now = new Date()
        this.params.endDate = this.currentTime
        this.params.startDate = this.cc(day)
        this.getItemDataPage(this.cur)
      }
    },
    getUserIdDayData(index, day) {
      this.num = index
      if (day == -1) {
        this.params.endDate = ''
        this.params.startDate = ''
        this.handleUserId()
      } else {
        let now = new Date()
        this.params.endDate = this.currentTime
        this.params.startDate = this.cc(day)
        this.handleUserId()
      }
    },
    getUserIdDateData(date) {
      let d = this.days
      this.params.startDate = date[0]
      this.params.endDate = date[1]
      this.handleUserId()
    },
    getSearchDayData(index, day) {
      this.num = index
      if (day == -1) {
        this.params.endDate = ''
        this.params.startDate = ''
        this.handleSearch()
      } else {
        let now = new Date()
        this.params.endDate = this.currentTime
        this.params.startDate = this.cc(day)
        this.handleSearch()
      }
    },
    getSearchDateData(date) {
      let d = this.days
      this.params.startDate = date[0]
      this.params.endDate = date[1]
      this.handleSearch()
    },
    getBidandUserIdDayData(index, day) {
      this.num = index
      if (day == -1) {
        this.params.endDate = ''
        this.params.startDate = ''
        this.handleBidandUserId()
      } else {
        let now = new Date()
        this.params.endDate = this.currentTime
        this.params.startDate = this.cc(day)
        this.handleBidandUserId()
      }
    },
    getBidandUserIdDateData(date) {
      let d = this.days
      this.params.startDate = date[0]
      this.params.endDate = date[1]
      this.handleBidandUserId()
    },
    getBidDayData(index, day) {
      this.num = index
      if (day == -1) {
        this.params.endDate = ''
        this.params.startDate = ''
        this.handleBid()
      } else {
        let now = new Date()
        this.params.endDate = this.currentTime
        this.params.startDate = this.cc(day)
        this.handleBid()
      }
    },
    getBidDateData(date) {
      let d = this.days
      this.params.startDate = date[0]
      this.params.endDate = date[1]
      this.handleBid()
    },
    getSysVersionDayData(index, day) {
      this.num = index
      if (day == -1) {
        this.params.endDate = ''
        this.params.startDate = ''
        this.handleSysVersion()
      } else {
        let now = new Date()
        this.params.endDate = this.currentTime
        this.params.startDate = this.cc(day)
        this.handleSysVersion()
      }
    },
    getSysVersionDateData(date) {
      let d = this.days
      this.params.startDate = date[0]
      this.params.endDate = date[1]
      this.handleSysVersion()
    },
    getSoftVersionDayData(index, day) {
      this.num = index
      if (day == -1) {
        this.params.endDate = ''
        this.params.startDate = ''
        this.handleSoftVersion()
      } else {
        let now = new Date()
        this.params.endDate = this.currentTime
        this.params.startDate = this.cc(day)
        this.handleSoftVersion()
      }
    },
    getSoftVersionDateData(date) {
      let d = this.days
      this.params.startDate = date[0]
      this.params.endDate = date[1]
      this.handleSoftVersion()
    },
    getuserobj(id, type, name) {
      this.currentPage = 1
      this.params.start = 0
      const data = {
        type: 1
      }
      this.config.visitCode = id
      this._getDateUserLogData(Object.assign({}, this.params, data, this.config))
    },
    getvisitobj(id, type, name) {
      this.currentPage = 1
      this.params.start = 0
      const data = {
        type: 1
      }
      this.config.userId = id
      this._getDateUserLogData(Object.assign({}, this.params, data, this.config))
    },
    getVisitTimes(id, type, name) {
      this.currentPage = 1
      this.params.start = 0
      console.log(this.type, id)
      if (this.type == 1) {
        const data = {
          type: 1
        }
        this.departmentObj = {
          id: id,
          name: name
        }
        this.config = {
          bId: id,
          userId: '',
          sysVersion: '',
          softVersion: ''
        }
        this._filterCommon(Object.assign({}, this.params, this.config, data))
      } else if (this.type == 2) {
        const data = {
          type: 1
        }
        this.userObj = {
          id: id,
          name: name
        }
        this.config.userId = id
        this._getDateUserLogData(Object.assign({}, this.params, this.config, data))
      } else if (this.type == 4) {
        const data = {
          type: 1
        }
        this.config = {
          bId: '',
          userId: '',
          sysVersion: id,
          softVersion: ''
        }
        this.dataObj = {
          sysVersion: id
        }
        this._filterCommon(Object.assign({}, this.params, this.config, data))
      } else if (this.type == 5) {
        const data = {
          type: 1
        }
        this.dataObj = {
          softVersion: id
        }
        this.config = {
          bId: '',
          userId: '',
          sysVersion: '',
          softVersion: id
        }
        this._filterCommon(Object.assign({}, this.params, this.config, data))
      }
    },
    getDepartment(id, name) {
      const data = {
        type: 1
      }
      this.config.bId = id
      this.departmentObj = {
        id: id,
        name: name
      }
      this._getDateData(Object.assign({}, this.params, this.config, data))
    },
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
    cc(days) {
      let now = new Date()
      now = now.valueOf()
      now = now - days * 24 * 60 * 60 * 1000
      now = new Date(now)
      return now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate()
    },
    handleCurrentChange(val) {
      this.params.start = (val - 1) * 10
      this.getItemDataPage(this.cur)
    },
    handleSearch(value) {
      let val = value || 1
      const data = {
        type: 1
      }
      console.log(123)
      this.params.start = (val - 1) * 10
      this.search()
    },
    handleBidandUserId(value) {
      let val = value || 1
      const data = {
        type: 1
      }
      this.params.start = (val - 1) * 10
      console.log(1)
      this._getDateUserLogData(Object.assign({}, this.params, this.config, data))
    },
    handleUserId(value) {
      let val = value || 1
      const data = {
        type: 1
      }
      this.params.start = (val - 1) * 10
      this._getDateUserLogData(Object.assign({}, this.params, this.config, data))
    },
    handleBid(value) {
      let val = value || 1
      const data = {
        type: 1
      }
      this.params.start = (val - 1) * 10
      if (this.type == 1) {
        this._getDateData(Object.assign({}, this.params, this.config, data))
      } else if (this.type == 2) {
        this._filterCommon(Object.assign({}, this.params, this.config, data))
      }
    },
    handleSysVersion(value) {
      let val = value || 1
      const data = {
        type: 1
      }
      this.params.start = (val - 1) * 10
      this._filterCommon(Object.assign({}, this.params, this.config, data))
    },
    handleSoftVersion(value) {
      let val = value || 1
      const data = {
        type: 1
      }
      this.params.start = (val - 1) * 10
      this._filterCommon(Object.assign({}, this.params, this.config, data))
    },
    _filterCommon(data) {
      filterCommon(data).then((res) => {
        this.userData = []
        this.type = res.type
        this.data = res.data
        this.total = res.total
      })
    },
    _getSysGroup(data) {
      getSysGroup(data).then((res) => {
        this.userData = []
        this.type = 4
        this.data = res.data
        this.total = res.total
      })
    },
    _getSoftGroup(data) {
      getSoftGroup(data).then((res) => {
        this.userData = []
        this.type = 5
        this.data = res.data
        this.total = res.total
      })
    },
    _getDataCount(data) {
      getDataCount(data).then((res) => {
        this.userData = []
        this.type = res.type
        this.data = res.data
        this.total = res.data.length
      })
    },
    _getDateData(data) {
      dateData(data).then((res) => {
        this.userData = []
        this.type = res.type
        this.data = res.data
        this.total = res.total
      })
    },
    _getDateLogData(data) {
      dateLogData(data).then((res) => {
        this.data = []
        this.type = 2
        this.userData = res.data
        this.total = res.total
      })
    },
    _getDateUserLogData(data) {
      dateUserLogData(data).then((res) => {
        this.data = []
        this.userData = res.data
        this.total = res.total
      })
    },
    _getUserGroupSearchByDate(data) {
      getUserGroupSearchByDate(data).then((res) => {
        this.userData = []
        this.userObj = null
        this.data = res.data
        this.total = res.total
      })
    },
    _getBranchSearchByDate(data) {
      getBranchSearchByDate(data).then((res) => {
        this.userData = []
        this.departmentObj = null
        this.data = res.data
        this.total = res.total
      })
    }
  }
}
</script>
<style scoped lang="scss">
.pagination {
  margin: 0 auto;
  margin-top: 10px;
  display: table;
}
.clearfix:after {
  content: "";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.head ul {
  list-style: none;
  color: #333;
  .date-box {
    float: right;
    margin-right: 0;
    .block {
      display: inline-block;
      margin-left: 20px;
    }
  }
}
.head ul .head-item {
  text-align: center;
  float: left;
  margin-right: 16px;
  padding: 6px 15px;
  line-height: 1.5;
  font-weight: 400;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
}
.head .active {
  border-color: #2d8cf0 !important;
}
.head ul .head-item {
  // width: 88px;
}
.head ul li input[type="date"] {
  width: 186px;
  height: 30px;
  border: 1px solid #cdcece;
  border-radius: 2px;
}
.main {
  width: 100%;
  margin-top: 20px;
  color: #333;
  .current-time {
    text-align: center;
    position: relative;
  }
}
.main h2 {
  margin: 5px 0;
  padding: 0;
  text-align: center;
  font-weight: normal;
}
.main .features {
  width: 100%;
  margin-top: 22px;
  margin-bottom: 20px;
  .breadcrumb {
    float: left;
    line-height: 30px;
    margin-left: 10px;
    .btn-item {
      display: inline-block;
      padding: 0 12px;
      margin: 0 5px;
      border: 2px solid #dbdbdb;
      cursor: pointer;
    }
    .active {
      background-color: #2d8cf0;
      color: #fff;
    }
  }
}
.features .export {
  display: block;
  float: left;
  padding: 0 15px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #cdcece;
  background-color: #fbfcfc;
  border-radius: 5px;
  box-shadow: 1px 1px 1px #cdcece, -1px -1px 1px #cdcece;
  outline: none;
  cursor: pointer;
  position: relative;
}
.features .export .icon-download {
  // position: absolute;
  display: inline-block;
  width: 15px;
  height: 15px;
  height: 100%;
  background: url(../../../assets/download.png) no-repeat left;
  background-size: 100%;
  vertical-align: middle;
}
.features input[type="text"] {
  float: left;
  width: 118px;
  height: 26px;
  font-size: 14px;
  text-align: center;
  border: 1px solid #cdcece;
  background-color: #056eeb;
  color: white;
}
.features .search-box {
  float: right;
  .search {
    height: 30px;
    border: 1px solid #cdcece;
    border-radius: 5px;
    outline: 0;
  }
  span {
    margin-left: 20px;
    display: inline-block;
    padding: 0 8px;
    line-height: 30px;
    color: #fff;
    background-color: #056ecb;
    border-radius: 5px;
    cursor: pointer;
  }
}

table {
  width: 100%;
  text-align: center;
  border: 1px solid #dddddd;
  border-radius: 1px;
  border-collapse: collapse;
}
table tr:nth-of-type(even) {
  background-color: #f9f9f9;
}
table tr:nth-of-type(odd) {
  background-color: #ffffff;
}
table tr th .icon-sort {
  display: inline-block;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto 0;
  width: 16px;
  height: 16px;
  background: url(../../../assets/sort.png) no-repeat center;
  background-size: 10px 15px;
}
table tr th .icon-sort:hover {
  background: url(../../../assets/sorted.png) no-repeat center;
  background-size: 10px 15px;
}
th,
td {
  height: 45px;
  border: 1px solid #dddddd;
  position: relative;
}
.three th {
  // width: (100%/3)
}
.hover,
.link {
  color: #0647ed;
  text-decoration: underline;
  cursor: pointer;
}
.link {
  position: absolute;
  right: 0;
}
.key-link {
  right: 13%;
}
</style>