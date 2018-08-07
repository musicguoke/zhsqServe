<template>
  <div>
    <v-search :search-show="false" :build-show="false" :delete-show="false" @on-import="importCatalog" />
    <tree-table ref="treeTable" :items='data3' :columns='dataColumns' @on-row-click="rowClick" @on-expand-click="loadData"></tree-table>
    <Modal v-model="editItemModal" :closable='false' :mask-closable=false :width="500">
      <h3 slot="header" style="color:#2D8CF0">修改目录</h3>
      <Form ref="editItemForm" :model="editItemForm" :label-width="100" label-position="right">
        <FormItem label="id" prop="id">
          <Input v-model="editItemForm.id" readonly placeholder="数据id"></Input>
        </FormItem>
        <FormItem label="数据名称" prop="name">
          <Input v-model="editItemForm.name" placeholder="请输入输入数据名称"></Input>
        </FormItem>
        <FormItem label="数据排序" prop="listorder">
          <Input v-model="editItemForm.listorder" placeholder="请输入数据描述"></Input>
        </FormItem>
        <FormItem label="数据描述" prop="description">
          <Input v-model="editItemForm.description" placeholder="请输入数据描述"></Input>
        </FormItem>
        <FormItem label="访问地址" prop="datapath">
          <Input v-model="editItemForm.datapath" placeholder="请输入数据描述"></Input>
        </FormItem>
        <FormItem label="数据类型" prop="type">
          <Select v-model="editItemForm.type">
            <Option v-for="(item, index) in dataTypeList" :value="item.typeid" :key="index">{{item.typename}}</Option>
          </Select>
        </FormItem>
        <FormItem label="数据更新时间" prop="time">
          <Input v-model="editItemForm.time" readonly placeholder="数据更新时间"></Input>
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
    <Modal v-model="layerModal" :closable='false' :mask-closable="false" :width="500">
      <h3 slot="header" style="color:#2D8CF0">图层信息</h3>
      <el-table :data="layerList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="60" sortable>
        </el-table-column>
        <el-table-column prop="layer" label="图层">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <Button type="primary" size="small" @click="checkLayer(scope)">查看</Button>
          </template>
        </el-table-column>
      </el-table>
    </Modal>
    <Modal
      v-model="layerFieldsModal"
      :closable='false'
      :mask-closable="false"
      :width="700"
      @on-ok="clickFieldsModal"
      @on-cancel="clickFieldsModal"
    >
      <h3 slot="header" style="color:#2D8CF0">图层信息</h3>
      <el-table :data="layerFields" border style="width: 100%" height="400">
        <el-table-column prop="listorder" width="80" label="排序" sortable>
        </el-table-column>
        <el-table-column prop="nameA" width="150" label="中文名">
        </el-table-column>
        <el-table-column prop="name" width="80" label="英文名">
        </el-table-column>
        <el-table-column prop="layerType" label="表名">
        </el-table-column>
        <el-table-column prop="fieldType" width="80" label="字段类型">
        </el-table-column>
      </el-table>
    </Modal>
  </div>
</template>

<script>
import { url } from '@/api/config.js'
import TreeTable from '@/components/my-tree/index'
import vSearch from '@/components/search'
import { getDateTree } from '@/api/system'
import {
  getAreaList,
  getAreaCatalog,
  getMsTabDatainfoById,
  updateMsTabDatainfo,
  deleteMsTabDatainfo,
  importMsTabFile,
  getSourceLayer,
  getSourceLayerFields
} from '@/api/catalog'
import { getDataTypeList } from '@/api/data-type'

export default {
  components: {
    TreeTable,
    vSearch
  },
  data() {
    return {
      data3: [],
      code: '',
      searchName: '',
      editItemModal: false,
      layerModal: false,
      layerFieldsModal: false,
      layerList: [],
      layerFields: [],
      importModal: false,
      uploadUrl: url,
      dataTypeList: [],
      importFile: {
        file: '',
        type: '',
        areacode: '',
        name: ''
      },
      editItemForm: {},
      dataColumns: [
        {
          title: '数据名称',
          key: 'title',
          width: 400
        }, {
          title: '数据编码',
          key: 'id',
          sortable: true
        }, {
          title: '操作',
          type: 'action',
          actions: [{
            type: 'primary',
            text: '编辑'
          }, {
            type: 'success',
            text: '查看图层'
          },{
            type: 'info',
            text: '绘制'
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
    this._getDataTypeList()
  },
  methods: {
    cancelModal() {
      this.editItemModal = false
      this.importModal = false
    },
    saveEditPass() {
      const data = {
        id: this.editItemForm.id,
        name: this.editItemForm.name,
        type: this.editItemForm.type,
        listorder: this.editItemForm.listorder,
        datapath: this.editItemForm.datapath,
        description: this.editItemForm.description,
        parentid: this.editItemForm.parentid,
        isaddmarker: this.editItemForm.isaddmarker
      }
      this._updateMsTabDatainfo(data)
    },
    importCatalog() {
      this.importModal = true
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
        formData.append('areaCode', -1)
        this._importMsTabFile(formData)
      }
    },
    rowClick(item, e) {
      let text = e.target.innerText.trim()
      if (text === '删除') {
        this.$Modal.confirm({
          title: '提示',
          content: '级联删除且删除的记录不可恢复，继续吗？',
          onOk: () => {
            this._deleteMsTabDatainfo(item.id)
          }
        })
      } else if (text === '编辑') {
        this._getMsTabDatainfoById(item.id)
      } else if (e.target.innerText === '绘制') {
        if (!item.datapath) {
          this.$Message.error('暂无图层地址')
          return
        }
        this.addMapLayer(item)
      }else if (e.target.innerText === '查看图层') {
        if (!item.datapath) {
          this.$Message.error('暂无图层地址')
          return
        }
        this._getSourceLayer(item.datapath)
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
          this.editItemForm = res.data
          this.editItemForm.time = this._mm.formatDate(res.data.updatetime)
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
          this.editItemModal = false
          this._getAreaCatalog()
        } else {
          this.$Message.error(`修改${res.message}`)
        }
      })
    },
    _getDataTypeList() {
      getDataTypeList().then(res => {
        if (res.code === 20000) {
          this.dataTypeList = res.data.list
        } else {
          this.$Message.error()
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
    },
    _getSourceLayer(src) {
      getSourceLayer(src).then(res => {
        if (res.code === 20000) {
          this.layerList = []
          this.layerFields = []
          res.data.map((v, index) => {
            let temp = {
              id: index + 1,
              layer: v
            }
            this.layerList.push(temp)
          })
          this.layerModal = true
        }
      })
    },
    checkLayer(scope) {
      this._getSourceLayerFields(scope.row.layer)
    },
    clickFieldsModal() {
      this.layerModal = true
      this.layerFieldsModal = false
    },
    _getSourceLayerFields(type) {
      getSourceLayerFields(type).then(res => {
        if (res.code === 20000) {
          this.layerFields = res.data
          this.layerModal = false
          this.layerFieldsModal = true
        }
      })
    },
    //添加图层
    addMapLayer(data){
      this.$router.push('map')
      this.$store.commit('setMapInfo',{isShow:true,datapath:data.datapath}) 
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
