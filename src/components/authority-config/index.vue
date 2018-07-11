<template>
  <div class="card-content" v-show="isShow" style="min-height: 400px;">
    <Steps :current="current" v-if="newSys">
      <Step title="基本信息" content=""></Step>
      <Step v-if="type!==2" title="数据配置" content=""></Step>
      <Step v-else title="专题配置" content=""></Step>
      <Step title="功能配置" content=""></Step>
      <Step title="地图配置" content=""></Step>
      <Step title="字段权限" content=""></Step>
    </Steps>
    <Menu mode="horizontal" ref="tab_menu" style="width: 100%" v-if="!newSys" :theme="theme" :active-name="tabActiveName" @on-select="tabChange">
      <MenuItem name="0">基本信息</MenuItem>
      <MenuItem v-if="type!==2" name="1">数据配置</MenuItem>
      <MenuItem v-else name="1">专题配置</MenuItem>
      <MenuItem name="2">功能配置</MenuItem>
      <MenuItem name="3">地图配置</MenuItem>
      <MenuItem name="4">字段权限</MenuItem>
    </Menu>
    <div class="current-content">
      <Form :model="formItem" :label-width="120" style="width: 560px" v-show="current == 0 && sysOrRole">
        <FormItem label="系统名称">
          <Input v-model="formItem.sysName" placeholder="请输入系统名称"></Input>
        </FormItem>
        <FormItem label="系统类别">
          <Select v-model="formItem.type" @on-change="sysTypeChange" :disabled="!newSys">
            <Option value="1">综合市情</Option>
            <Option value="2">规划定位</Option>
            <Option value="3">综合区情</Option>
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
        <FormItem label="ios_iphone封面">
          <Input v-model="formItem.ios_iphone" placeholder="上传后的地址" style="width: 77%"></Input>
          <Upload :action="`${uploadUrl}/sys/file/upload.do`" with-credentials :on-success="handleSuccess1">
            <Button type="ghost" style="display: inline" icon="ios-cloud-upload-outline">点击上传</Button>
          </Upload>
        </FormItem>
        <FormItem label="ios_ipad封面">
          <Input v-model="formItem.ios_ipad" placeholder="上传后的地址" style="width: 77%"></Input>
          <Upload :action="`${uploadUrl}/sys/file/upload.do`" with-credentials :on-success="handleSuccess2">
            <Button type="ghost" style="display: inline" icon="ios-cloud-upload-outline">点击上传</Button>
          </Upload>
        </FormItem>
        <FormItem label="android_phone封面">
          <Input v-model="formItem.android_phone" placeholder="上传后的地址" style="width: 77%"></Input>
          <Upload :action="`${uploadUrl}/sys/file/upload.do`" with-credentials :on-success="handleSuccess3">
            <Button type="ghost" style="display: inline" icon="ios-cloud-upload-outline">点击上传</Button>
          </Upload>
        </FormItem>
        <FormItem label="android_pad封面">
          <Input v-model="formItem.android_pad" placeholder="上传后的地址" style="width: 77%"></Input>
          <Upload :action="`${uploadUrl}/sys/file/upload.do`" with-credentials :on-success="handleSuccess4">
            <Button type="ghost" style="display: inline" icon="ios-cloud-upload-outline">点击上传</Button>
          </Upload>
        </FormItem>
        <FormItem label="pc封面">
          <Input v-model="formItem.pc" placeholder="上传后的地址" style="width: 77%"></Input>
          <Upload :action="`${uploadUrl}/sys/file/upload.do`" with-credentials :on-success="handleSuccess5">
            <Button type="ghost" style="display: inline" icon="ios-cloud-upload-outline">点击上传</Button>
          </Upload>
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
      <div style="width: 500px" v-show="current == 1 && !sysOrRole && type == 2">
        <my-tree :items="topicDataTree" :columns='topicDataColumns' @on-selection-change="selectTopicDataConfig"></my-tree>
      </div>
      <div v-show="current == 1 && type !== 2" class="table-tree-box" :style="{maxHeight: tableHeight + 'px'}">
        <my-tree ref="treeTable" :items="dataTree" :columns='dataColumns' :buildSys="buildSys" @on-selection-change="selectDataConfig"></my-tree>
      </div>
      <div style="width: 400px;overflow:auto" :style="{maxHeight: tableHeight + 'px'}" v-show="current == 2">
        <Table border ref="selection" :columns="columns4" :data="featureList" @on-select-all="selectFeatureConfig" @on-select="selectFeatureConfig" @on-selection-change="selectFeatureConfig"></Table>
      </div>
      <div style="width: 400px" v-show="current == 3">
        <Table border ref="selection" :columns="columns5" :data="mapConfigList" @on-select-all="selectMapConfig" @on-select="selectMapConfig" @on-selection-change="selectMapConfig">
        </Table>
      </div>
      <div style="width: 400px;paddingBottom: 60px;" class="select-box" v-show="current == 4">
        <Form :label-width="80">
          <FormItem label="权限等级">
            <Select v-if="sys" v-model="qxLevel" @on-change="qx1Change" placeholder="请选择权限等级">
              <Option v-if="funNum < 11 || funNum < 21" value="一级权限">一级权限</Option>
              <Option v-if="funNum < 21" value="二级权限">二级权限</Option>
              <Option v-if="funNum > 20" value="三级权限">三级权限</Option>
            </Select>
            <Select v-else v-model="qxLevel" @on-change="qx1Change" placeholder="请选择权限等级">
              <Option value="一级权限">一级权限</Option>
              <Option value="二级权限">二级权限</Option>
              <Option value="三级权限">三级权限</Option>
            </Select>
          </FormItem>
          <FormItem label="请选择权限">
            <Select v-model="funNum" placeholder="请先选择权限等级">
              <Option v-for="item in funAry" :value="item" :key="item">
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
      <Button type="primary" @click="next('formItem')">{{btnContent}}</Button>
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
  getBuildConfig,
  addSystem,
  searchSysById,
  updateSystem
} from '@/api/system'
import { addRole, updateRole, getRoleMapById, getRoleModuleById } from '@/api/role'
import { getAreaList, getMsTabDatainfoById, uploadImg } from '@/api/catalog'
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
    buildSys: {
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
      isShow: false,
      contentHeight: window.innerHeight - 136 + 'px',
      tableHeight: window.innerHeight - 298,
      uploadUrl: url,
      appBgArray: [1],
      code: '', // 目录树code
      tabActiveName: '0',
      theme: 'light',
      uploadType: '',
      qxLevel: '一级权限',
      sys: '',
      sysType: '',
      current: 0,
      btnContent: '下一步',
      formItem: {
        sysName: "",
        type: "1",
        areacode: "",
        enable: '0'
      },
      formRoleItem: {
        grName: '',
        grIspass: '1'
      },
      imageList: [],
      areaQxList: [],
      dataTree: [],
      topicDataTree: [],
      tempDataTree: [],
      tempTopicDataTree: [],
      mapConfigList: [],
      featureList: [],
      tempFeatureList: [],
      cilentAuthorityStr: '1',
      tabDataIdStr: '',
      mapIdStr: '',
      publishIdStr: '',
      ms720Str: '',
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
          key: 'dataId',
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
  created() {
    this.sys = this.$route.query.id || ''
    this.type = Number(this.$route.query.type) || ''
  },
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
    },
    tabChange(name) {
      this.tabActiveName = name
      this.current = parseInt(name)
    },
    next() {
      if (this.current == 3) {
        this.btnContent = '完成'
      }
      if (this.current == 4) {
        this.done()
      }
      if (this.current < 4) {
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
      if (res.code == 20000) {
        this.imageList.push(data)
        this.$set(this.formItem, 'ios_iphone', res.data)
      } else {
        this.$Message.error(res.message)
      }
    },
    handleSuccess2(res) {
      let data = {
        type: "ios_ipad",
        imagePath: res.data,
        imageType: "1"
      }
      if (res.code == 20000) {
        this.imageList.push(data)
        this.$set(this.formItem, 'ios_ipad', res.data)
      } else {
        this.$Message.error(res.message)
      }
    },
    handleSuccess3(res) {
      let data = {
        type: "android_phone",
        imagePath: res.data,
        imageType: "1"
      }
      if (res.code == 20000) {
        this.imageList.push(data)
        this.$set(this.formItem, 'android_phone', res.data)
      } else {
        this.$Message.error(res.message)
      }
    },
    handleSuccess4(res) {
      let data = {
        type: "android_pad",
        imagePath: res.data,
        imageType: "1"
      }
      if (res.code == 20000) {
        this.imageList.push(data)
        this.$set(this.formItem, 'android_pad', res.data)
      } else {
        this.$Message.error(res.message)
      }
    },
    handleSuccess5(res) {
      let data = {
        type: "pc",
        imagePath: res.data,
        imageType: "1"
      }
      if (res.code == 20000) {
        this.imageList.push(data)
        this.$set(this.formItem, 'pc', res.data)
      } else {
        this.$Message.error(res.message)
      }
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
    // 系统类别发生变化
    sysTypeChange(value) {
      this.featureList = this.tempFeatureList.filter(v => v.permissionType == value)
    },
    // 权限选择
    qx1Change(value) {
      this.funNum = ''
      let list = []
      this.funAry = []
      if (value === '一级权限') {
        list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        list.map(v => {
          this.funAry.push(v)
        })
      } else if (value === '二级权限') {
        list = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        list.map(v => {
          this.funAry.push(v)
        })
      } else {
        list = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
        list.map(v => {
          this.funAry.push(v)
        })
      }
    },
    _getRoleModuleById(id) {
      getRoleModuleById(id).then(res => {
        this.mapConfigList = res.mapConfigList
        this.mapConfigList.map(v => {
          v.name = v.mName
          v._checked = false
        })
        let list = []
        res.cilentAuthorityList.map(v => {
          v.name = v.moduleName
          v._checked = false
          if (v.id === 1) {
            v._checked = true
            v._disabled = true
          }
          list.push(v)
        })
        this.featureList = list
        this.dataTree = res.json720.length > 0 ? res.json720 : res.tabDataTreeJson
        this.topicDataTree = res.dataPublishJson
        if(id) {
          this._getRoleMapById(id)
        } else {
          this.isShow = true
          this.$emit('isShow', this.isShow)
        }
      })
    },
    _getSysMapById(id, type) {
      getBuildConfig(id).then(res => {
        let sysType = type || 1
        this.mapConfigList = res.mapConfigList
        this.mapConfigList.map(v => {
          v.name = v.mName
          v._checked = false
        })
        this.tempFeatureList = res.cilentAuthorityList
        this.tempFeatureList.map(v => {
          v.name = v.moduleName
          v._checked = false
        })
        this.featureList = this.tempFeatureList.filter(v => v.permissionType == sysType)
        this.dataTree = this.tempDataTree = res.tabDataTreeJson
        this.topicDataTree = this.tempTopicDataTree = res.dataPublishJson
        if(id) {
          this._searchSysById(id)
        } else {
          this.isShow = true
          this.$emit('isShow', this.isShow)
        }
      })
    },
    _getBuildConfig(lid, str, type) {
      let id = ''
      if(typeof (lid) === 'number') {
        id = lid
      }
      this.checkFunNum(this.$route.query.funNum)
      if (str === 'role') { //获取角色信息
        this._getRoleModuleById(id)
      } else if (str === 'sys') { //获取系统信息
        this._getAreaList() //区域列表
        this._getSysMapById(id, type)
      }
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
    _addSystem() {
      let data = Object.assign({}, {
        tabDataIdStr: this.$refs.treeTable.checkGroup.toString(),
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
        tabDataIdStr: this.$refs.treeTable.checkGroup.toString(),
        cilentAuthorityStr: this.cilentAuthorityStr,
        mapIdStr: this.mapIdStr,
        funNum: this.funNum,
        id: this.sysId,
        imageList: this.imageList,
        sysName: this.formItem.sysName,
        type: this.formItem.type,
        areacode: this.formItem.areacode,
        enable: this.formItem.enable,
      })
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
          if (res.data.imageList) {
            res.data.imageList.map(v => {
              this.formItem[v.type] = v.imagePath
            })
          }
          this.sysId = res.data.id
          let list = []
          this.featureList.map((v, index) => {
            // 判断该系统的已选功能项
            v._checked = false
            list = []
            res.data.cilentAuthorityList.map(h => {
              if (v.id === h.funId) {
                v._checked = true
                this.featureList.splice(index, 1, v)
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
          this.checkFunNum(res.data.funNum)
          this.isShow = true
          this.$emit('isShow', this.isShow)
        } else {
          this.$Message.error(res.message)
        }
      })
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
          // 720已选
          res.data.ms720ServerList.map(v => {

          })
          this.ms720Str = list
          list = []
          res.data.publishList.map(v => {
            list.push(v.publishId)
          })
          this.publishIdStr = list.toString()
          this.checkFunNum(res.data.funNum)
          this.isShow = true
          this.$emit('isShow', this.isShow)
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    checkFunNum(funNum) {
      if (funNum < 11) {
        this.qxLevel = '一级权限'
      } else if (funNum > 10 && funNum < 21) {
        this.qxLevel = '二级权限'
      } else if (funNum > 20) {
        this.qxLevel = '三级权限'
      }
      this.qx1Change(this.qxLevel)
      this.funNum = funNum
    },
    _addRole() {
      let data = Object.assign({}, {
        tabDataIdStr: this.$refs.treeTable.checkGroup.toString(),
        cilentAuthorityStr: this.cilentAuthorityStr,
        mapIdStr: this.mapIdStr,
        funNum: this.funNum,
        sysId: this.id,
        publishIdStr: this.publishIdStr,
        ms720Str: this.ms720Str
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
        tabDataIdStr: this.$refs.treeTable.checkGroup.toString(),
        cilentAuthorityStr: this.cilentAuthorityStr,
        mapIdStr: this.mapIdStr,
        funNum: this.funNum,
        sysId: this.id,
        grId: this.grId,
        publishIdStr: this.publishIdStr,
        ms720Str: this.ms720Str
      }, this.formRoleItem)
      updateRole(data).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`修改${res.message}`)
          this.cancel()
        } else {
          this.$Message.error(`修改${res.message}`)
        }
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
