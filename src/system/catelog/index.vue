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
        <div v-if="list.length > 0">
          <drag-tree :data="dragTreeData" draggable @on-drop="getDropData"></drag-tree>
          <div>
            <Button style="display: block;margin: 6px auto 0;" type="primary" @click="handleSave">保存</Button>
          </div>
        </div>
        <Alert show-icon v-else>请从左侧侧拖入数据</Alert>
      </Card>
    </div>
  </div>
</template>

<script>
// import DragTree from '@/components/DragTree/DragTree'
import DragTree from '@/components/tree/index.js'
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
        if (res.code === 20000) {
          this.$Message.success(res.message);
          this._getCatalogBySysId()
        }
      })
    },
    changeListId(list) {
      list.map(v => {
        v.dataId = v.id
        if (v.children) {
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
        if (v.children && v.children.length > 0) {
          this.checkListOrder(v.children, v.id)
        }
      })
      this._saveCatalogBySelf(JSON.stringify({ list: this.submitList }))
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
        if (v.children) {
          this.checkListOrder(v.children, v.id)
        }
      })
      return list
    },
    getDropData(info) {
      var dragData = info.dragNode.nodeData;
      var dragParent = info.dragNode.parentNode;
      var dropData = info.dropNode.nodeData;
      var dropParent = info.dropNode.parentNode;
      var dropPosition = info.dropPosition; //0作为子级，-1放在目标节点前面，1放在目标节点后面

      //把拖拽元素从父节点中删除
      if(dragParent) {
        dragParent.children.splice(dragParent.children.indexOf(dragData), 1);
      } else {
        this.dragTreeData.splice(this.dragTreeData.indexOf(dragData), 1);
      }
      if (dropPosition === 0) {
        dropData.children = dropData.children ? dropData.children : []
        dropData.children.push(dragData);
      } else {
        if(dropParent) {
          var index = dropParent.children.indexOf(dropData);
          if (dropPosition === -1) {
            dropParent.children.splice(index, 0, dragData);
          } else {
            dropParent.children.splice(index + 1, 0, dragData);
          }
        } else {
          var index = this.dragTreeData.indexOf(dropData);
          if (dropPosition === -1) {
            this.dragTreeData.splice(index, 0, dragData);
          } else {
            this.dragTreeData.splice(index + 1, 0, dragData);
          }
        }
      }
    }
  },
  destroyed() {
    this.$store.commit('setDragTreeData', '')
  }
}
</script>

<style lang="less">
@import "../../components/tree/style/tree.less";
</style>

<style scoped>
.market-nav-position {
    margin-bottom: 40px;
}
.market-nav-ul {
    margin: 0 auto;
    padding: 10px 0;
}
.market-title {
    width: 140px;
    height: 36px;
    line-height: 36px;
    border-radius: 40px;
    margin: 0 5px;
    background: #eff1f6;
    color: #65778b;
    font-size: 14px;
    display: inline-block;
    list-style: none;
    text-align: center;
}
.market-title.current {
    background: #fff;
    color: #5094e7;
    border: 1px solid #dfe3ed;
}
.cursor_pointer {
    cursor: pointer;
}
</style>
