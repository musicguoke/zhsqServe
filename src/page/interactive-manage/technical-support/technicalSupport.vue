<template>
<Content :style="{height:technicalHeight}">
    <Breadcrumb :style="{padding: '17px 0'}">
      <BreadcrumbItem>交互管理</BreadcrumbItem>
      <BreadcrumbItem>技术支持</BreadcrumbItem>
    </Breadcrumb>
    <Card>
  <div>
      <div class="seach_condition">
         <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
         <div class="search_button">
            <i-button @click="technicalAddOpen">新增</i-button>
         </div>
      </div>
      <div class="tableSize">
        <el-table :data="technicalData" border style="width: 100%">
            <el-table-column prop="paramname" label="参数名">
            </el-table-column>
            <el-table-column prop="paramvalue" label="参数值">
            </el-table-column>
            <el-table-column prop="listorder" label="排序" sortable="">
            </el-table-column>
             <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <Button type="info" @click="technicalEditOpen(scope)" size="small"  class="marginRight">编辑</Button>
                    <Button type="error" @click="remove(scope)" size="small">删除</Button>
                </template>
                </el-table-column>
            </el-table>
      </div>
      <div class="tablePage">
        <Page :total="pageLength" @on-change="pageChange" v-show="pageLength > 10"></Page>
      </div>
  </div>
  </Card>
  <Modal v-model="technicalModal" :title=modalTitle @on-ok="addOrUpdateUser">
        <Form :model="technicalForm" label-position="left" :label-width="100">
            <FormItem label="参数名">
                <Input v-model="technicalForm.paramname"  placeholder="请输入..."></Input>
            </FormItem>
            <FormItem label="参数值">
                <Input v-model="technicalForm.paramvalue"  placeholder="请输入..."></Input>
            </FormItem>
            <FormItem label="序号">
                <Input v-model="technicalForm.listorder"  placeholder="请输入..."></Input>
            </FormItem>
        </Form>
  </Modal>
  </Content>
</template>

<script>
import {getTechnicalSupportList,addTechnicalSupport,updateTechnicalSupport,deleteTechnicalSupport} from '@/api/interactive-service'
export default {
    data(){
        return{
            technicalHeight:window.innerHeight - 174 +'px',
            technicalModal:false,
            searchName:'',
            modalTitle:'',
            isAdd:false,
            technicalData:[],
            pageLength:0,
            total:0,
            nowPage:1,
            isAdd:true,
            technicalForm:{
                id:'',
                paramname:'',
                paramvalue:'',
                listorder:''
            }
        }
    },
    created(){
        this._getTechnicalSupportList(1)
    },
    methods:{
        _getTechnicalSupportList(Page){
            let data ={
                pageNo:Page,
                pageSize:10  
            }
            getTechnicalSupportList(data).then(res=>{
                this.pageLength = res.data.total
                this.technicalData = res.data.list
            })
        },
        pageChange(page){
            this.nowPage = page
            this._getTechnicalSupportList(page)
        },
        technicalAddOpen(){
            this.isAdd = true
            this.technicalModal = true;
            for(var i in this.technicalForm){
               this.technicalForm[i] = '';
            }
        },
        technicalEditOpen(params){
            this.isAdd = false
            this.technicalModal = true;
            for(var i in this.technicalForm){
               if(params.row[i]){
                   this.technicalForm[i] =params.row[i] 
               }
            }
        },        
        addOrUpdateUser(){
            let data = {
                paramname:this.technicalForm.paramname,
                paramvalue:this.technicalForm.paramvalue,
                listorder:this.technicalForm.listorder
            }
            if(this.isAdd){
                addTechnicalSupport(data).then(res=>{
                    if(res.code == 20000){
                        this.$Message.success('添加成功')
                        this._getTechnicalSupportList(this.nowPage)
                    }else{
                        this.$Message.success(res.message)
                    }
                })
            }else{
                data.id = this.technicalForm.id
                updateTechnicalSupport(data).then(res=>{
                    if(res.code == 20000){
                        this.$Message.success('修改成功')
                        this._getTechnicalSupportList(this.nowPage)
                    }else{
                        this.$Message.success(res.message)
                    }
                })
            }
        },
         remove (params) {
            this.$Modal.confirm({
                content: '删除后数据无法恢复，是否继续？',
                onOk: () => {
                    let data = {
                        id:params.row.id
                    }
                    deleteTechnicalSupport(data).then(res=>{
                        if(res.code == 20000){
                            this.$Message.success('删除成功');
                            this.technicalData.splice(params.$index, 1);
                            this._getTechnicalSupportList(this.nowPage)
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
