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
          <i-button @click="show()">新增</i-button>
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
                    <Button type="info"  size="small" class="marginRight">编辑</Button>
                    <Button type="error" size="small">删除</Button>
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
                prop="parentsCode"
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
                    <Button type="info"  size="small" class="marginRight">编辑</Button>
                    <Button type="error" size="small">删除</Button>
                </template>
                </el-table-column>
            </el-table>
          <div class="tablePage">
            <Page :total="pageLength" :current="resetPage" @on-change="pageChange"></Page>
          </div>
        </div>
      </div>
    </Card>
  </Content>
</template>

<script>
import {getHotspot,getHotSearch} from '@/api/search-service'
export default {
  data() {
    return {
      searchName: '',
      searchType:1,
      hotspotData:[],
      hotSearchData:[],
      pageLength:0,
      resetPage:1,
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
      ]
    }
  },
  methods: {
    menuChange(key){
      this.searchType = key
      this.resetPage = 1
      if(key == 3){
        this._getHotspot(1)
      }else if(key==4){
        this._getHotSearch(1)
      }
    },
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
    pageChange(Page){
      if(this.searchType == 3){
        this._getHotspot(Page)
      }else if(this.searchType == 4){
        this._getHotSearch(Page)
      }
    }
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
