<template>
<Content :style="{height:managerHeight}">
    <Breadcrumb :style="{marginBottom: '17px'}">
      <BreadcrumbItem>用户管理</BreadcrumbItem>
      <BreadcrumbItem>管理员列表</BreadcrumbItem>
    </Breadcrumb>
    <Card>
  <div>
      <div class="seach_condition">
         <div class="condition_list">
            <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
            <i-select :model.sync="searchManagerType" style="width:200px" placeholder="市级管理员" class="marginLeft">
                <i-option v-for="item in managerTypeList" :value="item.value" :key="item.key">{{ item.label }}</i-option>
            </i-select>
        </div>
         <div class="search_button">
            <i-button @click="managerAddOpen">新增</i-button>
            <i-button class="marginLeft">导入</i-button>
         </div>
      </div>
      <div class="tableSize">
        <Table border :columns="columns" :data="userData"></Table>
      </div>
      <div class="tablePage">
        <Page :total="userData.length" ></Page>
      </div>
  </div>
  </Card>
  </Content>
</template>

<script>
export default {
    data(){
        return{
            managerHeight:window.innerHeight - 65-60-20-90-18 +'px',
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
                    label: '市级管理员',
                    key:1
                },
                {
                    value: 'quxian',
                    label: '区县管理员',
                    key:2
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
</style>
