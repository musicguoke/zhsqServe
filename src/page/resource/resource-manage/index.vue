<template>
  <Content>
    <Breadcrumb :style="{marginBottom: '17px'}">
      <BreadcrumbItem>资源管理</BreadcrumbItem>
      <BreadcrumbItem>资源列表</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <div class="card-content">
        <Menu theme="light" active-name="1" @on-select="menuChange">
          <MenuItem name="1">数据资源目录</MenuItem>
          <MenuItem name="2">720资源</MenuItem>
          <MenuItem name="3">图片资源</MenuItem>
          <MenuItem name="4">区域概况</MenuItem>
          <MenuItem name="5">扶贫信息</MenuItem>
          <MenuItem name="6">专题配置</MenuItem>
          <MenuItem name="7">地图配置</MenuItem>
          <MenuItem name="8">宏观数据</MenuItem>
          <MenuItem name="9">区域文本</MenuItem>
        </Menu>
        <div class="table">
          <div class="seach_condition">
            <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
            <div class="search_button">
              <i-button @click="openAddModal()">新增</i-button>
            </div>
          </div>
          <Table border :columns="columns1" :data="data1" v-show="searchType == 1"></Table>
          <el-table v-show="searchType == 8"
                :data="macroData"
                border
                style="width: 100%"
                >
                <el-table-column
                prop="id"
                label="ID" width="100" sortable>
                </el-table-column>
                <el-table-column
                prop="name"
                label="数据名称" width="200">
                </el-table-column>
                <el-table-column
                prop="dataId"
                label="数据ID">
                </el-table-column>
                 <el-table-column
                prop="areaCode"
                label="行政区划编码">
                </el-table-column>
                 <el-table-column
                prop="areaName"
                label="行政区划名称">
                </el-table-column>
                <el-table-column
                prop="year"
                label="年份" width="80">
                </el-table-column>
                <el-table-column
                label="操作"
                width="160"
                align="center"
                >
                <template slot-scope="scope">
                    <Button type="info"  size="small"  @click="openEditModal(scope)">编辑</Button>
                    <!-- <Button type="error" size="small" @click="remove(scope)">删除</Button> -->
                </template>
                </el-table-column>
            </el-table>
            <el-table v-show="searchType == 9"
                :data="areaTextData"
                border
                style="width: 100%"
                >
                <el-table-column
                prop="id"
                label="ID" width="100" sortable>
                </el-table-column>
                <el-table-column
                prop="areacode"
                label="区域编码">
                </el-table-column>
                <el-table-column
                prop="dataId"
                label="数据编码">
                </el-table-column>
                <el-table-column
                prop="year"
                label="年份" width="80">
                </el-table-column>
                <el-table-column
                prop="title"
                label="标题" width="200">
                </el-table-column>
                <el-table-column
                prop="filePath"
                label="文件地址">
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
    <Modal v-model="macroDataModal" :title=modalTitle @on-ok="addOrUpdate">
        <Form :model="macroDataForm" label-position="left" :label-width="100">
            <FormItem label="数据名称">
                <Input v-model="macroDataForm.name" ></Input>
            </FormItem>
            <FormItem label="数据ID">
                <Input v-model="macroDataForm.dataId" ></Input>
            </FormItem>
            <FormItem label="行政区划编码">
                <Input v-model="macroDataForm.areaCode" ></Input>
            </FormItem>
            <FormItem label="行政区划名称">
                <Input v-model="macroDataForm.areaName" ></Input>
            </FormItem>
            <FormItem label="年份">
                <Input v-model="macroDataForm.year" ></Input>
            </FormItem>
             <FormItem label="标题">
                <Input v-model="macroDataForm.title" ></Input>
            </FormItem>
             <FormItem label="label">
                <Input v-model="macroDataForm.label" ></Input>
            </FormItem>
             <FormItem label="x">
                <Input v-model="macroDataForm.x" ></Input>
            </FormItem>
            <FormItem label="y">
                <Input v-model="macroDataForm.y" ></Input>
            </FormItem>
            <FormItem label="数据描述">
                <Input v-model="macroDataForm.dataDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
            </FormItem>
            <FormItem label="字段信息">
                <Input v-model="macroDataForm.filedsData" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
            </FormItem>
        </Form>
    </Modal>
    <Modal v-model="areaTextModal" :title=modalTitle @on-ok="addOrUpdate">
        <Form :model="areaTextForm" label-position="left" :label-width="100">
            <FormItem label="行政区划编码">
                <Input v-model="areaTextForm.areacode" ></Input>
            </FormItem>
            <FormItem label="标题">
                <Input v-model="areaTextForm.title" ></Input>
            </FormItem>
            <FormItem label="年份">
                <Input v-model="areaTextForm.year"></Input>
            </FormItem>
            <!-- <FormItem label="类型">
                <Select v-model="areaTextForm.dataCode">
                    <Option value="cun">村现状规划规划</Option>
                    <Option value="fu">扶贫</Option>
                </Select>
            </FormItem> -->
            <FormItem label="描述">
                <Input v-model="areaTextForm.filePath"></Input>
            </FormItem>
            <FormItem label="排序">
                <Input v-model="areaTextForm.listorder"></Input>
            </FormItem>
        </Form>
    </Modal>
  </Content>
