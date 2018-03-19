// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios';
import { focus } from 'vue-focus';
import tokenAxios from './utils/cTokenAxios';
import VueAMap from 'vue-amap';
import {Group, Cell, XInput, XButton , PopupPicker, Spinner,  Divider, ConfirmPlugin,ToastPlugin,Loading,Toast} from 'vux'



import config from './configs/index'
import footNavBar from './components/footNavBar'
import titleBar from './components/titleBar'
import CpGobackBtn from './components/CpGobackBtn'
import CpScroller from './components/CpScroller'

// 全局注册vux的组件
Vue.component('FootNavBar', footNavBar)
Vue.component('TitleBar', titleBar)
Vue.component('CpGobackBtn', CpGobackBtn)
Vue.component('CpScroller', CpScroller)

Vue.component('Group', Group)
Vue.component('Cell', Cell)

Vue.component('PopupPicker', PopupPicker)
Vue.component('Divider', Divider)
Vue.component('Spinner', Spinner)
Vue.component('XInput', XInput)
Vue.component('XButton', XButton)
Vue.component('Loading', Loading)
Vue.component('Toast', Toast)

Vue.directive('focus', focus);

Vue.use(ToastPlugin);
Vue.use(ConfirmPlugin);

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: config.aMapKey,
  plugin: ['AMap.Autocomplete','AMap.Geolocation','AMap.Driving', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor']
});

Vue.config.productionTip = false


Vue.prototype.$http = axios;
// Vue.prototype.$tokenAxios = tokenAxios;
Vue.use(tokenAxios)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

import "./assets/styles/bootstrap/bootstrap.less";
import "./assets/styles/style.less";
