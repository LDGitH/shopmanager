// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import MyBread from '@/components/cusBread.vue'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/index.css'
import Http from './plugins/http'
import App from './App'
import router from './router'
import moment from 'moment'

// 全局面包屑组件
// 组件名， 组件选项所在对象
// 组件的名字应该由组件本身提供
Vue.component(MyBread.name, MyBread);

// 过滤器处理日期格式
Vue.filter('fmtDate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

Vue.use(Http)
Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
  // 上面两行代码跟render作用一样
  // render: h => h(App)
})
