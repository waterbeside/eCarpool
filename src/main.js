// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios';
import tokenAxios from './utils/cTokenAxios';
import VueAMap from 'vue-amap';
import {Group, Cell, XInput, XButton,XNumber, XSwitch, PopupPicker,Datetime,DatetimePlugin, ViewBox, Search,Spinner, ButtonTab, ButtonTabItem, Divider, AlertPlugin, ConfirmPlugin,ToastPlugin,Loading,InlineLoading,Toast, Tab, TabItem} from 'vux'


import config from './configs/index'
import footNavBar from './components/footNavBar'
import titleBar from './components/titleBar'
import CpGobackBtn from './components/CpGobackBtn'

// 全局注册vux的组件
Vue.component('FootNavBar', footNavBar)
Vue.component('TitleBar', titleBar)
Vue.component('CpGobackBtn', CpGobackBtn)

Vue.component('Group', Group)
Vue.component('Cell', Cell)

Vue.component('PopupPicker', PopupPicker)

Vue.component('Datetime', Datetime)
Vue.component('ButtonTab', ButtonTab)
Vue.component('ButtonTabItem', ButtonTabItem)
Vue.component('Divider', Divider)

Vue.component('Search', Search)
Vue.component('Spinner', Spinner)
Vue.component('XInput', XInput)
Vue.component('XButton', XButton)
Vue.component('XNumber', XNumber)
Vue.component('XSwitch', XSwitch)
Vue.component('Loading', Loading)
Vue.component('Tab', Tab)
Vue.component('TabItem', TabItem)
Vue.component('Toast', Toast)

Vue.use(ToastPlugin, {position: 'top'});
Vue.use(DatetimePlugin);
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

import "./assets/styles/font-awesome.min.css";
import "./assets/styles/bootstrap.cp.min.css";
import "./assets/styles/style.less";
