<template>
  <div>
    <tree-table ref="treeTable" :items='data3' :columns='dataColumns' @on-row-click="rowClick" @on-expand-click="loadData"></tree-table>
    <Modal v-model="editItemModal" :closable='false' :mask-closable=false :width="500">
      <h3 slot="header" style="color:#2D8CF0">修改目录</h3>
      <Form ref="editItemForm" :model="editItemForm" :label-width="100" label-position="right">
        <FormItem label="id" prop="id">
          <Input v-model="editItemForm.id" placeholder="数据id"></Input>
        </FormItem>
        <FormItem label="数据名称" prop="name">
          <Input v-model="editItemForm.name" placeholder="请输入输入数据名称"></Input>
        </FormItem>
        <FormItem label="数据描述" prop="description">
          <Input v-model="editItemForm.description" placeholder="请输入数据描述"></Input>
        </FormItem>
        <FormItem label="数据类型" prop="type">
          <Select v-model="editItemForm.type">
            <Option value="1">目录</Option>
            <Option value="2">矢量</Option>
            <Option value="3">文本</Option>
            <Option value="4">720</Option>
          </Select>
        </FormItem>
        <FormItem label="数据更新时间" prop="time">
          <Input v-model="editItemForm.time" placeholder="数据更新时间"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelModal">取消</Button>
        <Button type="primary" @click="saveEditPass">保存</Button>
      </div>
    </Modal>
    <Modal v-model="importModal" :closable='false' :mask-closable="false" :width="500" @on-ok="saveImport" @on-cancel="cancelModal">
      <h3 slot="header" style="color:#2D8CF0">目录导入</h3>
      <Form ref="file_form" label-position="left" :label-width="80">
        <FormItem label="导入类型">
          <Select v-model="importFile.type" placeholder="请选择导入类型">
            <Option value="1">增量导入</Option>
            <Option value="2">全量导入</Option>
          </Select>
        </FormItem>
        <FormItem label="选择文件">
          <Upload :action="`${uploadUrl}/sys/file/upload.do`" with-credentials :before-upload="boforeUpload" :on-success="handleSuccessUpload">
            <Button type="ghost" icon="ios-cloud-upload-outline">请选择</Button>
          </Upload>
        </FormItem>
        <div class="importSlot">
          <div class="importSlotTitle">导入须知</div>
          <p>1、导入文件大小不超过2MB.</p>
          <p>2、支持Microsoft Office Excel的xls和xlsx文件,模板
            <a :href="`${uploadUrl}/sys/msTabDataController/downloadImportedFile.do`" download="ms_branch_struct.xlsx">点此下载.</a>
          </p>
        </div>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { url } from '@/api/config.js'
import TreeTable from '@/components/my-tree/index'
import { getDateTree } from '@/api/system'
import { 
  getAreaList,
  getAreaCatalog,
  getMsTabDatainfoById,
  updateMsTabDatainfo,
  deleteMsTabDatainfo,
  importMsTabFile
} from '@/api/catalog'

export default {
  components: {
    TreeTable
  },
  data() {
    return {
      data3: [],
      code: '',
      searchName: '',
      editItemModal: false,
      importModal: false,
      uploadUrl: url,
      importFile: {
        file: '',
        type: '',
        areacode: '',
        name: ''
      },
      editItemForm: {
        id: '',
        name: '',
        type: '',
        description: '',
        time: ''
      },
      dataColumns: [
        {
          type: 'selection',
          width: '50',
        },
        {
          title: '数据名称',
          key: 'title'
        }, {
          title: '数据编码',
          key: 'id',
          sortable: true
        }, {
          title: '排序',
          key: 'listorder'
        }, {
          title: '更新时间',
          key: 'updatetime'
        }, {
          title: '操作',
          type: 'action',
          actions: [{
            type: 'primary',
            text: '编辑'
          }, {
            type: 'success',
            text: '导入',
            key: 'parentId'
          }, {
            type: 'error',
            text: '删除'
          }]
        }
      ]
    }
  },
  created() {
    this._getAreaCatalog()
  },
  methods: {
    cancelModal() {
      this.editItemModal = false
      this.importModal = false
    },
    saveEditPass() {
      this._updateMsTabDatainfo()
    },
    handleSuccessUpload(response, file) {
      console.log('上传成功')
    },
    boforeUpload(file) {
      this.importFile.file = file
    },
    // 上传文件
    saveImport() {
      if (this.importFile.type === '') {
        this.$Message.error('请选择导入类型')
      } else if (this.importFile.file === '') {
        this.$Message.error('请选择上传文件')
      } else {
        let formData = new FormData(this.$refs.file_form)
        // 向 formData 对象中添加文件
        formData.append('file', this.importFile.file)
        formData.append('type', this.importFile.type)
        formData.append('areaCode', this.importFile.areacode)
        this._importMsTabFile(formData)
      }
    },
    rowClick(item, e) {
      if (e.target.innerText === '删除') {
        this.$Modal.confirm({
          title: '提示',
          content: '级联删除且删除的记录不可恢复，继续吗？',
          onOk: () => {
            this._deleteMsTabDatainfo(item.id)
          }
        })
      } else if (e.target.innerText === '编辑') {
        this._getMsTabDatainfoById(item.id)
      } else if (e.target.innerText === '导入') {
        this.importFile.areacode = item.id
        this.importModal = true
      }
    },
    loadData(item, index) {
      if (item.areacode && this.code !== item.areacode) {
        this._getDateTree(item.areacode, index)
      }
      this.code = item.areacode
    },
    _getAreaList() {
      getAreaList().then(res => {
        if (res.code === 20000) {
          res.data.list.map(v => {
            v.title = v.areaname
            v.id = v.areacode
            this.data3.push(v)
          })
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _getAreaCatalog() {
      getAreaCatalog().then(res => {
        res.map(v => v._checked = false)
        this.data3 = res
      })
    },
    _getDateTree(id) {
      getDateTree(id).then(res => {
        this.data3.map(v => {
          if (v.areacode === id) {
            v.children = res
          }
        })
        this.$refs.treeTable.initData(this.$refs.treeTable.deepCopy(this.data3), 1, null)
      })
    },
    _deleteMsTabDatainfo(id) {
      deleteMsTabDatainfo(id).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`删除${res.message}`)
          this._getAreaCatalog()
        } else {
          this.$Message.error(`删除${res.message}`)
        }
      })
    },
    _getMsTabDatainfoById(id) {
      getMsTabDatainfoById(id).then(res => {
        if (res.code === 20000) {
          this.editItemForm = {
            id: res.data.id,
            name: res.data.name,
            type: res.data.type,
            description: res.data.description,
            time: this._mm.formatDate(res.data.updatetime)
          }
          this.editItemModal = true
        } else {
          this.$Message.error(`获取${res.message}`)
        }
      })
    },
    _updateMsTabDatainfo(data) {
      updateMsTabDatainfo(data).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`修改${res.message}`)
          this._getAreaCatalog()
        } else {
          this.$Message.error(`修改${res.message}`)
        }
      })
    },
    _importMsTabFile(data) {
      importMsTabFile(data).then(res => {
        if (res.code === 20000) {
          this.$Message.success(res.message)
          this._getAreaCatalog()
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
