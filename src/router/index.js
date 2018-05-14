import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/page/index'
import SystemList from '@/page/product-manage/system-list/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    }, {
      path: '/product-manage/system-list',
      name: 'SystemList',
      component: SystemList
    }
  ]
})
