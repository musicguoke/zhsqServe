<template>
  <Content>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>产品管理</BreadcrumbItem>
      <BreadcrumbItem>{{name}}</BreadcrumbItem>
    </Breadcrumb>
    <Card :style="{maxHeight: contentHeight}">
      <div class="table" v-show="!isShow">
        <v-search :importShow="false" @on-search="search" @on-build="show" @on-reset="reset" :disabled="selectedId.length <= 0" @on-delete="deleteMany" />
        <el-table
          :data="sysData"
          border
          style="width: 100%"
          :cell-class-name="tableRowClassName"
          @selection-change="handleSelectionChange"
          @filter-change="handleFilterChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="sysName" label="系统名称"></el-table-column>
          <el-table-column
            prop="sysType"
            label="系统类型"
            column-key="sysType"
            :filters="[{ text: '综合市情', value: '1' }, { text: '规划定位', value: '2' }, { text: '综合区情', value: '3' }]"
          ></el-table-column>
          <el-table-column prop="areaName" label="所属区域"></el-table-column>
          <el-table-column
            prop="status"
            label="系统状态"
          ></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <Button type="primary" @click="editSys(scope.row)" size="small">编辑</Button>
              <Button type="success" @click="enterSys(scope.row)" size="small">进入系统</Button>
              <Button type="error" @click="deleteSys(scope.row)" size="small">删除</Button>
            </template>
          </el-table-column>
        </el-table>
        <div class="tablePage">
          <Page :total="total" :current="page" @on-change="handlePageChange"></Page>
        </div>
      </div>
      <authority-config
        ref="authConfig"
        @isShow="tableShow"
        :newSys="newSys"
        :buildSys="true"
        @cancel="cancel"
      />
    </Card>
  </Content>
</template>

<script>
import {
  getSystemList,
  deleteSingleSystem,
  deleteBatchSystems,
  enterSystem
} from '@/api/system'
import AuthorityConfig from '@/components/authority-config/product-config'
import vSearch from '@/components/search/index'
import { unreadSuggestList } from '@/api/suggest'

export default {
  components: {
    AuthorityConfig,
    vSearch
  },
  data() {
    return {
      contentHeight: window.innerHeight - 174 + 'px',
      newSys: true,
      isShow: false,
      page: 1,
      name: '系统列表',
      selectedId: [],
      sysData: [],
      total: '',
      sysType: '',
      searchContent: null
    }
  },
  created() {
    this._enterSystem()
  },
  methods: {
    tableRowClassName({row, column, rowIndex, columnIndex}) {
      if (row.enable == 0 && columnIndex === 4) {
        return 'warning-row'
      } else if (row.enable == 1 && columnIndex === 4) {
        return 'success-row'
      }
      return ''
    },
    filterSysType(value, row) {
      return row.type == value
    },
    search(content) {
      this.searchContent = content
      this._getSystemList()
    },
    reset() {
      this.searchContent = null
      this._getSystemList()
    },
    editSys(row) {
      this.newSys = false
      this.name = '编辑系统'
      this.$refs.authConfig._getBuildConfig(Number(row.id), 'sys', Number(row.type))
    },
    // 子组件控制table显示隐藏
    tableShow(isShow) {
      this.isShow = isShow
    },
    enterSys(row) {
      this._enterSystem(row)
    },
    deleteSys(row) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除这条数据吗？',
        onOk: () => {
          this._deleteSingleSystem(row.id)
        }
      })
    },
    handleFilterChange(arr) {
      this.sysType = arr['sysType'].toString()
      this._getSystemList()
    },
    handlePageChange(page) {
      this.page = page
      this._getSystemList()
    },
    handleSelectionChange(val) {
      this.selectedId = []
      val.map(v => {
        this.selectedId.push(v.id)
      })
    },
    deleteMany() {
      this.$Modal.confirm({
        content: '删除后数据无法恢复，是否继续？',
        onOk: () => {
          this._deleteBatchSystems(this.selectedId.toString())
        },
        onCancel: () => { }
      })
    },
    show() {
      this.newSys = true
      this.name = '新建系统'
      this.$refs.authConfig._getBuildConfig('new', 'sys')
    },
    cancel() {
      this.isShow = false
      this.newSys = false
      this.name = '系统列表'
      this._getSystemList()
    },
    _getSystemList() {
      getSystemList(this.page, this.searchContent, this.sysType).then(res => {
        if (res.code === 20000) {
          res.data.list.filter(v => {
            if (v.enable === 0) {
              v.status = '暂停运行'
            } else if (v.enable === 1) {
              v.status = '正在运行'
            }
            if (v.type === 1) {
              v.sysType = '综合市情'
            } else if (v.type === 2) {
              v.sysType = '规划定位'
            } else if (v.type === 3) {
              v.sysType = '综合区情'
            }
          })
          this.sysData = res.data.list
          this.total = res.data.total
        } else {
          this.$Message.error(`${res.message}`)
        }
      })
    },
    _deleteSingleSystem(id) {
      deleteSingleSystem(id).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`删除${res.message}`)
          this._getSystemList()
        } else {
          this.$Message.error(`删除${res.message}`)
        }
      })
    },
    _deleteBatchSystems(id) {
      deleteBatchSystems(id).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`删除${res.message}`)
          this._getSystemList()
        } else {
          this.$Message.error(`删除${res.message}`)
        }
      })
    },
    _unreadSuggestList(page) {
      unreadSuggestList(page).then(res => {
        if (res.code === 20000) {
          this.$store.commit('setUnread', res.data)
        }
      })
    },
    _enterSystem(data) {
      let id = ''
      if (data) {
        id = data.id
      }
      enterSystem(id).then(res => {
        if (res.code === 20000) {
          this._unreadSuggestList()
          if (id) {
            let params = {
              type: data.type,
              funNum: data.funNum,
              systemname: data.sysName,
              areacode: data.areacode,
              areaname: data.areaName
            }
            this.$store.commit('setParams', params)
            this.$router.push({path: '/system/' + id})
          } else {
            this._getSystemList()
          }
        } else {
          this.$Message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
