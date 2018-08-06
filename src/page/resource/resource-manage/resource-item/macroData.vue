<template>
    <div> 
        <v-search :import-show="false" :delete-show="false" :build-show="false" @on-search="search" @on-reset="reset"/>
        <el-table :data="macroData" border style="width: 100%">
            <!-- <el-table-column prop="id" label="ID" width="100" sortable>
            </el-table-column> -->
            <el-table-column prop="name" label="数据名称" width="200" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="dataId" label="数据ID">
            </el-table-column>
            <el-table-column prop="areaCode" label="行政区划编码">
            </el-table-column>
            <el-table-column prop="areaName" label="行政区划名称">
            </el-table-column>
            <el-table-column prop="year" label="年份" width="80">
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <Button type="info"  size="small"  @click="openEditModal(scope)">编辑</Button>
                    <!-- <Button type="error" size="small" @click="remove(scope)">删除</Button> -->
                </template>
            </el-table-column>
        </el-table>
        <div class="tablePage">
            <Page :total="pageLength"  @on-change="pageChange"  show-total show-elevator ref="macroPage"></Page>
        </div>
        <Modal v-model="macroDataModal" :title=modalTitle @on-ok="addOrUpdate">
            <Form :model="macroDataForm"  :label-width="100" style="max-height:400px;overflow:auto">
                <FormItem label="数据名称">
                    <Input v-model="macroDataForm.name" ></Input>
                </FormItem>
                <FormItem label="数据ID">
                    <Input v-model="macroDataForm.dataId" ></Input>
                </FormItem>
                <FormItem label="行政区划编码">
                    <Input v-model="macroDataForm.areaCode" ></Input>
                </FormItem>
                <FormItem label="行政区划名称">
                    <Input v-model="macroDataForm.areaName" ></Input>
                </FormItem>
                <FormItem label="年份">
                    <Input v-model="macroDataForm.year" ></Input>
                </FormItem>
                <FormItem label="标题">
                    <Input v-model="macroDataForm.title" ></Input>
                </FormItem>
                <FormItem label="label">
                    <Input v-model="macroDataForm.label" ></Input>
                </FormItem>
                <FormItem label="x">
                    <Input v-model="macroDataForm.x" ></Input>
                </FormItem>
                <FormItem label="y">
                    <Input v-model="macroDataForm.y" ></Input>
                </FormItem>
                <FormItem label="数据描述">
                    <Input v-model="macroDataForm.dataDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                </FormItem>
                <FormItem label="字段信息">
                    <Input v-model="macroDataForm.filedsData" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import { getMacroData,updateMacroData } from '@/api/dataSource-service'
import vSearch from '@/components/search/index'
export default {
    components: {
        vSearch
    },
    data(){
        return{
            searchName: '',
            searchType: 1,
            pageLength:0,
            isAdd:true,
            modalTitle:'',
            macroData:[],
            macroDataModal:false,
            macroDataForm:{
                id:'',
                name:'',
                dataId:'',
                areaCode:'',
                areaName:'',
                year:'',
                title:'',
                label:'',
                x:'',
                y:'',
                dataDesc:'',
                filedsData:''
            },
            nowPage:1
        }
    },
    created(){
        this._getMacroData(1)
    },
    methods:{
        //宏观数据
        _getMacroData(page){
            let data ={
                pageNo:page,
                pageSize:10, 
                method:'list', 
                title:this.searchName
            }
            getMacroData(data).then(res=>{
                this.pageLength = res.data.total
                this.macroData = res.data.list
            })
        },
        //分页点击
        pageChange(Page){
            this.nowPage = Page
            this._getMacroData(Page)
        },
        //打开新增模态框
        openAddModal(){
            this.isAdd = true
            this.macroDataModal = true
            for(let i in this.macroDataForm){
                this.macroDataForm[i] = ''
            }
             this.modalTitle = "新增宏观数据"
        },
        //打开编辑模态框
        openEditModal(params){
            this.isAdd = false
            this.macroDataModal = true
            for(let i in this.macroDataForm){
                this.macroDataForm[i] = ''
                if(params.row[i]){
                    this.macroDataForm[i] =params.row[i] 
                }
             }
              this.modalTitle = "修改宏观数据"
        },
        //点击确定
        addOrUpdate(){
            let data = {}
                data = {
                    method:'save',
                    id:this.macroDataForm.id,
                    name:this.macroDataForm.name,
                    year:this.macroDataForm.year,
                    areaCode:this.macroDataForm.areaCode,
                    areaName:this.macroDataForm.areaName,
                    dataId:this.macroDataForm.dataId,
                    title:this.macroDataForm.title,
                    updateTime:'',
                    address:'',
                    x:this.macroDataForm.x,
                    y:this.macroDataForm.y,
                    filedsData:this.macroDataForm.filedsData,
                    label:this.macroDataForm.label,
                    dataDesc:this.macroDataForm.dataDesc
                }
            if(this.isAdd){
                updateMacroData(data).then(res=>{
                    if(res.code == 20000){
                        this.$Message.success('添加成功');
                    }
                })
            }else{
                updateMacroData(data).then(res=>{
                    if(res.code == 20000){
                        this.$Message.success('修改成功');
                        this._getMacroData(this.nowPage)
                    }
                })
            }
        },
        search(searchName){
            this.searchName = searchName
            this._getMacroData(1)
            this.$refs.macroPage.currentPage = 1
        },
        reset(){    
            this.searchName = ''
            this._getMacroData(1)
            this.$refs.macroPage.currentPage = 1
        }
    }
}
</script>
<style>

</style>

