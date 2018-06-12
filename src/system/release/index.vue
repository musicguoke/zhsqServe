<template>
  <div>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>目录管理</BreadcrumbItem>
      <BreadcrumbItem>发布目录</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <v-search :search-show="false" :delete-show="false" :import-show="false" @on-build="build"/>
      <tree-table ref="treeTable" :items='data3' :columns='dataColumns' @on-row-click="rowClick"></tree-table>
      <Modal v-model="editItemModal" :closable='false' :mask-closable=false :width="500">
        <h3 slot="header" style="color:#2D8CF0">目录信息</h3>
        <Form ref="editItemForm" :model="editItemForm" :label-width="100" label-position="right" :rules="catalogValidate">
          <FormItem v-if="!isAdd" label="id" prop="dpId">
            <Input v-model="editItemForm.dpId"></Input>
          </FormItem>
          <FormItem label="名称" prop="dpName">
            <Input v-model="editItemForm.dpName" placeholder="请输入名称"></Input>
          </FormItem>
          <FormItem label="排序" prop="dpListorder">
            <Input v-model="editItemForm.dpListorder" placeholder="请输入排序"></Input>
          </FormItem>
          <FormItem label="数据类型" prop="dpType">
            <Select v-model="editItemForm.dpType">
              <Option value="1">目录</Option>
              <Option value="2">矢量</Option>
              <Option value="3">文本</Option>
              <Option value="4">720</Option>
            </Select>
          </FormItem>
          <FormItem v-if="!isAdd" label="添加时间">
            <Input v-model="dpAddtime" disabled></Input>
          </FormItem>
          <FormItem v-if="!isAdd" label="图片地址">
            <Input placeholder="上传后的地址" v-model="editItemForm.dpImagePath"></Input>
            <Upload :action="`${uploadUrl}/sys/file/upload.do`" with-credentials :on-success="handleSuccess">
              <Button type="ghost" style="display: inline" icon="ios-cloud-upload-outline">点击上传</Button>
            </Upload>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="text" @click="cancelEdit">取消</Button>
          <Button type="primary" :loading="savePassLoading" @click="saveEditPass">保存</Button>
        </div>
      </Modal>
      <Modal v-model="editCatalogModal" :closable='false' :mask-closable=false :width="500" @on-ok="saveCatalog" @on-cancel="cancelEdit">
        <h3 slot="header" style="color:#2D8CF0">数据目录</h3>
        <Form :label-width="100" label-position="right">
          <FormItem label="数据名称">
            <Input v-model="editItemForm.dpName" disabled></Input>
          </FormItem>
          <div :style="modalStyle">
            <tree-table :items='catalogData' :columns='catalogColumns' @on-row-click="rowClick" @on-selection-change="selectDataConfig" />
          </div>
          </tree-table>
        </Form>
      </Modal>

    </Card>
  </div>
</template>

<script>
import { url } from '@/api/config'
import TreeTable from '@/components/my-tree/index'
import vSearch from '@/components/search/index'
import { getDateTree } from '@/api/system'
import { getTopicDataTree, getTopicDataById, addTopicData, updateTopicData, addCatalogToTopic, deleteTopicData } from '@/api/topics'

