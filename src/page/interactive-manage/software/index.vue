<template>
  <Content>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>版本管理</BreadcrumbItem>
      <BreadcrumbItem>软件版本</BreadcrumbItem>
    </Breadcrumb>
    <Card :style="{maxHeight: contentHeight}">
      <v-search
        v-if="userinfo.role!==3"
        :search-show="false"
        :import-show="false"
        @on-build="build"
        :disabled="selectedId.length <= 0"
        @on-delete="deleteMany"
      />
      <div class="tableSize">
        <el-table
          :data="list"
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
          @filter-change="handleFilterChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <!-- <el-table-column prop="vId" label="ID" sortable>
          </el-table-column> -->
          <el-table-column prop="vTitle" label="版本名称" sortable>
          </el-table-column>
          <el-table-column prop="vVersion" label="版本号" sortable>
          </el-table-column>
          <el-table-column
            prop="vSysId"
            label="系统类型"
            column-key="sysType"
            :filters="[{ text: '综合市情', value: '1' }, { text: '规划定位', value: '2' }, { text: '综合区情', value: '3' }]"
          >
          </el-table-column>
          <el-table-column prop="vPlatform" label="运行平台">
          </el-table-column>
          <el-table-column prop="vAddtime" label="添加时间" sortable>
          </el-table-column>
          <el-table-column v-if="userinfo.role!==3" label="操作" width="160" align="center">
            <template slot-scope="scope">
              <Button type="primary" @click="detail(scope.row)" size="small" class="marginRight">查看</Button>
              <Button type="error" @click="remove(scope.row)" size="small">删除</Button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="tablePage">
        <Page :total="listLength" :current="page" @on-change="handlePageChange"></Page>
      </div>
    </Card>
    <Modal v-model="modalShow" :closable='false' :mask-closable="false" :width="500">
      <h3 slot="header" style="color:#2D8CF0">版本信息</h3>
      <Form ref="softwareForm" :rules="rules" :model="versionInfo" :label-width="90">
        <FormItem label="版本名称">
          <Input v-model="versionInfo.vTitle" placeholder="请输入版本名称"></Input>
        </FormItem>
        <FormItem label="版本号">
          <Input v-model="versionInfo.vVersion" placeholder="请输入版本号"></Input>
        </FormItem>
        <FormItem label="系统类型" prop="vSysId">
          <Select v-model="versionInfo.vSysId" placeholder="请选择系统类型">
            <Option value="1">综合市情</Option>
            <Option value="2">规划定位</Option>
            <Option value="3">综合区情</Option>
          </Select>
        </FormItem>
        <FormItem label="运行平台" prop="vPlatform">
          <Select v-model="versionInfo.vPlatform" placeholder="请选择设备类型">
            <Option value="android_phone">android_phone</Option>
            <Option value="android_pad">android_pad</Option>
          </Select>
        </FormItem>
        <FormItem label="是否强制更新">
          <RadioGroup v-model="versionInfo.vIsforced">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="选择文件">
          <Input v-model="versionInfo.vUrl" placeholder="文件地址"></Input>
          <Upload 
            :action="`${uploadUrl}/sys/msVersion/uploadVersion.do`" 
            with-credentials
            accept=".apk"
            :on-success="handleSuccess"
          >
            <Button type="ghost" icon="ios-cloud-upload-outline">请选择文件</Button>
          </Upload>
          <Alert show-icon>
            导入须知
            <template slot="desc">
              <p>1、导入文件大小不超过100MB.</p>
              <p>2、支持ipa、apk和app类型.</p>
            </template>
          </Alert>
        </FormItem>
        <FormItem label="更新说明">
          <Input v-model="versionInfo.vContent" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancel">取消</Button>
        <Button type="primary" @click="save">保存</Button>
      </div>
    </Modal>
  </Content>
</template>

<script>
import { url } from '@/api/config'
import vSearch from '@/components/search/index'
import { getVersionList, addVersion, getVersionById, deleteVersion, deleteVersions } from '@/api/software-version'

