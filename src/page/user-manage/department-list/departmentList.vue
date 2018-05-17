<template>
  <div :style="{height:departmentListHeight}">
      <div class="seach_condition">
         <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
         <div class="search_button">
            <i-button @click="departmentAddOpen">新增</i-button>
            <i-button >导入</i-button>
         </div>
      </div>
      <div class="departmentTable">
        <Table border :columns="columns" :data="departmentData"></Table>
      </div>
      <div class="departmentPage">
        <Page :total="departmentData.length" ></Page>
      </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            searchName:'',
            departmentListHeight:window.innerHeight - 65-60-20-90 -80 +'px',
            departmentAddName:'',
            columns: [
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
            this.$Modal.confirm({
                    title: '新增部门',
                    content: '<input placeholder="请输入..." type="text">',
                    okText: '确定',
                    cancelText: '取消'
                });
        },
        departmentAdd(){
            console.log(1)
        }
    }
}
</script>

<style>
    .seach_condition{
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 80px;
    }
    .search_button{
        width: 120px;
        display: flex;
        justify-content: space-between;
    }
    .departmentTable{
        height: 520px;
    }
    .departmentPage{
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .marginLeft{
        margin-left: 20px;
    }
</style>
