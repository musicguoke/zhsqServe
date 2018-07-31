<template>
    <div>
        <v-search :search-show="false" :delete-show="false" @on-search="search" @on-reset="reset"  @on-build="openAddModal" @on-import="openImportModal"/>
        <el-table :data="hotspotData" border style="width: 100%">
            <!-- <el-table-column prop="dataId" label="Id" sortable>
            </el-table-column> -->
            <el-table-column prop="name" label="热点名">
            </el-table-column>
            <el-table-column prop="parentid" label="父节点">
            </el-table-column>
            <el-table-column prop="imagePath" label="图片路径" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="操作" width="160" align="center">
                <template slot-scope="scope">
                    <Button type="info"  size="small" class="marginRight" @click="openEditModal(scope)">编辑</Button>
                    <Button type="error" size="small" @click="remove(scope)">删除</Button>
                </template>
            </el-table-column>
        </el-table>
        <div class="tablePage">
            <Page :total="pageLength" @on-change="pageChange" show-total show-elevator ref="planPage"></Page>
        </div>
        <Modal v-model="hotSpotModal" :title=modalTitle @on-ok="addOrUpdate" ref="hotSpotModal">
            <Form :model="hotSpotForm" :label-width="80" :rules="hotSpotRule" ref="planRule">
                <FormItem label="名称" prop="name">
                    <Input v-model="hotSpotForm.name" placeholder="请输入名称..."></Input>
                </FormItem>
                <FormItem label="父id" prop="parentid">
                    <Input v-model="hotSpotForm.parentid" placeholder="请输入父id..."></Input>
                </FormItem>
                <FormItem label="上传图片">
                    <Upload :action="`${uploadUrl}/sys/file/upload.do`" with-credentials :on-success="uploadSuccess" accept=".jpg,.png" :max-size="2048" ref="planUpload">
                        <Button type="ghost" icon="ios-cloud-upload-outline">请选择</Button>
                        <div slot="tip">只能上传jpg/png文件，且不超过2M</div>
                    </Upload>
                </FormItem>
                <FormItem label="图片地址" prop="imagePath">
                    <Input v-model="hotSpotForm.imagePath"></Input>
                </FormItem>
                <FormItem label="数据编号" prop="dataId">
                    <Input v-model="hotSpotForm.dataId" placeholder="请输入数据编码..."></Input>
                </FormItem>
                <FormItem label="序号" prop="listorder">
                    <Input v-model="hotSpotForm.listorder" placeholder="请输入序号..."></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal v-model="importModal" title='导入周边热点' @on-ok="saveImport">
          <Form :model="importForm" label-position="left" :label-width="100" ref="file_plan_form">
              <FormItem label="导入类型">
                  <Select v-model="importForm.type">
                      <Option value="1">增量导入</Option>
                      <Option value="2">全量导入</Option>
                  </Select>
              </FormItem>
              <FormItem label="选择文件">
                  <Upload :action="`${uploadUrl}/sys/msHotAroundBase/importFile.do`" with-credentials :before-upload="boforeUpload" :on-success="handleSuccessUpload" accept=".xls,.xlsx" ref="planImportUpload">
                        <Button type="ghost" icon="ios-cloud-upload-outline">请选择</Button>
                    </Upload>
              </FormItem>
                  <div class="importSlot">
                  <div class="importSlotTitle">导入须知</div>
                  <p>1、导入文件大小不超过2MB.</p>
                  <p>2、支持Microsoft Office Excel的xls和xlsx文件,模板<a :href="`${uploadUrl}/sys/msHotAroundBase/downloadImportedFile.do`">点此下载.</a></p>
              </div>
          </Form>
        </Modal>
    </div>
