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
        <Table border :columns="columns" :data="massageData" ref="selection"></Table>
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
export default {
    data(){
        return{
            searchName:'',
            messageManageHeight:window.innerHeight - 65-60-20-90-18 +'px',
            messageModal:false,
            modalTitle:'',
            isDetail:false,
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
                    title: '电话',
                    key: 'tel'
                },
                {
                    title: '短信内容',
                    key: 'messageInfo'
                },
                {
                    title: '添加时间',
                    key: 'sendTime'
                },
                {
                    title: '状态',
                    key: 'status'
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
                                           this.messageEditOpen(params)
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
            massageData:[
                {
                    id:1,
                    tel:'18888888888',
                    messageInfo:'你好',
                    sendTime:'2018-4-27',
                    type:'手动发送',
                    status:'发送成功',
                },
               {
                    id:1,
                    tel:'18888888888',
                    messageInfo:'你好',
                    sendTime:'2018-4-27',
                    type:'手动发送',
                    status:'发送成功',
                },
                {
                    id:1,
                    tel:'18888888888',
                    messageInfo:'你好',
                    sendTime:'2018-4-27',
                    type:'手动发送',
                    status:'发送成功',
                },
                {
                    id:1,
                    tel:'18888888888',
                    messageInfo:'你好',
                    sendTime:'2018-4-27',
                    type:'手动发送',
                    status:'发送成功',
                },
                {
                    id:1,
                    tel:'18888888888',
                    messageInfo:'你好',
                    sendTime:'2018-4-27',
                    type:'手动发送',
                    status:'发送成功',
                },
                {
                    id:1,
                    tel:'18888888888',
                    messageInfo:'你好',
                    sendTime:'2018-4-27',
                    type:'手动发送',
                    status:'发送成功',
                },
                {
                    id:1,
                    tel:'18888888888',
                    messageInfo:'你好',
                    sendTime:'2018-4-27',
                    type:'手动发送',
                    status:'发送成功',
                },
                {
                    id:1,
                    tel:'18888888888',
                    messageInfo:'你好',
                    sendTime:'2018-4-27',
                    type:'手动发送',
                    status:'发送成功',
                },
                {
                    id:1,
                    tel:'18888888888',
                    messageInfo:'你好',
                    sendTime:'2018-4-27',
                    type:'手动发送',
                    status:'发送成功',
                },
                {
                    id:1,
                    tel:'18888888888',
                    messageInfo:'你好',
                    sendTime:'2018-4-27',
                    type:'手动发送',
                    status:'发送成功',
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
            messageForm:{
                tel:'',
                messageInfo:'',
                type:'',
                status:'',
                sendTime:''
            }
        }
    },
    methods:{
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
