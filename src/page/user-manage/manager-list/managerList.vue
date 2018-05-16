<template>
  <div :style="{height:managerHeight}">
      <div class="search_condition">
         <div class="condition_list">
            <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
            <i-select :model.sync="searchManagerType" style="width:200px" placeholder="市级管理员" class="marginLeft">
                <i-option v-for="item in managerTypeList" :value="item.value">{{ item.label }}</i-option>
            </i-select>
        </div>
         <div class="search_button">
            <i-button @click="managerAddOpen">新增</i-button>
            <i-button >导入</i-button>
         </div>
      </div>
      <div class="userTable">
        <Table border :columns="columns" :data="userData"></Table>
      </div>
      <div class="userPage">
        <Page :total="userData.length" ></Page>
      </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            managerHeight:window.innerHeight - 65-60-20-90 -80 +'px',
            searchName:'',
            searchManagerType:'',
            columns: [
                {
                    title: 'Id',
                    key: 'id'
                },
                {
                    title: '用户名',
                    key: 'managerName'
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
            userData:[
                {
                    id:1,
                    managerName:'啦啦啦啦'
                },
                {
                   id:1,
                    managerName:'啦啦啦啦'
                },
                {
                    id:1,
                    managerName:'啦啦啦啦'
                },
                {
                    id:1,
                    managerName:'啦啦啦啦'
                },
                {
                    id:1,
                    managerName:'啦啦啦啦'
                },
                {
                   id:1,
                    managerName:'啦啦啦啦'
                },
                {
                    id:1,
                    managerName:'啦啦啦啦'
                },
                {
                    id:1,
                    managerName:'啦啦啦啦'
                },
                {
                    id:1,
                    managerName:'啦啦啦啦'
                },
                {
                    id:1,
                    managerName:'啦啦啦啦'
                }
            ],
            managerTypeList: [
                {
                    value: 'shiji',
                    label: '市级管理员'
                },
                {
                    value: 'quxian',
                    label: '区县管理员'
                }
            ]
        }
    },
    methods:{
        managerAddOpen(){

        }
    }
}
</script>

<style>
    .search_condition{
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 80px;
    }
    .condition_list{
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
    .marginLeft{
        margin-left: 20px;
    }
    .search_button{
        width: 120px;
        display: flex;
        justify-content: space-between;
    }
    .userTable{
        height: 520px;
    }
    .userPage{
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
