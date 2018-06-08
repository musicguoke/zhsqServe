<template>
  <div class="card-content" style="min-height: 400px;">
    <Steps :current="current" v-if="newSys">
      <Step title="基本信息" content=""></Step>
      <Step v-if="sysOrRole" title="上传欢迎页" content=""></Step>
      <Step v-else title="专题配置" content=""></Step>
      <Step title="功能配置" content=""></Step>
      <Step title="数据配置" content=""></Step>
      <Step title="地图配置" content=""></Step>
      <Step title="字段权限" content=""></Step>
    </Steps>
    <Menu mode="horizontal" ref="tab_menu" style="width: 100%" v-if="!newSys" :theme="theme" :active-name="tabActiveName" @on-select="tabChange">
      <MenuItem name="0">基本信息</MenuItem>
      <MenuItem v-if="sysOrRole" name="1">上传欢迎页</MenuItem>
      <MenuItem v-else name="1">专题配置</MenuItem>
      <MenuItem name="2">功能配置</MenuItem>
      <MenuItem name="3">数据配置</MenuItem>
      <MenuItem name="4">地图配置</MenuItem>
      <MenuItem name="5">字段权限</MenuItem>
    </Menu>
    <div class="current-content">
      <Form :model="formItem" :label-width="80" style="width: 400px" v-show="current == 0 && sysOrRole">
        <FormItem label="系统名称">
          <Input v-model="formItem.sysName" placeholder="请输入系统名称"></Input>
        </FormItem>
        <FormItem label="系统类别">
          <Select v-model="formItem.type">
            <Option value="1">综合市情</Option>
            <Option value="2">综合区情</Option>
            <Option value="3">规划定位</Option>
          </Select>
        </FormItem>
        <FormItem label="地区选择">
          <Select v-model="formItem.areacode">
            <Option v-for="(item, index) in areaQxList" :value="item.areacode" :key="index">
              {{item.areaname}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="是否启用">
          <Select v-model="formItem.enable">
            <Option value="1">启用</Option>
            <Option value="0">暂不启用</Option>
          </Select>
        </FormItem>
      </Form>
      <Form :model="formRoleItem" :label-width="80" style="width: 400px" v-show="current == 0 && !sysOrRole">
        <FormItem label="角色名称">
          <Input v-model="formRoleItem.grName" placeholder="请输入角色名称"></Input>
        </FormItem>
        <FormItem label="是否启用">
          <Select v-model="formRoleItem.grIspass">
            <Option value="1">启用</Option>
            <Option value="0">暂不启用</Option>
          </Select>
        </FormItem>
      </Form>
      <div style="width: 500px" v-show="current == 1 && sysOrRole">
        <Form :model="uploadForm" :label-width="100">
          <FormItem label="ios_iphone">
            <Input v-model="uploadForm.ios_iphone" placeholder="上传后的地址" style="width: 57%"></Input>
            <Upload :action="`${uploadUrl}/sys/file/upload.do`" with-credentials :on-success="handleSuccess1">
              <Button type="ghost" style="display: inline" icon="ios-cloud-upload-outline">点击上传</Button>
            </Upload>
          </FormItem>
          <FormItem label="ios_ipad">
            <Input v-model="uploadForm.ios_ipad" placeholder="上传后的地址" style="width: 57%"></Input>
            <Upload :action="`${uploadUrl}/sys/file/upload.do`" with-credentials :on-success="handleSuccess2">
              <Button type="ghost" style="display: inline" icon="ios-cloud-upload-outline">点击上传</Button>
            </Upload>
          </FormItem>
          <FormItem label="android_phone">
            <Input v-model="uploadForm.android_phone" placeholder="上传后的地址" style="width: 57%"></Input>
            <Upload :action="`${uploadUrl}/sys/file/upload.do`" with-credentials :on-success="handleSuccess3">
              <Button type="ghost" style="display: inline" icon="ios-cloud-upload-outline">点击上传</Button>
            </Upload>
          </FormItem>
          <FormItem label="android_pad">
            <Input v-model="uploadForm.android_pad" placeholder="上传后的地址" style="width: 57%"></Input>
            <Upload :action="`${uploadUrl}/sys/file/upload.do`" with-credentials :on-success="handleSuccess4">
              <Button type="ghost" style="display: inline" icon="ios-cloud-upload-outline">点击上传</Button>
            </Upload>
          </FormItem>
          <FormItem label="pc">
            <Input v-model="uploadForm.pc" placeholder="上传后的地址" style="width: 57%"></Input>
            <Upload :action="`${uploadUrl}/sys/file/upload.do`" with-credentials :on-success="handleSuccess5">
              <Button type="ghost" style="display: inline" icon="ios-cloud-upload-outline">点击上传</Button>
            </Upload>
          </FormItem>
        </Form>
      </div>
      <div style="width: 500px" v-show="current == 1 && !sysOrRole">
        <my-tree :items="topicDataTree" :columns='topicDataColumns' @on-selection-change="selectTopicDataConfig"></my-tree>
      </div>
      <div style="width: 400px" v-show="current == 2">
        <Table border ref="selection" :columns="columns4" :data="featureList" @on-select-all="selectFeatureConfig" @on-select="selectFeatureConfig" @on-selection-change="selectFeatureConfig">
        </Table>
      </div>
      <div v-show="current == 3" class="table-tree-box" :style="{maxHeight: tableHeight}">
        <my-tree ref="treeTable" :items="dataTree" :columns='dataColumns' @on-selection-change="selectDataConfig"></my-tree>
      </div>
      <div style="width: 400px" v-show="current == 4">
        <Table border ref="selection" :columns="columns5" :data="mapConfigList" @on-select-all="selectMapConfig" @on-select="selectMapConfig" @on-selection-change="selectMapConfig">
        </Table>
      </div>
      <div style="width: 400px" class="select-box" v-show="current == 5">
        <Form :label-width="80">
          <FormItem label="权限等级">
            <Select v-model="qxLevel" @on-change="qx1Change" placeholder="请选择权限等级">
              <Option value="一级权限">一级权限</Option>
              <Option value="二级权限">二级权限</Option>
              <Option value="三级权限">三级权限</Option>
            </Select>
          </FormItem>
          <FormItem label="请选择权限">
            <Select v-model="funNum" placeholder="请先选择权限等级">
              <Option v-for="(item, index) in funAry" :value="item" :key="index">
                {{item}}
              </Option>
            </Select>
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="btn" v-if="newSys">
      <Button type="error" @click="cancel">取消</Button>
      <Button type="primary" @click="pre" v-if="this.current !== 0">上一步</Button>
      <Button type="primary" @click="next">{{btnContent}}</Button>
    </div>
    <div class="btn" v-if="!newSys">
      <Button type="error" @click="cancel">取消</Button>
      <Button type="primary" @click="save">完成</Button>
    </div>
  </div>
</template>

<script>
import { url } from '@/api/config'
import {
  getAreaQx,
  getDateTree,
  getMapConfig,
  getFeature,
  addSystem,
  searchSysById,
  updateSystem
} from '@/api/system'
import { addRole, updateRole, getRoleMapById } from '@/api/role'
import { getAreaList, getMsTabDatainfoById, getAreaCatalog, uploadImg } from '@/api/catalog'
import { getTopicDataTree } from '@/api/topics'
import MyTree from '@/components/my-tree/index'

export default {
  components: {
    MyTree
  },
  props: {
    newSys: {
      type: Boolean,
      default: false
    },
    sysOrRole: {
      type: Boolean,
      default: true
    },
    id: ''
  },
  data() {
    return {
      contentHeight: window.innerHeight - 136 + 'px',
      tableHeight: window.innerHeight - 298 + 'px',
      uploadUrl: url,
      appBgArray: [1],
      code: '', // 目录树code
      tabActiveName: '0',
      theme: 'light',
      uploadType: '',
      qxLevel: '一级权限',
      current: 0,
      btnContent: '下一步',
      formItem: {
        sysName: "",
        type: "",
        areacode: "",
        enable: '0'
      },
      formRoleItem: {
        grName: '',
        grIspass: '1'
      },
      uploadForm: {
        ios_iphone: '',
        ios_ipad: '',
        android_phone: '',
        android_pad: '',
        pc: ''
      },
      imageList: [],
      areaQxList: [],
      dataTree: [],
      topicDataTree: [],
      tempDataTree: [],
      tempTopicDataTree: [],
      mapConfigList: [],
      featureList: [],
      cilentAuthorityStr: '1',
      tabDataIdStr: '',
      mapIdStr: '',
      publishIdStr: '',
      funNum: '',
      funAry: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      sysId: '',
      grId: '',
      selectedRow: '', //选中编辑的系统项
      dataColumns: [
        {
          type: 'selection',
          width: '50',
        }, {
          title: '名称',
          key: 'title'
        }, {
          title: '编码',
          key: 'id',
          sortable: true
        }, {
          title: '排序',
          key: 'listorder'
        }, {
          title: '更新时间',
          key: 'updatetime'
        }
      ],
      topicDataColumns: [
        {
          type: 'selection',
          width: '50',
        },
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
        }
      ],
      columns4: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '功能名称',
          key: 'name'
        }
      ],
      columns5: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '地图名称',
          key: 'name'
        }
      ]
    }
  },
  watch: {
    // 手动更新iview menu选中项
    tabActiveName() {
      this.$nextTick(() => {
        this.$refs.tab_menu.updateActiveName()
      })
    }
  },
  created() { },
  methods: {
    addAppBg() {
      this.appBgArray.push(1)
    },
    deleteAppBg(index) {
      this.appBgArray.splice(index, 1)
    },
    cancel() {
      this.$emit('cancel')
      this.initFormData()
    },
    // 数据初始化
    initFormData() {
      Object.assign(this.$data, this.$options.data())
      this._getAreaList()
      if(!this.sysOrRole) {
        this._getDateTree()
      } else {
        this._getAreaCatalog()
      }
      this._getFeature()
      this._getMapConfig()
    },
    tabChange(name) {
      this.tabActiveName = name
      this.current = parseInt(name)
    },
    next() {
      if (this.current == 4) {
        this.btnContent = '完成'
      }
      if (this.current == 5) {
        this.done()
      }
      if (this.current < 5) {
        this.current += 1
      }
    },
    pre() {
      if (this.current !== 2) {
        this.btnContent = '下一步'
      }
      this.current -= 1
    },
    done() {
      if (this.sysOrRole) {
        this._addSystem()
      } else {
        this._addRole()
      }
    },
    save() {
      if (this.sysOrRole) {
        this._updateSystem()
      } else {
        this._updateRole()
      }
    },
    handleSuccess1(res) {
      let data = {
        type: "ios_iphone",
        imagePath: res.data,
        imageType: "1"
      }
      this.imageList.push(data)
      this.uploadForm.ios_iphone = res.data
    },
    handleSuccess2(res) {
      let data = {
        type: "ios_ipad",
        imagePath: res.data,
        imageType: "1"
      }
      this.imageList.push(data)
      this.uploadForm.ios_ipad = res.data
    },
    handleSuccess3(res) {
      let data = {
        type: "android_phone",
        imagePath: res.data,
        imageType: "1"
      }
      this.imageList.push(data)
      this.uploadForm.android_phone = res.data
    },
    handleSuccess4(res) {
      let data = {
        type: "android_pad",
        imagePath: res.data,
        imageType: "1"
      }
      this.imageList.push(data)
      this.uploadForm.android_pad = res.data
    },
    handleSuccess5(res) {
      let data = {
        type: "pc",
        imagePath: res.data,
        imageType: "1"
      }
      this.imageList.push(data)
      this.uploadForm.pc = res.data
    },
    selectMapConfig(section, row) {
      // 已选择地图项
      let id = []
      section.map(v => id.push(v.id))
      this.mapIdStr = id.toString()
    },
    selectTopicDataConfig(section) {
      // 专题数据选择
      this.publishIdStr = section.toString()
    },
    selectDataConfig(section) {
      // 数据选择
      this.tabDataIdStr = section.toString()
    },
    selectFeatureConfig(section, row) {
      //已选择功能项
      let id = []
      section.map(v => id.push(v.id))
      this.cilentAuthorityStr = id.toString()
    },
    // 权限选择
    qx1Change(value) {
      console.log(value)
      if (value === '一级权限') {
        this.funAry = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      } else if (value === '二级权限') {
        this.funAry = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
      } else {
        this.funAry = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
      }
    },
    handleCheckData(arr) {
      let list = []
      arr.map(v => {
        list.push(v.id)
        if (v.children && v.children.length > 0) {
          this.handleCheckData(v.children)
        }
      })
      return list.toString()
    },
    _getAreaList() {
      getAreaList().then(res => {
        if (res.code === 20000) {
          this.areaQxList = res.data.list
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _getAreaCatalog() {
      getAreaCatalog().then(res => {
        this.dataTree = this.tempDataTree = res
      })
    },
    _getDateTree(id) {
      getDateTree(id).then(res => {
        this.dataTree = this.tempDataTree = res
      })
    },
    _getTopicDataTree() {
      getTopicDataTree().then(res => {
        this.topicDataTree = this.tempTopicDataTree = res
      })
    },
    _getMapConfig() {
      getMapConfig().then(res => {
        if (res.code === 20000) {
          this.mapConfigList = res.data.list
          this.mapConfigList.map(v => {
            v.name = v.mName
            v._checked = false
          })
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _getFeature(id) {
      getFeature(id).then(res => {
        if (res.code === 20000) {
          let list = []
          res.data.list.map(v => {
            v.name = v.moduleName
            v._checked = false
            if (v.id === 1) {
              v._checked = true
              v._disabled = true
            }
            list.push(v)
          })
          this.featureList = list
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _addSystem() {
      let data = Object.assign({}, {
        tabDataIdStr: this.tabDataIdStr,
        cilentAuthorityStr: this.cilentAuthorityStr,
        mapIdStr: this.mapIdStr,
        funNum: this.funNum,
        imageList: this.imageList
      }, this.formItem)
      addSystem(JSON.stringify(data)).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`添加${res.message}`)
          this.cancel()
        } else {
          this.$Message.error(`添加${res.message}`)
        }
      })
    },
    _updateSystem() {
      let data = Object.assign({}, {
        tabDataIdStr: this.tabDataIdStr,
        cilentAuthorityStr: this.cilentAuthorityStr,
        mapIdStr: this.mapIdStr,
        funNum: this.funNum,
        id: this.sysId,
        imageList: this.imageList
      }, this.formItem)
      updateSystem(JSON.stringify(data)).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`修改${res.message}`)
          this.cancel()
        } else {
          this.$Message.error(`修改${res.message}`)
        }
      })
    },
    _searchSysById(id) {
      this.current = 0
      searchSysById(id).then(res => {
        if (res.code === 20000) {
          this.formItem = {
            sysName: res.data.sysName,
            type: res.data.type.toString(),
            areacode: res.data.areacode,
            enable: res.data.enable.toString()
          }
          if(res.data.imageList) {
            res.data.imageList.map(v => {
              this.uploadForm[v.type] = v.imagePath
            })
          }
          this.uploadForm
          this.sysId = res.data.id
          let list = []
          this.featureList.map(v => {
            // 判断该系统的已选功能项
            v._checked = false
            list = []
            res.data.cilentAuthorityList.map(h => {
              if (v.id === h.funId) {
                v._checked = true
              }
              list.push(h.funId)
            })
          })
          this.cilentAuthorityStr = list.toString()
          this.mapConfigList.map((v, index) => {
            // 判断该系统的已选地图项
            v._checked = false
            list = []
            res.data.mapList.map(h => {
              if (v.id === h.funId) {
                v._checked = true
              }
              list.push(h.funId)
            })
            this.mapConfigList.splice(index, 1, v)
          })
          this.mapIdStr = list.toString()
          list = []
          res.data.msSystemDatainfoList.map(v => {
            this.tempDataTree = this.checkData(this.tempDataTree, v.dataId)
            list.push(v.dataId)
          })
          this.tabDataIdStr = list.toString()
          this.dataTree = this.tempDataTree
          if (res.data.funNum < 11) {
            this.qxLevel = '一级权限'
          } else if (res.data.funNum > 10 && res.data.funNum < 21) {
            this.qxLevel = '二级权限'
          } else if (res.data.funNum > 20) {
            this.qxLevel = '三级权限'
          }
          this.qx1Change(this.qxLevel)
          this.funNum = res.data.funNum
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    checkData(list, id) {
      list.map((h, index) => {
        if (id === h.id) {
          h.selected = true
        } else if (h.children) {
          this.checkData(h.children, id)
        }
        list.splice(index, 1, h)
      })
      return list
    },
    //获得角色详细信息
    _getRoleMapById(id) {
      getRoleMapById(id).then(res => {
        if (res.code === 20000) {
          this.formRoleItem = {
            grName: res.data.grName,
            grIspass: res.data.grIspass.toString()
          }
          this.grId = id
          let list = []
          this.featureList.map(v => {
            // 判断该系统的已选功能项
            v._checked = false
            list = []
            res.data.cilentAuthorityList.map(h => {
              if (v.id === h.sysFun) {
                v._checked = true
              }
              list.push(h.sysFun)
            })
          })
          this.cilentAuthorityStr = list.toString()
          this.mapConfigList.map((v, index) => {
            // 判断该系统的已选地图项
            v._checked = false
            list = []
            res.data.mapList.map(h => {
              if (v.id === h.sysFun) {
                v._checked = true
              }
              list.push(h.sysFun)
            })
            this.mapConfigList.splice(index, 1, v)
          })
          this.mapIdStr = list.toString()
          list = []
          res.data.publishList.map(v => {
            this.tempTopicDataTree = this.checkRoleData(this.tempTopicDataTree, v.publishId)
            list.push(v.publishId)
          })
          this.publishIdStr = list.toString()
          this.topicDataTree = this.tempTopicDataTree
          list = []
          res.data.msRoleDataList.map(v => {
            this.tempDataTree = this.checkRoleData(this.tempDataTree, v.sysData)
            list.push(v.sysData)
          })
          this.tabDataIdStr = list.toString()
          this.dataTree = this.tempDataTree
          if (res.data.funNum < 11) {
            this.qxLevel = '一级权限'
          } else if (res.data.funNum > 10 && res.data.funNum < 21) {
            this.qxLevel = '二级权限'
          } else if (res.data.funNum > 20) {
            this.qxLevel = '三级权限'
          }
          this.qx1Change(this.qxLevel)
          this.funNum = res.data.funNum
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    checkRoleData(list, id) {
      list.map((h, index) => {
        if (id === h.id) {
          h.selected = true
        } else if (h.children) {
          this.checkRoleData(h.children, id)
        }
        list.splice(index, 1, h)
      })
      return list
    },
    _addRole() {
      let data = Object.assign({}, {
        tabDataIdStr: this.tabDataIdStr,
        cilentAuthorityStr: this.cilentAuthorityStr,
        mapIdStr: this.mapIdStr,
        funNum: this.funNum,
        sysId: this.id,
        publishIdStr: this.publishIdStr
      }, this.formRoleItem)
      addRole(data).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`添加${res.message}`)
          this.cancel()
        } else {
          this.$Message.error(`添加${res.message}`)
        }
      })
    },
    _updateRole() {
      let data = Object.assign({}, {
        tabDataIdStr: this.tabDataIdStr,
        cilentAuthorityStr: this.cilentAuthorityStr,
        mapIdStr: this.mapIdStr,
        funNum: this.funNum,
        sysId: this.id,
        grId: this.grId,
        publishIdStr: this.publishIdStr
      }, this.formRoleItem)
      updateRole(data).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`修改${res.message}`)
          this.cancel()
        } else {
          this.$Message.error(`修改${res.message}`)
        }
      })
    },
    _uploadImg() {
      let formData = new FormData()
      // 向 formData 对象中添加文件
      formData.append('file', this.uploadData.file)
      formData.append('type', this.uploadData.type)
      uploadImg(formData).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ivu-tree-arrow {
  color: #495060;
}
.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.img-btn {
  display: inline-block;
}
.current-content {
  margin: 16px 0;
}
form {
  width: 100%;
}
.select-box {
  display: flex;
}
.ivu-menu-horizontal {
  height: 26px;
  line-height: 26px;
}
.ivu-upload {
  display: inline;
}
</style>
