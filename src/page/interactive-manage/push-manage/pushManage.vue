<template>
<Content :style="{height:pushManageHeight}">
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>用户管理</BreadcrumbItem>
      <BreadcrumbItem>推送管理</BreadcrumbItem>
    </Breadcrumb>
    <Card>
  <div>
      <v-search :search-show="false" :import-show="false" @on-build="pushAddOpen"/>
      <div class="tableSize">
        <el-table :data="pushData" border style="width: 100%">
            <el-table-column prop="pId" label="Id" width="60">
            </el-table-column>
            <el-table-column prop="pRemark" label="推送组/用户">
            </el-table-column>
            <el-table-column prop="pType" label="推送类型">
            </el-table-column>
            <el-table-column prop="pGroup" label="组编号">
            </el-table-column>
            <el-table-column prop="pContent" label="内容">
            </el-table-column>
            <el-table-column prop="pFilename" label="文件名">
            </el-table-column>
            <el-table-column prop="pFileurl" label="文件地址">
            </el-table-column>
             <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <!-- <Button type="info" @click="pushEditOpen(scope)" size="small"  class="marginRight">编辑</Button> -->
                    <Button type="error" @click="remove(scope.$index)" size="small">删除</Button>
                </template>
                </el-table-column>
            </el-table>
      </div>
      <div class="tablePage">
        <Page :total="pageLength" @on-change="pageChange" v-show="pageLength > 10" show-total show-elevator></Page>
      </div>
  </div>
  </Card>
  <Modal v-model="pushModal" :title=modalTitle>
        <Form :model="pushForm" label-position="left" :label-width="100">
            <FormItem label="用户组">
                <Select v-model="pushForm.pGroup">
                    <Option v-for="item in countyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="推送用户">
                <Input v-model="pushForm.pRemark" placeholder="请输入推送用户..." style='width:310px'></Input>
                <Button type="primary" icon="person-add" @click="chooseUserModal = true">添加</Button>
            </FormItem>
            <FormItem label="推送类型">
                <RadioGroup v-model="pushForm.pType" @on-change="radioChange">
                    <Radio label="0">消息</Radio>
                    <Radio label="1">版本</Radio>
                    <Radio label="2">文件</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="文件名" v-show="isFile">
                <Input v-model="pushForm.pFilename" placeholder="请输入文件名..."></Input>
            </FormItem>
            <FormItem label="文件路径" v-show="isFile">
                <Input v-model="pushForm.pFileurl" placeholder="请输入文件路径..."></Input>
            </FormItem>
            <FormItem label="内容">
                <Input v-model="pushForm.pContent" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
            </FormItem>
        </Form>
  </Modal>
  <Modal v-model="chooseUserModal" title="选择推送用户" width="60">
      <Row>
        <Col span="8">
            <Input v-model="searchUserName" placeholder="请输入..." ></Input>
        </Col>
        <Col span="4" style="text-align:center">
             <Button type="primary" icon="ios-search" @click="searchUser(1)">搜索</Button>
        </Col>
        <Col span="12">
        </Col>
      </Row>
    <br>
    <Row>
        <Col span="24">
            <el-table :data="userData" border style="width: 100%" @selection-change="selectUser">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="arLoginname" label="用户名">
                </el-table-column>
                <el-table-column prop="arTruename" label="姓名" >
                </el-table-column>
                <el-table-column prop="arMobile" label="电话">
                </el-table-column>
                <el-table-column prop="arEmail" label="邮箱">
                </el-table-column>
                <el-table-column prop="areaname" label="区县">
                </el-table-column>
                <el-table-column prop="name" label="部门">
                </el-table-column>
            </el-table>
            <div class="tablePage">
                <Page :total=total  :current="1" @on-change="searchUser" show-total v-show="total>10"></Page>
            </div>
        </Col>  
    </Row>
  </Modal>
  </Content>
</template>

<script>
import {getPushList,addPushList,deletePush} from '@/api/interactive-service'
import {getUserList} from '@/api/user-service'
import vSearch from '@/components/search/index'
export default {
    components: {
        vSearch
    },
    data(){
        return{
            searchName:'',
            searchUserName:'',
            pushManageHeight:window.innerHeight - 174 +'px',
            pushModal:false,
            chooseUserModal:false,
            modalTitle:'',
            isFile:false,
            pushData:[],
            userData:[],
            pageLength:0,
            total:0,
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
            pushForm:{
                pGroup:'',
                pRemark:'',
                pType:'0',
                pFilename:'',
                pFileurl:'',
                pContent:''
            }
        }
    },
    created(){
        this._getPushList(1)
    },
    methods:{
        _getPushList(Page){
            let data ={
                pageNo:Page,
                pageSize:10  
            }
            getPushList(data).then(res=>{
                this.pageLength = res.data.total
                this.pushData = res.data.list
            })
        },
        pageChange(page){
            this._getPushList(page)
        },
        pushAddOpen(){
            this.pushModal = true;
            for(var i in this.pushForm){
               this.pushForm[i] = '';
            }
            this.pushForm.pType = '0';
        },
        pushEditOpen(params){
             this.pushModal = true;
            for(var i in this.pushForm){
               if(params.row[i]){
                   this.pushForm[i] =params.row[i] 
               }
            }
        },
        radioChange(){
           if(this.pushForm.pType == '2'){
               this.isFile = true;
           }else{
               this.isFile = false;
           }
        },
         remove (index) {
             this.$Modal.confirm({
                    content: '删除后数据无法恢复，是否继续？',
                    onOk: () => {
                        this.pushData.splice(index, 1);
                        this.$Message.success('删除成功');
                    },
                    onCancel: () => {
                        
                    }
                });
        },
        //搜索用户
        searchUser(page){
            let data = {
                methods: 'list',
                pageNo: page,
                pageSize: 10,
                arTruename:this.searchUserName
            }
            getUserList(data).then(res => {
                this.userData = []
                for (let i in res.data.list) {
                    this.userData.push(res.data.list[i])
                }
                this.total = res.data.total
            })
        },
        //选择用户
        selectUser(val){
            console.log(val)
        }
    }
}
</script>

<style>
</style>
