<template>
  <Content>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>目录管理</BreadcrumbItem>
      <BreadcrumbItem>资源目录</BreadcrumbItem>
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
      dataColumns: [{
          title: '名称',
          key: 'title'
        }, {
          title: '编码',
          key: 'id',
          sortable: true
        }, {
          title: '类型',
          key: 'type'
        }, {
          title: '更新时间',
          key: 'time'
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
