<template>
  <div :style="{height:messageManageHeight}">
      <div class="seach_condition">
         <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
         <div class="search_button">
            <i-button>新增</i-button>
         </div>
      </div>
      <div class="messageTable">
        <Table border :columns="columns" :data="massageData"></Table>
      </div>
      <div class="massagePage">
        <Page :total="massageData.length" ></Page>
      </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            searchName:'',
            messageManageHeight:window.innerHeight - 65-60-20-90-18 +'px',
            columns: [
                {
                    title: 'Id',
                    key: 'id'
                },
                {
                    title: '电话',
                    key: 'tel'
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
