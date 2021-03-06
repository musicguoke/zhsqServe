<template>
    <div>
        <v-search  @on-build="openAddModal" :delete-show="false" @on-import="openImportModal" @on-search="search" @on-reset="reset"/>
        <el-table :data="areaTextData" border style="width: 100%">
            <el-table-column prop="areacode" label="区域编码" sortable>
            </el-table-column>
            <el-table-column prop="dataId" label="数据编码">
            </el-table-column>
            <el-table-column prop="year" label="年份" width="80">
            </el-table-column>
            <el-table-column prop="title" label="标题" width="200" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="filePath" label="文件地址" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <Button type="info"  size="small" class="marginRight" @click="openEditModal(scope)">编辑</Button>
                    <Button type="error" size="small" @click="remove(scope)">删除</Button>
                </template>
            </el-table-column>
        </el-table>
        <div class="tablePage">
            <Page :total="pageLength" @on-change="pageChange"  show-total show-elevator ref="areaTextPage"></Page>
          </div>
        <Modal v-model="areaTextModal" :title=modalTitle @on-ok="addOrUpdate" ref="areaTextModal">
            <Form :model="areaTextForm"  :label-width="100" :rules="areaTextRule" ref="areaTextRule">
                <FormItem label="行政区划编码" prop="areacode">
                    <Input v-model="areaTextForm.areacode" ></Input>
                </FormItem>
                <FormItem label="数据编码"  prop="dataId">
                    <Input v-model="areaTextForm.dataId" ></Input>
                </FormItem>
                <FormItem label="标题"  prop="title">
                    <Input v-model="areaTextForm.title" ></Input>
                </FormItem>
                <FormItem label="年份"  prop="year">
                    <Input v-model="areaTextForm.year"></Input>
                </FormItem>
                <FormItem label="文件地址"  prop="filePath">
                    <Input v-model="areaTextForm.filePath"></Input>
                </FormItem>
                <FormItem label="排序"  prop="listorder">
                    <Input v-model="areaTextForm.listorder"></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="importModal" title='导入区域文本' @on-ok="saveImport">
            <Form :model="importForm" label-position="left" :label-width="100" ref="file_text_form">
                <FormItem label="导入类型">
                    <Select v-model="importForm.type">
                        <Option value="1">增量导入</Option>
                        <Option value="2">全量导入</Option>
                    </Select>
                </FormItem>
                <FormItem label="选择文件">
                     <Upload :action="`${uploadUrl}/sys/areaText/importFile.do`" with-credentials :before-upload="boforeUpload" :on-success="handleSuccessUpload" accept=".xls,.xlsx" ref="areaTextUpload">
                        <Button type="ghost" icon="ios-cloud-upload-outline">请选择</Button>
                    </Upload>
                </FormItem>
                <div class="importSlot">
                    <div class="importSlotTitle">导入须知</div>
                    <p>1、导入文件大小不超过2MB.</p>
                    <p>2、支持Microsoft Office Excel的xls和xlsx文件,模板<a :href="`${uploadUrl}/sys/areaText/downloadImportedFile.do`">点此下载.</a></p>
                </div>
            </Form>
        </Modal>
    </div>
</template>
<script>
import { getAreaText,addAreaText,updateAreaText,deleteAreaText,importAreaText} from '@/api/dataSource-service'
import vSearch from '@/components/search/index'
import { url } from '@/api/config.js'
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
            uploadUrl:url,
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
                type:"",
                file:""
            },
            nowPage:1,
            areaTextRule: {
                areacode: [
                    { required: true, message: '行政区划编码不能为空', trigger: 'blur' }
                ],
                dataId: [
                    { required: true, message: '数据编码不能为空', trigger: 'blur' }
                ],
                year:[
                    { required: true, message: '年份不能为空', trigger: 'blur' }
                ],
                title: [
                    { required: true, message: '标题不能为空', trigger: 'blur' }
                ],
                filePath: [
                    { required: true, message: '文件地址不能为空', trigger: 'blur' }
                ],
                listorder:[
                    { required: true, message: '排序不能为空', trigger: 'blur' }
                ]
            },
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
                title:this.searchName  
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
            this.$refs.areaTextRule.resetFields()
            for(let i in this.areaTextForm){
                this.areaTextForm[i] = ''
            }
            this.modalTitle = '新增区域文本'
        },
        //打开编辑模态框
        openEditModal(params){
            this.isAdd = false
            this.areaTextModal = true
            this.$refs.areaTextRule.resetFields()
            for(let i in this.areaTextForm){
                this.areaTextForm[i] = ''
                if(params.row[i]){
                    this.areaTextForm[i] =params.row[i].toString()  
                }
            } 
            this.modalTitle = '修改区域文本'
        },
        //打开导入模态框
        openImportModal(){
            this.importModal = true
        },
        //点击确定
        addOrUpdate(){
            this.$refs['areaTextRule'].validate((valid)=>{
                if(valid){
                    let data = {}
                        data = {
                            method:'save',
                            areacode:this.areaTextForm.areacode,
                            title:this.areaTextForm.title,
                            year:this.areaTextForm.year,
                            dataId:this.areaTextForm.dataId,
                            filePath:this.areaTextForm.filePath,
                            listorder:this.areaTextForm.listorder
                        }
                    if(this.isAdd){
                        addAreaText(data).then(res=>{
                            if(res.code == 20000){
                                this.$Message.success('添加成功')
                                this._getAreaText(this.nowPage)
                            }else{
                                this.$Message.error(res.message);  
                            }
                        })
                    }else{
                        data.id = this.areaTextForm.id
                        updateAreaText(data).then(res=>{
                            if(res.code == 20000){
                                this.$Message.success('修改成功')
                                this._getAreaText(this.nowPage)
                            }else{
                                this.$Message.error(res.message);  
                            }
                        })
                    }
                }else{
                    this.$refs['areaTextModal'].visible = true
                    this.areaTextModal = true
                }
            })
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
                            this._getAreaText(1)
                            this.$refs.areaTextPage.currentPage = 1
                        }else{
                            this.$Message.error(res.message);
                        }
                    })
                },
                onCancel: () => {            
                }
            });   
        },
        //打开导入文件模态框
        openImportModal(){
            this.importModal = true
            for(let i in this.importForm){
                this.importForm[i] = ""
            }
            if(this.$refs.areaTextUpload._data.fileList){
                this.$refs.areaTextUpload._data.fileList = []
            }
        },
        boforeUpload(file) {
            this.importForm.file = file
        },
        //导入文件保存
        saveImport(){
            if (this.importForm.type === '') {
                this.$Message.error('请选择导入类型')
            } else if (this.importForm.file === '') {
                this.$Message.error('请选择上传文件')
            } else {
                let formData = new FormData(this.$refs.file_text_form)
                formData.append('type', this.importForm.type)
                formData.append('file', this.importForm.file)
                this._importAreaText(formData)
            }
        },
        //导入文件
        _importAreaText(data){
            importAreaText(data).then(res=>{
                if(res.code == 20000){
                    this.$Message.success("添加成功")
                    this._getAreaText(1)
                    this.$refs.areaTextPage.currentPage = 1
                }else{
                    this.$Message.error(res.message)
                }
            })
        },
        search(searchName){
            this.searchName = searchName
            this._getAreaText(1)
            this.$refs.areaTextPage.currentPage = 1
        },
        reset(){
            this.searchName = ''
            this._getAreaText(1)
            this.$refs.areaTextPage.currentPage = 1
        }
    }
}
</script>
<style>

</style>

