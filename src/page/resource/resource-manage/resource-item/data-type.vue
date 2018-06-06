<template>
  <div class="data-type">
    <v-search :importShow="false" @on-search="search" @on-build="newData"/>
    <el-table :data="data" border>
      <el-table-column prop="itemid" label="id" sortable=""></el-table-column>
      <el-table-column prop="typename" label="数据名称"></el-table-column>
      <el-table-column prop="typetime" label="时间"></el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <Button type="info" @click="editData(scope)" size="small" class="marginRight" title="编辑">编辑</Button>
          <Button type="error" @click="deleteData(scope)" size="small" title="删除">删除</Button>
        </template>
      </el-table-column>
    </el-table>
    <Modal v-model="editDataModal" :closable='false' :mask-closable="false" :width="500" @on-ok="saveModal" @on-cancel="cancelModal">
      <h3 slot="header" style="color:#2D8CF0">数据信息</h3>
      <Form :model="editItemForm" :label-width="60">
        <FormItem label="数据名称" prop="typename">
          <Input v-model="editItemForm.typename" placeholder="数据更新时间"></Input>
        </FormItem>
        <FormItem label="类型编号" prop="typeid">
          <Input v-model="editItemForm.typeid" placeholder="数据更新时间"></Input>
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
    saveModal() {
      if(this.editItemForm.typeid == '') {
        this._mm.errorTips('数据类型id不能为空')
      } else if(this.editItemForm.typename == '') {
        this._mm.errorTips('数据类型名称不能为空')
      } else if(!newOrEdit) {
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
    editData(scope) {
      this._getMsBaseContentTypeByItemid(scope.row.itemid)
    },
    deleteData(row) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除这条数据吗？',
        onOk: () => {
          this._deleteDataType(scope.row.itemid)
        }
      })
    },
    newData() {
      this.editDataModal = true
    },
    _getDataTypeList() {
      getDataTypeList().then(res => {
        if (res.code === 20000) {
          res.data.list.map(v => {
            v.typetime = this._mm.formatDate(v.typetime)
          })
          this.data = res.data.list
        } else {
          this._mm.errorTips()
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
          this._mm.errorTips()
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
          this._mm.successTips(`添加${res.message}`)
          this._getDataTypeList()
        } else {
          this._mm.errorTips(`添加${res.message}`)
        }
      })
    },
    _updateDataType(data) {
      updateDataType(data).then(res => {
        if (res.code === 20000) {
          this._mm.successTips(`修改${res.message}`)
          this._getDataTypeList()
        } else {
          this._mm.errorTips(`修改${res.message}`)
        }
      })
    },
    _deleteDataType(id) {
      deleteDataType(id).then(res => {
        if (res.code === 20000) {
          this._mm.successTips(`删除${res.message}`)
          this._getDataTypeList()
        } else {
          this._mm.errorTips(`删除${res.message}`)
        }
      })
    },
    _deleteDataTypes(data) {
      deleteDataTypes(data).then(res => {
        if (res.code === 20000) {
          this._mm.successTips(`批量删除${res.message}`)
          this._getDataTypeList()
        } else {
          this._mm.errorTips(`批量删除${res.message}`)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
