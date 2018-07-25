<template>
  <div class="zh-en">
    <v-search
      :export-show="true"
      :delete-show="false"
      :export-url="'/sys/msThematicMap/downloadImportedFile.do'" 
      @on-export="exportFile"
      @on-search="search"
      @on-reset="reset"
      @on-build="build"
      @on-import="importShow"
    />
    <div class="tableSize">
      <el-table :data="list" border style="width: 100%">
        <el-table-column prop="listorder" width="80" label="排序" sortable>
        </el-table-column>
        <el-table-column prop="nameA" label="中文名">
        </el-table-column>
        <el-table-column prop="name" label="英文名">
        </el-table-column>
        <el-table-column prop="layerType" width="300" label="表名">
        </el-table-column>
        <el-table-column prop="layerAlias" label="图层别名">
        </el-table-column>
        <el-table-column prop="fieldType" label="字段类型" sortable>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- <Button type="primary" @click="editData(scope.row)" size="small" class="marginRight" title="编辑">编辑</Button> -->
            <Button type="error" @click="deleteData(scope.row)" size="small" title="删除">删除</Button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="tablePage">
      <Page :total="listLength" :current="page" @on-change="_getZhEnList" show-total show-elevator></Page>
    </div>
    <Modal v-model="modalShow" :closable='false' :mask-closable="false" :width="500">
      <h3 slot="header" style="color:#2D8CF0">中英文信息</h3>
      <Form ref="form" :model="itemInfo" :rules="rules" :label-width="90">
        <FormItem label="中文名" prop="name">
          <Input v-model="itemInfo.name" placeholder="请输入中文名"></Input>
        </FormItem>
        <FormItem label="英文名" prop="nameA">
          <Input v-model="itemInfo.nameA" placeholder="请输入英文名"></Input>
        </FormItem>
        <FormItem label="表名" prop="layerType">
          <Input v-model="itemInfo.layerType" placeholder="请输入表名"></Input>
        </FormItem>
        <FormItem label="字段类型" prop="fieldType">
          <Select v-model="itemInfo.fieldType" placeholder="请选择字段类型">
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
          </Select>
        </FormItem>
        <FormItem label="描述信息">
          <Input v-model="itemInfo.layerAlias"></Input>
        </FormItem>
        <FormItem label="权值">
          <Input v-model="itemInfo.mOrder"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" @click="save">保存</Button>
      </div>
    </Modal>
    <Modal v-model="importModalShow" :closable='false' :mask-closable="false" :width="500" @on-ok="saveImportFile" @on-cancel="cancel">
      <h3 slot="header" style="color:#2D8CF0">导入文件</h3>
      <Form :model="importFile" :label-width="90">
        <FormItem label="导入类型">
          <Select v-model="importFile.type" placeholder="请选择导入类型">
            <Option value="1">增量导入</Option>
            <Option value="2">全量导入</Option>
          </Select>
        </FormItem>
        <FormItem label="选择文件">
          <Upload :action="`${uploadUrl}/sys/msThematicMap/importFile.do`" with-credentials :before-upload="boforeUpload">
            <Button type="ghost" icon="ios-cloud-upload-outline">请选择文件</Button>
          </Upload>
        </FormItem>
        <div class="importSlot">
          <div class="importSlotTitle">导入须知</div>
          <p>1、导入文件大小不超过2MB.</p>
          <p>2、支持Microsoft Office Excel的xls和xlsx文件,模板
            <a :href="`${uploadUrl}/sys/msThematicMap/downloadImportedFile.do`" download="ms_branch_struct.xlsx">点此下载.</a>
          </p>
        </div>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { url } from '@/api/config'
import vSearch from '@/components/search/index'
import { getZhEnList, addZhEn, uploadZhEnFile, deleteZhEn } from '@/api/zh-en'

export default {
  components: {
    vSearch
  },
  data() {
    return {
      contentHeight: window.innerHeight - 174 + 'px',
      uploadUrl: url,
      modalShow: false,
      importModalShow: false,
      list: [],
      listLength: '',
      searchContent: null,
      page: 1,
      itemInfo: {
        listorder: '',
        layerType: '',
        name: '',
        nameA: '',
        filedType: '',
        mapguid: '',
        layerAlias: '',
        mOrder: ''
      },
      importFile: {
        type: '2',
        file: ''
      },
      downUrl: '',
      rules: {
        name: [
          { required: true, message: '请输入中文名', trigger: 'blur' }
        ],
        nameA: [
          { required: true, message: '请输入英文名', trigger: 'blur' }
        ],
        layerType: [
          { required: true, message: '请输入表名', trigger: 'blur' },
        ],
        filedType: [
          { required: true, message: '请选择字段类型', trigger: 'blur' },
        ]
      }
    }
  },
  created() {
    this._getZhEnList()
  },
  methods: {
    _getZhEnList(page) {
      getZhEnList(page, this.searchContent).then(res => {
        if (res.code === 20000) {
          this.list = res.data.list
          this.listLength = res.data.total
        } else {
          this.$Message.error('好像出什么问题了！')
        }
      })
    },
    _addZhEn(data) {
      addZhEn(data).then(res => {
        if (res.code === 20000) {
          this.cancel()
          this.$Message.success(res.message)
          this._getZhEnList()
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _uploadZhEnFile(data) {
      uploadZhEnFile(data).then(res => {
        if (res.code === 20000) {
          this.$Message.success(res.message)
          this._getZhEnList()
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _deleteZhEn(data) {
      deleteZhEn(data).then(res => {
        if (res.code === 20000) {
          this.$Message.success(res.message)
          this._getZhEnList()
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    deleteData(row) {
      let data = {
        name: row.name,
        layer_type: row.layerType
      }
      this.$Modal.confirm({
        content: '删除后数据无法恢复，是否继续？',
        onOk: () => {
          this._deleteZhEn(data)
        },
        onCancel: () => { }
      })
    },
    importShow() {
      this.importModalShow = true
    },
    boforeUpload(file) {
      this.importFile.file = file
    },
    saveImportFile() {
      if (this.importFile.type === '') {
        this.$Message.error('请选择导入类型')
      } else if (this.importFile.file === '') {
        this.$Message.error('请选择上传文件')
      } else {
        let formData = new FormData(this.$refs.import_form)
        formData.append('type', this.importFile.type)
        formData.append('file', this.importFile.file)
        this._uploadZhEnFile(formData)
      }
    },
    build() {
      this.modalShow = true
    },
    search(name) {
      this.searchContent = name
      this._getZhEnList()
    },
    reset() {
      this.searchContent = null
      this.page = 1
      this._getZhEnList()
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this._addZhEn(this.itemInfo)
        }
      })
    },
    exportFile() {
      this.downUrl = '/sys/msStatisticalConfigController/downloadImportedFile.do'
    },
    cancel() {
      this.modalShow = false
      this.itemInfo = {
        listorder: '',
        layerType: '',
        name: '',
        nameA: '',
        filedType: '',
        mapguid: '',
        layerAlias: '',
        mOrder: ''
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

