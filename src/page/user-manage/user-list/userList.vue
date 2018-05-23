<template>
<Content :style="{height:userListHeight}">
    <Breadcrumb :style="{marginBottom: '17px'}">
      <BreadcrumbItem>用户管理</BreadcrumbItem>
      <BreadcrumbItem>用户列表</BreadcrumbItem>
    </Breadcrumb>
    <Card>
    <div>
        <div class="seach_condition">
            <div class="condition_list">
                <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
                <i-select :model.sync="searchDepartment" style="width:200px" placeholder="部门" class="marginLeft">
                    <i-option v-for="item in departmentList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                </i-select>
                <i-select :model.sync="searchCounty" style="width:200px" placeholder="区县" class="marginLeft">
                    <i-option v-for="item in countyList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                </i-select>
                <i-select :model.sync="searchSystem" style="width:200px" placeholder="系统选择" class="marginLeft">
                    <i-option v-for="item in systemList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                </i-select>
            </div>
            <div class="search_button">
                <i-button @click="userAddOpen">新增</i-button>
                <i-button class="marginLeft">导入</i-button>
            </div>
        </div>
        <div class="tableSize">
            <el-table
                :data="userData"
                border
                style="width: 100%"
                >
                <el-table-column
                prop="arId"
                label="Id" width="60" sortable>
                </el-table-column>
                <el-table-column
                prop="arLoginname"
                label="用户名">
                </el-table-column>
                <el-table-column
                prop="arTruename"
                label="姓名" width="100">
                </el-table-column>
                <el-table-column
                prop="arMobile"
                label="电话">
                </el-table-column>
                <el-table-column
                prop="arEmail"
                label="邮箱" width="180">
                </el-table-column>
                <el-table-column
                prop="areaname"
                label="区县"
                :filters="countyFilterList"
                :filter-method="filterByUserGroup"
                filter-placement="bottom-end">
                </el-table-column>
                <el-table-column
                prop="name"
                label="部门"
                :filters="[{ text: '环保局', value: '环保局' }, { text: '规划局', value: '规划局' }]"
                :filter-method="filterByDepartment"
                filter-placement="bottom-end">
                </el-table-column>
                <el-table-column
                prop="addTime"
                label="注册时间" sortable>
                </el-table-column>
                <el-table-column
                label="操作"
                width="160"
                align="center"
                >
                <template slot-scope="scope">
                    <Button type="info" @click="userEditOpen(scope)" size="small" class="marginRight">编辑</Button>
                    <Button type="error" @click="remove(scope.$index)" size="small">删除</Button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="tablePage">
            <Page :total=total  :current="1" @on-change="_getUserList"></Page>
        </div>
    </div>
    </Card>
    <Modal v-model="userModal" :title=modalTitle @on-ok="addOrUpdateUser()">
        <Form :model="userForm" label-position="left" :label-width="100">
            <FormItem label="用户名">
                <Input v-model="userForm.arLoginname" placeholder="请输入用户名..."></Input>
            </FormItem>
            <FormItem label="真实姓名">
                <Input v-model="userForm.arTruename" placeholder="请输入真实姓名..."></Input>
            </FormItem>
            <FormItem label="密码">
                <Input v-model="userForm.arPassword" placeholder="请输入密码..." type="password"></Input>
            </FormItem>
            <FormItem label="手机号">
                <Input v-model="userForm.arMobile" placeholder="请输入手机号..."></Input>
            </FormItem>
            <FormItem label="座机">
                <Input v-model="userForm.arTel" placeholder="请输入座机..."></Input>
            </FormItem>
            <FormItem label="邮箱">
                <Input v-model="userForm.arEmail" placeholder="请输入邮箱..."></Input>
            </FormItem>
            <FormItem label="校验码">
                <Input v-model="userForm.arSalt" placeholder="请输入校验码..."></Input>
            </FormItem>
            <FormItem label="来源">
                <Input v-model="userForm.arSource" placeholder="请输入来源..."></Input>
            </FormItem>
            <FormItem label="用户组">
                <Input v-model="userForm.arGroup" placeholder="请输入用户组..."></Input>
            </FormItem>
            <FormItem label="用户组">
                <Input v-model="userForm.arFax" placeholder="请输入用户组..."></Input>
            </FormItem>
            <FormItem label="区县">
                <Select v-model="userForm.arAreacode">
                    <Option v-for="item in countyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="部门">
                <Select v-model="userForm.arBranch">
                    <Option v-for="item in departmentList" :value="item.value" :key="item.key">{{ item.label }}</Option>
                </Select>
            </FormItem>
        </Form>
  </Modal>
