<template>
  <div class="data-type">
    <v-search
      :importShow="false"
      @on-search="search"
      @on-reset="reset"
      @on-build="newData"
      :disabled="selectedId.length <= 0"
      @on-delete="deleteMany"
    />
    <el-table :data="data" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="itemid" label="id" sortable=""></el-table-column>
      <el-table-column prop="typename" label="数据名称"></el-table-column>
      <el-table-column prop="typetime" label="时间"></el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <Button type="primary" @click="editData(scope.row)" size="small" class="marginRight" title="编辑">编辑</Button>
          <Button type="error" @click="deleteData(scope.row)" size="small" title="删除">删除</Button>
        </template>
      </el-table-column>
    </el-table>
    <Modal v-model="editDataModal" :closable='false' :mask-closable="false" :width="500" @on-ok="saveModal" @on-cancel="cancelModal">
      <h3 slot="header" style="color:#2D8CF0">数据信息</h3>
      <Form :model="editItemForm" :label-width="60">
        <FormItem label="数据名称" prop="typename">
          <Input v-model="editItemForm.typename" placeholder="数据名称"></Input>
        </FormItem>
        <FormItem label="类型编号" prop="typeid">
          <Input v-model="editItemForm.typeid" placeholder="类型编号"></Input>
        </FormItem>
        <!-- <FormItem label="插入类型" prop="typestatus">
          <Input v-model="editItemForm.typestatus" placeholder="数据更新时间"></Input>
        </FormItem> -->
      </Form>
    </Modal>
  </div>
</template>

<script>
import {
  getDataTypeList,
  getMsBaseContentTypeByItemid,
  getMsBaseContentTypeByTypeid,
  addDataType,
  updateDataType,
  deleteDataType,
  deleteDataTypes
} from '@/api/data-type'
import vSearch from '@/components/search/index'

export default {
  components: {
    vSearch
  },
  data() {
    return {
      newOrEdit: true,
      searchName: '',
      data: [],
      selectedId: [],
      editDataModal: false,
      editItemForm: {
        itemid: '',
        typename: '',
        typeid: '',
        typestatus: ''
      }
    }
  },
  created() {
    this._getDataTypeList()
  },
  methods: {
    search(name) {
      this._getDataTypeList('', name)
    },
    reset() {
      this._getDataTypeList()
    },
    handleSelectionChange(val) {
      this.selectedId = []
      val.map(v => {
        this.selectedId.push(v.id)
      })
    },
    deleteMany() {
      this.$Modal.confirm({
        content: '删除后数据无法恢复，是否继续？',
        onOk: () => {
          this._deleteStatistics(this.selectedId.toString())
        },
        onCancel: () => { }
      })
    },
    saveModal() {
      if(this.editItemForm.typeid == '') {
        this.$Message.error('数据类型id不能为空')
      } else if(this.editItemForm.typename == '') {
        this.$Message.error('数据类型名称不能为空')
      } else if(!this.newOrEdit) {
        this._updateDataType(this.editItemForm)
      } else {
        this._addDataType(this.editItemForm)
      }
    },
    cancelModal() {
      this.editItemForm = {
        itemid: '',
        typename: '',
        typeid: '',
        typestatus: ''
      }
    },
    editData(row) {
      this._getMsBaseContentTypeByItemid(row.itemid)
    },
    deleteData(row) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除这条数据吗？',
        onOk: () => {
          this._deleteDataType(row.itemid)
        }
      })
    },
    newData() {
      this.newOrEdit = true
      this.editDataModal = true
    },
    _getDataTypeList(page, name) {
      getDataTypeList(page, name).then(res => {
        if (res.code === 20000) {
          res.data.list.map(v => {
            v.typetime = this._mm.formatDate(v.typetime)
          })
          this.data = res.data.list
        } else {
          this.$Message.error()
        }
      })
    },
    _getMsBaseContentTypeByItemid(id) {
      getMsBaseContentTypeByItemid(id).then(res => {
        if (res.code === 20000) {
          this.editItemForm = {
            itemid: res.data.itemid,
            typename: res.data.typename,
            typeid: res.data.typeid,
            typestatus: res.data.typestatus
          }
          this.newOrEdit = false
          this.editDataModal = true
        } else {
          this.$Message.error()
        }
      })
    },
    _getMsBaseContentTypeByTypeid(id) {
      getMsBaseContentTypeByTypeid(id).then(res => {

      })
    },
    _addDataType(data) {
      addDataType(data).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`添加${res.message}`)
          this._getDataTypeList()
        } else {
          this.$Message.error(`添加${res.message}`)
        }
      })
    },
    _updateDataType(data) {
      updateDataType(data).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`修改${res.message}`)
          this._getDataTypeList()
        } else {
          this.$Message.error(`修改${res.message}`)
        }
      })
    },
    _deleteDataType(id) {
      deleteDataType(id).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`删除${res.message}`)
          this._getDataTypeList()
        } else {
          this.$Message.error(`删除${res.message}`)
        }
      })
    },
    _deleteDataTypes(data) {
      deleteDataTypes(data).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`批量删除${res.message}`)
          this._getDataTypeList()
        } else {
          this.$Message.error(`批量删除${res.message}`)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
