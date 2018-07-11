<template>
  <ol drag-tree-nodes class="drag-tree-nodes" :class="{hidden: collapsed}">
    <drag-tree-node
      v-for="li in list"
      :key="li.name"
      :nodeData="li"
      @removeNode="removeNode"
      v-if="!li.placeholder && !li.hidden"
    >
    </drag-tree-node>
    <li
      class="drag-tree-node drag-tree-placeholder"
      v-else-if="li.placeholder"
      :style="{height: `${nodeHeight}px`}"
    >
    </li>
  </ol>
</template>
<script>
  import DragTreeNode from './myDragTreeNode'
  
  export default {
    name: 'DragTreeNodes',
    props: {
      list: Array,
      collapsed: Boolean
    },
    computed: {
      nodeHeight () {
        return this.$store.state.dragTreeNodeHeight > 0 ? this.$store.state.dragTreeNodeHeight : 15
      }
    },
    beforeCreate () {
      // 解决互相递归调用组件时的template unregister错误
      this.$options.components.DragTreeNode = DragTreeNode
    }
  }
</script>
<style>
.drag-tree-nodes {
    position: relative;
    margin: 0;
    padding: 0;
    list-style: none;
}
body li {
  list-style-type: none;
}
.drag-tree-nodes.hidden {
    display: none;
    visibility: hidden;
}
.drag-tree-nodes .drag-tree-nodes {
    padding-left: 15px;
}
.drag-tree-placeholder div{
  user-select: none;
  display: block;
  padding: 10px 15px;
  margin-bottom: -1px;
  background-color : transparent;
}
</style>