</template>
<script>
import {getHotSpotBase,addHotSpotBase,updateHotSpotBase,deleteHotSpotBase,importHotSpotBase} from '@/api/search-service'
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
            id:'',
            imagePath:''
        },
        importForm:{
          type:'',
          file:''
        },
        hotSpotRule: {
            name: [
                { required: true, message: "热点名称不能为空", trigger: "blur" }
            ],
            parentid: [
                { required: true, message: "父级id不能为空", trigger: "blur"}
            ],
            dataId: [
                { required: true, message: "数据编码不能为空", trigger: "blur" }
            ],
            imagePath:[
                { required: true, message: "图片路径不能为空", trigger: "blur" }
            ],
            listorder: [
                { required: true, message: "序号不能为空", trigger: "blur"}
            ]
        }
    }
  },
  created(){
      this._getHotSpotBase(1)
  },
  methods:{
    // 获取热点数据
    _getHotSpotBase(Page){
      let data = {
        method:'list',
        pageNo:Page ,
        pageSize:10 ,
        // name:this.searchName
      }
      getHotSpotBase(data).then(res=>{
         this.hotspotData = res.data.list
         this.pageLength = res.data.total
      })
    },
    //分页点击
    pageChange(Page){
        this.nowPage = Page
        this._getHotSpotBase(Page)
    },
    //打开新增模态框
    openAddModal(){
      this.isAdd = true
      this.hotSpotModal = true
      this.$refs.planRule.resetFields()
      if (this.$refs.planUpload._data.fileList) {
        this.$refs.planUpload._data.fileList = []
      }
      for(let i in this.hotSpotForm){
        this.hotSpotForm[i] = '';
     }
     this.modalTitle = '新增周边热点'
    },
    //打开编辑模态框
    openEditModal(params){
        this.isAdd = false
        this.hotSpotModal = true
        this.$refs.planRule.resetFields()
        if (this.$refs.planUpload._data.fileList) {
            this.$refs.planUpload._data.fileList = []
        }
        for(let i in this.hotSpotForm){
          this.hotSpotForm[i] = '';
          if(params.row[i]){
            this.hotSpotForm[i] =params.row[i].toString()
          }
        }
        this.modalTitle = '修改周边热点'
    },
    //点击确定
    addOrUpdate(){
        this.$refs["planRule"].validate(valid => {
            if (valid) {
                let data = {}
                    data = {
                        method:'save',
                        name:this.hotSpotForm.name,
                        parentid:this.hotSpotForm.parentid,
                        dataId:this.hotSpotForm.dataId,
                        listorder:this.hotSpotForm.listorder,
                        imagePath:this.hotSpotForm.imagePath
                    }
                if(this.isAdd){
                    addHotSpotBase(data).then(res=>{
                        if(res.code == 20000){
                            this.$Message.success('添加成功');
                            this._getHotSpotBase(this.nowPage)
                            }else{
                            this.$Message.error(res.message)
                        }
                    })
                }else{
                    data.id = this.hotSpotForm.id
                    updateHotSpotBase(data).then(res=>{
                        if(res.code == 20000){
                            this.$Message.success('修改成功');
                            this._getHotSpotBase(this.nowPage)
                            }else{
                            this.$Message.error(res.message)
                        }
                    })
                }
            }else{
                this.$refs.hotSpotModal.visible = true
                this.hotSpotModal = true
            }
        })
    },
    search(searchName){
        this.searchName = searchName
        this._getHotSpotBase(1)
    },
    reset(){
        this.searchName = ''
        this._getHotSpotBase(1)
    },
    //删除
    remove (params) {
      let data = {}
      this.$Modal.confirm({
        content: '删除后数据无法恢复，是否继续？',
        onOk: () => {
            data = {id:params.row.id,method:'delete'}
            deleteHotSpotBase(data).then(res=>{
              if(res.code == 20000){
                  this.$Message.success('删除成功');
                  this._getHotSpotBase(1)
                  this.$refs.planPage.currentPage = 1 
              }else{
                  this.$Message.error(res.message)
                }
            })
          },
        onCancel: () => {            
          }
        });   
    },
    uploadSuccess(data) {
        if (data.code == 20000) {
            this.hotSpotForm.imagePath = data.data
            this.$Message.success(data.message)
        } else {
            this.$Message.error(data.message)
        }
    },
     //打开导入文件模态框
    openImportModal(){
        this.importModal = true
        for(let i in this.importForm){
            this.importForm[i] = ""
        }
        if(this.$refs.planImportUpload._data.fileList){
            this.$refs.planImportUpload._data.fileList = []
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
            let formData = new FormData(this.$refs.file_plan_form)
            formData.append('type', this.importForm.type)
            formData.append('file', this.importForm.file)
            this._importHotSpotBase(formData)
        }
    },
    //导入文件
    _importHotSpotBase(data){
        console.log(data)
        importHotSpotBase(data).then(res=>{
            if(res.code == 20000){
                this.$Message.success("添加成功")
                this._getHotSpotBase(1)
                this.$refs.planPage.currentPage = 1 
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


