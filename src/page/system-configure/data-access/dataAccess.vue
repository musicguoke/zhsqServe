<template>
  <Content :style="{height:parameterHeight}">
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>系统配置</BreadcrumbItem>
      <BreadcrumbItem>访问日志</BreadcrumbItem>
    </Breadcrumb>
    <Card :style="{maxHeight: contentHeight}">
      <div>
        <v-search :search-show="false" :build-show="false" :import-show="false" :disabled="selectedId.length <= 0" @on-delete="deleteMany" @on-build="parameterAddOpen" />
        <div class="tableSize">
          <el-table :data="list" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <!-- <el-table-column prop="id" label="ID" width="60" sortable>
            </el-table-column> -->
            <el-table-column prop="userName" width="80" label="用户名">
            </el-table-column>
            <el-table-column prop="operation" label="用户操作">
            </el-table-column>
            <el-table-column prop="loginIp" label="登录ip">
            </el-table-column>
            <el-table-column prop="actionUrl" width="350" label="操作地址">
            </el-table-column>
            <el-table-column prop="state" width="60" label="状态">
            </el-table-column>
            <el-table-column prop="actionTime" label="操作时间">
            </el-table-column>
            <el-table-column label="操作" width="60" align="center">
              <template slot-scope="scope">
                <!-- <Button type="info" @click="detail(scope.row)" size="small">查看</Button> -->
                <Button type="error" @click="remove(scope.row)" size="small">删除</Button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tablePage">
          <Page :total="pageLength" @on-change="pageChange" show-total></Page>
        </div>
      </div>
    </Card>
  </Content>
</template>

<script>
import { getLogList, getLogById, deleteLogById, deleteLogsById } from '@/api/access-log'
import vSearch from '@/components/search/index'
export default {
  components: {
    vSearch
  },
  data() {
    return {
      contentHeight: window.innerHeight - 174 + 'px',
      list: [],
      selectedId: []
    }
  },
  created() {
    this._getLogList()
  },
  methods: {
    _getLogList(page) {
      getLogList(page).then(res => {
        res.data.list.map(v => {
          v.actionTime = this._mm.formatDate(v.actionTime)
          v.state = v.state ? '正常' : '异常'
        })
        this.list = res.data.list
        this.pageLength = res.data.total
      })
    },
    pageChange(page) {
      this._getLogList(page)
    },
    remove(row) {
      this.$Modal.confirm({
        content: '删除后数据无法恢复，是否继续？',
        onOk: () => {
          this._deleteLogById(row.id)
        }
      })
    },
    _deleteLogById(id) {
      deleteLogById(id).then(res => {
        if (res.code === 20000) {
          this.$Message.success(res.message)
          this._getLogList()
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _deleteLogsById(id) {
      deleteLogsById(id).then(res => {
        if (res.code === 20000) {
          this.$Message.success(res.message)
          this._getLogList()
        } else {
          this.$Message.error(res.message)
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
          this._deleteLogsById(this.selectedId.toString())
        }
      })
    }
  }
}
</script>

<style>
</style>
