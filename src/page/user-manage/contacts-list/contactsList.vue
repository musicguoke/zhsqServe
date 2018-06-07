<template>
<Content :style="{maxHeight:managerHeight}">
    <Breadcrumb :style="{marginBottom: '17px'}">
      <BreadcrumbItem>用户管理</BreadcrumbItem>
      <BreadcrumbItem>管理员列表</BreadcrumbItem>
    </Breadcrumb>
    <Card>
  <div>
      <v-search :searchShow="false" :importShow="false" @on-build="managerAddOpen" />
      <div class="tableSize">
        <el-table :data="userData" border style="width: 100%">
            <el-table-column prop="id" label="Id" width="60">
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
        <Page :total="pageLength" v-show="pageLength>10" @on-change="pageChange" show-total show-elevator></Page>
      </div>
  </div>
  </Card>
  <Modal v-model="managerModal" :title=modalTitle @on-ok="addOrUpdate">
        <Form :model="managerForm" label-position="left" :label-width="100">
            <FormItem label="用户名">
                <Input v-model="managerForm.userName" placeholder="请输入用户名..."></Input>
            </FormItem>
            <FormItem label="真实姓名">
                <Input v-model="managerForm.realName" placeholder="请输入真实姓名..."></Input>
            </FormItem>
            <FormItem label="密码">
                <Input v-model="managerForm.password" placeholder="请输入密码..." type="password"></Input>
            </FormItem>
            <FormItem label="子系统">
                <Select v-model="sysId" multiple>
                    <Option v-for="item in systemList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="手机号">
                <Input v-model="managerForm.tel" placeholder="请输入手机号..."></Input>
            </FormItem>
            <FormItem label="邮箱">
                <Input v-model="managerForm.email" placeholder="请输入邮箱..."></Input>
            </FormItem>
            <FormItem label="管理员类型">
                <Select v-model="managerForm.role">
                    <Option v-for="item in managerTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
        </Form>
  </Modal>
  </Content>
</template>

<script>
import {getManagerList,addManager,updateManager,deleteManager} from '@/api/manager-service.js'
import {getSystemList} from '@/api/system.js'
import MD5 from 'crypto-js/md5'
import vSearch from '@/components/search/index'
export default {
    components: {
        vSearch
    },
    data(){
        return{
            managerHeight:window.innerHeight - 136 +'px',
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
                tel:'',
                email:'',
                role:'',
                id:''
            },
            sysId:[],
            userData:[],
            systemList:[],
            isAdd:true,
            managerTypeList: [
                {
                    value: 1,
                    label: '超级管理员',
                    text:'超级管理员',
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
            ]
        }
    },
    created(){
        this._getManagerList(1)
        getSystemList(1).then(res=>{
            let data = res.data.list
            for(let i in data){
                this.systemList.push({
                    value:data[i].id,
                    label:data[i].sysName
                })
            }
        })
    },
    methods:{
        _getManagerList(page){
            let data = {
                pageNo:page,
                pageSize:10
            }
            getManagerList(data).then(res=>{
                this.userData = res.data.list
                this.userData.map(v=>{
                    if(v.role == 1){
                        v.roleName = '超级管理员'
                    }else if(v.role == 2){
                        v.roleName = '市级管理员'
                    }else if(v.role == 3){
                        v.roleName = '普通管理员'
                    }
                })
                this.pageLength = res.data.total
            })
        },
        managerAddOpen(){
            this.isAdd = true
            this.managerModal = true
            this.modalTitle = '新增管理员'
            this.sysId = []
            for(var i in this.managerForm){
               this.managerForm[i] = ''
            }
        },
        managerEditOpen(params){
            this.isAdd = false
            this.managerModal = true;
            this.modalTitle = '修改管理员';
            this.sysId = []
            for(var i in this.managerForm){
               if(params.row[i]){
                   this.managerForm[i] =params.row[i] 
               }
            }
        },
        addOrUpdate(){
            let data = {
                userName:this.managerForm.userName,
                realName:this.managerForm.realName,
                password:MD5(this.managerForm.password).toString(),
                tel:this.managerForm.tel,
                email:this.managerForm.email,
                role:this.managerForm.role,
                sysId:Array.from(this.sysId)
            }
            if(this.isAdd){
                addManager(data).then(res=>{
                    if (res.code == 20000) {
                        this.$Message.success('添加成功');
                        this._getManagerList(this.nowPage)
                    }else{
                        this.$Message.error(res.message);
                    }
                })
            }else{
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
        },
        pageChange(page){
            this.nowPage = page
            this._getManagerList(page)
        },
        remove (params) {
            this.$Modal.confirm({
                    content: '删除后数据无法恢复，是否继续？',
                    onOk: () => {
                        let data = {
                            id:params.row.id
                        }
                        deleteManager(data).then(res=>{
                            if (res.code == 20000) {
                                this.userData.splice(params.$index, 1);
                                this.$Message.success('删除成功');
                                this._getManagerList(this.nowPage)
                            }else{
                                this.$Message.error(res.message);
                            }
                        })
                    },
                    onCancel: () => {
                        
                    }
                });
        },
        filterByRole(value, row){
            return row.role === value
        }
    }
}
</script>

<style>
</style>
