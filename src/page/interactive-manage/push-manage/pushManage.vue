<template>
<Content :style="{height:pushManageHeight}">
    <Breadcrumb :style="{marginBottom: '17px'}">
      <BreadcrumbItem>用户管理</BreadcrumbItem>
      <BreadcrumbItem>推送管理</BreadcrumbItem>
    </Breadcrumb>
    <Card>
  <div>
      <div class="seach_condition">
         <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
         <div class="search_button">
            <i-button @click="pushAddOpen">新增</i-button>
         </div>
      </div>
      <div class="tableSize">
        <Table border :columns="columns" :data="pushData" ref="selection"></Table>
      </div>
      <div class="tablePage">
        <Page :total="pushData.length" ></Page>
      </div>
  </div>
  </Card>
  <Modal v-model="pushModal" :title=modalTitle>
        <Form :model="pushForm" label-position="left" :label-width="100">
            <FormItem label="用户组">
                <Select v-model="pushForm.userGroup">
                    <Option v-for="item in countyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="推送用户">
                <Input v-model="pushForm.userGroup" placeholder="请输入推送用户..."></Input>
            </FormItem>
            <FormItem label="推送类型">
                <RadioGroup v-model="pushForm.radio" @on-change="radioChange">
                    <Radio label="info">消息</Radio>
                    <Radio label="edition">版本</Radio>
                    <Radio label="file">文件</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="文件名" v-show="isFile">
                <Input v-model="pushForm.fileName" placeholder="请输入文件名..."></Input>
            </FormItem>
            <FormItem label="文件路径" v-show="isFile">
                <Input v-model="pushForm.fileSrc" placeholder="请输入文件路径..."></Input>
            </FormItem>
            <FormItem label="内容">
                <Input v-model="pushForm.messageInfo" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
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
            pushManageHeight:window.innerHeight - 65-60-20-90-18 +'px',
            pushModal:false,
            modalTitle:'',
            isFile:false,
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
                    title: '推送类型',
                    key: 'pushType'
                },
                {
                    title: '推送组/用户',
                    key: 'userGroup'
                },
                {
                    title: '内容',
                    key: 'messageInfo'
                },
                {
                    title: '时间',
                    key: 'time'
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
                                            this.pushEditOpen(params)
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
            pushData:[
                {
                    id:1,
                    pushType:'版本',
                    userGroup:'小张',
                    messageInfo:'新版本上线了',
                    radio:'edition',
                    time:'2018-4-27'
                },
              {
                    id:1,
                    pushType:'版本',
                    userGroup:'小张',
                    messageInfo:'新版本上线了',
                    radio:'edition',
                    time:'2018-4-27'
                },
                {
                    id:1,
                    pushType:'版本',
                    userGroup:'小张',
                    messageInfo:'新版本上线了',
                    radio:'edition',
                    time:'2018-4-27'
                },
                {
                    id:1,
                    pushType:'版本',
                    userGroup:'小张',
                    messageInfo:'新版本上线了',
                    radio:'edition',
                    time:'2018-4-27'
                },
                {
                    id:1,
                    pushType:'版本',
                    userGroup:'小张',
                    messageInfo:'新版本上线了',
                    radio:'edition',
                    time:'2018-4-27'
                },
                {
                    id:1,
                    pushType:'版本',
                    userGroup:'小张',
                    messageInfo:'新版本上线了',
                    radio:'edition',
                    time:'2018-4-27'
                },
                {
                    id:1,
                    pushType:'版本',
                    userGroup:'小张',
                    messageInfo:'新版本上线了',
                    radio:'edition',
                    time:'2018-4-27'
                },
                {
                    id:1,
                    pushType:'版本',
                    userGroup:'小张',
                    messageInfo:'新版本上线了',
                    radio:'edition',
                    time:'2018-4-27'
                },
                {
                    id:1,
                    pushType:'版本',
                    userGroup:'小张',
                    messageInfo:'新版本上线了',
                    radio:'edition',
                    time:'2018-4-27'
                },
                {
                    id:1,
                    pushType:'版本',
                    userGroup:'小张',
                    messageInfo:'新版本上线了',
                    radio:'edition',
                    time:'2018-4-27'
                }
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
            pushForm:{
                userGroup:'',
                userGroup:'',
                pushType:'info',
                messageInfo:'',
                fileName:'',
                radio:'',
                fileSrc:''
            }
        }
    },
    methods:{
        pushAddOpen(){
            this.pushModal = true;
            for(var i in this.pushForm){
               this.pushForm[i] = '';
            }
            this.pushForm.radio = 'info';
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
           if(this.pushForm.radio == 'file'){
               this.isFile = true;
           }else{
               this.isFile = false;
           }
        },
         remove (index) {
            this.userData.splice(index, 1);
        }
    }
}
</script>

<style>
</style>
