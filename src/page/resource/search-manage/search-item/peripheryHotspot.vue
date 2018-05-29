<template>
    <div>
        <div class="seach_condition">
            <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
            <div class="search_button">
            <i-button @click="openAddModal">新增</i-button>
            </div>
        </div>
        <el-table :data="hotspotData" border style="width: 100%">
            <el-table-column prop="id" label="Id" width="100" sortable>
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
    </div>
</template>
<script>
import {getHotspot,addHotspot,updateHotspot,deleteHotspot} from '@/api/search-service'
export default {
data() {
    return {
        searchName: '',
        hotspotData:[],
        pageLength:0,
        hotSpotModal:false,
        isAdd:true,
        modalTitle:'',
        hotSpotForm:{
            name:'',
            parentid:'',
            dataId:'',
            listorder:''
        }
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
      if(isAdd){
          addHotspot(data).then(res=>{
            if(res.code == 20000){
              this.$Message.success('添加成功');
            }
          })
      }else{
          updateHotspot(data).then(res=>{
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
            this.hotspotData.splice(params.$index, 1)
            data = {id:params.row.id,method:'delete'}
            deleteHotspot(data).then(res=>{
              if(res.code == 20000){
                this.$Message.success('删除成功');
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


