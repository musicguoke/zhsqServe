<template>
  <Content>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>产品管理</BreadcrumbItem>
      <BreadcrumbItem>{{name}}</BreadcrumbItem>
    </Breadcrumb>
    <Card :style="{maxHeight: contentHeight}">
      <div class="table" v-show="!isShow">
        <v-search 
          :importShow="false"
          @on-search="search"
          @on-build="show"
          :disabled="selectedId.length <= 0"
          @on-delete="deleteMany" />
        <el-table :data="sysData" border style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="系统编号" sortable>
          </el-table-column>
          <el-table-column prop="sysName" label="系统名称">
          </el-table-column>
          <el-table-column prop="areaName" label="所属区县" sortable>
          </el-table-column>
          <el-table-column prop="status" label="系统状态" sortable>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <Button type="primary" @click="editSys(scope.row)" size="small">编辑</Button>
              <Button type="success" @click="enterSys(scope.row)" size="small">进入系统</Button>
              <Button type="error" @click="deleteSys(scope.row)" size="small">删除</Button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <authority-config v-show="isShow" ref="authConfig" :newSys="newSys" @cancel="cancel" />
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
import AuthorityConfig from '@/components/authority-config/index'
import vSearch from '@/components/search/index'

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
      name: '系统列表',
      selectedId: [],
      sysData: []
    }
  },
  created() {
    this._enterSystem()
  },
  methods: {
    editSys(row) {
      this.$refs.authConfig._searchSysById(row.id)
      this.isShow = true
      this.newSys = false
      this.name = '编辑系统'
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
      this.isShow = true
      this.newSys = true
      this.name = '新建系统'
    },
    cancel() {
      this._getSystemList()
      this.isShow = false
      this.newSys = false
      this.name = '系统列表'
    },
    _getSystemList(page) {
      getSystemList(page).then(res => {
        if (res.code === 20000) {
          res.data.list.filter(v => {
            if (v.enable === 0) {
              v.status = '暂停运行'
            } else if (v.enable === 1) {
              v.status = '正在运行'
            }
          })
          this.sysData = res.data.list
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
    _enterSystem(data) {
      let id = ''
      if (data) {
        id = data.id
      }
      enterSystem(id).then(res => {
        if (res.code === 20000) {
          if (id) {
            this.$router.push({
              path: '/system',
              query: {
                id: id,
                systemname: data.sysName
              }
            })
          } else {
            this._getSystemList()
            this.$refs.authConfig._getAreaList()
            this.$refs.authConfig._getAreaCatalog()
            this.$refs.authConfig._getFeature()
            this.$refs.authConfig._getMapConfig()
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
