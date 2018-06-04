<template>
<Content :style="{height:parameterHeight}">
    <Breadcrumb :style="{marginBottom: '17px'}">
      <BreadcrumbItem>系统配置</BreadcrumbItem>
      <BreadcrumbItem>参数配置</BreadcrumbItem>
    </Breadcrumb>
    <Card>
  <div>
      <div class="seach_condition">
         <div class="condition_list">
            <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
        </div>
         <div class="search_button">
            <i-button @click="parameterAddOpen">新增</i-button>
         </div>
      </div>
      <div class="tableSize">
        <el-table :data="parameterData" border style="width: 100%">
            <el-table-column prop="metaId" label="Id" width="60">
            </el-table-column>
            <el-table-column prop="metaKey" label="变量名">
            </el-table-column>
            <el-table-column prop="metaValue" label="值">
            </el-table-column>
            <el-table-column prop="metaDec" label="描述">
            </el-table-column>
             <el-table-column prop="metaType" label="类型">
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <Button type="info" @click="parameterEditOpen(scope)" size="small"  class="marginRight">编辑</Button>
                    <Button type="error" @click="remove(scope)" size="small">删除</Button>
                </template>
            </el-table-column>
        </el-table>
      </div>
      <div class="tablePage">
        <Page :total="pageLength" v-show="pageLength>10" @on-change="pageChange"></Page>
      </div>
  </div>
  </Card>
  <Modal v-model="parameterModal" :title=modalTitle @on-ok="addOrUpdate">
        <Form :model="parameterForm" label-position="left" :label-width="100">
            <FormItem label="变量名">
                <Input v-model="parameterForm.metaKey" placeholder="请输入变量名..."></Input>
            </FormItem>
            <FormItem label="类型">
                <Select v-model="parameterForm.metaType"  placeholder="请选择...">
                    <Option v-for="item in metaTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="值">
                <Input v-model="parameterForm.metaValue" placeholder="请输入..." ></Input>
            </FormItem>
            <FormItem label="能否编辑">
                <Select v-model="parameterForm.metaIskeep"  placeholder="请选择...">
                    <Option v-for="item in metaIskeepList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="预选值（用|分割）" v-show="parameterForm.metaType == 'select'">
                <Input v-model="parameterForm.metaSelectvalue" placeholder="请输入..."></Input>
            </FormItem>
            <FormItem label="描述">
                <Input v-model="parameterForm.metaDec" placeholder="请输入..."></Input>
            </FormItem>
        </Form>
  </Modal>
  </Content>
</template>

<script>
import {getParameterList,addParameter,updateParameter,deleteParameter} from '@/api/systemConfigure-service.js'
export default {
    data(){
        return{
            parameterHeight:window.innerHeight - 136 +'px',
            searchName:'',
            searchManagerType:'',
            parameterModal:false,
            modalTitle:'',
            pageLength:0,
            parameterForm:{
                metaKey:'',
                metaType:'',
                metaValue:'',
                metaIskeep:'',
                metaSelectvalue:'',
                metaDec:'',
                metaId:''
            },
            metaTypeList:[
                {
                    value: 'text',
                    label: 'text',
                },
                {
                    value: 'select',
                    label: 'select',
                },
                {
                    value: 'other',
                    label: '其它',
                }
            ],
            metaIskeepList:[
                {
                    value:1,
                    label:'不能编辑'
                },
                {
                    value:2,
                    label:'能编辑'
                }
            ],
            parameterData:[],
            isAdd:true
        }
    },
    created(){
        this._getParameterList(1)
    },
    methods:{
        _getParameterList(page){
            let data = {
                pageNo:page,
                pageSize:10
            }
            getParameterList(data).then(res=>{
                this.parameterData = res.data.list
                this.pageLength = res.data.total
            })
        },
        pageChange(page){
            this._getParameterList(page)
        },
        parameterAddOpen(){
            this.isAdd = true
            this.parameterModal = true
            this.modalTitle = '新增参数'
            for(var i in this.parameterForm){
               this.parameterForm[i] = ''
            }
        },
        parameterEditOpen(params){
            this.isAdd = false
            this.parameterModal = true;
            this.modalTitle = '修改参数';
            for(var i in this.parameterForm){
               if(params.row[i]){
                   this.parameterForm[i] =params.row[i] 
               }
            }
        },
        addOrUpdate(){
            let data = {}
            if(this.isAdd){
                data = {
                    metaKey:this.parameterForm.metaKey,
                    metaDec:this.parameterForm.metaDec,
                    metaType:this.parameterForm.metaType,
                    metaIskeep:this.parameterForm.metaIskeep,
                    weiboPic:this.parameterForm.weiboPic,
                    weiboTxt:this.parameterForm.weiboTxt,
                    metaValue:this.parameterForm.metaValue,
                    metaSelectvalue:this.parameterForm.metaSelectvalue,
                }
                addParameter(data).then(res=>{
                    if (res.code == 20000) {
                        this.$Message.info('添加成功');
                    }
                })
            }else{
                data = {
                    metaKey:this.parameterForm.metaKey,
                    metaDec:this.parameterForm.metaDec,
                    metaType:this.parameterForm.metaType,
                    metaIskeep:this.parameterForm.metaIskeep,
                    weiboPic:this.parameterForm.weiboPic,
                    weiboTxt:this.parameterForm.weiboTxt,
                    metaValue:this.parameterForm.metaValue,
                    metaSelectvalue:this.parameterForm.metaSelectvalue,
                    metaId:this.parameterForm.metaId,
                }
                updateParameter(data).then(res=>{
                    if (res.code == 20000) {
                        this.$Message.info('添加成功');
                    }
                })
            }
        },
        remove (params) {
            this.$Modal.confirm({
                    content: '删除后数据无法恢复，是否继续？',
                    onOk: () => {
                        let data = {
                            metaId:params.row.metaId
                        }
                        deleteParameter(data).then(res=>{
                            if (res.code == 20000) {
                                this.parameterData.splice(params.$index, 1);
                                this.$Message.success('删除成功');
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
