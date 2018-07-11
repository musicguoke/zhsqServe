<template>
  <li class="drag-tree-node" :data-id="nodeData.dataId">
    <div
      class="drag-tree-handle"
      :data-id="nodeData.dataId"
      @mousedown.self="dragStart"
    >
      <div class="drag-tree-icon" @click="toggle" v-if="hasChildren">
        <Icon v-if="collapsed" type="arrow-right-b"></Icon>
        <Icon v-if="!collapsed" type="arrow-down-b"></Icon>
      </div>
      <span>{{ nodeData.dataId }}</span>
      <span v-if="!editTitle">{{ nodeData.title }}</span>
      <Input type="text" v-if="editTitle" v-model="title"></Input>
      <div v-if="!editTitle">
        <Button size="small" type="primary" shape="circle" icon="edit" @click="edit(nodeData)"></Button>
        <Button size="small" type="warning" shape="circle" icon="close-round" @click="deleteNode(nodeData.dataId)"></Button>
      </div>
      <div v-if="editTitle" style="display: flex;">
        <Button size="small" type="primary" shape="circle" icon="checkmark-round" @click="save(nodeData)"></Button>
        <Button size="small" type="warning" shape="circle" icon="close-round" @click="cancel"></Button>
      </div>
    </div>
    <drag-tree-nodes :list="nodeData.children" :collapsed="collapsed" ref="childNodes"></drag-tree-nodes>
  </li>
