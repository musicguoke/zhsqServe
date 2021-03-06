import 'babel-polyfill'
import App from './App'
import router from './router'
import { Table, TableColumn, Tree } from 'element-ui'
import MUtil from '@/util/mm.js'
import store from './vuex/store'
import './components/dragTree/dom-expand.js'

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tree)

import './common/css/common.css'

Vue.prototype._mm = new MUtil()
Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})