</Content>    
</template>

<script>
import { getAreaCode,getUserList,addUser,updateUser } from '@/api/user-service'
import crypto from 'crypto'
export default {
    data(){
        return{
            userListHeight:window.innerHeight - 65-60-20-90-18 +'px',
            searchDepartment:'',
            searchCounty:'',
            searchSystem:'',
            searchName:'',
            userModal:false,
            modalTitle:'',
            total:0,
            isAdd:false,
            userForm:{
                arLoginname:'',
                arTruename:'',
                arPassword:'',
                arTel:'',//座机
                arMobile:'',//手机
                arEmail:'',
                arSalt:'', //校验码
                arGroup:'',//用户组
                arFax:'',//用户组
                arBranch:'', //部门
                arAreacode:'',//区县
                arSource:''//来源
            },
            userData:[],
            departmentList: [
                {
                    value: '',
                    label: '部门'
                }
            ],
            countyList: [
                {
                    value: '',
                    label: '区县'
                }
            ],
            countyFilterList:[

            ],
            systemList: [
                {
                    value: '',
                    label: '系统选择',
                    key:5
                },
                {
                    value: 'fx',
                    label: '风险系统',
                    key:6
                },
                {
                    value: 'ghdw',
                    label: '规划定位',
                    key:7
                }
            ]
        }
    },
    created(){
        getAreaCode().then(res=>{
           for(let i in res.data.list){
               this.countyList.push({
                   value:res.data.list[i].areacode,
                   label:res.data.list[i].areaname
               })
               this.countyFilterList.push({
                   text:res.data.list[i].areaname,
                   value:res.data.list[i].areaname
               })
           }
        }),
        this._getUserList(1)
    },
    methods: {
        userAddOpen(){
            this.userModal = true;
            this.isAdd = true;
            this.modalTitle = '新增用户';
            for(let i in this.userForm){
               this.userForm[i] = '';
            }
        },
        userEditOpen(params){
            this.userModal = true;
            this.isAdd = false;
            this.modalTitle = '修改用户';
             for(let i in this.userForm){
               if(params.row[i]){
                   this.userForm[i] =params.row[i] 
               }
            }
        },
        remove (index) {
            this.$Modal.confirm({
                    content: '删除后数据无法恢复，是否继续？',
                    onOk: () => {
                        this.userData.splice(index, 1);
                        this.$Message.success('删除成功');
                    },
                    onCancel: () => {
                        
                    }
                });
            
        },
        filterByUserGroup(value, row) {
            return row.userGroup === value;
        },
        filterByDepartment(value,row){
            return row.department === value;
        },
        _getUserList(page){
            let data = {
                methods:'list',
                pageNo:page,
                pageSize:10
            }
            getUserList(data).then(res=>{
                this.userData = []
                for(let i in res.data.list){
                    this.userData.push(res.data.list[i])
                }
                this.total = res.data.total
            })
        },
        addOrUpdateUser(){
            let md5 = crypto.createHash("md5");
            let data = {
                arLoginname:this.userForm.arLoginname,
                arTruename:this.userForm.arTruename,
                arPassword:md5.digest(this.userForm.arPassword),
                arTel:this.userForm.arTel,//座机
                arMobile:this.userForm.arMobile,//手机
                arEmail:this.userForm.arEmail,
                arSalt:this.userForm.arSalt, //校验码
                arGroup:this.userForm.arGroup,//用户组
                arFax:this.userForm.arFax,//用户组
                arBranch:this.userForm.arBranch, //部门
                arAreacode:this.userForm.arAreacode,//区县
                arSource:this.userForm.arSource//来源
            }
            if(isAdd){
                addUser(data).then(res=>{
                    console.log(res)
                })
            }else{
                updateUser(data).then(res=>{
                    console.log(res)
                })
            }
           
        },
    }
}
</script>

<style>
    .el-table-filter__content{
        max-height: 160px;
        overflow-y: scroll;
    }
</style>
