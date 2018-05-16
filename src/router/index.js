import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/page/index'
import Vindex from '@/page/index/index'
import SystemList from '@/page/product-manage/system-list/index'
import UserVisit from '@/page/behavior/user-visit/index'
import DataVisit from '@/page/behavior/data-visit/index'
import SearchVisit from '@/page/behavior/search-visit/index'

Vue.use(Router)

export default new Router({
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
          path: 'SystemList',
          component: SystemList
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
