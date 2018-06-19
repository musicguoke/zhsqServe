<template>
  <div class="statistic">
    <v-search
      :build-show="false" 
      :export-url="'/sys/msStatisticalConfigController/downloadImportedFile.do'" 
      :export-show="true"
      @on-search="search"
      @on-reset="reset"
      @on-export="exportFile" 
      @on-import="importShow"
      :disabled="selectedId.length <= 0"
      @on-delete="deleteMany"
    />
    <div class="tableSize">
      <el-table :data="list" border style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="id" sortable>
        </el-table-column>
        <el-table-column prop="target" label="指标名称">
        </el-table-column>
        <el-table-column prop="targetId" label="指标编码" sortable>
        </el-table-column>
        <el-table-column prop="sourceName" label="图层名称">
        </el-table-column>
        <el-table-column prop="sourceId" label="图层编码" sortable>
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
      <Page :total="listLength" @on-change="_getStatisticList"></Page>
    </div>
    <Modal v-model="modalShow" :closable='false' :mask-closable="false" :width="500" @on-ok="save" @on-cancel="cancel">
      <h3 slot="header" style="color:#2D8CF0">统计配置</h3>
      <Form ref="import_form" :model="itemInfo" :label-width="90">
        <FormItem label="ID">
          <Input v-model="itemInfo.id" placeholder="请输入版本名称" readonly></Input>
        </FormItem>
        <FormItem label="指标编码">
          <Input v-model="itemInfo.targetId" placeholder="请输入版本名称"></Input>
        </FormItem>
        <FormItem label="指标名称">
          <Input v-model="itemInfo.target" placeholder="请输入版本名称"></Input>
        </FormItem>
        <FormItem label="图层名称">
          <Input v-model="itemInfo.sourceName" placeholder="请输入版本号"></Input>
        </FormItem>
        <FormItem label="源图层">
          <Input v-model="itemInfo.sourcelayer" placeholder="请输入版本号"></Input>
        </FormItem>
        <FormItem label="字段">
          <Input v-model="itemInfo.fieldsName"></Input>
        </FormItem>
        <FormItem label="字段别名">
          <Input v-model="itemInfo.fields"></Input>
        </FormItem>
        <FormItem label="字段类型">
          <Input v-model="itemInfo.fieldsType"></Input>
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
          <Upload 
            :action="`${uploadUrl}/sys/msStatisticalConfigController/importFile.do`"
            with-credentials
            :before-upload="boforeUpload"
          >
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
import { getStatisticList, addStatistic, updateStatistic, getStatistic, deleteStatistic, deleteStatistics, importStatisticFile } from '@/api/statistics'

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
      selectedId: [],
      itemInfo: {
        id: '',
        targetId: '',
        target: '',
        sourcelayer: '',
        sourceId: '',
        sourceName: '',
        filter: '',
        fields: '',
        fieldsName: '',
        fieldsType: '',
        flag: ''
      },
      importFile: {
        type: '2',
        file: ''
      },
      downUrl: ''
    }
  },
  created() {
    this._getStatisticList()
  },
  methods: {
    search(name) {
      this._getStatisticList('', name)
    },
    reset() {
      this._getStatisticList()
    },
    _getStatisticList(page, name) {
      getStatisticList(page, name).then(res => {
        if (res.code === 20000) {
          this.list = res.data.list
          this.listLength = res.data.total
        } else {
          this.$Message.error('好像出什么问题了！')
        }
      })
    },
    _getStatistic(id) {
      getStatistic(id).then(res => {
        if (res.code === 20000) {
          this.itemInfo = res.data
          this.modalShow = true
        } else {
          this.$Message.error('好像出什么问题了！')
        }
      })
    },
    _addStatistic(data) {
      addStatistic(data).then(res => {
        if (res.code === 20000) {
          this.$Message.success(res.message)
          this._getVersionList()
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _updateStatistic(data) {
      updateStatistic(data).then(res => {
        if (res.code === 20000) {
          this.$Message.success(res.message)
          this._getVersionList()
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _deleteStatistic(id) {
      deleteStatistic(id).then(res => {
        if (res.code === 20000) {
          this.$Message.success(res.message)
          this._getVersionList()
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _deleteStatistics(id) {
      deleteStatistics(id).then(res => {
        if (res.code === 20000) {
          this.$Message.success(res.message)
          this._getVersionList()
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _importStatisticFile(data) {
      importStatisticFile(data).then(res => {
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
          this._deleteStatistics(this.selectedId.toString())
        },
        onCancel: () => { }
      })
    },
    exportFile() {
      this.downUrl = '/sys/msStatisticalConfigController/downloadImportedFile.do'
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
        this._importStatisticFile(formData)
      }
    },
    detail(row) {
      this._getStatistic(row.id)
    },
    remove(row) {
      this.$Modal.confirm({
        content: '删除后数据无法恢复，是否继续？',
        onOk: () => {
          this._deleteStatistic(row.id)
        },
        onCancel: () => { }
      })
    },
    save() {
      this._updateStatistic(this.itemInfo)
    },
    cancel() {
      this.itemInfo = {
        id: '',
        targetId: '',
        target: '',
        sourcelayer: '',
        sourceId: '',
        sourceName: '',
        filter: '',
        fields: '',
        fieldsName: '',
        fieldsType: '',
        flag: ''
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

