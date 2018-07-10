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
.drag-tree {
  overflow: auto;
}
.drag-tree-empty, .drag-tree-dropzone {
    border: 1px dashed #bbb;
    min-height: 100px;
    background-color: #e5e5e5;
    background-image: -webkit-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), -webkit-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff);
    background-image: -moz-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), -moz-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff);
    background-image: linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff), linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff);
    background-size: 60px 60px;
    background-position: 0 0, 30px 30px;
}

.drag-tree-empty {
    pointer-events: none;
}
</style>