</template>

<script>
import {getMacroData,updateMacroData,getAreaText,addAreaText,updateAreaText,deleteAreaText} from '@/api/dataSource-service'
export default {
  data() {
    return {
      searchName: '',
      searchType: 1,
      pageLength:0,
      isAdd:true,
      modalTitle:'',
      macroData:[],
      areaTextData:[],
      macroDataModal:false,
      areaTextModal:false,
      macroDataForm:{
        name:'',
        dataId:'',
        areaCode:'',
        areaName:'',
        year:'',
        title:'',
        label:'',
        x:'',
        y:'',
        dataDesc:'',
        filedsData:''
      },
      areaTextForm:{
        areacode:'',
        title:'',
        year:'',
        filePath:'',
        listorder:''
      },
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
        },
        {
          title: '操作',
          key: 'action',
          width: 250,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '25px'
                },
                on: {
                  click: () => {
                    console.log(params)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, '删除')
            ])
          }
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
    //menu改变
    menuChange(key){
      this.searchType = key
      if(key == 8){
        this._getMacroData(1)
      }else if(key==9){
        this._getAreaText(1)
      }
    },
    //宏观数据
    _getMacroData(page){
      let data ={
        pageNo:page,
        pageSize:10, 
        method:'list', 
        title:''  
      }
      getMacroData(data).then(res=>{
        this.pageLength = res.data.total
        this.macroData = res.data.list
      })
    },
    //区域文本
    _getAreaText(page){
      let data ={
        pageNo:page,
        pageSize:10, 
        method:'list', 
        title:''  
      }
      getAreaText(data).then(res=>{
        this.pageLength = res.data.total
        this.areaTextData = res.data.list
      })
    },
     //分页点击
    pageChange(Page){
      if(this.searchType == 8){
        this._getMacroData(Page)
      }else if(this.searchType == 9){
        this._getAreaText(Page)
      }
    },
    //打开新增模态框
    openAddModal(){
      this.isAdd = true
      if(this.searchType == 8){
        // this.macroDataModal = true
        // for(let i in this.macroDataForm){
        //   this.macroDataForm[i] = '';
        // }
      }else if(this.searchType == 9){
        this.areaTextModal = true
        for(let i in this.areaTextForm){
          this.areaTextForm[i] = '';
        }
      }
    },
    //打开编辑模态框
    openEditModal(params){
      this.isAdd = false
      if(this.searchType == 8){
        this.macroDataModal = true
        for(let i in this.macroDataForm){
          this.macroDataForm[i] = '';
          if(params.row[i]){
            this.macroDataForm[i] =params.row[i] 
          }
        }
      }else if(this.searchType == 9){
        this.areaTextModal = true
        for(let i in this.areaTextForm){
          this.areaTextForm[i] = '';
          if(params.row[i]){
            this.areaTextForm[i] =params.row[i] 
          }
        }
      }
    },
    //点击确定
    addOrUpdate(){
      let data = {}
      if(this.searchType == 8){
        data = {
          method:'save',
          id:this.macroDataForm.id,
          name:this.macroDataForm.name,
          year:this.macroDataForm.year,
          areaCode:this.macroDataForm.areaCode,
          areaName:this.macroDataForm.areaName,
          dataId:this.macroDataForm.dataId,
          title:this.macroDataForm.title,
          updateTime:'',
          address:'',
          x:this.macroDataForm.x,
          y:this.macroDataForm.y,
          filedsData:this.macroDataForm.filedsData,
          label:this.macroDataForm.label,
          dataDesc:this.macroDataForm.dataDesc
        }
      }else if(this.searchType == 9){
        data = {
          method:'save',
          areacode:this.areaTextForm.areacode,
          title:this.areaTextForm.title,
          year:this.areaTextForm.year,
          filePath:this.areaTextForm.filePath,
          listorder:this.areaTextForm.listorder
        }
      }
      if(isAdd){
        if(this.searchType == 8){
          updateMacroData(data).then(res=>{
            if(res.code == 20000){
              this.$Message.success('添加成功');
            }
          })
        }else if(this.searchType == 9){
          addAreaText(data).then(res=>{
            if(res.code == 20000){
              this.$Message.success('添加成功');
            }
          })
        }
      }else{
        if(this.searchType == 3){
          updateMacroData(data).then(res=>{
            if(res.code == 20000){
              this.$Message.success('修改成功');
            }
          })
        }else if(this.searchType == 4){
          updateAreaText(data).then(res=>{
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
          if(this.searchType == 8){

          }else if(this.searchType == 9){
              this.areaTextData.splice(params.$index, 1)
              data = {id:params.row.id,method:'delete'}
              deleteAreaText(data).then(res=>{
                if(res.code == 20000){
                  this.$Message.success('删除成功');
                }
              })
            }
          },
        onCancel: () => {            
        }
      });   
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
