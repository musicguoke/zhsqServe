<template>
  <Content>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>交互管理</BreadcrumbItem>
      <BreadcrumbItem>版本描述</BreadcrumbItem>
    </Breadcrumb>
    <Card :style="{maxHeight: contentHeight}">
      <div class="tableSize">
        <el-table :data="list" border style="width: 100%">
          <el-table-column prop="id" label="id" sortable>
          </el-table-column>
          <el-table-column prop="version" label="版本号" sortable>
          </el-table-column>
          <el-table-column prop="imagePath" label="图片路径">
          </el-table-column>
          <el-table-column prop="listorder" label="版本排序" sortable>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" sortable>
          </el-table-column>
          <el-table-column label="操作" width="160" align="center">
            <template slot-scope="scope">
              <Button type="info" @click="detail(scope.row)" size="small">查看</Button>
              <Button type="success" @click="importFile(scope.row)" size="small">导入</Button>
              <Button type="error" @click="remove(scope.row)" size="small">删除</Button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="tablePage">
        <Page :total="listLength" @on-change="_getVersionList(page)"></Page>
      </div>
    </Card>
    <Modal v-model="modalShow" :closable='false' :mask-closable="false" :width="500" @on-ok="save" @on-cancel="cancel">
      <h3 slot="header" style="color:#2D8CF0">版本信息</h3>
      <Form :model="versionInfo" :label-width="60">
        <FormItem label="版本号">
          <Input v-model="versionInfo.version" placeholder="请输入版本号"></Input>
        </FormItem>
        <FormItem label="排序">
          <Input v-model="versionInfo.listorder" placeholder="请输入版本号"></Input>
        </FormItem>
        <FormItem label="图片地址">
          <Input v-model="versionInfo.imagePath" placeholder="请输入版本号"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="importModal" :closable='false' :mask-closable="false" :width="500" @on-ok="saveImport" @on-cancel="cancel">
      <h3 slot="header" style="color:#2D8CF0">版本描述信息导入</h3>
      <Form ref="file_form" label-position="left" :label-width="80">
        <FormItem label="版本号">
          <Input v-model="versionInfo.version" disabled></Input>
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
  </Content>
</template>

<script>
import { url } from '@/api/config'
import vSearch from '@/components/search/index'
import { getVersionDescList, getVersionDescById, deleteVersionDesc, uploadVersionDesc } from '@/api/version-des'

export default {
  components: {
    vSearch
  },
  data() {
    return {
      contentHeight: window.innerHeight - 174 + 'px',
      modalShow: false,
      importModal: false,
      uploadUrl: url,
      list: [],
      listLength: '',
      versionInfo: {
        version: '',
        listorder: '',
        imagePath: ''
      },
      file: ''
    }
  },
  created() {
    this._getVersionDescList()
  },
  methods: {
    _getVersionDescList(page) {
      getVersionDescList(page).then(res => {
        if (res.code === 20000) {
          res.data.list.map(v => {
            v.updateTime = this._mm.formatDate(v.updateTime)
          })
          this.list = res.data.list
          this.listLength = res.data.total
        } else {
          this.$Message.error('好像出什么问题了！')
        }
      })
    },
    _getVersionDescById(id) {
      getVersionDescById(id).then(res => {
        if (res.code === 20000) {
          this.versionInfo = {
            version: res.data.version,
            listorder: res.data.listorder,
            imagePath: res.data.imagePath
          }
          this.modalShow = true
        } else {
          this.$Message.error('好像出什么问题了！')
        }
      })
    },
    _deleteVersionDesc(id) {
      deleteVersionDesc(id).then(res => {
        if (res.code === 20000) {
          this.$Message.success(res.message)
          this._getVersionDescList()
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _uploadVersionDesc(data) {
      uploadVersionDesc(data).then(res => {
        if(res.code === 20000) {
          this.$Message.success(res.message)
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    boforeUpload(file) {
      this.file = file
    },
    importFile(row) {
      this.versionInfo.version = row.version
      this.importModal = true
    },
    detail(row) {
      this._getVersionDescById(row.id)
    },
    remove(row) {
      this.$Modal.confirm({
        content: '删除后数据无法恢复，是否继续？',
        onOk: () => {
          this._deleteVersionDesc(row.id)
        },
        onCancel: () => { }
      })
    },
    save() {
      
    },
    saveImport() {
      let formData = new FormData()
        // 向 formData 对象中添加文件
      formData.append('file', this.file)
      formData.append('version', this.versionInfo.version)
      this._uploadVersionDesc(formData)
    },
    cancel() {
      this.versionInfo = {
        version: '',
        listorder: '',
        imagePath: ''
      }
    }
  }
}
</script>

<style>
</style>