export default {
  components: {
    TreeTable,
    vSearch
  },
  data() {
    return {
      data3: [],
      code: '',
      uploadUrl: url,
      searchName: '',
      savePassLoading: false,
      editItemModal: false,
      editCatalogModal: false,
      modalStyle: {
        maxHeight: '400px',
        overflow: 'auto'
      },
      isAdd: false,
      dpAddtime: '',
      editItemForm: {
        dpId: '',
        dpName: '',
        dpType: '',
        dpListorder: '',
        dpAreacode: '',
        dpImagePath: '',
        dpParentid: -1,
        sysId: ''
      },
      catalogData: [],
      dataIdStr: '',
      catalogValidate: {
        dpName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        dpListorder: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ],
        dpType: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ]
      },
      catalogColumns: [
        {
          type: 'selection',
          width: '50',
        },
        {
          title: '数据名称',
          key: 'title'
        }
      ],
      dataColumns: [
        {
          title: '数据名称',
          key: 'dpName'
        }, {
          title: '数据类型',
          key: 'id'
        }, {
          title: '排序',
          key: 'dpListorder'
        }, {
          title: '描述',
          key: 'description'
        }, {
          title: '操作',
          type: 'action',
          actions: [{
            type: 'primary',
            text: '编辑'
          }, {
            type: 'warning',
            text: '数据目录'
          }, {
            type: 'success',
            text: '添加'
          }, {
            type: 'error',
            text: '删除'
          }],
          width: 120
        }
      ]
    }
  },
  created() {
    this._getTopicDataTree()
    this.editItemForm.sysId = this.$route.query.id
  },
  methods: {
    build() {
      this.isAdd = true
      this.editItemModal = true
    },
    cancelEdit() {
      this.editItemModal = false
      this.cancelCatalog = false
      this.editItemForm = {
        dpName: '',
        dpType: '',
        dpListorder: ''
      }
    },
    saveEditPass() {
      if (this.isAdd) {
        this._addTopicData(this.editItemForm)
      } else {
        this._updateTopicData(this.editItemForm)
      }
    },
    handleSuccess(res) {
      this.editItemForm.dpImagePath = res.data
    },
    // 保存数据目录
    saveCatalog() {
      let data = {
        dpId: this.editItemForm.dpId,
        dataIdStr: this.dataIdStr
      }
      this._addCatalogToTopic(data)
    },
    // 数据目录选择
    selectDataConfig(section) {
      this.dataIdStr = section.toString()
    },
    rowClick(item, e) {
      if (e.target.innerText === '删除') {
        this.$Modal.confirm({
          title: '提示',
          content: '确认删除吗？',
          onOk: () => {
            this._deleteTopicData(item.id)
          }
        })
      } else if (e.target.innerText === '编辑') {
        this.isAdd = false
        this._getTopicDataById(item.id)
      } else if (e.target.innerText === '添加') {
        this.editItemForm.dpParentid = item.id
        this.isAdd = true
        this.editItemModal = true
      } else if (e.target.innerText === '数据目录') {
        this.editItemForm.dpId = item.id
        this.editItemForm.dpName = item.dpName
        this.editCatalogModal = true
        this._getDateTree()
      }
    },
    initData(list) {
      list.map(v => {
        v.title = v.dpName
        if (v.children && v.children.length > 0) {
          this.initData(v.children)
        }
      })
      return list
    },
    _addTopicData(data) {
      addTopicData(data).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`添加${res.message}`)
          this._getTopicDataTree()
          this.editItemModal = false
        } else {
          this.$Message.error(`添加${res.message}`)
        }
      })
    },
    _getTopicDataTree(id) {
      getTopicDataTree(id).then(res => {
        this.data3 = this.initData(res)
      })
    },
    _deleteTopicData(id) {
      deleteTopicData(id).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`删除${res.message}`)
          this._getTopicDataTree()
        } else {
          this.$Message.error(`删除${res.message}`)
        }
      })
    },
    _getTopicDataById(id) {
      getTopicDataById(id).then(res => {
        if (res.code === 20000) {
          this.editItemForm = {
            dpId: res.data.dpId,
            dpName: res.data.dpName,
            dpType: res.data.dpType,
            dpListorder: res.data.dpListorder,
            dpAreacode: res.data.dpAreacode,
            dpImagePath: res.data.dpImagePath,
            dpParentid: res.data.dpParentid,
            sysId: res.data.sysId
          }
          this.dpAddtime = this._mm.formatDate(res.data.dpAddtime)
          this.editItemModal = true
        } else {
          this.$Message.error(`获取${res.message}`)
        }
      })
    },
    _updateTopicData(data) {
      updateTopicData(data).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`修改${res.message}`)
          this.editItemModal = false
          this._getTopicDataTree()
        } else {
          this.$Message.error(`修改${res.message}`)
        }
      })
    },
    _getDateTree(id) {
      getDateTree().then(res => {
        this.catalogData = res
      })
    },
    _addCatalogToTopic(data) {
      addCatalogToTopic(data).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`添加${res.message}`)
          this._getTopicDataTree()
        } else {
          this.$Message.error(`添加${res.message}`)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.seach_condition {
  justify-content: flex-end;
}
</style>
