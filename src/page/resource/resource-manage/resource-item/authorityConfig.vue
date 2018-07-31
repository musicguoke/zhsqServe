<template>
  <div class="statistic">
    <v-search :search-show="false" :import-show="false" :disabled="selectedId.length <= 0" @on-build="build" @on-delete="deleteMany" />
    <div class="tableSize">
      <el-table :data="list" border style="width: 100%" @filter-change="filterSys" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <!-- <el-table-column prop="moduleId" label="编号" sortable>
        </el-table-column> -->
        <el-table-column
          prop="moduleName"
          label="模块名称"
        >
        </el-table-column>
        <el-table-column
          prop="permissionType"
          label="系统类别"
          column-key="permissionType"
          :filters="
          [{text: '综合市情', value: '1'}, 
          {text: '规划定位', value: '2'}, 
          {text: '综合区情', value: '3'}]"
        >
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
      <Page :total="listLength" @on-change="handlePageChange" show-total show-elevator ref="authorityPage"></Page>
    </div>
    <Modal v-model="modalShow" :closable='false' :mask-closable="false" :width="500">
      <h3 slot="header" style="color:#2D8CF0">权限信息</h3>
      <Form ref="form" :model="itemInfo" :rules="rules" :label-width="90">
        <FormItem label="编号" prop="moduleId">
          <Input v-model="itemInfo.moduleId"></Input>
        </FormItem>
        <FormItem label="模块名称" prop="moduleName">
          <Input v-model="itemInfo.moduleName" placeholder="请输入模块名称"></Input>
        </FormItem>
        <FormItem label="系统类别" prop="permissionType">
          <Select v-model="itemInfo.permissionType">
            <Option value="1">综合市情</Option>
            <Option value="2">规划定位</Option>
            <Option value="3">综合区情</Option>
          </Select>
        </FormItem>
        <FormItem label="模块描述" prop="moduleDescp">
          <Input v-model="itemInfo.moduleDescp" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入模块描述"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" @click="save">保存</Button>
      </div>
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
        moduleId: '',
        moduleName: '',
        moduleDescp: '',
        permissionType: ''
      },
      nowPage:'',
      sysType: null,
      rules: {
        moduleId: [
          { required: true, message: '请输入功能编号', trigger: 'blur' }
        ],
        moduleName: [
          { required: true, message: '请输入功能名称', trigger: 'blur' }
        ],
        moduleDescp: [
          { required: true, message: '请输入功能描述', trigger: 'blur' },
        ],
        permissionType: [
          { required: true, message: '请选择系统', trigger: 'blur' },
        ]
      }
    }
  },
  created() {
    this._getAuthorityList()
  },
  methods: {
    filterSys(row) {
      this.sysType = row.permissionType[0]
      this._getAuthorityList()
    },
    handlePageChange(page) {
      this.nowPage = page
      this._getAuthorityList()
    },
    _getAuthorityList() {
      getAuthorityList(this.nowPage, this.sysType).then(res => {
        if (res.code === 20000) {
          res.data.list.map(v => {
            if (v.permissionType == 1) {
              v.permissionType = '综合市情'
            } else if (v.permissionType == 2) {
              v.permissionType = '规划定位'
            } else if (v.permissionType == 3) {
              v.permissionType = '综合区情'
            }
          })
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
          res.data.permissionType = res.data.permissionType.toString()
          this.itemInfo = res.data
          this.itemInfo.moduleId = res.data.moduleId.toString()
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
          this.cancel()
          this.$Message.success(res.message)
          this._getAuthorityList(this.nowPage)
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _updateAuthority(data) {
      updateAuthority(data).then(res => {
        if (res.code === 20000) {
          this.cancel()
          this.$Message.success(res.message)
          this._getAuthorityList(this.nowPage)
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _deleteAuthority(id) {
      deleteAuthority(id).then(res => {
        if (res.code === 20000) {
          this.$Message.success(res.message)
          this._getAuthorityList(1)
          this.$refs.page.authorityPage = 1
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _deleteAuthorities(id) {
      deleteAuthorities(id).then(res => {
        if (res.code === 20000) {
          this.$Message.success(res.message)
          this._getAuthorityList(1)
          this.$refs.page.authorityPage = 1
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
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.isNew) {
            this._addAuthority(this.itemInfo)
          } else {
            this._updateAuthority(this.itemInfo)
          }
        }
      })
    },
    cancel() {
      this.modalShow = false
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

