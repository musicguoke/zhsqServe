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
                <i-button @click="departmentAddOpen">新增</i-button>
                <i-button class="marginLeft">导入</i-button>
            </div>
        </div>
        <div class="tableSize">
            <el-table
                :data="departmentData"
                border
                style="width: 100%">
                <el-table-column
                prop="id"
                label="Id">
                </el-table-column>
                <el-table-column
                prop="departmentName"
                label="部门名称">
                </el-table-column>
                <el-table-column
                label="操作"
                width="160"
                align="center"
                >
                <template slot-scope="scope">
                    <Button type="info" @click="departmentEditOpen(scope)" size="small"  class="marginRight">编辑</Button>
                    <Button type="error" @click="remove(scope.$index)" size="small">删除</Button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="tablePage">
            <Page :total="departmentData.length" ></Page>
        </div>
    </div>
  </Card>
  <Modal v-model="departmentModal" :title=modalTitle>
        <Form :model="departmentForm" label-position="left" :label-width="100">
            <FormItem label="部门名称">
                <Input v-model="departmentForm.departmentName" placeholder="请输入部门名称..."></Input>
            </FormItem>
        </Form>
  </Modal>
</Content>
</template>

<script>
export default {
    data(){
        return{
            searchName:'',
            departmentListHeight:window.innerHeight - 65-60-20-90-18 +'px',
            departmentModal:false,
            departmentForm:{
                departmentName:''
            },
            modalTitle:'',
            departmentData: [
                {
                    id: 1,
                    departmentName: '环保局',
                },
                {
                    id: 2,
                    departmentName: '规划局',
                },
                {
                    id: 3,
                    departmentName: '地理信息中心',
                },
                {
                    id: 4,
                    departmentName: '知行公司',
                },
                {
                    id: 1,
                    departmentName: '环保局',
                },
                {
                    id: 2,
                    departmentName: '规划局',
                },
                {
                    id: 3,
                    departmentName: '地理信息中心',
                },
                {
                    id: 4,
                    departmentName: '知行公司',
                },
                {
                    id: 3,
                    departmentName: '地理信息中心',
                },
                {
                    id: 4,
                    departmentName: '知行公司',
                }
            ]
        }
    },
    methods:{
        departmentAddOpen(){
            this.departmentModal = true;
            this.modalTitle = '新增部门';
        },
        departmentEditOpen(params){
            this.modalTitle = '修改部门'
            this.departmentModal = true;
            for(var i in this.departmentForm){
               if(params.row[i]){
                   this.departmentForm[i] =params.row[i] 
               }
            }
        },
        remove (index) {
            this.$Modal.confirm({
                    content: '删除后数据无法恢复，是否继续？',
                    onOk: () => {
                        this.departmentData.splice(index, 1);
                        this.$Message.success('删除成功');
                    },
                    onCancel: () => {
                        
                    }
                });
            
        }
    }
}
</script>

<style>
</style>
