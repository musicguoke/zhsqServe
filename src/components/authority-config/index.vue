<template>
  <div class="card-content" v-if="isShow" style="min-height: 450px;">
    <Steps :current="current" v-if="newSys">
      <Step title="基本信息" content=""></Step>
      <Step title="数据配置" content=""></Step>
      <Step title="功能配置" content=""></Step>
      <Step title="地图配置" content=""></Step>
      <Step title="字段权限" content=""></Step>
    </Steps>
    <Menu mode="horizontal" ref="tab_menu" style="width: 100%" v-if="!newSys" :theme="theme" :active-name="tabActiveName" @on-select="tabChange">
      <MenuItem name="0">基本信息</MenuItem>
      <MenuItem name="1">数据配置</MenuItem>
      <MenuItem name="2">功能配置</MenuItem>
      <MenuItem name="3">地图配置</MenuItem>
      <MenuItem name="4">字段权限</MenuItem>
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
      <div v-show="current == 1" class="table-tree-box" :style="{maxHeight: tableHeight + 'px'}">
        <my-tree ref="treeTable" :items="dataTree" :columns='dataColumns' :buildSys="buildSys" @on-selection-change="selectDataConfig"></my-tree>
      </div>
      <div style="width: 500px;overflow:auto" :style="{maxHeight: tableHeight + 'px'}" v-show="current == 2">
        <Table border ref="selection" :columns="columns4" :data="featureList" @on-select-all="selectFeatureConfig" @on-select="selectFeatureConfig" @on-selection-change="selectFeatureConfig"></Table>
      </div>
      <div style="width: 400px" v-show="current == 3">
        <Table border ref="selection" :columns="columns5" :data="mapConfigList" @on-select-all="selectMapConfig" @on-select="selectMapConfig" @on-selection-change="selectMapConfig">
        </Table>
      </div>
      <div style="width: 400px;paddingBottom: 60px;" class="select-box" v-show="current == 4">
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
import { url } from '@/api/config'
import { getBuildConfig } from '@/api/system'
import { configMixin } from '@/util/mixin'
import { addRole, updateRole, getRoleMapById, getRoleModuleById } from '@/api/role'
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
      uploadUrl: url,
      sys: '',
      btnContent: '下一步',
      formRoleItem: {
        grName: '',
        grIspass: '1'
      },
      dataTree: [],
      topicDataTree: [],
      ms720Str: '',
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
    }
  },
  methods: {
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
    done() {
      this._addRole()
    },
    save() {
      this._updateRole()
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
    _getBuildConfig(lid, str, type) {
      let id = ''
      if(typeof (lid) === 'number') {
        id = lid
      }
      this._getRoleModuleById(id)
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
