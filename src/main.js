// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import VueWechat from 'vue-wechat-title'
import {AlertPlugin,ToastPlugin,LoadingPlugin} from 'vux'
import './assets/js/fontSize.js'
import './assets/css/common.css'

Vue.config.productionTip = false
Vue.use(VueResource);
Vue.use(VueWechat);
Vue.use(AlertPlugin);
Vue.use(ToastPlugin);
Vue.use(LoadingPlugin)
// Vue.directive('title', {
//   inserted: function (el, binding) {
//     document.title = el.innerText
//     el.remove()
//   }
// })
const FastClick = require('fastclick');
FastClick.attach(document.body);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
