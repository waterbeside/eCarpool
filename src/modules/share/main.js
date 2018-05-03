// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from '../../utils/axios';

import VueAMap from 'vue-amap';
import {Group, Cell, ConfirmPlugin,ToastPlugin,Loading} from 'vux'


import config from './config'


// 全局注册vux的组件
Vue.component('Group', Group)
Vue.component('Cell', Cell)


Vue.component('Loading', Loading)

Vue.use(ToastPlugin);
Vue.use(ConfirmPlugin);

Vue.prototype.$http = axios;


Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})

import "../../assets/css/bootstrap/bootstrap.less";
import "../../assets/css/m_share.less";
