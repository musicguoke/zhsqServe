<template>
  <div class="card-content" v-show="isShow" style="min-height: 450px;">
    <Steps :current="current" v-if="newSys">
      <Step title="基本信息" content=""></Step>
      <Step title="专题配置" content=""></Step>
      <Step title="数据配置" content=""></Step>
      <Step title="功能配置" content=""></Step>
      <Step title="地图配置" content=""></Step>
      <Step title="字段权限" content=""></Step>
    </Steps>
    <Menu mode="horizontal" ref="tab_menu" style="width: 100%" v-if="!newSys" :theme="theme" :active-name="tabActiveName" @on-select="tabChange">
      <MenuItem name="0">基本信息</MenuItem>
      <MenuItem name="1">专题配置</MenuItem>
      <MenuItem name="2">数据配置</MenuItem>
      <MenuItem name="3">功能配置</MenuItem>
      <MenuItem name="4">地图配置</MenuItem>
      <MenuItem name="5">字段权限</MenuItem>
    </Menu>
    <div class="current-content">
      <Form :model="formRoleItem" :label-width="80" style="width: 400px" v-show="current == 0">
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
      <div style="width: 500px" v-show="current == 1">
        <my-tree ref="topicTreeTable" :items="topicDataTree" :columns='topicDataColumns' @on-selection-change="selectTopicDataConfig"></my-tree>
      </div>
      <div
        v-show="current == 2"
        class="table-tree-box"
        :style="{maxHeight: tableHeight + 'px',width: '500px'}"
      >
        <my-tree
          ref="treeTable"
          :items="dataTree"
          :buildSys="buildSys"
          :columns='dataColumns'
          @on-selection-change="selectDataConfig"
        >
        </my-tree>
      </div>
      <div
        style="width: 500px;overflow:auto"
        :style="{maxHeight: tableHeight + 'px'}"
        v-show="current == 3"
      >
        <Table border ref="selection" :columns="columns4" :data="featureList" @on-select-all="selectFeatureConfig" @on-select="selectFeatureConfig" @on-selection-change="selectFeatureConfig"></Table>
      </div>
      <div style="width: 400px" v-show="current == 4">
        <Table border ref="selection" :columns="columns5" :data="mapConfigList" @on-select-all="selectMapConfig" @on-select="selectMapConfig" @on-selection-change="selectMapConfig">
        </Table>
      </div>
      <div style="width: 400px" class="select-box" v-show="current == 5">
        <Form :label-width="80">
          <FormItem label="权限等级">
            <Select v-model="qxLevel" @on-change="qx1Change" placeholder="请选择权限等级">
              <Option 
                v-for="item in ['公众用户可浏览', '部分字段可浏览', '全部字段可浏览'].slice(0, qxLevelNum+1)"
                :value="item"
                :key="item"
              >
                {{item}}
              </Option>
            </Select>
          </FormItem>
          <!-- <FormItem label="请选择权限">
            <Select v-model="funNum" placeholder="请先选择权限等级">
              <Option v-for="item in arrFun" :value="item" :key="item">
                {{item}}
              </Option>
            </Select>
          </FormItem> -->
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
import { configMixin } from '@/util/mixin'
import { addRole, updateRole, getRoleMapById, getRoleModuleById } from '@/api/role'
import { getAreaList, getMsTabDatainfoById, uploadImg } from '@/api/catalog'
import MyTree from '@/components/my-tree/index'

export default {
  mixins: [configMixin],
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
    id: ''
  },
  data() {
    return {
      sys: '',
      btnContent: '下一步',
      formRoleItem: {
        grName: '',
        grIspass: '1'
      },
      dataTree: [],
      topicDataTree: []
    }
  },
  methods: {
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
    _getBuildConfig(lid) {
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
        this.dataTree = res.tabDataTreeJson
        this.topicDataTree = res.dataPublishJson
        this.qxCheck(this.$route.query.funNum)
        if(typeof(id) === 'number') {
          this._getRoleMapById(id)
        } else if(typeof(id) === 'string') {
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
    _addRole() {
      let data = Object.assign({}, {
        tabDataIdStr: this.$refs.treeTable.checkGroup.toString(),
        cilentAuthorityStr: this.cilentAuthorityStr,
        mapIdStr: this.mapIdStr,
        funNum: this.funNum,
        sysId: this.id,
        publishIdStr: this.$refs.topicTreeTable.checkGroup.toString(),
        ms720Str: ''
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
        publishIdStr: this.$refs.topicTreeTable.checkGroup.toString(),
        ms720Str: ''
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
