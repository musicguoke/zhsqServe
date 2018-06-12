<template>
    <div>
        <v-search :search-show="false"  @on-build="openAddModal" @on-import="openImportModal"/>
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
            <Page :total="pageLength" @on-change="pageChange" show-total show-elevator></Page>
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
          <Form :model="importForm" label-position="left" :label-width="100" ref="file_form">
              <FormItem label="导入类型">
                  <Select v-model="importForm.type">
                      <Option value="1">增量导入</Option>
                      <Option value="2">全量导入</Option>
                  </Select>
              </FormItem>
              <FormItem label="选择文件">
                  <Upload :action="`${uploadUrl}/sys/hotAround/importFile.do`" with-credentials :before-upload="boforeUpload" :on-success="handleSuccessUpload" accept=".xls,.xlsx" ref="upload">
                        <Button type="ghost" icon="ios-cloud-upload-outline">请选择</Button>
                    </Upload>
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
import vSearch from '@/components/search/index'
import { url } from '@/api/config.js'
export default {
    components: {
        vSearch
    },
data() {
    return {
        searchName: '',
        hotspotData:[],
        pageLength:0,
        hotSpotModal:false,
        importModal:false,
        isAdd:true,
        uploadUrl:url,
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
     this.modalTitle = '新增周边热点'
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
        this.modalTitle = '修改周边热点'
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
            data = {id:params.row.id,method:'delete'}
            deleteHotspot(data).then(res=>{
              if(res.code == 20000){
                  this.hotspotData.splice(params.$index, 1)
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
            this._importHotSearch(formData)
        }
    },
    //导入文件
    _importHotSearch(data){
        importHotSearch(data).then(res=>{
            if(res.code == 20000){
                this.$Message.success("添加成功")
                this._getHotspot(1)
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


