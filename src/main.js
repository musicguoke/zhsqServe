import App from './App'
import router from './router'
import { Table, TableColumn, Tree, Button } from 'element-ui'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import MUtil from '@/util/mm.js'


Vue.use(iView)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tree)
Vue.use(Button)

import './common/css/common.css'

Vue.prototype._mm = new MUtil()
Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})