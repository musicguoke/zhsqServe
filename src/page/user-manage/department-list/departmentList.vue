<template>
<Content :style="{height:departmentListHeight}">
    <Breadcrumb :style="{marginBottom: '17px'}">
      <BreadcrumbItem>用户管理</BreadcrumbItem>
      <BreadcrumbItem>部门列表</BreadcrumbItem>
    </Breadcrumb>
    <Card>
    <div>
        <div class="seach_condition">
            <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
            <div class="search_button">
                <i-button class="marginLeft">导入</i-button>
            </div>
        </div>
        <div class="tableSize">
            <Row>
                <Col span="9" class="departmentTree" :style="{overflow:'auto',height:departmentTreeHeight}">
                    <el-tree :data="departmentData" default-expand-all :props="defaultProps" node-key="fGuid" :render-content="renderContent" @node-click="handleNodeClick" :highlight-current="highlightcurrent" :expand-on-click-node="expandonclicknode"></el-tree>
                </Col>
                <Col span="14" class="departmentInfo" :style="{height:departmentTreeHeight}">
                    <div class="fontSize">{{operationType}}</div>
                    <Form :model="departmentInfoForm" label-position="left">
                        <FormItem label="部门名" :label-width="100">
                            <Input v-model="departmentInfoForm.name"></Input>
                        </FormItem>
                        <FormItem label="部门简称" :label-width="100">
                            <Input v-model="departmentInfoForm.nameA"></Input>
                        </FormItem>
                        <FormItem label="部门编码" :label-width="100">
                            <Input v-model="departmentInfoForm.id"></Input>
                        </FormItem>
                        <FormItem label="父级编码" :label-width="100">
                            <Input v-model="departmentInfoForm.parentid"></Input>
                        </FormItem>
                        <FormItem label="序号" :label-width="100">
                            <Input v-model="departmentInfoForm.listorder"></Input>
                        </FormItem>
                        <FormItem style="text-align:center">
                            <Button type="primary"  icon="document" @click="saveDepartment">保存</Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </div>
    </div>
  </Card>
</Content>
</template>

<script>
import {getDepartmentList,addAndUpdateDepartment,importDepartment} from '@/api/department-service'
export default {
    data(){
        return{
            searchName:'',
            departmentListHeight:window.innerHeight - 65-60-20-90-18 +'px',
            departmentTreeHeight:window.innerHeight - 65-60-20-90-18-120 +'px',
            departmentData:[],
            defaultProps:{
                label:'name',
                children:'list'
            },
            highlightcurrent:true,
            expandonclicknode:true,
            departmentInfoForm:{
                name:'',
                id:'',
                parentid:'',
                nameA:'',
                listorder:''
            },
            operationType:'部门详情'
        }
    },
    created(){
        this._getDepartmentList()
    },
    methods:{
      //向树上绑定按钮
      renderContent(h, { node, data, store }) {
        return (
          <span style="font-size: 14px;width:100%;">
            <span style="float:left">
              <span title={node.label}>{node.label}</span>
            </span>
            <span style="float:right;padding-right:5px;display:block">
             <i on-click={ () => this.append(data) } class="el-icon-circle-plus" style="color:#20a0ff"></i>
              &nbsp;
              <i on-click={ () => this.remove(node, data) } class="el-icon-circle-close" style="color:#ff3800"></i>
            </span>
          </span>);
      },
      //获取树形数据
      _getDepartmentList(){
          let data = {
            pageNo:1,
            pageSize:100,
            method:'listTree',   
            grName:''
          }
          getDepartmentList(data).then(res=>{
             let data = res.data
             this.departmentData = [{
                 id:"-1",
                 list:[],
                 name:"部门列表",
                 nameA:"部门列表",
                 parentid:""
             }]
             for(let i in data){
                  this.departmentData[0].list.push(data[i])
              }
          })
      },
      //树节点点击
      handleNodeClick(data){
          for(let i in data){
              this.operationType = '部门详情'+'--'+data.name
              this.departmentInfoForm[i] = data[i]
          }
      },
      //当前节点下创建节点
      append(data){
          event.cancelBubble = true; 
          this.operationType = '部门添加'
          for(let i in data){
              this.departmentInfoForm[i] = ''
          }
          this.departmentInfoForm.parentid = data.id
      },
      //删除节点
      remove(node,data){
          event.cancelBubble = true; 
          this.$Modal.confirm({
            content: '删除时该节点下的所有子节点也将删除，是否继续？',
                onOk: () => {
                },
                onCancel: () => {
                        
                }
            });
        },
        //点击保存
        saveDepartment(){
            let data ={

            }
            addAndUpdateDepartment().then(res=>{
                let data = {
                    name:this.departmentInfoForm.name,
                    id:this.departmentInfoForm.id,
                    parentid:this.departmentInfoForm.id,
                    nameA:this.departmentInfoForm.id,
                    listorder:this.departmentInfoForm.listorder
                }
                addAndUpdateDepartment(data).then(res=>{
                    if(res.code = 20000){
                        this.$Message.success('保存成功')
                        this._getDepartmentList()
                    }
                })
            })
        }
    }
}
</script>

<style>
.departmentTree{
    padding: 10px;
    border: 1px solid #ccc;
}
.departmentInfo{
    font-size: 16px;
    padding: 10px;
    border: 1px solid #ccc;
    margin-left: 20px;
}
.ivu-form-item-label{
    font-size: 14px;
}
.fontSize{
    font-weight: bold;
    margin-bottom: 20px;
}
</style>
