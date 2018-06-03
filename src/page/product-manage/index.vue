<template>
  <Content>
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
      </div>
      <authority-config v-show="isShow" ref="authConfig" :newSys="newSys" @cancel="cancel" />
    </Card>
  </Content>
</template>

<script>
import {
  getSystemList,
  deleteSingleSystem,
  enterSystem
} from '@/api/system'
import AuthorityConfig from '@/components/authority-config/index'

export default {
  components: {
    AuthorityConfig
  },
  data() {
    return {
      newSys: true,
      isShow: false,
      name: '系统列表',
      searchName: '',
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
                    this.$refs.authConfig._searchSysById(params.row.id)
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
                        this._deleteSingleSystem(params.row.id)
                      }
                    })
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      sysData: []
    }
  },
  created() {
    this._enterSystem()
  },
  methods: {
    show() {
      this.isShow = true
      this.newSys = true
      this.name = '新建系统'
    },
    cancel() {
      this._getSystemList()
      this.isShow = false
      this.newSys = false
      this.name = '系统列表'
    },
    // 选择某个系统，进入系统详情
    systemConfig(data) {
      this._enterSystem(data)
    },
    _getSystemList(page) {
      getSystemList(page).then(res => {
        if(res.code === 20000) {
          this.sysData = res.data.list
        } else {
          this._mm.errorTips(`${res.message}`)
        }
      })
    },
    _deleteSingleSystem(id) {
      deleteSingleSystem(id).then(res => {
        if(res.code === 20000) {
          this._mm.successTips(`删除${res.message}`)
          this._getSystemList()
        } else {
          this._mm.errorTips(`删除${res.message}`)
        }
      })
    },
    _enterSystem(data) {
      let id = ''
      if (data) {
        id = data.id
      }
      enterSystem(id).then(res => {
        if (res.code === 20000) {
          if (id) {
            this.$router.push({
              path: '/system',
              query: {
                id: id,
                systemname: data.sysName
              }
            })
          } else {
            this._getSystemList()
          }
        } else {
          this._mm.errorTips(res.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
