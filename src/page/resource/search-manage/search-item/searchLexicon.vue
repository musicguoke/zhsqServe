<template>
    <div>
        <v-search :search-show="false"  @on-build="openAddModal" :disabled="selectedId.length <= 0" @on-delete="deleteMany" @on-import="openImportModal"/>
        <el-table :data="lexiconData" border style="width: 100%"  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="dataId" label="数据编码" sortable>
            </el-table-column>
            <el-table-column prop="name" label="名称">
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <Button type="info"  size="small" class="marginRight" @click="openEditModal(scope)">编辑</Button>
                    <Button type="error" size="small" @click="remove(scope)">删除</Button>
                </template>
            </el-table-column>
        </el-table>
        <div class="tablePage">
            <Page :total="pageLength" v-show="pageLength>10" @on-change="pageChange" show-total show-elevator></Page>
        </div>
        <Modal v-model="lexiconModal" :title=modalTitle @on-ok="addOrUpdate">
            <Form :model="lexiconForm" label-position="left" :label-width="100">
                <FormItem label="数据编码">
                    <Input v-model="lexiconForm.dataId" placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="名称">
                    <Input v-model="lexiconForm.name" placeholder="请输入..."></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="importModal" title='导入词库' @on-ok="saveImport">
          <Form :model="importForm" label-position="left" :label-width="100" ref="file_form">
              <FormItem label="导入类型">
                  <Select v-model="importForm.type">
                      <Option value="1">增量导入</Option>
                      <Option value="2">全量导入</Option>
                  </Select>
              </FormItem>
              <FormItem label="选择文件">
                    <Upload :action="`${uploadUrl}/sys/msWordLibraryController/importFile.do`" with-credentials :before-upload="boforeUpload" :on-success="handleSuccessUpload" accept=".xls,.xlsx" ref="upload">
                        <Button type="ghost" icon="ios-cloud-upload-outline">请选择</Button>
                    </Upload>
              </FormItem>
                  <div class="importSlot">
                  <div class="importSlotTitle">导入须知</div>
                  <p>1、导入文件大小不超过2MB.</p>
                  <p>2、支持Microsoft Office Excel的xls和xlsx文件,模板<a :href="`${uploadUrl}/sys/msWordLibraryController/downloadImportedFile.do`">点此下载.</a></p>
              </div>
          </Form>
        </Modal>
    </div>
</template>
<script>
import {getLexicon,addLexicon,updateLexicon,deleteLexicon,deleteLexicons,importLexicon} from "@/api/search-service";
import vSearch from '@/components/search/index'
import { url } from '@/api/config.js'
export default {
    components: {
        vSearch
    },
  data() {
    return {
      searchName: "",
      lexiconData: [],
      pageLength: 0,
      lexiconModal: false,
      importModal:false,
      isAdd: true,
      uploadUrl:url,
      modalTitle: "",
      nowPage:1,
      lexiconForm: {
        dataId: "",
        name: "",
        id:""
      },
      importForm:{
          type:'',
          file:{}
      },
      selectedId:[]
    }
  },
  created(){
      this._getLexicon(1)
  },
  methods:{
      //获取热搜数据
     _getLexicon(Page){
      let data = {
        method:'list',
        pageNo:Page ,
        pageSize:10 
      }
      getLexicon(data).then(res=>{
         this.lexiconData = res.data.list
         this.pageLength = res.data.total
      })
    },
    //分页点击
    pageChange(Page){
        this.nowPage = Page
        this._getLexicon(Page)
    },
    //打开新增模态框
    openAddModal(){
        this.isAdd = true
        this.lexiconModal = true
        for(let i in this.lexiconForm){
          this.lexiconForm[i] = '';
        }
    },
    //打开编辑模态框
    openEditModal(params){
        this.isAdd = false
        this.lexiconModal = true
        for(let i in this.lexiconForm){
          this.lexiconForm[i] = '';
          if(params.row[i]){
            this.lexiconForm[i] =params.row[i] 
          }
        }
    },
    //打开导入文件模态框
    openImportModal(){
        this.importModal = true
        for(let i in this.importForm){
            this.importForm[i] = ""
        }
        if(this.$refs.upload._data.fileList){
            this.$refs.upload._data.fileList = []
        }
    },
    //点击确定
    addOrUpdate(){
      let data = {
         dataId:this.lexiconForm.dataId,
         name:this.lexiconForm.name
      }
      if(this.isAdd){
        addLexicon(data).then(res=>{
            if(res.code == 20000){
               this.$Message.success('添加成功')
               this._getLexicon(this.nowPage)
            }else{
               this.$Message.error(res.message)     
            }
        })
      }else{
        data.id = this.lexiconForm.id
        updateLexicon(data).then(res=>{
            if(res.code == 20000){
              this.$Message.success('修改成功')
              this._getLexicon(this.nowPage)
            }else{
              this.$Message.error(res.message)
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
            this.lexiconData.splice(params.$index, 1)
            data = {id:params.row.id,method:'delete'}
            deleteLexicon(data).then(res=>{
                if(res.code == 20000){
                  this.$Message.success('删除成功');
                  this.pageLength--
                }else{
                  this.$Message.error(res.message)
                }
            })
          },
        onCancel: () => {            
        }
      });   
    },
    _deleteLexicons(id) {
        let data = {
            idStr:id
        }
        deleteLexicons(data).then(res => {
            if (res.code === 20000) {
                this.$Message.success(res.message)
                this._getLexicon(this.nowPage)
            } else {
                this.$Message.error(res.message)
            }
        })
    },
    handleSelectionChange(val) {
        this.selectedId = []
        val.map(v => {
            this.selectedId.push(v.id)
        })
    },
    deleteMany() {
        this.$Modal.confirm({
            content: '删除后数据无法恢复，是否继续？',
            onOk: () => {
                this._deleteLexicons(this.selectedId.toString())
            },
            onCancel: () => { }
        })
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
            let formData = new FormData(this.$refs.file_form)
            formData.append('type', this.importForm.type)
            formData.append('file', this.importForm.file)
            this._importLexicon(formData)
        }
    },
    //导入文件
    _importLexicon(data){
        importLexicon(data).then(res=>{
            if(res.code == 20000){
                this.$Message.success("添加成功")
                this._getLexicon(1)
            }else{
                this.$Message.error(res.message)
            }
        })
    }
  }
}
</script>
<style>
</style>
