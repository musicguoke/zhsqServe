<template>
    <div :style="{height:userListHeight}">
        <div class="seach_condition">
            <div class="condition_list">
                <Input v-model="searchName" placeholder="输入搜索名称" style="width: 200px"></Input>
                <i-select :model.sync="searchDepartment" style="width:200px" placeholder="部门" class="marginLeft">
                    <i-option v-for="item in departmentList" :value="item.value" :key="item.key">{{ item.label }}</i-option>
                </i-select>
                <i-select :model.sync="searchCounty" style="width:200px" placeholder="区县" class="marginLeft">
                    <i-option v-for="item in countyList" :value="item.value" :key="item.key">{{ item.label }}</i-option>
                </i-select>
                <i-select :model.sync="searchSystem" style="width:200px" placeholder="系统选择" class="marginLeft">
                    <i-option v-for="item in systemList" :value="item.value" :key="item.key">{{ item.label }}</i-option>
                </i-select>
            </div>
            <div class="search_button">
                <i-button>新增</i-button>
                <i-button class="marginLeft">导入</i-button>
            </div>
        </div>
        <div class="tableSize">
            <Table border :columns="columns" :data="userData"></Table>
        </div>
        <div class="tablePage">
            <Page :total="userData.length"></Page>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            userListHeight:window.innerHeight - 65-60-20-90-18 +'px',
            searchDepartment:'',
            searchCounty:'',
            searchSystem:'',
            searchName:'',
            columns: [
                {
                    title: 'Id',
                    key: 'id'
                },
                {
                    title: '用户名',
                    key: 'userName'
                },
                {
                    title: '真实姓名',
                    key: 'userRealName'
                },
                {
                    title: '手机',
                    key: 'tel'
                },
                {
                    title: '区县',
                    key: 'county'
                },
                {
                    title: '部门',
                    key: 'department'
                },
                {
                    title: '注册时间',
                    key: 'registerTime'
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
            userData: [
                {
                    id: 1,
                    userName: '啦啦啦啦',
                    userRealName: '张三',
                    tel: '18888888888',
                    county: '万州区',
                    department: '环保局',
                    registerTime: '2018年1月1日'
                },
                {
                    id: 1,
                    userName: '啦啦啦啦',
                    userRealName: '张三',
                    tel: '18888888888',
                    county: '万州区',
                    department: '环保局',
                    registerTime: '2018年1月1日'
                },
                {
                    id: 1,
                    userName: '啦啦啦啦',
                    userRealName: '张三',
                    tel: '18888888888',
                    county: '万州区',
                    department: '环保局',
                    registerTime: '2018年1月1日'
                },
                {
                    id: 1,
                    userName: '啦啦啦啦',
                    userRealName: '张三',
                    tel: '18888888888',
                    county: '万州区',
                    department: '环保局',
                    registerTime: '2018年1月1日'
                },
                {
                    id: 1,
                    userName: '啦啦啦啦',
                    userRealName: '张三',
                    tel: '18888888888',
                    county: '万州区',
                    department: '环保局',
                    registerTime: '2018年1月1日'
                },
                {
                    id: 1,
                    userName: '啦啦啦啦',
                    userRealName: '张三',
                    tel: '18888888888',
                    county: '万州区',
                    department: '环保局',
                    registerTime: '2018年1月1日'
                },
                {
                    id: 1,
                    userName: '啦啦啦啦',
                    userRealName: '张三',
                    tel: '18888888888',
                    county: '万州区',
                    department: '环保局',
                    registerTime: '2018年1月1日'
                },
                {
                    id: 1,
                    userName: '啦啦啦啦',
                    userRealName: '张三',
                    tel: '18888888888',
                    county: '万州区',
                    department: '环保局',
                    registerTime: '2018年1月1日'
                },
                {
                    id: 1,
                    userName: '啦啦啦啦',
                    userRealName: '张三',
                    tel: '18888888888',
                    county: '万州区',
                    department: '环保局',
                    registerTime: '2018年1月1日'
                },
                {
                    id: 1,
                    userName: '啦啦啦啦',
                    userRealName: '张三',
                    tel: '18888888888',
                    county: '万州区',
                    department: '环保局',
                    registerTime: '2018年1月1日'
                }
            ],
            departmentList: [
                {
                    value: '',
                    label: '部门',
                    key:1
                },
                {
                    value: 'beijing',
                    label: '北京市',
                    key:2
                }
            ],
            countyList: [
                {
                    value: '',
                    label: '区县',
                    key:3
                },
                {
                    value: 'chongqing',
                    label: '重庆市',
                    key:4
                }
            ],
            systemList: [
                {
                    value: '',
                    label: '系统选择',
                    key:5
                },
                {
                    value: 'chongqing',
                    label: '重庆市',
                    key:6
                }
            ]
        }
    },
    method: {

    }
}
</script>

<style>
</style>
