<template>
<Content :style="{maxHeight:managerHeight}">
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>用户管理</BreadcrumbItem>
      <BreadcrumbItem>管理员列表</BreadcrumbItem>
    </Breadcrumb>
    <Card>
  <div>
      <v-search :searchShow="false" :deleteShow="false" :importShow="false" @on-build="managerAddOpen" />
      <div class="tableSize">
        <el-table :data="userData" border style="width: 100%">
            <el-table-column prop="id" label="Id" width="60" sortable>
            </el-table-column>
            <el-table-column prop="userName" label="用户名">
            </el-table-column>
            <el-table-column prop="realName" label="姓名">
            </el-table-column>
            <el-table-column prop="tel" label="电话">
            </el-table-column>
            <el-table-column prop="email" label="邮箱">
            </el-table-column>
            <el-table-column prop="roleName" label="角色" :filters="managerTypeList" :filter-method="filterByRole" filter-placement="bottom-end">
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <Button type="info" @click="managerEditOpen(scope)" size="small"  class="marginRight">编辑</Button>
                    <Button type="error" @click="remove(scope)" size="small">删除</Button>
                </template>
            </el-table-column>
        </el-table>
      </div>
      <div class="tablePage">
        <Page :total="pageLength" v-show="pageLength>10" @on-change="pageChange" show-total show-elevator ref="managerPage"></Page>
      </div>
  </div>
  </Card>
  <Modal v-model="managerModal" :title=modalTitle @on-ok="addOrUpdate" ref="managerModal">
        <Form :model="managerForm" :label-width="100"  :rules="manageRule" ref="manageRule">
            <FormItem label="用户名" prop="userName">
                <Input v-model="managerForm.userName" placeholder="请输入用户名"></Input>
            </FormItem>
            <FormItem label="真实姓名" prop="realName">
                <Input v-model="managerForm.realName" placeholder="请输入真实姓名"></Input>
            </FormItem>
            <FormItem label="密码" prop="password" v-show="isAdd">
                <Input v-model="managerForm.password" placeholder="请输入密码" type="password"></Input>
            </FormItem>
             <FormItem label="密码" v-show="!isAdd">
                <Input v-model="managerForm.editPassword" placeholder="无新密码输入则保持原密码不变" type="password"></Input>
            </FormItem>
            <FormItem label="管理员类型" prop="role">
                <Select v-model="managerForm.role" @on-change="managerChange">
                    <Option v-for="item in managerTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="子系统" v-show="managerForm.role == 3">
                <div style="display:flex">
                    <Select v-model="sysType" multiple  placeholder="请选择系统类型" style="width:50%" @on-change="typeChange">
                        <Option v-for="item in systemTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="sysId" multiple  placeholder="请选择系统" style="width:50%">
                        <Option v-for="item in systemFilterList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
            </FormItem>
            <FormItem label="手机号" prop="tel">
                <Input v-model="managerForm.tel" placeholder="请输入手机号"></Input>
            </FormItem>
            <FormItem label="邮箱">
                <Input v-model="managerForm.email" placeholder="请输入邮箱"></Input>
            </FormItem>
        </Form>
  </Modal>
  </Content>
</template>

