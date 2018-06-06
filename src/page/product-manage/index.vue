<template>
  <Content>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>产品管理</BreadcrumbItem>
      <BreadcrumbItem>{{name}}</BreadcrumbItem>
    </Breadcrumb>
    <Card :style="{maxHeight: contentHeight}">
      <div class="table" v-show="!isShow">
        <v-search :importShow="false" @on-search="search" @on-build="show"/>
        <Table border :columns="columns1" :data="sysData"></Table>
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
import vSearch from '@/components/search/index'

export default {
  components: {
    AuthorityConfig,
    vSearch
  },
  data() {
    return {
      contentHeight: window.innerHeight - 174 + 'px',
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
          key: 'areaName'
        },
        {
          title: '系统状态',
          key: 'status'
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
                  margin: '0 5px'
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
                  type: 'success',
                  size: 'small'
                },
                style: {
                  margin: '0 5px'
                },
                on: {
                  click: e => {
                    this._enterSystem(params.row)
                  }
                }
              }, '进入系统'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  margin: '0 5px'
                },
                on: {
                  click: e => {
                    e.stopPropagation()
                    this.$Modal.confirm({
                      title: '提示',
                      content: '确认删除这条数据吗？',
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
    _getSystemList(page) {
      getSystemList(page).then(res => {
        if (res.code === 20000) {
          res.data.list.filter(v => {
            if(v.enable === 0) {
              v.status = '暂停运行'
            } else if(v.enable === 1) {
              v.status = '正在运行'
            }
          })
          this.sysData = res.data.list
        } else {
          this.$Message.error(`${res.message}`)
        }
      })
    },
    _deleteSingleSystem(id) {
      deleteSingleSystem(id).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`删除${res.message}`)
          this._getSystemList()
        } else {
          this.$Message.error(`删除${res.message}`)
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
            this.$refs.authConfig._getAreaList()
            this.$refs.authConfig._getAreaCatalog()
            this.$refs.authConfig._getFeature()
            this.$refs.authConfig._getMapConfig()
          }
        } else {
          this.$Message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
