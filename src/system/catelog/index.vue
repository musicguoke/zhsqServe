<template>
  <div>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>目录管理</BreadcrumbItem>
      <BreadcrumbItem>修改目录</BreadcrumbItem>
    </Breadcrumb>
    <div class="table-box">
      <Card :style="{width:'49%',float:'left',maxHeight: contentHeight}">
        <my-drag-tree :list="dataTree"></my-drag-tree>
      </Card>
      <Card :style="{width:'49%',float:'right',overflow:'hidden',maxHeight: contentHeight}">
        <div
          v-if="list.length > 0"
        >
          <drag-tree :list="dragTreeData"></drag-tree>
          <div>
            <Button style="display: block;margin: 6px auto 0;" type="primary" @click="handleSave">保存</Button>
            <!-- <Button type="error" @click="clear">清空</Button> -->
          </div>
        </div>
        <Alert show-icon v-else>请从左侧侧拖入数据</Alert>
      </Card>
    </div>
  </div>
</template>

<script>
import DragTree from '@/components/DragTree/DragTree'
import MyDragTree from '@/components/DragTree/myDragTree'
import { getAreaCatalog, getCatalogBySysId, saveCatalogBySelf } from '@/api/catalog'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      contentHeight: window.innerHeight - 174 + 'px',
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
        }
      ],
      dataTree: [],
      tempList: [],
      submitList: []
    }
  },
  components: {
    DragTree,
    MyDragTree
  },
  created() {
    this._getAreaCatalog()
    this._getCatalogBySysId()
  },
  computed: {
    list() {
      return this.tempList.length > 0 ? this.tempList : this.$store.state.dragTreeData
    },
    ...mapGetters([
      'dragTreeData'
    ])
  },
  methods: {
    _getAreaCatalog(id) {
      getAreaCatalog(id).then(res => {
        this.dataTree = this.changeListId(res)
      })
    },
    _getCatalogBySysId() {
      getCatalogBySysId().then(res => {
        this.tempList = res
        this.$store.commit('setDragTreeData', res)
      })
    },
    _saveCatalogBySelf(data) {
      saveCatalogBySelf(data).then(res => {
        if(res.code === 20000) {
          this.$Message.success(res.msg)
        }
      })
    },
    changeListId(list) {
      list.map(v => {
        v.dataId = v.id
        if(v.children) {
          this.changeListId(v.children)
        }
      })
      return list
    },
    handleSave() {
      let list = this.$store.state.dragTreeData
      this.submitList = []
      list.map((v, index) => {
        v.listorder = index + 1
        v.parentId = -1
        let obj = {
          id: v.id, 
          parentId: v.parentId, 
          name: v.title, 
          listorder: v.listorder, 
          dataId: v.dataId
        }
        this.submitList.push(obj)
        if(v.children && v.children.length > 0) {
          this.checkListOrder(v.children, v.id)
        }
      })
      this._saveCatalogBySelf(JSON.stringify({list: this.submitList}))
    },
    checkListOrder(list, id, ) {
      list.map((v, index) => {
        v.listorder = index + 1
        v.parentId = id
        let obj = {
          id: v.id, 
          parentId: v.parentId, 
          name: v.title, 
          listorder: v.listorder, 
          dataId: v.dataId
        }
        this.submitList.push(obj)
        if(v.children) {
          this.checkListOrder(v.children, v.id)
        }
      })
      return list
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
