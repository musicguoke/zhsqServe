<template>
    <div>
        <div class="seach_condition">
            <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
            <div class="search_button">
                <i-button @click="openAddModal()">新增</i-button>
            </div>
        </div>
        <el-table v-show="searchType == 7" :data="mapConfigureData" border style="width: 100%">
            <el-table-column prop="id" label="ID" width="100" sortable>
            </el-table-column>
            <el-table-column prop="mName" label="名称">
            </el-table-column>
            <el-table-column prop="mUrl" label="地图地址" width="300">
            </el-table-column>
            <el-table-column prop="mImage" label="地图图例" width="300">
            </el-table-column>
            <el-table-column prop="mVersion" label="版本" sortable>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
                <template slot-scope="scope">
                        <Button type="info"  size="small"  @click="openEditModal(scope)">编辑</Button>
                        <!-- <Button type="error" size="small" @click="remove(scope)">删除</Button> -->
                </template>
            </el-table-column>
        </el-table>
        <div class="tablePage">
            <Page :total="pageLength" @on-change="pageChange" v-show="pageLength > 10" show-total :current="resetPage"></Page>
        </div>
        <Modal v-model="mapConfigureModal" :title=modalTitle @on-ok="addOrUpdate">
            <Form :model="mapConfigureForm" label-position="left" :label-width="100">
                <FormItem label="名称">
                    <Input v-model="mapConfigureForm.mName" ></Input>
                </FormItem>
                <FormItem label="地图地址">
                    <Input v-model="mapConfigureForm.mUrl" ></Input>
                </FormItem>
                <FormItem label="排序">
                    <Input v-model="mapConfigureForm.mOrder" ></Input>
                </FormItem>
                <FormItem label="地图图例"> 
                    <Upload
                        multiple
                        action="//jsonplaceholder.typicode.com/posts/">
                        <Button type="ghost" icon="ios-cloud-upload-outline">点击上传</Button>
                    </Upload>
                </FormItem>
                <FormItem label="图例地址">
                    <Input v-model="mapConfigureForm.mImage" ></Input>
                </FormItem>
                <FormItem label="版本">
                    <Input v-model="mapConfigureForm.mVersion" ></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import {getMapConfigure,insertMapConfigure,updateMapConfigure,deleteMapConfigureById} from '@/api/dataSource-service'
export default {
    data(){
        return{
            searchName: '',
            searchType: 1,
            pageLength:0,
            isAdd:true,
            modalTitle:'',
            mapConfigureData:[],
            mapConfigureModal:false,
            mapConfigureForm:{
                mName:'',
                mUrl:'',
                mOrder:'',
                mImage:'',
                mVersion:''
            }
        }
    },
    methods:{
        //地图配置
        _getMapConfigure(){
            getMapConfigure().then(res=>{
                this.pageLength = res.data.total
                this.resetPage = 1
                this.mapConfigureData = res.data.list
            })
        },
        //打开新增模态框
        openAddModal(){
            this.isAdd = true
            this.mapConfigureModal = true
            for(let i in this.mapConfigureForm){
                this.mapConfigureForm[i] = ''
            }
        },
        //打开编辑模态框
        openEditModal(params){
            this.isAdd = false
            this.mapConfigureModal = true
            for(let i in this.mapConfigureForm){
                this.mapConfigureForm[i] = ''
                if(params.row[i]){
                    this.mapConfigureForm[i] = params.row[i]
                }
            }   
        },
        //点击确定
        addOrUpdate(){
            let data = {}
                data = {
                    mName:this.mapConfigureForm.mName,
                    mUrl:this.mapConfigureForm.mUrl,
                    mOrder:this.mapConfigureForm.mOrder,
                    mImage:this.mapConfigureForm.mImage,
                    mVersion:this.mapConfigureForm.mVersion
                }
            if(isAdd){
                insertMapConfigure(data).then(res=>{
                    if(res.code == 20000){
                    this.$Message.success('添加成功');
                    }
                })
            }else{
                updateMapConfigure(data).then(res => {
                    if(res.code == 20000){
                    this.$Message.success('修改成功');
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
                    this.mapConfigureData.splice(params.$index,1)
                    data = {id:params.row.id}
                    deleteMapConfigureById(data).then(res=>{
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

