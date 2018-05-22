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
                    <i-option v-for="item in departmentList" :value="item.value" :key="item.key">{{ item.label }}</i-option>
                </i-select>
                <i-select :model.sync="searchCounty" style="width:200px" placeholder="区县" class="marginLeft">
                    <i-option v-for="item in countyList" :value="item.value" :key="item.key">{{ item.label }}</i-option>
                </i-select>
                <i-select :model.sync="searchSystem" style="width:200px" placeholder="系统选择" class="marginLeft">
                    <i-option v-for="item in systemList" :value="item.value" :key="item.key">{{ item.label }}</i-option>
                </i-select>
            </div>
            <div class="search_button">
                <i-button @click="userAddOpen">新增</i-button>
                <i-button class="marginLeft">导入</i-button>
            </div>
        </div>
        <div class="tableSize">
            <Table border ref="selection" :columns="columns" :data="userData"></Table>
        </div>
        <div class="tablePage">
            <Page :total="userData.length"></Page>
        </div>
    </div>
    </Card>
    <Modal v-model="userModal" :title=modalTitle>
        <Form :model="userForm" label-position="left" :label-width="100">
            <FormItem label="用户名">
                <Input v-model="userForm.userName" placeholder="请输入用户名..."></Input>
            </FormItem>
            <FormItem label="真实姓名">
                <Input v-model="userForm.realName" placeholder="请输入真实姓名..."></Input>
            </FormItem>
            <FormItem label="密码">
                <Input v-model="userForm.password" placeholder="请输入密码..." type="password"></Input>
            </FormItem>
            <FormItem label="手机号">
                <Input v-model="userForm.tel" placeholder="请输入手机号..."></Input>
            </FormItem>
            <FormItem label="邮箱">
                <Input v-model="userForm.email" placeholder="请输入邮箱..."></Input>
            </FormItem>
            <FormItem label="区县">
                <Select v-model="userForm.userGroup">
                    <Option v-for="item in countyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="部门">
                <Select v-model="userForm.department">
                    <Option v-for="item in departmentList" :value="item.value" :key="item.key">{{ item.label }}</Option>
                </Select>
            </FormItem>
        </Form>
  </Modal>
</Content>    
</template>

<script>
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
            userForm:{
                userName:'',
                realName:'',
                password:'',
                tel:'',
                email:'',
                userGroup:'',
                department:''
            },
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: 'Id',
                    key: 'id'
                },
                {
                    title: '用户名',
                    key: 'userName'
                },
                {
                    title: '真实姓名',
                    key: 'realName'
                },
                {
                    title: '手机',
                    key: 'tel'
                },
                {
                    title:'邮箱',
                    key:'email'
                },
                {
                    title: '区县',
                    key: 'userGroup'
                },
                {
                    title: '部门',
                    key: 'department'
                },
                {
                    title: '注册时间',
                    key: 'registerTime'
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 250,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '25px'
                                },
                                on: {
                                    click: () => {
                                        this.userEditOpen(params)
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.remove(params.index)
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ],
            userData: [
                {
                    id: 1,
                    userName: '啦啦啦啦',
                    realName: '张三',
                    tel: '18888888888',
                    email:'123456@163.com',
                    userGroup: '万州区',
                    department: '环保局',
                    registerTime: '2018年1月1日'
                },
                {
                    id: 1,
                    userName: '啦啦啦啦',
                    realName: '张三',
                    tel: '18888888888',
                    email:'123456@163.com',
                    userGroup: '万州区',
                    department: '环保局',
                    registerTime: '2018年1月1日'
                },
                {
                    id: 1,
                    userName: '啦啦啦啦',
                    realName: '张三',
                    tel: '18888888888',
                    email:'123456@163.com',
                    userGroup: '万州区',
                    department: '环保局',
                    registerTime: '2018年1月1日'
                },
                {
                    id: 1,
                    userName: '啦啦啦啦',
                    realName: '张三',
                    tel: '18888888888',
                    email:'123456@163.com',
                    userGroup: '万州区',
                    department: '环保局',
                    registerTime: '2018年1月1日'
                },
                {
                    id: 1,
                    userName: '啦啦啦啦',
                    realName: '张三',
                    tel: '18888888888',
                    email:'123456@163.com',
                    userGroup: '万州区',
                    department: '环保局',
                    registerTime: '2018年1月1日'
                },
                {
                    id: 1,
                    userName: '啦啦啦啦',
                    realName: '张三',
                    tel: '18888888888',
                    email:'123456@163.com',
                    userGroup: '万州区',
                    department: '环保局',
                    registerTime: '2018年1月1日'
                },
                {
                    id: 1,
                    userName: '啦啦啦啦',
                    realName: '张三',
                    tel: '18888888888',
                    email:'123456@163.com',
                    userGroup: '万州区',
                    department: '环保局',
                    registerTime: '2018年1月1日'
                },
                {
                    id: 1,
                    userName: '啦啦啦啦',
                    realName: '张三',
                    tel: '18888888888',
                    email:'123456@163.com',
                    userGroup: '万州区',
                    department: '环保局',
                    registerTime: '2018年1月1日'
                },
                {
                    id: 1,
                    userName: '啦啦啦啦',
                    realName: '张三',
                    tel: '18888888888',
                    email:'123456@163.com',
                    userGroup: '万州区',
                    department: '环保局',
                    registerTime: '2018年1月1日'
                },
                {
                    id: 1,
                    userName: '啦啦啦啦',
                    realName: '张三',
                    tel: '18888888888',
                    email:'123456@163.com',
                    userGroup: '万州区',
                    department: '环保局',
                    registerTime: '2018年1月1日'
                }
            ],
            departmentList: [
                {
                    value: '',
                    label: '部门',
                    key:1
                },
                {
                    value: 'hb',
                    label: '环保局',
                    key:2
                },
                {
                    value: 'jt',
                    label: '交通局',
                    key:3
                },
            ],
            countyList: [
                {
                    value: '',
                    label: '区县',
                    key:3
                },
                {
                    value: 'yb',
                    label: '渝北区',
                    key:4
                },
                {
                    value: 'wz',
                    label: '万州区',
                    key:5
                }
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
    methods: {
        userAddOpen(){
            this.userModal = true;
            this.modalTitle = '新增用户';
            for(var i in this.userForm){
               this.userForm[i] = '';
            }
        },
        userEditOpen(params){
            this.userModal = true;
            this.modalTitle = '修改用户';
             for(var i in this.userForm){
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
            
        }
    }
}
</script>

<style>
</style>
