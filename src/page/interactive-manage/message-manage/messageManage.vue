<template>
  <div :style="{height:messageManageHeight}">
      <div class="seach_condition">
         <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
         <div class="search_button">
            <i-button>新增</i-button>
         </div>
      </div>
      <div class="tableSize">
        <Table border :columns="columns" :data="massageData"></Table>
      </div>
      <div class="tablePage">
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
                    title: '短信内容',
                    key: 'messageInfo'
                },
                {
                    title: '添加时间',
                    key: 'addTime'
                },
                {
                    title: '状态',
                    key: 'status'
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
            massageData:[
                {
                    id:1,
                    tel:'18888888888',
                    messageInfo:'你好',
                    addTime:'2018-4-27',
                    status:'发送成功',
                },
               {
                    id:1,
                    tel:'18888888888',
                    messageInfo:'你好',
                    addTime:'2018-4-27',
                    status:'发送成功',
                },
                {
                    id:1,
                    tel:'18888888888',
                    messageInfo:'你好',
                    addTime:'2018-4-27',
                    status:'发送成功',
                },
                {
                    id:1,
                    tel:'18888888888',
                    messageInfo:'你好',
                    addTime:'2018-4-27',
                    status:'发送成功',
                },
                {
                    id:1,
                    tel:'18888888888',
                    messageInfo:'你好',
                    addTime:'2018-4-27',
                    status:'发送成功',
                },
                {
                    id:1,
                    tel:'18888888888',
                    messageInfo:'你好',
                    addTime:'2018-4-27',
                    status:'发送成功',
                },
                {
                    id:1,
                    tel:'18888888888',
                    messageInfo:'你好',
                    addTime:'2018-4-27',
                    status:'发送成功',
                },
                {
                    id:1,
                    tel:'18888888888',
                    messageInfo:'你好',
                    addTime:'2018-4-27',
                    status:'发送成功',
                },
                {
                    id:1,
                    tel:'18888888888',
                    messageInfo:'你好',
                    addTime:'2018-4-27',
                    status:'发送成功',
                },
                {
                    id:1,
                    tel:'18888888888',
                    messageInfo:'你好',
                    addTime:'2018-4-27',
                    status:'发送成功',
                },
            ]
        }
    },
    methods:{
    }
}
</script>

<style>
    
</style>
