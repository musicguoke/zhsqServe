<template>
<Content :style="{height:pushManageHeight}">
    <Breadcrumb :style="{marginBottom: '17px'}">
      <BreadcrumbItem>用户管理</BreadcrumbItem>
      <BreadcrumbItem>推送管理</BreadcrumbItem>
    </Breadcrumb>
    <Card>
  <div>
      <div class="seach_condition">
         <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
         <div class="search_button">
            <i-button>新增</i-button>
         </div>
      </div>
      <div class="tableSize">
        <Table border :columns="columns" :data="pushData"></Table>
      </div>
      <div class="tablePage">
        <Page :total="pushData.length" ></Page>
      </div>
  </div>
  </Card>
  </Content>
</template>

<script>
export default {
    data(){
        return{
            searchName:'',
            pushManageHeight:window.innerHeight - 65-60-20-90-18 +'px',
            columns: [
                {
                    title: 'Id',
                    key: 'id'
                },
                {
                    title: '推送类型',
                    key: 'pushType'
                },
                {
                    title: '推送组/用户',
                    key: 'pushTarget'
                },
                {
                    title: '内容',
                    key: 'pushContent'
                },
                {
                    title: '时间',
                    key: 'time'
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
            pushData:[
                {
                    id:1,
                    pushType:'版本',
                    pushTarget:'小张',
                    pushContent:'新版本上线了',
                    time:'2018-4-27'
                },
              {
                    id:1,
                    pushType:'版本',
                    pushTarget:'小张',
                    pushContent:'新版本上线了',
                    time:'2018-4-27'
                },
                {
                    id:1,
                    pushType:'版本',
                    pushTarget:'小张',
                    pushContent:'新版本上线了',
                    time:'2018-4-27'
                },
                {
                    id:1,
                    pushType:'版本',
                    pushTarget:'小张',
                    pushContent:'新版本上线了',
                    time:'2018-4-27'
                },
                {
                    id:1,
                    pushType:'版本',
                    pushTarget:'小张',
                    pushContent:'新版本上线了',
                    time:'2018-4-27'
                },
                {
                    id:1,
                    pushType:'版本',
                    pushTarget:'小张',
                    pushContent:'新版本上线了',
                    time:'2018-4-27'
                },
                {
                    id:1,
                    pushType:'版本',
                    pushTarget:'小张',
                    pushContent:'新版本上线了',
                    time:'2018-4-27'
                },
                {
                    id:1,
                    pushType:'版本',
                    pushTarget:'小张',
                    pushContent:'新版本上线了',
                    time:'2018-4-27'
                },
                {
                    id:1,
                    pushType:'版本',
                    pushTarget:'小张',
                    pushContent:'新版本上线了',
                    time:'2018-4-27'
                },
                {
                    id:1,
                    pushType:'版本',
                    pushTarget:'小张',
                    pushContent:'新版本上线了',
                    time:'2018-4-27'
                }
            ]
        }
    },
    methods:{
    }
}
</script>

<style>
</style>
