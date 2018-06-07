<template>
<Content :style="{height:messageManageHeight}">
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>用户管理</BreadcrumbItem>
      <BreadcrumbItem>短信管理</BreadcrumbItem>
    </Breadcrumb>
    <Card>
  <div>
      <div class="seach_condition" style="margin-bottom:10px">
         <!-- <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input> -->
        <i-button @click="messageAddOpen">发送短信</i-button>
      </div>
      <div class="tableSize">
        <el-table :data="messageData" border style="width: 100%">
            <el-table-column prop="id" label="Id" width="60">
            </el-table-column>
            <el-table-column prop="phone" label="电话">
            </el-table-column>
            <el-table-column prop="message" label="短信内容">
            </el-table-column>
            <el-table-column prop="addTime" label="添加时间">
            </el-table-column>
            <el-table-column prop="typeName" label="发送类型">
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <Button type="info" @click="messageEditOpen(scope)" size="small">详情</Button>
                </template>
                </el-table-column>
        </el-table>
      </div>
      <div class="tablePage">
        <Page :total="pageLength"  @on-change="pageChange" v-show="pageLength > 10" show-total show-elevator></Page>
      </div>
  </div>
  </Card>
  <Modal v-model="messageModal" :title=modalTitle ref="modal">
        <Form :model="messageForm" label-position="left" :label-width="100">
            <FormItem label="电话">
                <Input v-model="messageForm.phone" placeholder="请输入电话号码..." ></Input>
            </FormItem>
            <FormItem label="短信内容">
                <Input v-model="messageForm.message" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..." ></Input>
            </FormItem>
            <FormItem label="添加时间">
                <Input v-model="messageForm.addTime" ></Input>
            </FormItem>
            <FormItem label="发送类型">
                <Input v-model="messageForm.typeName" ></Input>
            </FormItem>
        </Form>
  </Modal>
  </Content>
</template>

<script>
import {getMessageList,sendMessage,getMessageById} from '@/api/interactive-service'
import vSearch from '@/components/search/index'
export default {
    components: {
        vSearch
    },
    data(){
        return{
            searchName:'',
            messageManageHeight:window.innerHeight - 136 +'px',
            messageModal:false,
            modalTitle:'',
            isDetail:false,
            messageData:[],
            pageLength:1,
            messageForm:{
                phone:'',
                message:'',
                type:'',
                status:'',
                addTime:'',
                typeName:''
            }
        }
    },
    created(){
        this._getMessageList()
    },
    methods:{
        _getMessageList(){
            getMessageList().then(res=>{
                this.pageLength = res.data.total
                this.messageData = res.data.list
                this.messageData.map(v=>{
                   v.addTime = this._mm.formatDate(v.addTime)
                   if(v.type == 1){
                       v.typeName = '手动发送短信'
                   }else if(v.type == 2){
                       v.typeName = '注册或登录验证短信发送'
                   }
                })
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
            this.modalTitle = "短信详情"
            this.$refs.modal.footerHide = true
            for(var i in this.messageForm){
               if(params.row[i]){
                   this.messageForm[i] =params.row[i] 
               }
            }
        }
    }
}
</script>

<style>
    
</style>
