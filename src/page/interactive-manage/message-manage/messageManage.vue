<template>
<Content :style="{height:messageManageHeight}">
    <Breadcrumb :style="{marginBottom: '17px'}">
      <BreadcrumbItem>用户管理</BreadcrumbItem>
      <BreadcrumbItem>短信管理</BreadcrumbItem>
    </Breadcrumb>
    <Card>
  <div>
      <div class="seach_condition">
         <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
         <div class="search_button">
            <i-button @click="messageAddOpen">新增</i-button>
         </div>
      </div>
      <div class="tableSize">
        <el-table :data="massageData" border style="width: 100%">
            <el-table-column prop="id" label="Id" width="60">
            </el-table-column>
            <el-table-column prop="tel" label="电话">
            </el-table-column>
            <el-table-column prop="messageInfo" label="短信内容">
            </el-table-column>
            <el-table-column prop="sendTime" label="添加时间">
            </el-table-column>
            <el-table-column prop="status" label="状态">
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <Button type="info" @click="messageEditOpen(scope)" size="small"  class="marginRight">编辑</Button>
                    <Button type="error" @click="remove(scope.$index)" size="small">删除</Button>
                </template>
                </el-table-column>
        </el-table>
      </div>
      <div class="tablePage">
        <Page :total="massageData.length" ></Page>
      </div>
  </div>
  </Card>
  <Modal v-model="messageModal" :title=modalTitle>
        <Form :model="messageForm" label-position="left" :label-width="100">
            <FormItem label="电话">
                <Input v-model="messageForm.tel" placeholder="请输入电话号码..."></Input>
            </FormItem>
            <FormItem label="内容">
                <Input v-model="messageForm.messageInfo" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
            </FormItem>
            <FormItem label="类型" v-show="isDetail">
                <Input v-model="messageForm.type"></Input>
            </FormItem>
            <FormItem label="状态" v-show="isDetail">
                <Input v-model="messageForm.status"></Input>
            </FormItem>
            <FormItem label="发送时间" v-show="isDetail">
                <Input v-model="messageForm.sendTime"></Input>
            </FormItem>
        </Form>
  </Modal>
  </Content>
</template>

<script>
import {getMessageList,addContacts,updateContacts,deleteContacts,sendMessage} from '@/api/interactive-service'
export default {
    data(){
        return{
            searchName:'',
            messageManageHeight:window.innerHeight - 65-60-20-90-18 +'px',
            messageModal:false,
            modalTitle:'',
            isDetail:false,
            massageData:[],
            messageForm:{
                tel:'',
                messageInfo:'',
                type:'',
                status:'',
                sendTime:''
            }
        }
    },
    created(){
        this._getMessageList()
    },
    methods:{
        _getMessageList(){
            getMessageList().then(res=>{
                this.massageData = res.data.list
            })
        },
        messageAddOpen(){
            this.messageModal = true;
            this.isDetail = false;
            for(var i in this.messageForm){
               this.messageForm[i] = '';
            }
        },
        messageEditOpen(params){
            this.messageModal = true;
            this.isDetail = true;
            for(var i in this.messageForm){
               if(params.row[i]){
                   this.messageForm[i] =params.row[i] 
               }
            }
        },
         remove (index) {
             this.$Modal.confirm({
                    content: '删除后数据无法恢复，是否继续？',
                    onOk: () => {
                        this.massageData.splice(index, 1);
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
