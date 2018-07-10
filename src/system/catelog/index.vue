<template>
  <div>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>目录管理</BreadcrumbItem>
      <BreadcrumbItem>修改目录</BreadcrumbItem>
    </Breadcrumb>
    <div class="table-box">
      <Card :style="{width:'49%',float:'left',maxHeight: contentHeight}">
        <my-drag-tree :list="dataTree"></my-drag-tree>
        <!-- <tree-table ref="tree" :items='dataTree' :columns='dataColumns' :buildSys="true" @on-tree-select="selectDataConfig">
        </tree-table> -->
      </Card>
      <Card :style="{width:'49%',float:'right',overflow:'hidden',maxHeight: contentHeight}">
        <drag-tree></drag-tree>
        <div
          v-if="list.length > 0"
          style="display: flex; justify-content: center;margin-top: 16px;"
        >
          <div>
            <Button type="primary" @click="handleSave">保存</Button>
            <Button type="error" @click="clear">清空</Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import DragTree from '@/components/DragTree/DragTree'
import MyDragTree from '@/components/DragTree/myDragTree'
import TreeTable from '@/components/my-tree/index'
import { getDateTree } from '@/api/system'
import { getCatalogBySysId, saveCatalogBySelf } from '@/api/catalog'

export default {
  data() {
    return {
      contentHeight: window.innerHeight - 174 + 'px',
      list: [],
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
      tempTree: [],
      tempList: [],
      sameLevelList: [],
      submitList: []
    }
  },
  components: {
    DragTree,
    TreeTable,
    MyDragTree
  },
  created() {
    this._getDateTree(-1)
    this._getCatalogBySysId()
  },
  mounted() {
    console.log(this.$refs.dragTree)
  },
  methods: {
    _getDateTree(id) {
      getDateTree(id).then(res => {
        this.dataTree = this.tempTree = this.changeListId(res)
      })
    },
    _getCatalogBySysId() {
      getCatalogBySysId().then(res => {
        this.list = res
        this.$store.commit('setDragTreeData', res)
      })
    },
    _saveCatalogBySelf(data) {
      saveCatalogBySelf(data).then(res => {
        if(res.code === 20000) {
          this.$Message.succss(res.msg)
        }
      })
    },
    selectDataConfig(section) {
      let data = Object.assign({}, section)
      if (this.checkData(this.list, data.dataId)) {
        this.tempList.push(data)
      }
      this.isChecked(data)
      this.distinct(this.tempList)
      this.arraySort(this.tempList)
      for (let i = 0; i < this.tempList.length; i++) {
        if (i < this.tempList.length - 1) {
          if (this.tempList[i + 1].level < this.tempList[i].level) {
            if (this.sameLevelList.length > 0) {
              this.sameLevelList.push(this.tempList[i])
              this.tempList[i + 1].children = []
              this.tempList[i + 1].children = this.sameLevelList
              this.sameLevelList = []
            } else {
              this.tempList[i + 1].children = []
              this.tempList[i + 1].children.push(this.tempList[i])
            }
          } else {
            this.sameLevelList.push(this.tempList[i])
          }
        }
      }
      this.list = [this.tempList[this.tempList.length - 1]]
    },
    checkData(list, id) {
      let bol = true
      list.map((v, i) => {
        if (v.dataId === id) {
          list.splice(i, 1)
          bol = false
        } else if (v.children) {
          this.checkData(v.children, id)
        }
      })
      return bol
    },
    changeListId(list) {
      list.map(v => {
        v.dataId = v.id
        v.id = this.uuid()
        if(v.children) {
          this.changeListId(v.children)
        }
      })
      return list
    },
    distinct(list) {
      let len = list.length
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          if (list[i].id == list[j].id) {
            list.splice(j, 1)
            len--
            j--
          }
        }
      }
    },
    arraySort(arr) {
      for (let j = 0; j < arr.length - 1; j++) {
        for (let i = 0; i < arr.length - 1 - j; i++) {
          if (arr[i].level < arr[i + 1].level) {
            let temp = arr[i]
            arr[i] = arr[i + 1]
            arr[i + 1] = temp
          }
        }
      }
    },
    isChecked(obj) {
      if (obj.parent) {
        this.tempList.map(v => {
          if (v.dataId !== obj.parent.dataId) {
            this.tempList.push(obj.parent)
          }
        })
        if (obj.parent.parent) {
          this.isChecked(obj.parent)
        }
      }
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
    },
    clear() {
      this.list = this.tempList = this.sameLevelList = []
      this.$refs.tree.handleCancelCheckAll()
      this._getDateTree(-1)
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
