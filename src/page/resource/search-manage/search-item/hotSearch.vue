<template>
    <div>
        <div class="seach_condition">
            <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
            <div class="search_button">
              <i-button @click="openAddModal">新增</i-button>
              <i-button class="marginLeft" @click="importModal = true">导入</i-button>
            </div>
        </div>
        <el-table :data="hotSearchData" border style="width: 100%">
            <el-table-column prop="dataCode" label="数据编码" sortable>
            </el-table-column>
            <el-table-column prop="dataname" label="热搜内容">
            </el-table-column>
            <el-table-column prop="parentsCode" label="父节点">
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
        <Modal v-model="hotSearchModal" :title=modalTitle @on-ok="addOrUpdate">
            <Form :model="hotSearchForm" label-position="left" :label-width="100">
                <FormItem label="热搜名">
                    <Input v-model="hotSearchForm.dataname" placeholder="请输入热搜名..."></Input>
                </FormItem>
                <FormItem label="大类编码">
                    <Input v-model="hotSearchForm.parentsCode" placeholder="请输入大类编码..."></Input>
                </FormItem>
                <FormItem label="数据编码">
                    <Input v-model="hotSearchForm.dataCode" placeholder="请输入数据编码..."></Input>
                </FormItem>
                <FormItem label="序号">
                    <Input v-model="hotSearchForm.listorder" placeholder="请输入序号..."></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="importModal" title='导入热搜' @on-ok="saveImport">
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
import {
  getHotSearch,
  addHotSearch,
  updateHotSearch,
  deleteHotSearch,
  importHotSearch
} from "@/api/search-service";
export default {
  data() {
    return {
      searchName: "",
      hotSearchData: [],
      pageLength: 0,
      hotSearchModal: false,
      importModal:false,
      isAdd: true,
      modalTitle: "",
      nowPage:1,
      hotSearchForm: {
        dataname: "",
        parentsCode: "",
        dataCode: "",
        listorder: "",
        id:""
      },
      importForm:{
          type:'',
          file:''
      },
    }
  },
  created(){
      this._getHotSearch(1)
  },
  methods:{
      //获取热搜数据
     _getHotSearch(Page){
      let data = {
        method:'list',
        pageNo:Page ,
        pageSize:10 ,
        dataname:''
      }
      getHotSearch(data).then(res=>{
         this.hotSearchData = res.data.list
         this.pageLength = res.data.total
      })
    },
    //分页点击
    pageChange(Page){
        this.nowPage = Page
        this._getHotSearch(Page)
    },
    //打开新增模态框
    openAddModal(){
        this.isAdd = true
        this.hotSearchModal = true
        for(let i in this.hotSearchForm){
          this.hotSearchForm[i] = '';
        }
    },
    //打开编辑模态框
    openEditModal(params){
        this.isAdd = false
        this.hotSearchModal = true
        for(let i in this.hotSearchForm){
          this.hotSearchForm[i] = '';
          if(params.row[i]){
            this.hotSearchForm[i] =params.row[i] 
          }
        }
    },
    //点击确定
    addOrUpdate(){
      let data = {}
      if(this.searchType == 3){
        data = {
          method:'save',
          name:this.hotSpotForm.name,
          parentid:this.hotSpotForm.parentid,
          dataId:this.hotSpotForm.dataId,
          listorder:this.hotSpotForm.listorder
        }
      }else if(this.searchType == 4){
        data = {
          method:'save',
          dataname:this.hotSearchForm.dataname,
          parentsCode:this.hotSearchForm.parentsCode,
          dataCode:this.hotSearchForm.dataCode,
          listorder:this.hotSearchForm.listorder
        }
      }
      if(this.isAdd){
        addHotSearch(data).then(res=>{
            if(res.code == 20000){
              this.$Message.success('添加成功');
              this._getHotSearch(1)
            }
        })
      }else{
        data.id = this.hotSearchForm.id
        updateHotSearch(data).then(res=>{
            if(res.code == 20000){
              this.$Message.success('修改成功');
              this._getHotSearch(this.nowPage)
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
            this.hotSearchData.splice(params.$index, 1)
            data = {id:params.row.id,method:'delete'}
            deleteHotSearch(data).then(res=>{
                if(res.code == 20000){
                  this.$Message.success('删除成功');
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
