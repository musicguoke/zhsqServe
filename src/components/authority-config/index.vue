<template>
  <div class="card-content" style="min-height: 400px;">
    <Steps :current="current" v-if="newSys">
      <Step title="基本信息" content="这里是该步骤的描述信息"></Step>
      <Step title="功能配置" content="这里是该步骤的描述信息"></Step>
      <Step title="数据配置" content="这里是该步骤的描述信息"></Step>
      <Step title="地图配置" content="这里是该步骤的描述信息"></Step>
      <Step title="字段权限" content="这里是该步骤的描述信息"></Step>
    </Steps>
    <Menu mode="horizontal" style="width: 100%" v-if="!newSys" :theme="theme" active-name="0" @on-select="tabChange">
      <MenuItem name="0">基本信息</MenuItem>
      <MenuItem name="1">功能配置</MenuItem>
      <MenuItem name="2">数据配置</MenuItem>
      <MenuItem name="3">地图配置</MenuItem>
      <MenuItem name="4">字段权限</MenuItem>
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
        <FormItem label="上传欢迎页">
          <Input placeholder="上传后的地址" style="width: 68%"></Input>
          <Upload action="//jsonplaceholder.typicode.com/posts/">
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
      <div style="width: 400px" v-show="current == 1">
        <Table border ref="selection" :columns="columns4" :data="featureList" @on-select-all="selectFeatureConfig" @on-select="selectFeatureConfig" @on-selection-change="selectFeatureConfig">
        </Table>
      </div>
      <div v-show="current == 2">
        <tree-table :items='dataTree' :columns='dataColumns' @on-selection-change='selectDataConfig'>
        </tree-table>
      </div>
      <div style="width: 400px" v-show="current == 3">
        <Table border ref="selection" :columns="columns5" :data="mapConfigList" @on-select-all="selectMapConfig" @on-select="selectMapConfig" @on-selection-change="selectMapConfig">
        </Table>
      </div>
      <div style="width: 400px" class="select-box" v-show="current == 4">
        <Form :label-width="80">
          <FormItem label="一级权限">
            <Select v-model="funNum" placeholder="一级权限0~10">
              <Option v-for="(item, index) in funAry1" :value="item" :key="index">
                {{item}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="二级权限">
            <Select v-model="funNum" placeholder="二级权限11~20">
              <Option v-for="(item, index) in funAry2" :value="item" :key="index">
                {{item}}
              </Option>
            </Select>
          </FormItem>
          <FormItem label="三级权限">
            <Select v-model="funNum" placeholder="三级权限21~30">
              <Option v-for="(item, index) in funAry3" :value="item" :key="index">
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
import TreeTable from '@/components/tree-table/index'

export default {
  components: {
    TreeTable
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
      theme: 'light',
      current: 0,
      btnContent: '下一步',
      funAry1: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      funAry2: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      funAry3: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
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
      areaQxList: [],
      dataTree: [],
      mapConfigList: [],
      featureList: [],
      cilentAuthorityStr: '1',
      tabDataIdStr: '',
      mapIdStr: '',
      funNum: '',
      sysId: '',
      grId: '',
      selectedRow: '', //选中编辑的系统项
      dataColumns: [
        {
          type: 'selection',
          width: '50',
        }, {
          title: '名称',
          key: 'title',
          width: '150',
        }, {
          title: '编码',
          key: 'id',
          sortable: true,
          width: '150',
        }, {
          title: '类型',
          key: 'type',
          width: '150',
        }, {
          title: '更新时间',
          key: 'time',
          width: '150',
        }
      ],
      columns4: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '地图名称',
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
          title: '功能名称',
          key: 'name'
        }
      ]
    }
  },
  created() {
    this._getAreaQx()
    this._getFeature()
    this._getDateTree()
    this._getMapConfig()
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    tabChange(name) {
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
    selectMapConfig(section, row) {
      // 已选择地图项
      let id = []
      section.map(v => id.push(v.id))
      this.mapIdStr = id.toString()
    },
    selectDataConfig(section) {
      this.tabDataIdStr = section.toString()
    },
    selectFeatureConfig(section, row) {
      //已选择功能项
      let id = []
      section.map(v => id.push(v.id))
      this.cilentAuthorityStr = id.toString()
    },
    _getAreaQx() {
      getAreaQx().then(res => {
        if (res.code === 20000) {
          this.areaQxList = res.data.list
        } else {
          this._mm.errorTips(res.message)
        }
      })
    },
    _getDateTree(id) {
      getDateTree(id).then(res => {
        this.dataTree = res
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
          this._mm.errorTips(res.message)
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
          this._mm.errorTips(res.message)
        }
      })
    },
    _addSystem() {
      let data = Object.assign({}, {
        tabDataIdStr: this.tabDataIdStr,
        cilentAuthorityStr: this.cilentAuthorityStr,
        mapIdStr: this.mapIdStr,
        funNum: this.funNum
      }, this.formItem)
      addSystem(data).then(res => {
        if (res.code === 20000) {
          this._mm.successTips(`添加${res.message}`)
          this.cancel()
        } else {
          this._mm.errorTips(`添加${res.message}`)
        }
      })
    },
    _updateSystem() {
      let data = Object.assign({}, {
        tabDataIdStr: this.tabDataIdStr,
        cilentAuthorityStr: this.cilentAuthorityStr,
        mapIdStr: this.mapIdStr,
        funNum: this.funNum,
        id: this.sysId
      }, this.formItem)
      updateSystem(data).then(res => {
        if(res.code === 20000) {
          this._mm.successTips(`修改${res.message}`)
          this.cancel()
        } else {
          this._mm.errorTips(`修改${res.message}`)
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
            areacode: res.data.areacode.toString(),
            enable: res.data.enable.toString()
          }
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
            list.push(v.dataId)
          })
          this.tabDataIdStr = list.toString()
          this.dataTree = this.checkData(this.dataTree, res.data.msSystemDatainfoList)
          this.funNum = res.data.funNum
        } else {
          this._mm.errorTips(res.message)
        }
      })
    },
    checkData(list, idList) {
      list.map((v, index) => {
        v._checked = false
        idList.map(h => {
          if (v.id === h.dataId) {
            v._checked = true
          }
          if (v.children) {
            this.checkData(v.children, idList)
          }
        })
        list.splice(index, 1, v)
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
          res.data.msRoleDataList.map(v => {
            list.push(v.sysData)
          })
          this.tabDataIdStr = list.toString()
          this.dataTree = this.checkRoleData(this.dataTree, res.data.msRoleDataList)
          this.funNum = res.data.funNum
        } else {
          this._mm.errorTips(res.message)
        }
      })
    },
    checkRoleData(list, idList) {
      list.map((v, index) => {
        v._checked = false
        idList.map(h => {
          if (v.id === h.sysData) {
            v._checked = true
          }
          if (v.children) {
            this.checkRoleData(v.children, idList)
          }
        })
        list.splice(index, 1, v)
      })
      return list
    },
    _addRole() {
      let data = Object.assign({}, {
        tabDataIdStr: this.tabDataIdStr,
        cilentAuthorityStr: this.cilentAuthorityStr,
        mapIdStr: this.mapIdStr,
        funNum: this.funNum,
        sysId: this.id
      }, this.formRoleItem)
      addRole(data).then(res => {
        if (res.code === 20000) {
          this._mm.successTips(`添加${res.message}`)
          this.cancel()
        } else {
          this._mm.errorTips(`添加${res.message}`)
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
        grId: this.grId
      }, this.formRoleItem)
      updateRole(data).then(res => {
        if(res.code === 20000) {
          this._mm.successTips(`修改${res.message}`)
          this.cancel()
        } else {
          this._mm.errorTips(`修改${res.message}`)
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
.ivu-upload {
  display: inline-block;
}
.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
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
</style>
