<template>
  <div>
    <div class="seach_condition">
      <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
      <div class="search_button">
        <i-button class="marginLeft">导入</i-button>
      </div>
    </div>
    <tree-table ref="treeTable" :items='data3' :columns='dataColumns' @on-row-click="rowClick" @on-expand-click="loadData"></tree-table>
    <Modal v-model="editItemModal" :closable='false' :mask-closable=false :width="500">
      <h3 slot="header" style="color:#2D8CF0">修改目录</h3>
      <Form ref="editItemForm" :model="editItemForm" :label-width="100" label-position="right" :rules="passwordValidate">
        <FormItem label="id" prop="oldPass" :error="oldPassError">
          <Input v-model="editItemForm.id" placeholder="请输入现在使用的密码"></Input>
        </FormItem>
        <FormItem label="数据名称" prop="newPass">
          <Input v-model="editItemForm.name" placeholder="请输入新密码，至少6位字符"></Input>
        </FormItem>
        <FormItem label="数据描述" prop="description">
          <Input v-model="editItemForm.description" placeholder="请再次输入新密码"></Input>
        </FormItem>
        <FormItem label="数据类型" prop="type">
          <Select v-model="editItemForm.type">
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>
        <FormItem label="数据更新时间" prop="time">
          <Input v-model="editItemForm.time" placeholder="请再次输入新密码"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelEditPass">取消</Button>
        <Button type="primary" :loading="savePassLoading" @click="saveEditPass">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import TreeTable from '@/components/tree-table/index'
import { getDateTree } from '@/api/system'
import { getAreaList, getMsTabDatainfoById, updateMsTabDatainfo, deleteMsTabDatainfo, importMsTabFile } from '@/api/catalog'

export default {
  components: {
    TreeTable
  },
  data() {
    return {
      data3: [],
      code: '',
      searchName: '',
      editItemModal: false,
      editItemForm: {
        id: '',
        name: '',
        type: '',
        description: '',
        time: ''
      },
      dataColumns: [
        {
          type: 'selection',
          width: '50',
        },
        {
          title: '数据名称',
          key: 'title'
        }, {
          title: '数据类型',
          key: 'id',
          sortable: true
        }, {
          title: '排序',
          key: 'sort'
        }, {
          title: '更新时间',
          key: 'time'
        }, {
          title: '操作',
          type: 'action',
          actions: [{
            type: 'primary',
            text: '编辑'
          }, {
            type: 'error',
            text: '删除'
          }]
        }
      ]
    }
  },
  created() {
    this._getAreaList()
  },
  methods: {
    cancelEditPass() {
      this.editItemModal = false
    },
    saveEditPass() {
      this._updateMsTabDatainfo()
    },
    rowClick(item, e) {
      if (e.target.innerText === '删除') {
        this._deleteMsTabDatainfo(item.id)
      } else if (e.target.innerText === '编辑') {
        this._getMsTabDatainfoById(item.id)
      }
    },
    loadData(item, index) {
      if (item.areacode && this.code !== item.areacode) {
        this._getDateTree(item.areacode, index)
      }
      this.code = item.areacode
    },
    _getAreaList() {
      getAreaList().then(res => {
        if (res.code === 20000) {
          res.data.list.map(v => {
            v.title = v.areaname
            v.id = v.areacode
            this.data3.push(v)
          })
        } else {
          this._mm.errorTips(res.message)
        }
      })
    },
    _getDateTree(id) {
      getDateTree(id).then(res => {
        this.data3.map(v => {
          if (v.areacode === id) {
            v.children = res
          }
        })
        this.$refs.treeTable.initData(this.$refs.treeTable.deepCopy(this.data3), 1, null)
      })
    },
    _deleteMsTabDatainfo(id) {
      deleteMsTabDatainfo(id).then(res => {
        if (res.code === 20000) {
          this._mm.successTips(`删除${res.message}`)
        } else {
          this._mm.errorTips(`删除${res.message}`)
        }
      })
    },
    _getMsTabDatainfoById(id) {
      getMsTabDatainfoById(id).then(res => {
        if (res.code === 20000) {
          this.editItemModal = true
        } else {
          this._mm.errorTips(`获取${res.message}`)
        }
      })
    },
    _updateMsTabDatainfo(data) {
      updateMsTabDatainfo(data).then(res => {
        if (res.code === 20000) {
          this._mm.successTips(`修改${res.message}`)
        } else {
          this._mm.errorTips(`修改${res.message}`)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
