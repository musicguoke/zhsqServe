<template>
  <div class="card-content" v-show="isShow" style="min-height: 400px;">
    <Steps :current="current" v-if="newSys">
      <Step title="基本信息" content=""></Step>
      <Step title="720配置" content=""></Step>
      <Step title="专题配置" content=""></Step>
      <Step title="功能配置" content=""></Step>
      <Step title="地图配置" content=""></Step>
      <Step title="字段权限" content=""></Step>
    </Steps>
    <Menu mode="horizontal" ref="tab_menu" style="width: 100%" v-if="!newSys" :theme="theme" :active-name="tabActiveName" @on-select="tabChange">
      <MenuItem name="0">基本信息</MenuItem>
      <MenuItem name="1">720配置</MenuItem>
      <MenuItem name="2">专题配置</MenuItem>
      <MenuItem name="3">功能配置</MenuItem>
      <MenuItem name="4">地图配置</MenuItem>
      <MenuItem name="5">字段权限</MenuItem>
    </Menu>
    <div class="current-content">
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
      <div style="width: 500px" v-show="current == 2">
        <my-tree ref="topicTreeTable" :items="topicDataTree" :columns='topicDataColumns' @on-selection-change="selectTopicDataConfig"></my-tree>
      </div>
      <div v-show="current == 1" class="table-tree-box" :style="{maxHeight: tableHeight + 'px'}">
        <my-tree ref="treeTable" :items="dataTree" :columns='dataColumns' @on-selection-change="selectDataConfig"></my-tree>
      </div>
      <div style="width: 400px;overflow:auto" :style="{maxHeight: tableHeight + 'px'}" v-show="current == 3">
        <Table border ref="selection" :columns="columns4" :data="featureList" @on-select-all="selectFeatureConfig" @on-select="selectFeatureConfig" @on-selection-change="selectFeatureConfig"></Table>
      </div>
      <div style="width: 400px" v-show="current == 4">
        <Table border ref="selection" :columns="columns5" :data="mapConfigList" @on-select-all="selectMapConfig" @on-select="selectMapConfig" @on-selection-change="selectMapConfig">
        </Table>
      </div>
      <div style="width: 400px" class="select-box" v-show="current == 5">
        <Form :label-width="80">
          <FormItem label="权限等级">
            <Select v-if="sys" v-model="qxLevel" @on-change="qx1Change" placeholder="请选择权限等级">
              <Option v-if="sysFunNum < 11 || sysFunNum < 21 || sysFunNum > 20" value="一级权限">一级权限</Option>
              <Option v-if="sysFunNum < 21 || sysFunNum > 20" value="二级权限">二级权限</Option>
              <Option v-if="sysFunNum > 20" value="三级权限">三级权限</Option>
            </Select>
            <Select v-else v-model="qxLevel" @on-change="qx1Change" placeholder="请选择权限等级">
              <Option value="一级权限">一级权限</Option>
              <Option value="二级权限">二级权限</Option>
              <Option value="三级权限">三级权限</Option>
            </Select>
          </FormItem>
          <FormItem label="请选择权限">
            <Select v-model="funNum" placeholder="请先选择权限等级">
              <Option v-for="item in arrFun" :value="item" :key="item">
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
        type: "",
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
      cilentAuthorityStr: '1',
      tabDataIdStr: '',
      mapIdStr: '',
      publishIdStr: '',
      ms720Str: '',
      funNum: '',
      sysFunNum: '',
      funAry: [0, 1, 2,
       3, 4, 5, 6, 7, 8, 9,
        10,11, 12, 13, 14, 
        15, 16, 17, 18, 19,
         20,21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
      arrFun: [],
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
  created() {
    this.sys = this.$route.query.id || ''
    this.type = Number(this.$route.query.type) || ''
    this.sysFunNum = Number(this.$route.query.funNum) || ''
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
      if (this.current == 4) {
        this.btnContent = '完成'
      }
      if (this.current == 5) {
        this.done()
      }
      if (this.current < 6) {
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
      this._addRole()
    },
    save() {
      this._updateRole()
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
      this.ms720Str = section.toString()
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
        this.arrFun = this.funAry.slice(0, 11)
      } else if (value === '二级权限') {
        this.arrFun = this.funAry.slice(11, 21)
      } else {
        this.arrFun = this.funAry.slice(21, 31)
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
    _getBuildConfig(lid, str) {
      let id = ''
      if(typeof (lid) === 'number') {
        id = lid
      }
      getRoleModuleById(id).then(res => {
        this.mapConfigList = res.mapConfigList
        this.mapConfigList.map(v => {
          v.name = v.mName
          v._checked = false
        })
        //
        let list = []
        res.cilentAuthorityList.map(v => {
          v.name = v.moduleName
          v._checked = false
          list.push(v)
        })
        this.featureList = list
        //
        this.dataTree = res.json720
        this.topicDataTree = res.dataPublishJson
        //
        this.funAry.map((v, index) => {
          if(v === this.sysFunNum) {
            this.funAry = this.funAry.slice(0, index + 1)
          }
        })
        // this.checkFunNum(this.sysFunNum)
        if (typeof (id) === 'number' && str === 'role') { //获取角色信息
          this._getRoleMapById(id)
        } else if (typeof (id) === 'string') {
          this.isShow = true
          this.$emit('isShow', this.isShow)
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
        tabDataIdStr: this.tabDataIdStr,
        cilentAuthorityStr: this.cilentAuthorityStr,
        mapIdStr: this.mapIdStr,
        funNum: this.funNum,
        sysId: this.id,
        publishIdStr: this.$refs.topicTreeTable.checkGroup.toString(),
        ms720Str: this.$refs.treeTable.checkGroup.toString()
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
        publishIdStr: this.$refs.topicTreeTable.checkGroup.toString(),
        ms720Str: this.$refs.treeTable.checkGroup.toString()
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
