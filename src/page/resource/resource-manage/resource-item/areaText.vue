<template>
    <div>
        <div class="seach_condition">
            <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
            <div class="search_button">
                <i-button @click="openAddModal()">新增</i-button>
                <i-button class="marginLeft">导入</i-button>
            </div>
        </div>
        <el-table :data="areaTextData" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100" sortable>
            </el-table-column>
            <el-table-column prop="areacode" label="区域编码">
            </el-table-column>
            <el-table-column prop="dataId" label="数据编码">
            </el-table-column>
            <el-table-column prop="year" label="年份" width="80">
            </el-table-column>
            <el-table-column prop="title" label="标题" width="200">
            </el-table-column>
            <el-table-column prop="filePath" label="文件地址">
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <Button type="info"  size="small" class="marginRight" @click="openEditModal(scope)">编辑</Button>
                    <Button type="error" size="small" @click="remove(scope)">删除</Button>
                </template>
            </el-table-column>
        </el-table>
        <div class="tablePage">
            <Page :total="pageLength" @on-change="pageChange" v-show="pageLength > 10" show-total ></Page>
          </div>
        <Modal v-model="areaTextModal" :title=modalTitle @on-ok="addOrUpdate">
            <Form :model="areaTextForm" label-position="left" :label-width="100">
                <FormItem label="行政区划编码">
                    <Input v-model="areaTextForm.areacode" ></Input>
                </FormItem>
                <FormItem label="数据编码">
                    <Input v-model="areaTextForm.dataId" ></Input>
                </FormItem>
                <FormItem label="标题">
                    <Input v-model="areaTextForm.title" ></Input>
                </FormItem>
                <FormItem label="年份">
                    <Input v-model="areaTextForm.year"></Input>
                </FormItem>
                <FormItem label="文件地址">
                    <Input v-model="areaTextForm.filePath"></Input>
                </FormItem>
                <FormItem label="排序">
                    <Input v-model="areaTextForm.listorder"></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="importModal" title='导入区域文本' @on-ok="saveImport">
            <Form :model="importForm" label-position="left" :label-width="100">
                <FormItem label="导入类型">
                    <Select v-model="importForm.type">
                        <Option value="1">增量导入</Option>
                        <Option value="2">全量导入</Option>
                    </Select>
                </FormItem>
                <FormItem label="选择文件">
                    <Input v-model="importForm.file" placeholder="请选择excel"></Input>
                    <Upload action="//jsonplaceholder.typicode.com/posts/">
                        <Button type="ghost" icon="ios-cloud-upload-outline">请选择</Button>
                    </Upload>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import { getAreaText,addAreaText,updateAreaText,deleteAreaText } from '@/api/dataSource-service'
export default {
    data(){
        return{
            searchName: '',
            searchType: 1,
            pageLength:0,
            isAdd:true,
            modalTitle:'',
            areaTextData:[],
            areaTextModal:false,
            importModal:false,
            areaTextForm:{
                areacode:'',
                title:'',
                year:'',
                dataId:'',
                filePath:'',
                listorder:'',
                id:''
            },
            importForm:{

            },
            nowPage:1
        }
    },
    created(){
        this._getAreaText(1)
    },
    methods:{
        //区域文本
        _getAreaText(page){
            let data ={
                pageNo:page,
                pageSize:10, 
                method:'list', 
                title:''  
            }
            getAreaText(data).then(res=>{
                this.pageLength = res.data.total
                this.areaTextData = res.data.list
            })
        },
        //分页点击
        pageChange(Page){
            this.nowPage = Page
            this._getAreaText(Page)
        },
        //打开新增模态框
        openAddModal(){
            this.isAdd = true
            this.areaTextModal = true
            for(let i in this.areaTextForm){
                this.areaTextForm[i] = ''
            }
        },
        //打开编辑模态框
        openEditModal(params){
            this.isAdd = false
            this.areaTextModal = true
            for(let i in this.areaTextForm){
            this.areaTextForm[i] = ''
                if(params.row[i]){
                    this.areaTextForm[i] =params.row[i] 
                }
            } 
        },
        //点击确定
        addOrUpdate(){
            let data = {}
                data = {
                    method:'save',
                    areacode:this.areaTextForm.areacode,
                    title:this.areaTextForm.title,
                    year:this.areaTextForm.year,
                    filePath:this.areaTextForm.filePath,
                    listorder:this.areaTextForm.listorder
                }
            if(this.isAdd){
                addAreaText(data).then(res=>{
                    if(res.code == 20000){
                        this.$Message.success('添加成功');
                    }
                })
            }else{
                data.id = this.areaTextForm.id
                updateAreaText(data).then(res=>{
                    if(res.code == 20000){
                        this.$Message.success('修改成功');
                        this._getAreaText(this.nowPage)
                    }
                })
                
            }
        },
        //删除
        remove (params) {
            let data = {}
            this.$Modal.confirm({
                content: '删除后数据无法恢复，是否继续？',
                onOk: () => {
                    this.areaTextData.splice(params.$index, 1)
                    data = {id:params.row.id,method:'delete'}
                    deleteAreaText(data).then(res=>{
                        if(res.code == 20000){
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

