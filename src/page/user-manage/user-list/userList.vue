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
                    <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px" @change="_getUserList(1)"></Input>
                    <!-- <Select v-model="searchDepartment" style="width:200px" placeholder="部门" class="marginLeft">
                        <Option v-for="item in departmentList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="searchCounty" style="width:200px" placeholder="区县" class="marginLeft">
                        <Option v-for="item in countyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <Select v-model="searchSystem" style="width:200px" placeholder="系统选择" class="marginLeft">
                        <Option v-for="item in systemList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select> -->
                </div>
                <div class="search_button">
                    <i-button @click="userAddOpen">新增</i-button>
                    <i-button class="marginLeft">导入</i-button>
                </div>
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
                    <Button type="info" @click="equipmentOpen(scope)" size="small" class="marginRight" icon="ios-gear" title="设备信息"></Button>
                    <Button type="info" @click="userEditOpen(scope)" size="small" class="marginRight" icon="edit" title="编辑"></Button>
                    <Button type="error" @click="remove(scope)" size="small" icon="trash-a" title="删除"></Button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="tablePage">
            <Page :total=total  :current="1" @on-change="_getUserList" show-total></Page>
        </div>
    </Card>
    <Modal v-model="userModal" :title=modalTitle @on-ok="addOrUpdateUser">
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
  <Modal v-model="equipmentModal" :title=modalTitle @on-ok="updateEquipment">
        <Form :model="equipmentForm" label-position="left" :label-width="100">
            <FormItem label="设备类型">
                <Select v-model="equipmentForm.arOs" placeholder="请选择...">
                    <Option v-for="item in equipmentType" :value="item.value" :key="item.key">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="绑定码">
                <Input v-model="equipmentForm.arCodeBind" placeholder="请输入..."></Input>
            </FormItem>
            <FormItem label="登陆次数">
                <Input v-model="equipmentForm.arLogincount" placeholder="请输入..."></Input>
            </FormItem>
            <FormItem label="注册时间">
                <Input v-model="equipmentForm.arRegtime" placeholder="请输入..." ></Input>
            </FormItem>
            <FormItem label="最后登陆时间">
                <Input v-model="equipmentForm.arLastlogintime" placeholder="请输入..."></Input>
            </FormItem>
        </Form>
  </Modal>
</Content>    
</template>

<script>
import { getAreaCode, getUserList, addUser, updateUser, deleteUser ,
        getEquipment , updateEquipment} from '@/api/user-service'
import {formatDate} from '@/components/dateChange/dateChange.js';
import MD5 from 'crypto-js/md5'
export default {
    data() {
        return {
            userListHeight: window.innerHeight - 65 - 60 - 20 - 90 - 18 + 'px',
            searchDepartment: '',
            searchCounty:'',
            searchSystem: '',
            searchName: '',
            userModal: false,
            equipmentModal:false,
            modalTitle: '',
            total: 0,
            isAdd: false,
            userForm: {
                arLoginname: '',
                arTruename: '',
                arPassword: '',
                arTel: '',//座机
                arMobile: '',//手机
                arEmail: '',
                arSalt: '', //校验码
                arGroup: '',//用户组
                arFax: '',//用户组
                arBranch: '', //部门
                arAreacode: '',//区县
                arSource: ''//来源
            },
            equipmentForm:{

            },
            userData: [],
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
            countyFilterList: [

            ],
            systemList: [
                {
                    value: '',
                    label: '系统选择',
                    key: 5
                },
                {
                    value: 'fx',
                    label: '风险系统',
                    key: 6
                },
                {
                    value: 'ghdw',
                    label: '规划定位',
                    key: 7
                }
            ],
            equipmentType:[
                {
                    value:'ios_iphone',
                    label:'ios_iphone'
                },
                {
                    value:'ios_ipad',
                    label:'ios_ipad'
                },
                {
                    value:'android_iphone',
                    label:'android_iphone'
                },
                {
                    value:'android_ipad',
                    label:'android_ipad'
                }
            ]
        }
    },
    created() {
        getAreaCode().then(res => {
            for (let i in res.data.list) {
                this.countyList.push({
                    value: res.data.list[i].areacode,
                    label: res.data.list[i].areaname
                })
                this.countyFilterList.push({
                    text: res.data.list[i].areaname,
                    value: res.data.list[i].areaname
                })
            }
        }),
            this._getUserList(1)
    },
    methods: {
        userAddOpen() {
            this.userModal = true;
            this.isAdd = true;
            this.modalTitle = '新增用户';
            for (let i in this.userForm) {
                this.userForm[i] = '';
            }
        },
        userEditOpen(params) {
            this.userModal = true;
            this.isAdd = false;
            this.modalTitle = '修改用户';
            for (let i in this.userForm) {
                this.userForm[i] = '';
                if (params.row[i]) {
                    this.userForm[i] = params.row[i]
                }
            }
        },
        equipmentOpen(params){
            this.equipmentModal = true
            let data = {
                pageNo:1,
                pageSize: 10,
                arId:params.row.arId
            }
            getEquipment(data).then(res=>{
                console.log(res)
            })
        },
        remove(params) {
            let data = {
                arId: params.row.arId
            }
            this.$Modal.confirm({
                content: '删除后数据无法恢复，是否继续？',
                onOk: () => {
                    this.userData.splice(params.$index, 1);
                    deleteUser(data).then(res => {
                        if (res.code = 20000) {
                            this.$Message.success('删除成功');
                        }
                    })
                },
                onCancel: () => {

                }
            });

        },
        filterByUserGroup(value, row) {
            return row.userGroup === value;
        },
        filterByDepartment(value, row) {
            return row.department === value;
        },
        _getUserList(page) {
            let data = {
                methods: 'list',
                pageNo: page,
                pageSize: 10
            }
            getUserList(data).then(res => {
                this.userData = []
                for (let i in res.data.list) {
                    this.userData.push(res.data.list[i])
                }
                this.total = res.data.total
            })
        },
        addOrUpdateUser() {
            let data = {
                arLoginname: this.userForm.arLoginname,
                arTruename: this.userForm.arTruename,
                arPassword: MD5(this.userForm.arPassword).toString(),
                arTel: this.userForm.arTel,//座机
                arMobile: this.userForm.arMobile,//手机
                arEmail: this.userForm.arEmail,
                arSalt: this.userForm.arSalt, //校验码
                arGroup: this.userForm.arGroup,//用户组
                arFax: this.userForm.arFax,//用户组
                arBranch: this.userForm.arBranch, //部门
                arAreacode: this.userForm.arAreacode,//区县
                arSource: this.userForm.arSource//来源
            }
            if (this.isAdd) {
                addUser(data).then(res => {
                    if (res.code == 20000) {
                        this.$Message.info('添加成功');
                    }
                })
            } else {
                updateUser(data).then(res => {
                    if (res.code == 20000) {
                        this.$Message.info('修改成功');
                    }
                })
            }
        },
        //跟新设备
        updateEquipment(){

        }
    }
}
</script>

<style>
.el-table-filter__content {
  max-height: 160px;
  overflow-y: scroll;
}
</style>
