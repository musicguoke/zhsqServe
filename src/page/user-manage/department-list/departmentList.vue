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
            <Table border :columns="columns" :data="departmentData" ref="selection"></Table>
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
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: 'Id',
                    key: 'id'
                },
                {
                    title: '部门名称',
                    key: 'departmentName'
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
                                            this.departmentEditOpen(params)
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
                            ]);
                        }
                    }
            ],
            departmentData:[
                {
                    id:1,
                    departmentName:'环保局',
                },
                {
                    id:2,
                    departmentName:'规划局',
                },
                {
                    id:3,
                    departmentName:'地理信息中心',
                },
                {
                    id:4,
                    departmentName:'知行公司',
                },
                {
                    id:1,
                    departmentName:'环保局',
                },
                {
                    id:2,
                    departmentName:'规划局',
                },
                {
                    id:3,
                    departmentName:'地理信息中心',
                },
                {
                    id:4,
                    departmentName:'知行公司',
                },
                {
                    id:3,
                    departmentName:'地理信息中心',
                },
                {
                    id:4,
                    departmentName:'知行公司',
                }
            ]
        }
    },
    methods:{
        departmentAddOpen(){
            this.departmentModal = true;
            this.modalTitle = '新增部门';
        },
        departmentEditOpen(){
            this.modalTitle = '修改部门'
            this.departmentModal = true;
        },
        remove (index) {
            this.departmentData.splice(index, 1);
        }
    }
}
</script>

<style>
</style>
