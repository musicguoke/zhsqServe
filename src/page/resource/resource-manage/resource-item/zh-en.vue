<template>
  <div class="zh-en">
    <v-search :search-show="false" :delete-show="false" @on-build="build" @on-import="importShow" />
    <div class="tableSize">
      <el-table :data="list" border style="width: 100%">
        <el-table-column prop="listorder" width="80" label="排序" sortable>
        </el-table-column>
        <el-table-column prop="name" label="中文名">
        </el-table-column>
        <el-table-column prop="nameA" label="英文名">
        </el-table-column>
        <el-table-column prop="layerType" label="表名" sortable>
        </el-table-column>
        <el-table-column prop="fieldType" label="字段类型" sortable>
        </el-table-column>
      </el-table>
    </div>
    <div class="tablePage">
      <Page :total="listLength" @on-change="_getZhEnList"></Page>
    </div>
    <Modal v-model="modalShow" :closable='false' :mask-closable="false" :width="500" @on-ok="save" @on-cancel="cancel">
      <h3 slot="header" style="color:#2D8CF0">中英文信息</h3>
      <Form ref="import_form" :model="itemInfo" :label-width="90">
        <FormItem label="中文名">
          <Input v-model="itemInfo.name" placeholder="请输入中文名"></Input>
        </FormItem>
        <FormItem label="英文名">
          <Input v-model="itemInfo.nameA" placeholder="请输入英文名"></Input>
        </FormItem>
        <FormItem label="表名">
          <Input v-model="itemInfo.layerType" placeholder="请输入表名"></Input>
        </FormItem>
        <FormItem label="字段类型">
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
            <a :href="`${uploadUrl}/sys/msTabDataController/downloadImportedFile.do`" download="ms_branch_struct.xlsx">点此下载.</a>
          </p>
        </div>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { url } from '@/api/config'
import vSearch from '@/components/search/index'
import { getZhEnList, addZhEn, uploadZhEnFile } from '@/api/zh-en'

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
    }
  },
  created() {
    this._getZhEnList()
  },
  methods: {
    _getZhEnList(page) {
      getZhEnList(page).then(res => {
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
    save() {
      this._addZhEn(this.itemInfo)
    },
    cancel() {
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

