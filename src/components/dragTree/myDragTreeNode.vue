<template>
  <li class="drag-tree-node">
    <div class="drag-tree-handle" @mousedown.self="dragStart">
      <div class="drag-tree-icon" @click="toggle" v-if="hasChildren">
        <Icon v-if="collapsed" type="arrow-right-b"></Icon>
        <Icon v-if="!collapsed" type="arrow-down-b"></Icon>
      </div>
      <span>{{ nodeData.title }}</span>
      <span>{{ nodeData.dataId }}</span>
    </div>
    <drag-tree-nodes
      :list="nodeData.children"
      :collapsed="collapsed"
      ref="childNodes">
    </drag-tree-nodes>
  </li>
</template>
<script>
import DragTreeNodes from './myDragTreeNodes'
import DomHelper from './dom-helper'
export default {
  name: 'DragTreeNode',
  props: {
    nodeData: Object
  },
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
      title: '',
      sourceData: null
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
      if (this.$parent.$parent.$options.name === 'MyDragTree') {
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
      this.sourceData = JSON.parse(JSON.stringify(this.dragInfo.siblings[this.dragInfo.index]))
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
      if (this.firstMoving) {
        this.firstMoving = false
        return
      }
    },
    checkDataIndex(list, id) {
      list.map(v => {
        if(v.dataId === id) {
          if(typeof this.sourceData === 'object' && !isNaN(this.sourceData.length)) {
            list = list.concat(this.sourceData)
          } else {
            list.push(this.sourceData)
          }
        } else if(v.children) {
          this.checkDataIndex(v.children, id)
        }
      })
      return list
    },
    dragEnd(evt) {
      this.unbindDragMoveEvent()
      this.isDragging = false
      let targetId, list = []
      targetId = evt.target.dataset['id']
      console.log(evt.target.dataset['id'])
      this.sourceData = this.changeListId(this.sourceData)
      if(targetId) {
        this.$store.commit('setDragTreeData', this.checkDataIndex(this.$store.state.dragTreeData, targetId))
      } else if(this.dragTreeData.length < 1) {
        if(typeof this.sourceData === 'object' && !isNaN(this.sourceData.length)) {
          list = list.concat(this.sourceData)
        } else {
          list.push(this.sourceData)
        }
        this.$store.commit('setDragTreeData', list)
      }
      if (this.dragElm) {
        console.log('end')
        this.dragInfo.apply()
        this.$nextTick(() => {
          this.dragElm.remove()
          this.dragElm = null
          this.dragInfo = null
        })
      }
    },
    changeListId(list) {
      if(typeof list === 'object' && !isNaN(list.length)) {
        list.map(v => {
          v.id = this.uuid()
          if(v.children) {
            this.changeListId(v.children)
          }
        })
      } else {
        list.id = this.uuid()
        if(list.children) {
          this.changeListId(list.children)
        }
      }
      return list
    },
    uuid() {
      let s = []
      let hexDigits = "0123456789abcdef"
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = "4"  
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-"

      let uuid = s.join("")
      return uuid
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
  padding: 5px 15px;
  padding-left: 30px;
  line-height: 30px;
  /* margin-bottom: -1px; */
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
  position: absolute;
  top: -5px;
  left: 0;
  padding: 10px 10px 0 10px;
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