</template>
<script>
import DragTreeNodes from './DragTreeNodes'
import DomHelper from './dom-helper'
export default {
  name: 'DragTreeNode',
  props: {
    nodeData: Object
  },
  // components: {
  //   DragTreeNodes
  // },
  data() {
    return {
      collapsed: true,
      isDragging: false,
      lastX: null,
      lastY: null,
      dragElm: null,
      placeElm: null,
      hiddenPlaceElm: null,
      // 移动坐标对象
      pos: null,
      firstMoving: true,
      dragInfo: null,
      editTitle: false,
      title: ''
    }
  },
  computed: {
    hasChildren() {
      return this.nodeData.children && this.nodeData.children.length > 0
    },
    parentNodeData() {
      if (!this.$parent || !this.$parent.$parent) {
        return null
      }
      if (this.$parent.$parent.$options.name === 'DragTree') {
        return { name: '', children: this.$parent.$parent.list }
      } else {
        return this.$parent.$parent.nodeData
      }
    },
    isPlaceholder() {
      return this.nodeData.placeholder
    },
    rootTreeData() {
      return {
        name: '',
        root: true,
        children: this.$store.state.dragTreeData || []
      }
    },
    dragTreeData() {
      return this.$store.state.dragTreeData
    }
  },
  methods: {
    // 切换节点展开收缩状态
    toggle() {
      this.collapsed = !this.collapsed
    },
    // store node height
    setPlaceHolderHeight() {
      this.$store.commit('setDragTreeNodeHeight', this.$el.offsetHeight)
    },
    // get node's parent by store
    getNodeParent(node, rootNode, curArgs = { notRoot: false, match: null, isMatch: false }) {
      // debugger
      if (node.root) {
        return curArgs
      }
      let list = rootNode.children
      for (let i = 0; i < list.length; i++) {
        if (curArgs.isMatch) {
          break
        }
        let item = list[i]
        if (item === node) {
          curArgs.match = item
          break
        } else if (item.children && item.children.length > 0) {
          let isRootBefore = !curArgs.notRoot
          if (isRootBefore) {
            curArgs.notRoot = true
          }
          let matchAfter = this.getNodeParent(node, item, curArgs)
          if (!curArgs.isMatch && matchAfter.match) {
            curArgs.match = item
            curArgs.isMatch = true
          }
          if (isRootBefore) {
            curArgs.notRoot = !isRootBefore
          }
        }
      }
      if (!curArgs.notRoot && node === curArgs.match) {
        curArgs.match = rootNode
        curArgs.isMatch = true
      }
      return curArgs
    },
    edit(data) {
      this.editTitle = true
      this.title = data.title
    },
    deleteNode(dataId) {
      this.$store.commit('setDragTreeData', this.findDataId(this.dragTreeData, dataId))
    },
    findDataId(list, dataId, title) {
      list.map((v, index) => {
        if (v.dataId == dataId) {
          if (title) {
            v.title = title
          } else {
            list.splice(index, 1)
          }
        } else if (v.children) {
          this.findDataId(v.children, dataId, title)
        }
      })
      return list
    },
    save(data) {
      this.$store.commit('setDragTreeData', this.findDataId(this.dragTreeData, data.dataId, this.title))
      this.editTitle = false
    },
    cancel() {
      this.editTitle = false
    },
    bindDragMoveEvent() {
      document.bind('mouseup', this.dragEnd)
      document.bind('mousemove', this.dragMove)
    },
    unbindDragMoveEvent() {
      document.unbind('mouseup', this.dragEnd)
      document.unbind('mousemove', this.dragMove)
    },
    dragStart(evt) {
      // console.log(this)
      this.isDragging = true
      this.dragInfo = DomHelper.dragInfo(this.nodeData, this.parentNodeData)
      console.log('dragInfo', this.dragInfo)
      let index = DomHelper.jsonIndex(this.nodeData, this.parentNodeData.children)
      // 隐藏当前节点
      // this.nodeData.hidden = true
      // 加入替换节点 index + 1 => index, 1
      this.parentNodeData.children.splice(index, 1, { name: 'placeholder', placeholder: true })
      // 创建拖动节点
      let el = this.$el
      let cloneEl = el.cloneNode(true)
      let parentEl = el.parentNode
      this.dragElm = document.createElement(parentEl.tagName).addClass(parentEl.className).addClass('drag-tree-node-drag')
      this.dragElm.css('width', `${el.offsetWidth}px`)
      this.dragElm.css('z-index', 9999)
      this.setPlaceHolderHeight()
      this.pos = DomHelper.positionStarted(evt, el)
      this.dragElm.css({
        left: `${evt.pageX - this.pos.offsetX}px`,
        top: `${evt.pageY - this.pos.offsetY}px`
      })
      this.dragElm.append(cloneEl)
      document.querySelector('body').append(this.dragElm)
      // 绑定dragMove事件
      this.bindDragMoveEvent()
    },
    dragMove(evt) {
      if (!this.isDragging) return true
      // console.log('move')
      let leftElmPos = evt.pageX - this.pos.offsetX
      let topElmPos = evt.pageY - this.pos.offsetY
      this.dragElm.css({
        left: `${leftElmPos}px`,
        top: `${topElmPos}px`
      })
      // 判断移动方向
      DomHelper.positionMoved(evt, this.pos, this.firstMoving)
      if (this.firstMoving) {
        this.firstMoving = false
        return
      }
      if (this.pos.dirAx) { // 水平移动
        if (this.pos.distX > 0) { // 向右移动
          let prev = this.dragInfo.prev()
          if (prev) {
            let children = prev.children
            if (children) {
              this.dragInfo.moveTo(prev, prev.children, prev.children.length)
            }
          }
        }
        if (this.pos.distX < 0) { // 向左移动
          let next = this.dragInfo.next()
          if (!next) {
            let target = this.dragInfo.parent
            if (target) {
              let parent = this.getNodeParent(target, this.rootTreeData).match
              if (parent) {
                this.dragInfo.moveTo(parent, parent.children, DomHelper.jsonIndex(target, parent.children) + 1)
              }
            }
          }
        }
      } else { // 垂直移动
        if (this.pos.distY > 0) {
          
          let next = this.dragInfo.next()
          if (next) {
            this.dragInfo.moveTo(next, next.children, 0)
          } else { // 寻找父节点的同级节点
            let target = this.dragInfo.parent
            if (target) {
              let parent = this.getNodeParent(target, this.rootTreeData).match
              if (parent) {
                this.dragInfo.moveTo(parent, parent.children, DomHelper.jsonIndex(target, parent.children) + 1)
              }
            }
          }
        }
        if (this.pos.distY < 0) {
          let prev = this.dragInfo.prev()
          if (prev) {
            prev.children = prev.children ? prev.children : []
            this.dragInfo.moveTo(prev, prev.children, prev.children.length)
          } else {
            let target = this.dragInfo.parent
            if (target) {
              let parent = this.getNodeParent(target, this.rootTreeData).match
              if (parent) {
                this.dragInfo.moveTo(parent, parent.children, DomHelper.jsonIndex(target, parent.children))
              }
            }
          }
        }
      }
    },
    dragEnd(evt) {
      this.unbindDragMoveEvent()
      this.isDragging = false
      if (this.dragElm) {
        console.log('end')
        this.dragInfo.apply()
        let list = this.findId(this.dragTreeData, this.dragInfo.apply())
        this.$store.commit('setDragTreeData', list)
        this.$nextTick(() => {
          this.dragElm.remove()
          this.dragElm = null

          this.dragInfo = null
        })
      }
    },
    findId(list, data) {
      list.map((v, index) => {
        if (v.dataId == data.dataId) {
          list.splice(index, 1, data)
        } else if (v.children) {
          this.findId(v.children, data)
        }
      })
      return list
    }
  },
  beforeCreate() {
    this.$options.components.DragTreeNodes = DragTreeNodes
  }
}
</script>
<style>
.drag-tree-node .clickable {
  cursor: pointer;
}
.drag-tree-node,
.drag-tree-placeholder {
  position: relative;
  margin: 0;
  padding: 0;
  min-height: 20px;
  line-height: 20px;
}
.drag-tree-placeholder {
  background: #f0f9ff;
  border: dashed 2px #bed2db;
  box-sizing: border-box;
}
.drag-tree-node .drag-tree-handle {
  overflow: hidden;
  user-select: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 15px;
  padding-left: 30px;
  line-height: 30px;
  background-color: #fff;
  border: 1px solid #ddd;
  cursor: move;
  position: relative;
}
.drag-tree-node .drag-tree-handle:hover {
  background: #727272;
  color: #fff;
}
.drag-tree-node .drag-tree-handle .drag-tree-icon {
  font-size: 20px;
}
.drag-tree-node .right-button {
  margin-left: 8px;
}
.drag-tree-node-drag {
  position: absolute;
  pointer-events: none;
  z-index: 999;
  opacity: 0.8;
}
.drag-tree-node-hidden {
  display: none;
}
</style>

