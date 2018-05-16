import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/page/index'
import Vindex from '@/page/index/index'
import SystemList from '@/page/product-manage/system-list/index'
import DepartmentList from '@/page/user-manage/department-list/departmentList'
import UserList from '@/page/user-manage/user-list/userList'
import ManagerList from '@/page/user-manage/manager-list/managerList'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        component: Index,
        redirect: 'index',
        children: [{
                path: 'index',
                name: 'index',
                component: Vindex
            },
            {
                path: 'SystemList',
                component: SystemList
            }, {
                path: 'DepartmentList',
                component: DepartmentList
            }, {
                path: 'UserList',
                component: UserList
            }, {
                path: 'ManagerList',
                component: ManagerList
            }
        ]
    }]
})