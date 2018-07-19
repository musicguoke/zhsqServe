<template>
  <Content>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>目录管理</BreadcrumbItem>
      <BreadcrumbItem>资源目录</BreadcrumbItem>
    </Breadcrumb>
    <Card :style="{maxHeight: contentHeight}">
      <tree-table :items='dataTree' :columns='dataColumns' @on-selection-change='selectDataConfig'></tree-table>
    </Card>
  </Content>
</template>

<script>
import { getDataTreeAllBySysId } from '@/api/catalog'
import TreeTable from '@/components/my-tree/index'

export default {
  components: {
    TreeTable
  },
  data() {
    return {
      contentHeight: window.innerHeight - 174 + 'px',
      dataTree: [],
      dataColumns: [{
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
      ]
    }
  },
  created() {
    this._getDataTreeAllBySysId(-1)
  },
  methods: {
    selectDataConfig() {

    },
    _getDataTreeAllBySysId(id) {
      getDataTreeAllBySysId(id).then(res => {
        this.dataTree = res
      })
    }
  }
}
</script>

<style>
</style>