<script>
import { getManagerList, addManager, updateManager, deleteManager } from '@/api/manager-service.js'
import { getSystemList } from '@/api/system.js'
import MD5 from 'crypto-js/md5'
import vSearch from '@/components/search/index'
export default {
    components: {
        vSearch
    },
    data(){
        return{
            managerHeight:window.innerHeight - 174 +'px',
            searchName:'',
            searchManagerType:'',
            managerModal:false,
            modalTitle:'',
            pageLength:0,
            nowPage:1,
            managerForm:{
                userName:'',
                realName:'',
                password:'',
                editPassword:'',
                tel:'',
                email:'',
                role:'',
                id:''
            },
            sysId: [],
            sysType: [],
            userData: [],
            systemList: [],
            systemFilterList: [],
            systemTypeList: [{
                value: 1,
                label: '综合市情'
            }, {
                value: 2,
                label: '规划定位'
            }, {
                value: 3,
                label: '综合区情'
            }],
            isAdd: true,
            managerTypeList: [
                {
                    value: 1,
                    label: '超级管理员',
                    text: '超级管理员',
                },
                {
                    value: 2,
                    label: '市级管理员',
                    text: '市级管理员',
                },
                {
                    value: 3,
                    label: '普通管理员',
                    text: '普通管理员',
                }
            ],
            manageRule: {
                userName: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' }
                ],
                realName: [
                    { required: true, message: '真实姓名不能为空', trigger: 'blur' }
                ],
                tel: [
                    { required: true, message: '用户手机不能为空', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '用户邮箱不能为空', trigger: 'blur' },
                    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                ],
                role: [
                    { required: true, message: '请选择用户类型', trigger: 'change',type:'number'}
                ],
                password:[
                    { required: true, message: '用户密码不能为空', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码不能少于6位', trigger: 'blur' }
                ]
            },
        }
    },
    created() {
        this._getManagerList(1)
        getSystemList(1).then(res => {
            let data = res.data.list
            for (let i in data) {
                this.systemList.push({
                    value: data[i].id,
                    label: data[i].sysName,
                    type: data[i].type
                })
            }
        })
    },
    methods: {
        _getManagerList(page) {
            let data = {
                pageNo: page,
                pageSize: 10
            }
            getManagerList(data).then(res => {
                this.userData = res.data.list
                this.userData.map(v => {
                    if (v.role == 1) {
                        v.roleName = '超级管理员'
                    } else if (v.role == 2) {
                        v.roleName = '市级管理员'
                    } else if (v.role == 3) {
                        v.roleName = '普通管理员'
                    }
                })
                this.pageLength = res.data.total
            })
        },
        managerAddOpen(){
            this.$refs.manageRule.resetFields()
            this.isAdd = true
            this.managerModal = true
            this.modalTitle = '新增管理员'
            this.sysId = []
            this.sysType = []
            for (var i in this.managerForm) {
                this.managerForm[i] = ''
            }
        },
        managerEditOpen(params){
            this.$refs.manageRule.resetFields()
            this.isAdd = false
            this.managerModal = true;
            this.modalTitle = '修改管理员';
            this.sysId = []
            this.sysType = []
            for (var i in this.managerForm) {
                if (params.row[i]) {
                    this.managerForm[i] = params.row[i]
                }
            }
            this.managerForm.editPassword = ''
            if (params.row.list.length > 0) {
                params.row.list.map(v => {
                    this.sysId.push(v.id)
                    this.sysType.push(v.type)
                })
            }
        },
        managerChange() {
            this.sysId = []
            this.sysType = []
        },
        typeChange() {
            let array = []
            if (this.sysType.length > 0) {
                this.sysType.map(a => {
                    this.systemList.map(b => {
                        if (a == b.type) {
                            array.push(b)
                        }
                    })
                })
                this.systemFilterList = array
            } else {
                this.systemFilterList = this.systemList
            }
        },
        addOrUpdate() {
            let data = {
                userName:this.managerForm.userName,
                realName:this.managerForm.realName,
                password:'',
                tel:this.managerForm.tel,
                email:this.managerForm.email,
                role:this.managerForm.role,
                sysIdStr:this.sysId.join(",")
            }
            this.$refs.manageRule.validate((valid) => {
                if(!valid){
                    this.$refs.managerModal.visible = true;
                    this.managerModal = true;
                }else{
                    if(this.managerForm.role == 3&&this.sysId.length == 0){
                        this.$Message.error('请至少选择一个系统')
                        this.$refs.managerModal.visible = true;
                        this.managerModal = true; 
                    }else{
                        if(this.isAdd){
                            data.password = MD5(this.managerForm.password).toString()
                            addManager(data).then(res=>{
                                if (res.code == 20000) {
                                    this.$Message.success('添加成功');
                                    this._getManagerList(this.nowPage)
                                }else{
                                    this.$Message.error(res.message);
                                }
                            })
                        }else{
                            if(this.managerForm.editPassword){
                                data.password = MD5(this.managerForm.editPassword).toString()
                            }else{
                                data.password = this.managerForm.password
                            }
                            data.id = this.managerForm.id
                            updateManager(data).then(res=>{
                                if (res.code == 20000) {
                                    this.$Message.success('修改成功');
                                    this._getManagerList(this.nowPage)
                                }else{
                                    this.$Message.error(res.message);
                                }
                            })
                        }
                    }
                }
            })
        },
        pageChange(page) {
            this.nowPage = page
            this._getManagerList(page)
        },
        remove(params) {
            this.$Modal.confirm({
                content: '删除后数据无法恢复，是否继续？',
                onOk: () => {
                    let data = {
                        id: params.row.id
                    }
                    deleteManager(data).then(res => {
                        if (res.code == 20000) {
                            this.userData.splice(params.$index, 1);
                            this.$Message.success('删除成功');
                            this._getManagerList(1)
                            this.$refs.managerPage.currentPage = 1
                        } else {
                            this.$Message.error(res.message);
                        }
                    })
                },
                onCancel: () => {

                }
            });
        },
        filterByRole(value, row) {
            return row.role === value
        }
    }
}
</script>

<style>
</style>
