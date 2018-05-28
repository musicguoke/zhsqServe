<template>
  <Content>
    <Breadcrumb :style="{marginBottom: '17px'}">
      <BreadcrumbItem>目录管理</BreadcrumbItem>
      <BreadcrumbItem>发布目录</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <tree-table :items='dataTree' :columns='dataColumns' @on-selection-change='selectDataConfig'></tree-table>
    </Card>
  </Content>
</template>

<script>
import { getDateTree } from '@/api/system'
import TreeTable from '@/components/tree-table/index'

export default {
  components: {
    TreeTable
  },
  data() {
    return {
      dataTree: [],
      dataColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '名称',
          key: 'title'
        }, {
          title: '区县',
          key: 'qx'
        }, {
          title: '编码',
          key: 'id',
          sortable: true
        }, {
          title: '图片路径',
          key: 'src'
        }, {
          title: '图片类型',
          key: 'type'
        }, {
          title: '更新时间',
          key: 'time'
        }, {
          title: '操作',
          type: 'action',
          actions: [{
            type: 'primary',
            text: '编辑'
          }, {
            type: 'error',
            text: '删除'
          }]
        }
      ]
    }
  },
  created() {
    this._getDateTree()
  },
  methods: {
    selectDataConfig() {

    },
    _getDateTree(id) {
      getDateTree(id).then(res => {
        this.dataTree = res
      })
    }
  }
}
</script>

<style>
</style>
