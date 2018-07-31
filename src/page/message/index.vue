<template>
  <Content>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>意见处理</BreadcrumbItem>
    </Breadcrumb>
    <Card :style="{maxHeight: contentHeight}">
      <div class="table">
        <el-table :data="list" border style="width: 100%">
          <!-- <el-table-column prop="id" label="ID" width="60" sortable></el-table-column> -->
          <el-table-column prop="contact" label="联系人"></el-table-column>
          <el-table-column prop="suggest" label="建议" :show-overflow-tooltip="true" width="300"></el-table-column>
          <el-table-column prop="suggestReply" label="意见回复" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="replyDescp" label="回复描述" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="status" label="系统状态"></el-table-column>
          <el-table-column prop="addtime" width="180" label="添加时间"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <Button type="primary" @click="editSys(scope.row)" size="small">编辑</Button>
              <Button type="error" @click="deleteSys(scope.row)" size="small">删除</Button>
            </template>
          </el-table-column>
        </el-table>
        <div class="tablePage">
          <Page :total="listLength" @on-change="_getSuggestList"></Page>
        </div>
      </div>
    </Card>
    <Modal 
      v-model="modalShow"
      :closable='false'
      :mask-closable='false'
      :width="500"
    >
      <h3 slot="header" style="color:#2D8CF0">意见信息</h3>
      <Form ref="itemInfo" :model="itemInfo" :label-width="80" :rules="rules">
        <FormItem label="UID">
          <Input v-model="itemInfo.uid" readonly></Input>
        </FormItem>
        <FormItem label="联系人">
          <Input v-model="itemInfo.contact" readonly></Input>
        </FormItem>
        <FormItem label="反馈类型">
          <Input v-model="type" readonly></Input>
        </FormItem>
        <FormItem label="设备码">
          <Input v-model="itemInfo.clientCode" readonly></Input>
        </FormItem>
        <FormItem label="添加时间">
          <Input v-model="addtime" readonly></Input>
        </FormItem>
        <FormItem label="回复时间">
          <Input v-model="replyTime" readonly></Input>
        </FormItem>
        <FormItem label="IP">
          <Input v-model="itemInfo.addip" readonly></Input>
        </FormItem>
        <FormItem label="建议">
          <Input v-model="itemInfo.suggest" readonly type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
        </FormItem>
        <FormItem label="意见回复" prop="suggestReply">
          <Input v-model="itemInfo.suggestReply" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
        </FormItem>
        <FormItem label="回复描述">
          <Input v-model="itemInfo.replyDescp" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelEditPass">取消</Button>
        <Button type="warning" v-if="itemInfo.status % 2 !== 1" @click="ignore">忽略</Button>
        <Button type="primary" v-if="itemInfo.status % 2 !== 1" @click="save">保存</Button>
        <Button type="primary" v-else @click="save">确定</Button>
      </div>
    </Modal>
  </Content>
</template>

<script>
import {
  getSuggestList,
  updateSuggest,
  deleteSuggest,
  searchSuggestById
} from '@/api/suggest'

export default {
  data() {
    return {
      contentHeight: window.innerHeight - 174 + 'px',
      modalShow: false,
      list: [],
      addtime: '',
      replyTime: '',
      type: '',
      rules: {
        suggestReply: [
          { required: true, message: '回复不能为空', trigger: 'blur' }
        ]
      },
      itemInfo: {
        id: '',
        uid: '',
        contact: '',
        suggest: '',
        clientCode: '',
        addtime: '',
        addip: '',
        suggestReply: '',
        replyDescp: '',
        userManage: '',
        replyTime: '',
        status: -1,
        type: '',
        sysId: '',
      }
    }
  },
  created() {
    this._getSuggestList()
  },
  methods: {
    save() {
      if(this.itemInfo.status % 2 == 1) {
        this.cancelEditPass()
        return 
      }
      this.$refs['itemInfo'].validate((valid) => {
        if (valid) {
          this.itemInfo.status = 1
          this._updateSuggest(this.itemInfo)
        }
      })
    },
    ignore() {
      this.itemInfo.status = 3
      this._updateSuggest(this.itemInfo)
    },
    cancelEditPass() {
      this.modalShow = false
      this.$refs.itemInfo.resetFields()
    },
    deleteSys(row) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除这条数据吗？',
        onOk: () => {
          this._deleteSuggest(row.id)
        }
      })
    },
    editSys(row) {
      this._searchSuggestById(row.id)
    },
    _getSuggestList(page) {
      getSuggestList(page).then(res => {
        if (res.code === 20000) {
          res.data.list.map(v => {
            if (v.status == 0) {
              v.status = '未处理'
            } else if (v.status === 3) {
              v.status = '已忽略'
            } else {
              v.status = '已处理并查看'
            }
            v.addtime = this._mm.formatDate(v.addtime)
          })
          this.list = res.data.list
          this.listLength = res.data.total
        } else {
          this.$Message.error(`${res.message}`)
        }
      })
    },
    _searchSuggestById(id) {
      searchSuggestById(id).then(res => {
        if (res.code === 20000) {
          this.itemInfo = res.data
          this.addtime = this._mm.formatDate(this.itemInfo.addtime)
          this.replyTime = this._mm.formatDate(this.itemInfo.replyTime)
          this.itemInfo.status = res.data.status.toString()
          if (this.itemInfo.type === 0) {
            this.type = '意见'
          } else if (this, itemInfo.type === 1) {
            this.type = 'bug'
          } else {
            this.type = '数据问题'
          }
          this.modalShow = true
        } else {
          this.$Message.error(`${res.message}`)
        }
      })
    },
    _deleteSuggest(id) {
      deleteSuggest(id).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`删除${res.message}`)
          this._getSuggestList()
        } else {
          this.$Message.error(`删除${res.message}`)
        }
      })
    },
    _updateSuggest(data) {
      updateSuggest(data).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`${res.message}`)
          this.modalShow = false
          this._getSuggestList()
        } else {
          this.$Message.error(`${res.message}`)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ivu-form-item {
  margin-bottom: 12px;
}
</style>
