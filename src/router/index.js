import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/page/index'
import Vindex from '@/page/index/index'
import DepartmentList from '@/page/user-manage/department-list/departmentList'
import UserList from '@/page/user-manage/user-list/userList'
import ManagerList from '@/page/user-manage/manager-list/managerList'
import SystemManage from '@/page/product-manage/index'
import UserVisit from '@/page/behavior/user-visit/index'
import DataVisit from '@/page/behavior/data-visit/index'
import SearchVisit from '@/page/behavior/search-visit/index'
import ResourceManage from '@/page/resource/resource-manage/index'
import SearchManage from '@/page/resource/search-manage/index'
import MessageManage from '@/page/interactive-manage/message-manage/messageManage'
import PushManage from '@/page/interactive-manage/push-manage/pushManage'

Vue.use(Router)

const router = new Router({
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
                path: 'system-manage',
                component: SystemManage
            },
            {
                path: 'department-list',
                component: DepartmentList
            },
            {
                path: 'user-list',
                component: UserList
            },
            {
                path: 'manager-list',
                component: ManagerList
            },
            {
                path: 'user-statistics',
                component: UserVisit
            },
            {
                path: 'data-statistics',
                component: DataVisit
            },
            {
                path: 'search-statistics',
                component: SearchVisit
            },
            {
                path: 'resource-manage',
                component: ResourceManage
            },
            {
                path: 'search-manage',
                component: SearchManage
            },
            {
                path: 'message-manage',
                component: MessageManage
            },
            {
                path: 'push-manage',
                component: PushManage
            }
        ]
    }]
})

export default router