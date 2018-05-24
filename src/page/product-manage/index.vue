<template>
  <Content :style="{padding: '0 50px'}">
    <Breadcrumb :style="{marginBottom: '17px'}">
      <BreadcrumbItem>产品管理</BreadcrumbItem>
      <BreadcrumbItem>{{name}}</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <div class="table" v-show="!isShow">
        <div class="seach_condition">
          <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
          <div class="search_button">
            <i-button @click="show()">新增</i-button>
          </div>
        </div>
        <Table border :columns="columns1" :data="sysData" @on-row-click="systemConfig"></Table>
        <div class="tablePage">
          <Page :total="sysData.length"></Page>
        </div>
      </div>
      <div v-if="isShow" class="card-content" style="min-height: 400px;">
        <Steps :current="current" v-if="newSys">
          <Step title="基本信息" content="这里是该步骤的描述信息"></Step>
          <Step title="功能配置" content="这里是该步骤的描述信息"></Step>
          <Step title="数据配置" content="这里是该步骤的描述信息"></Step>
          <Step title="地图配置" content="这里是该步骤的描述信息"></Step>
        </Steps>
        <Menu mode="horizontal" style="width: 100%" v-if="!newSys" :theme="theme" active-name="0" @on-select="tabChange">
          <MenuItem name="0">基本信息</MenuItem>
          <MenuItem name="1">功能配置</MenuItem>
          <MenuItem name="2">数据配置</MenuItem>
          <MenuItem name="3">地图配置</MenuItem>
        </Menu>
        <div class="current-content">
          <Form :model="formItem" :label-width="80" style="width: 400px" v-show="current == 0">
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
            <FormItem label="上传欢迎页">
              <Input placeholder="上传后的地址" style="width: 68%"></Input>
              <Upload action="//jsonplaceholder.typicode.com/posts/">
                <Button type="ghost" style="display: inline" icon="ios-cloud-upload-outline">点击上传</Button>
              </Upload>
            </FormItem>
          </Form>
          <div style="width: 400px" v-show="current == 1">
            <Table border ref="selection" :columns="columns4" :data="featureList" @on-select="selectFeatureConfig"></Table>
          </div>
          <div v-show="current == 2">
            <tree-table :items='dataTree' :columns='dataColumns' @on-selection-change='selectDataConfig'></tree-table>
          </div>
          <div style="width: 400px" v-show="current == 3">
            <Table border ref="selection" :columns="columns5" :data="mapConfigList" @on-select="selectMapConfig">
            </Table>
          </div>
        </div>
        <div class="btn" v-if="newSys">
          <Button type="error" @click="cancel">取消</Button>
          <Button type="primary" @click="pre" v-if="this.current !== 0">上一步</Button>
          <Button type="primary" @click="next">{{btnContent}}</Button>
        </div>
        <div class="btn" v-if="!newSys">
          <Button type="error" @click="cancel">取消</Button>
          <Button type="primary" @click="_addSystem">完成</Button>
        </div>
      </div>
    </Card>
  </Content>
</template>

<script>
import {
  getAreaQx,
  getDateTree,
  getMapConfig,
  getFeature,
  getSystemList,
  addSystem,
  deleteSingleSystem
} from '@/api/system'
import TreeTable from '@/components/tree-table/index'

export default {
  components: {
    TreeTable
  },
  data() {
    return {
      theme: 'light',
      current: 0,
      newSys: true,
      btnContent: '下一步',
      isShow: false,
      name: '系统列表',
      searchName: '',
      areaQxList: [],
      dataTree: [],
      mapConfigList: [],
      featureList: [],
      formItem: {
        sysName: "",
        type: "",
        areacode: ""
      },
      funIdStr: '',
      dataIdStr: '',
      selectedRow: '', //选中编辑的系统项
      columns1: [
        {
          title: '系统编号',
          key: 'id'
        },
        {
          title: '系统名称',
          key: 'sysName'
        },
        {
          title: '所属区县',
          key: 'areacode'
        },
        {
          title: '系统状态',
          key: 'enable'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '25px'
                },
                on: {
                  click: e => {
                    e.stopPropagation()
                    this.selectedRow = params.row
                    this.formItem = {
                      sysName: params.row.sysName,
                      type: params.row.type.toString(),
                      areacode: params.row.areacode
                    }
                    this.current = 0
                    this.isShow = true
                    this.newSys = false
                    this.name = '编辑系统'
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: e => {
                    e.stopPropagation()
                    this.$Modal.confirm({
                      title: '提示',
                      content: '确认删除吗？',
                      onOk: () => {
                        this._deleteSingleSystem(params.id)
                      }
                    })
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      sysData: [],
      // 表格树title
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
    this._getSystemList()
    this._getAreaQx()
  },
  methods: {
    show() {
      this.isShow = true
      this.newSys = true
      this.name = '新建系统'
    },
    cancel() {
      this.isShow = false
      this.newSys = false
      this.name = '系统列表'
    },
    tabChange(name) {
      if (name == 1) {
        this._getFeature(this.selectedRow.msSystemFunList[0].funId)
      }
      this.current = name
    },
    next() {
      if (this.current == 0) {
        this._getFeature()
      }
      if (this.current == 1) {
        this._getDateTree()
      }
      if (this.current == 2) {
        this._getMapConfig()
        this.btnContent = '完成'
      }
      if (this.current == 3) {
        this._addSystem()
      }
      if (this.current < 3) {
        this.current += 1
      }
    },
    pre() {
      if (this.current !== 2) {
        this.btnContent = '下一步'
      }
      this.current -= 1
    },
    selectMapConfig(section, row) {
      // 已选择地图项
      let id = []
      section.map(v => id.push(v.id))
      this.dataIdStr = id.toString()
    },
    selectDataConfig(section) {
      let id = []
      section.map(v => id.push(v.id))
      this.dataIdStr = id.toString()
    },
    selectFeatureConfig(section) {
      //已选择功能项
      let id = []
      section.map(v => id.push(v.id))
      this.funIdStr = id.toString()
    },
    // 选择某个系统，进入系统详情
    systemConfig(data) {
      console.log(data)
      this.$router.push('/system')
    },
    _getAreaQx() {
      getAreaQx().then(res => {
        this.areaQxList = res.data.list
      })
    },
    _getDateTree(id) {
      getDateTree(id).then(res => {
        this.dataTree = res
      })
    },
    _getMapConfig() {
      getMapConfig().then(res => {
        this.mapConfigList = res.data.list.filter(v => v.name = v.mName)
      })
    },
    _getFeature(id) {
      getFeature(id).then(res => {
        let list = []
        res.data.list.map(v => {
          v.name = v.moduleName
          v._checked = false
          if (v.id === 1) {
            v._checked = true
          }
          list.push(v)
        })
        this.featureList = list
      })
    },
    _getSystemList() {
      getSystemList().then(res => {
        this.sysData = res.data.list
      })
    },
    _addSystem() {
      let data = Object.assign({}, {
        dataIdStr: this.dataIdStr,
        funIdStr: this.funIdStr,
        funType: 1,
        enable: 0
      }, this.formItem)
      addSystem(data).then(res => {
        this.isShow = false
        this.name = '系统列表'
      })
    },
    _deleteSingleSystem(id) {
      deleteSingleSystem(id).then(res => {
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
.form {
  width: 400px;
}
</style>
