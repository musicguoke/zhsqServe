<template>
    <div>
        <div class="seach_condition">
            <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
            <div class="search_button">
              <i-button @click="openAddModal">新增</i-button>
              <i-button class="marginLeft" @click="importModal = true">导入</i-button>
            </div>
        </div>
        <el-table :data="lexiconData" border style="width: 100%">
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
            <Page :total="pageLength" @on-change="pageChange"></Page>
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
          <Form :model="importForm" label-position="left" :label-width="100">
              <FormItem label="导入类型">
                  <Select v-model="importForm.type">
                      <Option value="1">增量导入</Option>
                      <Option value="2">全量导入</Option>
                  </Select>
              </FormItem>
              <FormItem label="选择文件" style="width:100px;">
                  <div style="display:flex">
                      <div>
                          <Input v-model="importForm.file" placeholder="请选择excel" style="width:300px;"></Input>
                      </div>
                      <Upload action="//jsonplaceholder.typicode.com/posts/">
                          <Button type="ghost" icon="ios-cloud-upload-outline">请选择</Button>
                      </Upload>
                  </div>
              </FormItem>
                  <div class="importSlot">
                  <div class="importSlotTitle">导入须知</div>
                  <p>1、导入文件大小不超过2MB.</p>
                  <p>2、支持Microsoft Office Excel的xls和xlsx文件,模板<a>点此下载.</a></p>
              </div>
          </Form>
        </Modal>
    </div>
</template>
<script>
import {getLexicon,addLexicon,updateLexicon,deleteLexicon,importLexicon} from "@/api/search-service";
export default {
  data() {
    return {
      searchName: "",
      lexiconData: [],
      pageLength: 0,
      lexiconModal: false,
      importModal:false,
      isAdd: true,
      modalTitle: "",
      nowPage:1,
      lexiconForm: {
        dataId: "",
        name: "",
        id:""
      },
      importForm:{
          type:'',
          file:''
      },
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
    //点击确定
    addOrUpdate(){
      let data = {
         dataId:this.lexiconForm.dataId,
         name:this.lexiconForm.name
      }
      if(this.isAdd){
        addLexicon(data).then(res=>{
            if(res.code == 20000){
               this._mm.successTips('添加成功')
               this._getLexicon(this.nowPage)
            }else{
               this._mm.errorTips(res.message)     
            }
        })
      }else{
        data.id = this.lexiconForm.id
        updateLexicon(data).then(res=>{
            if(res.code == 20000){
              this._mm.successTips('修改成功')
              this._getLexicon(this.nowPage)
            }else{
              this._mm.errorTips(res.message)
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
                  this._mm.successTips('删除成功');
                }else{
                  this._mm.errorTips(res.message)
                }
            })
          },
        onCancel: () => {            
        }
      });   
    },
     //导入文件保存
    saveImport(){
      let data = {
        method:'importFile',
        type:this.importForm.type,
        file:this.importForm.file
      }
      importHotSearch(data).then(res=>{

      })
    }
  }
}
</script>
<style>
</style>
