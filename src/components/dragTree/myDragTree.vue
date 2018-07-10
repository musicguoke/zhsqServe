<template>
  <div drag-tree class="drag-tree" :style="{maxHeight: contentHeight}">
    <my-drag-tree-nodes :list="list"></my-drag-tree-nodes>
  </div>
</template>
<script>
  import MyDragTreeNodes from './myDragTreeNodes'

  export default {
    name: 'MyDragTree',
    props: {
      list: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        contentHeight: window.innerHeight - 236 + 'px'
      }
    },
    components: {
      MyDragTreeNodes
    }
  }
</script>
<style>
</style>
