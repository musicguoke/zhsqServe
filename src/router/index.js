import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/page/index'
import Vindex from '@/page/index/index'
import SystemManage from '@/page/product-manage/index'
import UserVisit from '@/page/behavior/user-visit/index'
import DataVisit from '@/page/behavior/data-visit/index'
import SearchVisit from '@/page/behavior/search-visit/index'

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
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.name === 'index') {
    document.getElementById('app').style.height = 'auto'
  } else {
    document.getElementById('app').style.height = '100%'
  }
  next()
})

export default router