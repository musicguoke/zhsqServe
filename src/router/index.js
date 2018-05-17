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

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/',
      component: Index,
      redirect: 'index',
      children: [
        {
          path: 'index',
          name: 'index',
          component: Vindex
        },
        {
          path: 'system-manage',
          component: SystemManage
        },
        {
          path: 'DepartmentList',
          component: DepartmentList
        }, 
        {
            path: 'UserList',
            component: UserList
        }, 
        {
          path: 'ManagerList',
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
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.name === 'index' || to.path.indexOf('statistics') > -1) {
    document.getElementById('app').style.height = 'auto'
  } else {
    document.getElementById('app').style.height = '100%'
  }
  next()
})

export default router
