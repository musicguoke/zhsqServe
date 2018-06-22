<template>
  <div class="statistic">
    <v-search :search-show="false" :import-show="false" :disabled="selectedId.length <= 0" @on-build="build" @on-delete="deleteMany" />
    <div class="tableSize">
      <el-table :data="list" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="id" sortable>
        </el-table-column>
        <el-table-column prop="moduleName" label="模块名称">
        </el-table-column>
        <el-table-column prop="moduleDescp" label="模块描述">
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <Button type="info" @click="detail(scope.row)" size="small" class="marginRight">编辑</Button>
            <Button type="error" @click="remove(scope.row)" size="small">删除</Button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="tablePage">
      <Page :total="listLength" @on-change="_getAuthorityList"></Page>
    </div>
    <Modal v-model="modalShow" :closable='false' :mask-closable="false" :width="500" @on-ok="save" @on-cancel="cancel">
      <h3 slot="header" style="color:#2D8CF0">权限信息</h3>
      <Form ref="import_form" :model="itemInfo" :label-width="90">
        <FormItem label="ID">
          <Input v-model="itemInfo.id" readonly></Input>
        </FormItem>
        <FormItem label="模块名称">
          <Input v-model="itemInfo.moduleName" placeholder="请输入模块名称"></Input>
        </FormItem>
        <FormItem label="模块描述">
          <Input v-model="itemInfo.moduleDescp" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入模块描述"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import vSearch from '@/components/search'
import { getAuthorityList, addAuthority, updateAuthority, getAuthority, deleteAuthority, deleteAuthorities } from '@/api/authority-config'

export default {
  components: {
    vSearch
  },
  data() {
    return {
      contentHeight: window.innerHeight - 174 + 'px',
      modalShow: false,
      list: [],
      selectedId: [],
      listLength: '',
      isNew: true,
      itemInfo: {
        id: '',
        moduleName: '',
        moduleDescp: ''
      }
    }
  },
  created() {
    this._getAuthorityList()
  },
  methods: {
    _getAuthorityList(page) {
      getAuthorityList(page).then(res => {
        if (res.code === 20000) {
          this.list = res.data.list
          this.listLength = res.data.total
        } else {
          this.$Message.error('好像出什么问题了！')
        }
      })
    },
    _getAuthority(id) {
      getAuthority(id).then(res => {
        if (res.code === 20000) {
          this.itemInfo = res.data
          this.isNew = false
          this.modalShow = true
        } else {
          this.$Message.error('好像出什么问题了！')
        }
      })
    },
    _addAuthority(data) {
      addAuthority(data).then(res => {
        if (res.code === 20000) {
          this.$Message.success(res.message)
          this._getVersionList()
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _updateAuthority(data) {
      updateAuthority(data).then(res => {
        if (res.code === 20000) {
          this.$Message.success(res.message)
          this._getVersionList()
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _deleteAuthority(id) {
      deleteAuthority(id).then(res => {
        if (res.code === 20000) {
          this.$Message.success(res.message)
          this._getVersionList()
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _deleteAuthorities(id) {
      deleteAuthorities(id).then(res => {
        if (res.code === 20000) {
          this.$Message.success(res.message)
          this._getVersionList()
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
          this._deleteAuthorities(this.selectedId.toString())
        },
        onCancel: () => { }
      })
    },
    build() {
      this.modalShow = true
      this.isNew = true
    },
    detail(row) {
      this._getAuthority(row.id)
    },
    remove(row) {
      this.$Modal.confirm({
        content: '删除后数据无法恢复，是否继续？',
        onOk: () => {
          this._deleteAuthority(row.id)
        },
        onCancel: () => { }
      })
    },
    save() {
      if(this.isNew) {
        this._addAuthority(this.itemInfo)
      } else {
        this._updateAuthority(this.itemInfo)
      }
    },
    cancel() {
      this.itemInfo = {
        id: '',
        moduleName: '',
        moduleDescp: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ivu-alert-with-desc {
  margin-bottom: 0;
}
</style>

