<template>
    <div>
        <div class="seach_condition">
            <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
            <div class="search_button">
                <i-button @click="openAddModal">新增</i-button>
                <i-button class="marginLeft" @click="importModal = true">导入</i-button>
            </div>
        </div>
        <el-table :data="hotspotData" border style="width: 100%">
            <el-table-column prop="dataId" label="Id" sortable>
            </el-table-column>
            <el-table-column prop="name" label="热点名">
            </el-table-column>
            <el-table-column prop="parentid" label="父节点">
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
        <Modal v-model="hotSpotModal" :title=modalTitle @on-ok="addOrUpdate">
            <Form :model="hotSpotForm" label-position="left" :label-width="100">
                <FormItem label="名称">
                    <Input v-model="hotSpotForm.name" placeholder="请输入名称..."></Input>
                </FormItem>
                <FormItem label="父id">
                    <Input v-model="hotSpotForm.parentid" placeholder="请输入父id..."></Input>
                </FormItem>
                <FormItem label="数据编号">
                    <Input v-model="hotSpotForm.dataId" placeholder="请输入数据编码..."></Input>
                </FormItem>
                <FormItem label="序号">
                    <Input v-model="hotSpotForm.listorder" placeholder="请输入序号..."></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="importModal" title='导入周边热点' @on-ok="saveImport">
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
import {getHotspot,addHotspot,updateHotspot,deleteHotspot,importHotspot} from '@/api/search-service'
export default {
data() {
    return {
        searchName: '',
        hotspotData:[],
        pageLength:0,
        hotSpotModal:false,
        importModal:false,
        isAdd:true,
        modalTitle:'',
        nowPage:1,
        hotSpotForm:{
            name:'',
            parentid:'',
            dataId:'',
            listorder:'',
            id:''
        },
        importForm:{
          type:'',
          file:''
        },
    }
  },
  created(){
      this._getHotspot(1)
  },
  methods:{
    // 获取热点数据
    _getHotspot(Page){
      let data = {
        method:'list',
        pageNo:Page ,
        pageSize:10 ,
        name:''
      }
      getHotspot(data).then(res=>{
         this.hotspotData = res.data.list
         this.pageLength = res.data.total
      })
    },
    //分页点击
    pageChange(Page){
        this.nowPage = Page
        this._getHotspot(Page)
    },
    //打开新增模态框
    openAddModal(){
      this.isAdd = true
      this.hotSpotModal = true
      for(let i in this.hotSpotForm){
        this.hotSpotForm[i] = '';
     }
    },
    //打开编辑模态框
    openEditModal(params){
        this.isAdd = false
        this.hotSpotModal = true
        for(let i in this.hotSpotForm){
          this.hotSpotForm[i] = '';
          if(params.row[i]){
            this.hotSpotForm[i] =params.row[i] 
          }
        }
    },
    //点击确定
    addOrUpdate(){
      let data = {}
        data = {
          method:'save',
          name:this.hotSpotForm.name,
          parentid:this.hotSpotForm.parentid,
          dataId:this.hotSpotForm.dataId,
          listorder:this.hotSpotForm.listorder
        }
      if(this.isAdd){
          addHotspot(data).then(res=>{
            if(res.code == 20000){
              this.$Message.success('添加成功');
              this._getHotspot(this.nowPage)
            }else{
              this.$Message.error(res.message)
            }
          })
      }else{
          data.id = this.hotSpotForm.id
          updateHotspot(data).then(res=>{
            if(res.code == 20000){
              this.$Message.success('修改成功');
              this._getHotspot(this.nowPage)
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
            this.hotspotData.splice(params.$index, 1)
            data = {id:params.row.id,method:'delete'}
            deleteHotspot(data).then(res=>{
              if(res.code == 20000){
                  this.$Message.success('删除成功');
              }else{
                  this.$Message.error(res.message)
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


