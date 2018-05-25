<template>
  <Content>
    <Breadcrumb :style="{marginBottom: '17px'}">
      <BreadcrumbItem>资源管理</BreadcrumbItem>
      <BreadcrumbItem>搜索管理</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <div class="seach_condition">
        <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
        <div class="search_button">
          <i-button @click="openAddModal">新增</i-button>
        </div>
      </div>
      <div class="card-content">
        <Menu theme="light" active-name="1" @on-select="menuChange">
          <MenuItem name="1">周边搜索</MenuItem>
          <MenuItem name="2">搜索词库</MenuItem>
          <MenuItem name="3">周边热点</MenuItem>
          <MenuItem name="4">热搜</MenuItem>
        </Menu>
        <div class="table">
          <Table border :columns="columns1" :data="data1" v-show="searchType == 1"></Table>
          <el-table v-show="searchType == 3"
                :data="hotspotData"
                border
                style="width: 100%"
                >
                <el-table-column
                prop="id"
                label="Id" width="100" sortable>
                </el-table-column>
                <el-table-column
                prop="name"
                label="热点名">
                </el-table-column>
                <el-table-column
                prop="parentid"
                label="父节点">
                </el-table-column>
                <el-table-column
                label="操作"
                width="160"
                align="center"
                >
                <template slot-scope="scope">
                    <Button type="info"  size="small" class="marginRight" @click="openEditModal(scope)">编辑</Button>
                    <Button type="error" size="small" @click="remove(scope)">删除</Button>
                </template>
                </el-table-column>
            </el-table>
            <el-table v-show="searchType == 4"
                :data="hotSearchData"
                border
                style="width: 100%"
                >
                <el-table-column
                prop="dataCode"
                label="Id" sortable>
                </el-table-column>
                <el-table-column
                prop="dataname"
                label="热搜内容">
                </el-table-column>
                <el-table-column
                prop="parentsCode"
                label="父节点">
                </el-table-column>
                <el-table-column
                label="操作"
                width="160"
                align="center"
                >
                <template slot-scope="scope">
                    <Button type="info"  size="small" class="marginRight" @click="openEditModal(scope)">编辑</Button>
                    <Button type="error" size="small" @click="remove(scope)">删除</Button>
                </template>
                </el-table-column>
            </el-table>
          <div class="tablePage">
            <Page :total="pageLength" @on-change="pageChange"></Page>
          </div>
        </div>
      </div>
    </Card>
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
  </Content>
</template>

<script>
import {getHotspot,addHotspot,updateHotspot,deleteHotspot,
getHotSearch,addHotSearch,updateHotSearch,deleteHotSearch} from '@/api/search-service'
export default {
  data() {
    return {
      searchName: '',
      searchType:1,
      hotspotData:[],
      hotSearchData:[],
      pageLength:0,
      hotSearchModal:false,
      hotSpotModal:false,
      isAdd:true,
      modalTitle:'',
      columns1: [
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Age',
          key: 'age'
        },
        {
          title: 'Address',
          key: 'address'
        }
      ],
      data1: [
        {
          name: 'John Brown',
          age: 18,
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          age: 24,
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        },
        {
          name: 'Joe Black',
          age: 30,
          address: 'Sydney No. 1 Lake Park',
          date: '2016-10-02'
        },
        {
          name: 'Jon Snow',
          age: 26,
          address: 'Ottawa No. 2 Lake Park',
          date: '2016-10-04'
        }
      ],
      hotSearchForm:{
        dataname:'',
        parentsCode:'',
        dataCode:'',
        listorder:''
      },
      hotSpotForm:{
        name:'',
        parentid:'',
        dataId:'',
        listorder:''
      }
    }
  },
  methods: {
    //menu改变
    menuChange(key){
      this.searchType = key
      if(key == 3){
        this._getHotspot(1)
      }else if(key==4){
        this._getHotSearch(1)
      }
    },
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
      if(this.searchType == 3){
        this._getHotspot(Page)
      }else if(this.searchType == 4){
        this._getHotSearch(Page)
      }
    },
    //打开新增模态框
    openAddModal(){
      this.isAdd = true
      if(this.searchType == 3){
        this.hotSpotModal = true
        for(let i in this.hotSpotForm){
          this.hotSpotForm[i] = '';
        }
      }else if(this.searchType == 4){
        this.hotSearchModal = true
        for(let i in this.hotSearchForm){
          this.hotSearchForm[i] = '';
        }
      }
    },
    //打开编辑模态框
    openEditModal(params){
      this.isAdd = false
      if(this.searchType == 3){
        this.hotSpotModal = true
        for(let i in this.hotSpotForm){
          this.hotSpotForm[i] = '';
          if(params.row[i]){
            this.hotSpotForm[i] =params.row[i] 
          }
        }
      }else if(this.searchType == 4){
        this.hotSearchModal = true
        for(let i in this.hotSearchForm){
          this.hotSearchForm[i] = '';
          if(params.row[i]){
            this.hotSearchForm[i] =params.row[i] 
          }
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
      if(isAdd){
        if(this.searchType == 3){
          addHotspot(data).then(res=>{
            if(res.code == 20000){
              this.$Message.success('添加成功');
            }
          })
        }else if(this.searchType == 4){
          addHotSearch(data).then(res=>{
            if(res.code == 20000){
              this.$Message.success('添加成功');
            }
          })
        }
      }else{
        if(this.searchType == 3){
          updateHotspot(data).then(res=>{
            if(res.code == 20000){
              this.$Message.success('修改成功');
            }
          })
        }else if(this.searchType == 4){
          updateHotSearch(data).then(res=>{
            if(res.code == 20000){
              this.$Message.success('修改成功');
            }
          })
        }
      }
    },
    //删除
    remove (params) {
      let data = {}
      this.$Modal.confirm({
        content: '删除后数据无法恢复，是否继续？',
        onOk: () => {
          if(this.searchType == 3){
            this.hotspotData.splice(params.$index, 1)
            data = {id:params.row.id,method:'delete'}
            deleteHotspot(data).then(res=>{
              if(res.code == 20000){
                this.$Message.success('删除成功');
              }
            })
           }else if(this.searchType == 4){
              this.hotSearchData.splice(params.$index, 1)
               data = {id:params.row.id,method:'delete'}
              deleteHotSearch(data).then(res=>{
                if(res.code == 20000){
                  this.$Message.success('删除成功');
                }
              })
            }
          },
          onCancel: () => {            
          }
        });   
    },
  }

}
</script>

<style lang="scss" scoped>
.ivu-tree-arrow {
  color: #495060;
}
.table {
  width: 100%;
  margin-left: 16px;
}
.ivu-table-wrapper {
  width: 100%;
}
.card-content {
  display: flex;
}
</style>
