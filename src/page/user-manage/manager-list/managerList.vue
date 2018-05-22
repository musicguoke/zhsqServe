<template>
<Content :style="{height:managerHeight}">
    <Breadcrumb :style="{marginBottom: '17px'}">
      <BreadcrumbItem>用户管理</BreadcrumbItem>
      <BreadcrumbItem>管理员列表</BreadcrumbItem>
    </Breadcrumb>
    <Card>
  <div>
      <div class="seach_condition">
         <div class="condition_list">
            <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
            <i-select :model.sync="searchManagerType" style="width:200px" placeholder="市级管理员" class="marginLeft">
                <i-option v-for="item in managerTypeList" :value="item.value" :key="item.key">{{ item.label }}</i-option>
            </i-select>
        </div>
         <div class="search_button">
            <i-button @click="managerAddOpen">新增</i-button>
            <i-button class="marginLeft">导入</i-button>
         </div>
      </div>
      <div class="tableSize">
        <el-table
                :data="userData"
                border
                style="width: 100%">
                <el-table-column
                prop="id"
                label="Id" width="60">
                </el-table-column>
                <el-table-column
                prop="userName"
                label="用户名">
                </el-table-column>
                <el-table-column
                prop="realName"
                label="姓名">
                </el-table-column>
                <el-table-column
                prop="tel"
                label="电话">
                </el-table-column>
                <el-table-column
                prop="email"
                label="邮箱">
                </el-table-column>
                <el-table-column
                label="操作"
                width="160"
                align="center"
                >
                <template slot-scope="scope">
                    <Button type="info" @click="managerEditOpen(scope)" size="small"  class="marginRight">编辑</Button>
                    <Button type="error" @click="remove(scope.$index)" size="small">删除</Button>
                </template>
                </el-table-column>
            </el-table>
      </div>
      <div class="tablePage">
        <Page :total="userData.length" ></Page>
      </div>
  </div>
  </Card>
  <Modal v-model="managerModal" :title=modalTitle>
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
            <FormItem label="手机号">
                <Input v-model="managerForm.tel" placeholder="请输入手机号..."></Input>
            </FormItem>
            <FormItem label="邮箱">
                <Input v-model="managerForm.email" placeholder="请输入邮箱..."></Input>
            </FormItem>
            <FormItem label="部门">
                <Select v-model="managerForm.role">
                    <Option v-for="item in roleList" :value="item.value" :key="item.key">{{ item.label }}</Option>
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
            managerHeight:window.innerHeight - 65-60-20-90-18 +'px',
            searchName:'',
            searchManagerType:'',
            managerModal:false,
            modalTitle:'',
            managerForm:{
                userName:'',
                realName:'',
                password:'',
                tel:'',
                email:'',
                role:''
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
                    title: '姓名',
                    key: 'realName'
                },
                {
                    title: '电话',
                    key: 'tel'
                },
                {
                    title: '邮箱',
                    key: 'email'
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
                                            this.managerEditOpen(params)
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
            userData:[
                {
                    id:1,
                    userName:'啦啦啦啦',
                    realName:'张三',
                    tel:'18888888888',
                    email:'12456@163.com'
                },
                {
                    id:1,
                    userName:'啦啦啦啦',
                    realName:'张三',
                    tel:'18888888888',
                    email:'12456@163.com'
                },
                {
                    id:1,
                    userName:'啦啦啦啦',
                    realName:'张三',
                    tel:'18888888888',
                    email:'12456@163.com'
                },
                {
                    id:1,
                    userName:'啦啦啦啦',
                    realName:'张三',
                    tel:'18888888888',
                    email:'12456@163.com'
                },
                {
                    id:1,
                    userName:'啦啦啦啦',
                    realName:'张三',
                    tel:'18888888888',
                    email:'12456@163.com'
                },
                {
                    id:1,
                    userName:'啦啦啦啦',
                    realName:'张三',
                    tel:'18888888888',
                    email:'12456@163.com'
                },
                {
                    id:1,
                    userName:'啦啦啦啦',
                    realName:'张三',
                    tel:'18888888888',
                    email:'12456@163.com'
                },
                {
                    id:1,
                    userName:'啦啦啦啦',
                    realName:'张三',
                    tel:'18888888888',
                    email:'12456@163.com'
                },
                {
                    id:1,
                    userName:'啦啦啦啦',
                    realName:'张三',
                    tel:'18888888888',
                    email:'12456@163.com'
                },
                {
                    id:1,
                    userName:'啦啦啦啦',
                    realName:'张三',
                    tel:'18888888888',
                    email:'12456@163.com'
                }
            ],
            managerTypeList: [
                {
                    value: 'shiji',
                    label: '市级管理员',
                    key:1
                },
                {
                    value: 'quxian',
                    label: '区县管理员',
                    key:2
                }
            ],
            roleList:[
                {
                    value: 'shiji',
                    label: '市级管理员',
                    key:1
                },
                {
                    value: 'quxian',
                    label: '区县管理员',
                    key:2
                },
                {
                    value: 'chaoji',
                    label: '超级管理员',
                    key:3
                }
            ]
        }
    },
    methods:{
        managerAddOpen(){
            this.managerModal = true;
            this.modalTitle = '新增管理员';
            for(var i in this.managerForm){
               this.managerForm[i] = '';
            }
        },
        managerEditOpen(params){
            this.managerModal = true;
            this.modalTitle = '修改管理员';
            for(var i in this.managerForm){
               if(params.row[i]){
                   this.managerForm[i] =params.row[i] 
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