export default {
  components: {
    vSearch
  },
  data() {
    return {
      contentHeight: window.innerHeight - 174 + 'px',
      uploadUrl: url,
      modalShow: false,
      selectedId: [],
      list: [],
      listLength: '',
      isNew: false,
      page: 1,
      sysType: '',
      versionInfo: {
        vTitle: '',
        vVersion: '',
        vPlatform: '',
        vUrl: '',
        vIsforced: '0',
        vContent: '',
        vSysId: '',
        vForcedContent: '',
        vSourcename: '',
        sysIdStr: ''
      },
      rules: {
        vPlatform: [
          { required: true, message: '运行平台不能为空', trigger: 'blur' }
        ],
        vSysId: [
          { required: true, message: '系统类型不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    userinfo() {
      return JSON.parse(localStorage.getItem('userInfo'))
    }
  },
  created() {
    this._getVersionList()
  },
  methods: {
    handlePageChange(page) {
      this.page = page
      this._getVersionList()
    },
    handleFilterChange(arr) {
      this.sysType = arr['sysType'].toString()
      this._getVersionList()
    },
    _getVersionList() {
      getVersionList(this.page, this.sysType).then(res => {
        if (res.code === 20000) {
          res.data.list.map(v => {
            v.vAddtime = this._mm.formatDate(v.vAddtime)
            if (v.vSysId == 1) {
              v.vSysId = '综合市情'
            } else if (v.vSysId == 2) {
              v.vSysId = '规划定位'
            } else if (v.vSysId == 3) {
              v.vSysId = '综合区情'
            }
          })
          this.list = res.data.list
          this.listLength = res.data.total
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _addVersion(data) {
      addVersion(data).then(res => {
        if (res.code === 20000) {
          this.modalShow = false
          this._getVersionList()
          this.$Message.success(res.message)
        } else {
          this.$Message.error('好像出什么问题了！')
        }
      })
    },
    _getVersionById(id) {
      getVersionById(id).then(res => {
        if (res.code === 20000) {
          this.versionInfo = {
            vTitle: res.data.vTitle,
            vVersion: res.data.vVersion,
            vPlatform: res.data.vPlatform,
            vUrl: res.data.vUrl,
            vIsforced: res.data.vIsforced.toString(),
            vContent: res.data.vContent,
            vSysId: res.data.vSysId,
            vForcedContent: res.data.vForcedContent,
            vSourcename: res.data.vSourcename,
            sysIdStr: res.data.sysIdStr
          }
          this.isNew = false
          this.modalShow = true
        } else {
          this.$Message.error('好像出什么问题了！')
        }
      })
    },
    _deleteVersion(id) {
      deleteVersion(id).then(res => {
        if (res.code === 20000) {
          this.$Message.success(res.message)
          this._getVersionList()
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _deleteVersions(id) {
      deleteVersions(id).then(res => {
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
          this._deleteVersions(this.selectedId.toString())
        },
        onCancel: () => { }
      })
    },
    build() {
      this.isNew = true
      this.modalShow = true
    },
    handleSuccess(res) {
      this.versionInfo.vUrl = res.data
    },
    detail(row) {
      this._getVersionById(row.vId)
    },
    remove(row) {
      this.$Modal.confirm({
        content: '删除后数据无法恢复，是否继续？',
        onOk: () => {
          this._deleteVersion(row.vId)
        },
        onCancel: () => { }
      })
    },
    save() {
      this.$refs['softwareForm'].validate((valid) => {
        if (valid) {
          if(this.isNew) {
            this._addVersion(this.versionInfo)
          } else {
            this.cancel()
          }
        }
      })
    },
    cancel() {
      this.modalShow = false
      this.$refs['softwareForm'].resetFields()
      this.versionInfo = {
        vTitle: '',
        vVersion: '',
        vPlatform: '',
        vUrl: '',
        vIsforced: '0',
        vContent: '',
        vSysId: '',
        vForcedContent: '',
        vSourcename: '',
        sysIdStr: ''
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

