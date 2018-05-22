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
        <el-table
                :data="pushData"
                border
                style="width: 100%">
                <el-table-column
                prop="id"
                label="Id" width="60">
                </el-table-column>
                <el-table-column
                prop="pushType"
                label="推送类型">
                </el-table-column>
                <el-table-column
                prop="userGroup"
                label="推送组/用户">
                </el-table-column>
                <el-table-column
                prop="messageInfo"
                label="内容">
                </el-table-column>
                <el-table-column
                prop="time"
                label="时间">
                </el-table-column>
                <el-table-column
                label="操作"
                width="160"
                align="center"
                >
                <template slot-scope="scope">
                    <Button type="info" @click="pushEditOpen(scope)" size="small"  class="marginRight">编辑</Button>
                    <Button type="error" @click="remove(scope.$index)" size="small">删除</Button>
                </template>
                </el-table-column>
            </el-table>
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
             this.$Modal.confirm({
                    content: '删除后数据无法恢复，是否继续？',
                    onOk: () => {
                        this.pushData.splice(index, 1);
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
