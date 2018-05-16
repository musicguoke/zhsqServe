import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/page/index'
import Vindex from '@/page/index/index'
import SystemList from '@/page/product-manage/system-list/index'

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
        }
      ]
    }
  ]
})
