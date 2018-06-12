<template>
  <Content>
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>权限管理</BreadcrumbItem>
      <BreadcrumbItem>角色管理</BreadcrumbItem>
      <BreadcrumbItem v-if="name!==''">{{name}}</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <div v-show="!isShow">
        <v-search :search-show="false" :delete-show="false" :import-show="false" @on-build="show"/>
        <div class="tableSize">
          <el-table :data="roleList" border style="width: 100%">
            <el-table-column prop="grId" label="Id" width="100" sortable>
            </el-table-column>
            <el-table-column prop="grName" label="角色名称">
            </el-table-column>
            <el-table-column prop="arTruename" label="描述">
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
              <template slot-scope="scope">
                <Button type="primary" @click="edit(scope)" size="small" class="marginRight">编辑</Button>
                <Button type="error" @click="remove(scope)" size="small">删除</Button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="tablePage">
          <Page :total="total" :current="page" @on-change="_getRolesList"></Page>
        </div>
      </div>
      <authority-config v-show="isShow" ref="authConfig" :id="sysId" :sysOrRole="false" :newSys="newRole" @cancel="cancel" />
    </Card>
  </Content>
</template>

<script>
import { getRolesList, updateRole, deleteRole, updateRoleMap } from '@/api/role'
import AuthorityConfig from '@/components/authority-config/index'
import vSearch from '@/components/search/index'

export default {
  components: {
    AuthorityConfig,
    vSearch
  },
  data() {
    return {
      isShow: false,
      newRole: false,
      roleList: [],
      searchName: '',
      name: '',
      total: 0,
      page: 1,
      sysId: ''
    }
  },
  created() {
    this._getRolesList()
    this.sysId = this.$route.query.id
  },
  mounted() {
    this.$refs.authConfig._getBuildConfig()
  },
  methods: {
    show() {
      this.isShow = true
      this.newRole = true
      this.name = '新建角色'
    },
    cancel() {
      this._getRolesList()
      this.isShow = false
      this.newRole = false
      this.name = ''
    },
    edit(scope) {
      this.name = '编辑角色'
      this.isShow = true
      this.$refs.authConfig._getRoleMapById(scope.row.grId)
    },
    remove(scope) {
      this.$Modal.confirm({
        title: '提示',
        content: '确认删除吗？',
        onOk: () => {
          this._deleteRole(scope.row.grId)
        }
      })
    },
    _getRolesList(name, page) {
      getRolesList(name, page).then(res => {
        if (res.code === 20000) {
          this.roleList = res.data.list
          this.total = res.data.total
        } else {
          this.$Message.error(res.message)
        }
      })
    },
    _deleteRole(id) {
      deleteRole(id).then(res => {
        if (res.code === 20000) {
          this.$Message.success(`删除${res.message}`)
          this._getRolesList()
        } else {
          this.$Message.error(`删除${res.message}`)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
