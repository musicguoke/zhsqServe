import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/page/index'
import SystemList from '@/page/product-manage/system-list/index'
import DepatmentList from '@/page/user-manage/department-list/departmentList'
import UserList from '@/page/user-manage/user-list/userList'
import ManagerList from '@/page/user-manage/manager-list/managerList'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'Index',
        component: Index,
        children: [{
            path: 'SystemList',
            component: SystemList
        }, {
            path: 'DepatmentList',
            component: DepatmentList
        }, {
            path: 'UserList',
            component: UserList
        }, {
            path: 'ManagerList',
            component: ManagerList
        }]
    }]
})