<template>
  <Content>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>交互管理</BreadcrumbItem>
      <BreadcrumbItem>软件版本</BreadcrumbItem>
    </Breadcrumb>
    <Card :style="{maxHeight: contentHeight}">
      <v-search :search-show="false" @on-build="build" @on-import="importFile" />
      <div class="tableSize">
        <el-table :data="list" border style="width: 100%">
          <el-table-column prop="vId" label="vId" sortable>
          </el-table-column>
          <el-table-column prop="vTitle" label="版本名称" sortable>
          </el-table-column>
          <el-table-column prop="vVersion" label="版本号" sortable>
          </el-table-column>
          <el-table-column prop="vPlatform" label="运行平台">
          </el-table-column>
          <el-table-column prop="vAddtime" label="添加时间" sortable>
          </el-table-column>
          <el-table-column label="操作" width="160" align="center">
            <template slot-scope="scope">
              <Button type="info" @click="detail(scope.row)" size="small" class="marginRight">查看</Button>
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
        <FormItem label="版本名称">
          <Input v-model="versionInfo.vTitle" placeholder="请输入版本名称"></Input>
        </FormItem>
        <FormItem label="版本号">
          <Input v-model="versionInfo.vVersion" placeholder="请输入版本号"></Input>
        </FormItem>
        <FormItem label="运行平台">
          <Select v-model="versionInfo.vPlatform" placeholder="请选择设备类型">
            <Option value="ios_iphone">ios_iphone</Option>
            <Option value="ios_ipad">ios_ipad</Option>
            <Option value="android_phone">android_phone</Option>
            <Option value="android_pad">android_pad</Option>
            <Option value="pc">pc</Option>
          </Select>
        </FormItem>
        <FormItem label="文件地址">
          <Input v-model="versionInfo.vUrl" placeholder="请输入版本号"></Input>
        </FormItem>
      </Form>
    </Modal>
  </Content>
</template>

<script>
import vSearch from '@/components/search/index'
import { getVersionList, addVersion, getVersionById, deleteVersion, deleteVersions, uploadVersion } from '@/api/software-version'

export default {
  components: {
    vSearch
  },
  data() {
    return {
      contentHeight: window.innerHeight - 174 + 'px',
      modalShow: false,
      list: [],
      listLength: '',
      versionInfo: {
        vTitle: '',
        vVersion: '',
        vPlatform: '',
        vUrl: ''
      }
    }
  },
  created() {
    this._getVersionList()
  },
  methods: {
    _getVersionList(page) {
      getVersionList(page).then(res => {
        if (res.code === 20000) {
          res.data.list.map(v => {
            v.vAddtime = this._mm.formatDate(v.vAddtime)
          })
          this.list = res.data.list
          this.listLength = res.data.total
        } else {
          this.$Message.error('好像出什么问题了！')
        }
      })
    },
    _getVersionById(id) {
      getVersionById(id).then(res => {
        if (res.code === 20000) {
          this.modalShow = true
          this.versionInfo = {
            vTitle: res.data.vTitle,
            vVersion: res.data.vVersion,
            vPlatform: res.data.vPlatform,
            vUrl: res.data.vUrl
          }
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
    build() {
      this.modalShow = true
    },
    importFile() {

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
    save() {},
    cancel() {
      this.versionInfo = {
        vTitle: '',
        vVersion: '',
        vPlatform: '',
        vUrl: ''
      }
    }
  }
}
</script>

<style>
</style>
