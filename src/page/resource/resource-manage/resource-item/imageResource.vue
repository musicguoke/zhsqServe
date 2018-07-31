<template>
    <div>
        <v-search :import-show="false" :delete-show="false" @on-search="search" @on-reset="reset" @on-build="openAddModal"/>
        <el-table :data="imageSourceData" border style="width: 100%">
             <!-- <el-table-column prop="id" label="ID" sortable>
            </el-table-column> -->
            <el-table-column prop="fileName" label="图片名称" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="filePath" label="图片路径" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="fileQuality" label="压缩图" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="thumbnailName" label="缩略图" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <Button type="info"  size="small"  @click="openEditModal(scope)">编辑</Button>
                    <Button type="error" size="small" @click="remove(scope)">删除</Button>
                </template>
            </el-table-column>
        </el-table>
        <div class="tablePage">
            <Page :total="pageLength" @on-change="pageChange" v-show="pageLength > 10" show-total show-elevator ref="imagePage"></Page>
        </div>
        <Modal v-model="imageSourceModal" :title=modalTitle @on-ok="addOrUpdate" ref="imageModal">
            <Form :model="imageSourceForm" :label-width="80" :rules="imageRule" ref="imageRule">
                <FormItem label="图片名称" prop="fileName">
                    <Input v-model="imageSourceForm.fileName" ></Input>
                </FormItem>
                <FormItem label="图片路径" prop="filePath">
                    <Input v-model="imageSourceForm.filePath" ></Input>
                </FormItem>
                <FormItem label="压缩图">
                    <Input v-model="imageSourceForm.fileQuality" ></Input>
                </FormItem>
                <FormItem label="缩略图">
                    <Input v-model="imageSourceForm.thumbnailName" ></Input>
                </FormItem>
                <FormItem label="排序" >
                    <Input v-model="imageSourceForm.listorder" ></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import { getImageSource,addImageSource,updateImageSource,deleteImageSource } from '@/api/dataSource-service'
import vSearch from '@/components/search/index'
export default {
    components: {
        vSearch
    },
    data(){
        return{
            searchName: '',
            pageLength:0,
            isAdd:true,
            modalTitle:'',
            imageSourceData:[],
            imageSourceModal:false,
            countyList:[],
            imageSourceForm:{
                id:'',
                fileName:'',
                filePath:'',
                fileQuality:'',
                thumbnailName:'',
                listorder:''
            },
            nowPage:1,
            imageRule: {
                fileName: [
                    { required: true, message: '图片名称不能为空', trigger: 'blur' }
                ],
                filePath: [
                    { required: true, message: '图片路径不能为空', trigger: 'blur' }
                ],
                listorder: [
                    { required: true, message: '排序序号不能为空', trigger: 'blur' }
                ]
            },
        }
    },
    created(){
        this._getImageSource(1)
    },
    methods:{
        _getImageSource(page){
            let data ={
                pageNo:page,
                pageSize:10, 
                name:this.searchName 
            }
            getImageSource(data).then(res=>{
                this.pageLength = res.data.total
                this.imageSourceData = res.data.list
            })
        },
        //分页点击
        pageChange(Page){
            this.nowPage = Page
            this._getImageSource(Page)
        },
        //搜索
        search(searchName){
            this.searchName = searchName
            this._getImageSource(1)
           this.$refs.imagePage.currentPage = 1
        },
        reset(){
            this.searchName = ''
            this._getImageSource(1)
            this.$refs.imagePage.currentPage = 1
        },
        //打开新增模态框
        openAddModal(){
            this.isAdd = true
            this.imageSourceModal = true
            this.$refs.imageRule.resetFields()
            this.modalTitle = "新增图片资源"
            for(let i in this.imageSourceForm){
                this.imageSourceForm[i] = ''
            }
        },
        //打开编辑模态框
        openEditModal(params){
            this.isAdd = false
            this.imageSourceModal = true
            this.$refs.imageRule.resetFields()
            this.modalTitle = "修改图片资源"
            for(let i in this.imageSourceForm){
                this.imageSourceForm[i] = ''
                if(params.row[i]){
                    this.imageSourceForm[i] =params.row[i].toString()  
                }
             }
        },
        //点击确定
        addOrUpdate(){
            this.$refs['imageRule'].validate((valid)=>{
                if(valid){
                    let data = {
                        fileName:this.imageSourceForm.fileName,
                        filePath:this.imageSourceForm.filePath,
                        fileQuality:this.imageSourceForm.fileQuality,
                        thumbnailName:this.imageSourceForm.thumbnailName,
                        listorder:this.imageSourceForm.listorder
                    }
                    if(this.isAdd){
                        addImageSource(data).then(res=>{
                            if(res.code == 20000){
                                this.$Message.success('添加成功');
                                this._getImageSource(this.nowPage)
                            }else{
                                this.$Message.error(res.message)
                            }
                        })
                    }else{
                        data.id = this.imageSourceForm.id
                        updateImageSource(data).then(res=>{
                            if(res.code == 20000){
                                this.$Message.success('修改成功');
                                this._getImageSource(this.nowPage)
                            }else{
                                this.$Message.error(res.message)
                            }
                        })  
                    }
                }else{
                    this.$refs['imageModal'].visible = true
                    this.imageSourceModal = true
                }
            })
        },
        remove(params) {
            let data = {
                id: params.row.id
            }
            this.$Modal.confirm({
                content: '删除后数据无法恢复，是否继续？',
                onOk: () => {
                    this.imageSourceData.splice(params.$index, 1);
                    deleteImageSource(data).then(res => {
                        if (res.code = 20000) {
                            this.$Message.success('删除成功')
                            this._getImageSource(1)
                            this.$refs.imagePage.currentPage = 1
                        }else{
                            this.$Message.error(res.message);
                        }
                    })
                },
                onCancel: () => {

                }
            });
        },
    }
}
</script>
<style>

</style>

