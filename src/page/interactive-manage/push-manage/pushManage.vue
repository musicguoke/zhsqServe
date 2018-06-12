<template>
<Content :style="{height:pushManageHeight}">
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>用户管理</BreadcrumbItem>
      <BreadcrumbItem>推送管理</BreadcrumbItem>
    </Breadcrumb>
    <Card>
  <div>
      <v-search :search-show="false" :import-show="false" :disabled="selectedId.length <= 0" @on-delete="deleteMany" @on-build="pushAddOpen"/>
      <div class="tableSize">
        <el-table :data="pushData" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="pId" label="Id" width="60">
            </el-table-column>
            <el-table-column prop="pRemark" label="推送组/用户">
            </el-table-column>
            <el-table-column prop="typeName" label="推送类型">
            </el-table-column>
            <el-table-column prop="pGroup" label="组编号">
            </el-table-column>
            <el-table-column prop="pContent" label="内容">
            </el-table-column>
            <!-- <el-table-column prop="pFilename" label="文件名">
            </el-table-column>
            <el-table-column prop="pFileurl" label="文件地址">
            </el-table-column> -->
             <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <!-- <Button type="info" @click="pushEditOpen(scope)" size="small"  class="marginRight">编辑</Button> -->
                    <Button type="error" @click="remove(scope)" size="small">删除</Button>
                </template>
                </el-table-column>
            </el-table>
      </div>
      <div class="tablePage">
        <Page :total="pageLength" @on-change="pageChange" v-show="pageLength > 10" show-total show-elevator></Page>
      </div>
  </div>
  </Card>
  <Modal v-model="pushModal" :title=modalTitle @on-ok="savePushMessage">
        <Form :model="pushForm" label-position="left" :label-width="100">
            <FormItem label="用户组">
                <Select v-model="pushForm.pGroup">
                    <Option v-for="item in roleData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="推送用户">
                <Input v-model="pushForm.pRemark" placeholder="请选择推送用户..." style='width:310px'></Input>
                <Button type="primary" icon="person-add" @click="_getUserList">添加</Button>
            </FormItem>
            <FormItem label="推送类型">
                <RadioGroup v-model="pushForm.pType" @on-change="radioChange">
                    <Radio label="0">消息</Radio>
                    <Radio label="1">版本</Radio>
                    <!-- <Radio label="2">文件</Radio> -->
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
  <Modal v-model="chooseUserModal" title="选择推送用户" width="60"  @on-ok="saveSelectUser">
      <Row>
        <Col span="8">
            <Input v-model="searchUserName" placeholder="请输入..."></Input>
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
            <el-table :data="userData" border style="width: 100%" @selection-change="selectUser" ref="multipleTable">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="arLoginname" label="用户名">
                </el-table-column>
                <el-table-column prop="arTruename" label="姓名" >
                </el-table-column>
                <el-table-column prop="arMobile" label="电话">
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
import {getPushList,addPushList,deletePush,deletePushs} from '@/api/interactive-service'
import {getUserList,getAreaCode} from '@/api/user-service'
import {getRolesList} from '@/api/role'
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
            roleData:[],
            userData:[],
            countyList: [],
            selectUserList:{userName:[],userIds:[]},
            pageLength:0,
            total:0,
            nowPage:1,
            pushForm:{
                pGroup:'',
                pRemark:'',
                pType:'0',
                pFilename:'',
                pFileurl:'',
                pContent:'',
                userIds:''
            },
             selectedId:[]
        }
    },
    created(){
        this._getPushList(1)
        getRolesList("",1).then(res=>{
            res.data.list.map(v=>{
                this.roleData.push({
                    value:v.grId,
                    label:v.grName
                })
            })
        })
        getAreaCode().then(res => {
            for (let i in res.data.list) {
                this.countyList.push({
                    value: res.data.list[i].areacode,
                    label: res.data.list[i].areaname
                })
            }
        })
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
                this.pushData.map(v=>{
                    if(v.pType == 0){
                        v.typeName = '消息'
                    }else if(v.pType == 1){
                        v.typeName = '版本'
                    }else if(v.pType == 1){
                        v.typeName = '文件'
                    }
                })
            })
        },
        pageChange(page){
            this.nowPage = page
            this._getPushList(page)
        },
        pushAddOpen(){
            this.pushModal = true;
            for(var i in this.pushForm){
               this.pushForm[i] = ''
            }
            this.pushForm.pType = '0'
            this.searchUser(1)
            this.modalTitle = '新增推送'
        },
        pushEditOpen(params){
             this.pushModal = true;
            for(var i in this.pushForm){
               if(params.row[i]){
                   this.pushForm[i] =params.row[i] 
               }
            }
        },
        _getUserList(){
            this.chooseUserModal = true
        },
        radioChange(){
           if(this.pushForm.pType == '2'){
               this.isFile = true;
           }else{
               this.isFile = false;
           }
        },
         remove (params) {
             this.$Modal.confirm({
                    content: '删除后数据无法恢复，是否继续？',
                    onOk: () => {
                        let data = {pId:params.row.pId}
                        deletePush(data).then(res=>{
                            if(res.code == 20000){
                                this.pushData.splice(params.$index, 1);
                                this.$Message.success('删除成功');
                                this._getPushList(1)
                            }else{
                                this.$Message.error(res.message);
                            }
                        })
                    },
                    onCancel: () => {
                        
                    }
                });
        },
        _deletePushs(id) {
            let data = {
                pIdStr:id
            }
            deletePushs(data).then(res => {
                if (res.code === 20000) {
                    this.$Message.success(res.message)
                    this._getPushList(1)
                } else {
                    this.$Message.error(res.message)
                }
            })
        },
        handleSelectionChange(val) {
            this.selectedId = []
            val.map(v => {
                this.selectedId.push(v.pId)
            })
        },
        deleteMany() {
            this.$Modal.confirm({
                content: '删除后数据无法恢复，是否继续？',
                onOk: () => {
                this._deletePushs(this.selectedId.toString())
                },
                onCancel: () => { }
            })
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
                let data = res.data.list
                for (let i in data) {
                    this.countyList.map(v=>{
                        if(v.value == data[i].arAreacode){
                            data[i].areaname = v.label
                        }
                    })
                    this.userData.push(data[i])
                }
                this.total = res.data.total
            })
        },
        //选择用户
        selectUser(val){
            this.selectUserList={
                userName:[],
                userIds:[]
            }
            val.map(v=>{
                this.selectUserList.userName.push(v.arLoginname)
                this.selectUserList.userIds.push(v.arId)
            })
        },
        //用户框点击保存
        saveSelectUser(){
            let userName = Array.from(this.selectUserList.userName).join(",")
            let userIds = Array.from(this.selectUserList.userIds).join(",")
            this.pushForm.pRemark = userName
            this.pushForm.userIds = userIds
        },
        //推送点击保存
        savePushMessage(){
            let data = {
                pGroup:this.pushForm.pGroup,
                pRemark:this.pushForm.pRemark,
                pType:this.pushForm.pType,
                pFilename:this.pushForm.pFilename,
                pFileurl:this.pushForm.pFileurl,
                pContent:this.pushForm.pContent,
                userIds:this.pushForm.userIds
            }
            addPushList(data).then(res=>{
                if(res.code == 20000){
                    this.$Message.success('添加成功')
                    this._getPushList(this.nowPage)
                }else{
                    this.$Message.error(res.message)
                }
            })
        }
    }
}
</script>

<style>
</style>
