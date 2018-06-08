<template>
<Content :style="{maxHeight:managerHeight}">
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>用户管理</BreadcrumbItem>
      <BreadcrumbItem>联系人列表</BreadcrumbItem>
    </Breadcrumb>
    <Card>
  <div>
      <v-search :searchShow="false" :importShow="false" @on-build="contactsAddOpen" />
      <div class="tableSize">
        <el-table :data="contactsData" border style="width: 100%">
            <el-table-column prop="id" label="Id">
            </el-table-column>
            <el-table-column prop="name" label="姓名">
            </el-table-column>
            <el-table-column prop="phone" label="电话">
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <Button type="info" @click="contactsEditOpen(scope)" size="small"  class="marginRight">编辑</Button>
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
  <Modal v-model="contactsModal" :title=modalTitle @on-ok="addOrUpdate">
        <Form :model="contactsForm" label-position="left" :label-width="100">
            <FormItem label="姓名">
                <Input v-model="contactsForm.name" placeholder="请输入用户名..."></Input>
            </FormItem>
            <FormItem label="电话">
                <Input v-model="contactsForm.phone" placeholder="请输入真实姓名..."></Input>
            </FormItem>
        </Form>
  </Modal>
  </Content>
</template>

<script>
import {getContactsList,addContacts,updateContacts,deleteContacts} from '@/api/contactsList-service.js'
import vSearch from '@/components/search/index'
export default {
    components: {
        vSearch
    },
    data(){
        return{
            managerHeight:window.innerHeight - 174 +'px',
            searchName:'',
            contactsModal:false,
            modalTitle:'',
            pageLength:0,
            nowPage:1,
            contactsForm:{
                id:"",
                name:"",
                phone:""
            },
            contactsData:[],
            isAdd:true,
        }
    },
    created(){
        this._getContactsList(1)
    },
    methods:{
        _getContactsList(page){
            let data = {
                pageNo:page,
                pageSize:10
            }
            getContactsList(data).then(res=>{
                this.contactsData = res.data.list
                this.pageLength = res.data.total
            })
        },
        contactsAddOpen(){
            this.isAdd = true
            this.contactsModal = true
            this.modalTitle = '新增管联系人'
            this.sysId = []
            for(var i in this.contactsForm){
               this.contactsForm[i] = ''
            }
        },
        contactsEditOpen(params){
            this.isAdd = false
            this.contactsModal = true;
            this.contactsTitle = '修改管理员';
            this.sysId = []
            for(var i in this.contactsForm){
               if(params.row[i]){
                   this.contactsForm[i] =params.row[i] 
               }
            }
        },
        addOrUpdate(){
            let data = {
                name:this.contactsForm.name,
                phone:this.contactsForm.phone
            }
            if(this.isAdd){
                addContacts(data).then(res=>{
                    if (res.code == 20000) {
                        this.$Message.success('添加成功');
                        this._getContactsList(this.nowPage)
                    }else{
                        this.$Message.error(res.message);
                    }
                })
            }else{
                data.id = this.contactsForm.id
                updateContacts(data).then(res=>{
                    if (res.code == 20000) {
                        this.$Message.success('修改成功');
                        this._getContactsList(this.nowPage)
                    }else{
                        this.$Message.error(res.message);
                    }
                })
            }
        },
        pageChange(page){
            this.nowPage = page
            this._getContactsList(page)
        },
        remove (params) {
            this.$Modal.confirm({
                    content: '删除后数据无法恢复，是否继续？',
                    onOk: () => {
                        let data = {
                            id:params.row.id
                        }
                        deleteContacts(data).then(res=>{
                            if (res.code == 20000) {
                                this.contactsData.splice(params.$index, 1);
                                this.$Message.success('删除成功');
                                this._getContactsList(this.nowPage)
                            }else{
                                this.$Message.error(res.message);
                            }
                        })
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
