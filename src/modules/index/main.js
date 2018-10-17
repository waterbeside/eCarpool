// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios';
import { focus } from 'vue-focus';
import tokenAxios from './utils/cTokenAxios';
import cFuns from '@/utils/cFuns';
import VueAMap from 'vue-amap';
import {Group, Cell, XInput, XButton , PopupPicker, Spinner,  Divider, ConfirmPlugin,ToastPlugin,Loading,Toast} from 'vux'
import VueI18n from 'vue-i18n'




import config from './config'
import titleBar from '../../components/titleBar'
import CpGobackBtn from '../../components/CpGobackBtn'
import CpScroller from '../../components/CpScroller'

// 全局注册vux的组件
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

Vue.config.productionTip = false
Vue.prototype.$http = axios;
// Vue.prototype.$tokenAxios = tokenAxios;
Vue.use(tokenAxios)
Vue.use(VueI18n)


var _language = cFuns.getLanguage(1);
var arrowLang = "zh,zh-tw,zh-hk,vi,en,"
localStorage.setItem('language',_language);
var lang = _language;
if(arrowLang.indexOf(_language.toLowerCase()) == -1){
  lang = "en"
}
// console.log(_language);

const i18n = new VueI18n({
  // locale: _language, // 语言标识
    locale: lang, // 语言标识
    messages: {
       'zh': require('@/../static/lang/zh'),
       'zh-TW': require('@/../static/lang/zh-TW'),
       'zh-HK': require('@/../static/lang/zh-TW'),
       'vi': require('@/../static/lang/vi'),
       'en': require('@/../static/lang/en')
   }
})

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: config.aMapKey,
  v: '1.4.10',
  plugin: ['AMap.Autocomplete','AMap.Geolocation','AMap.Driving', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor']
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})

import "../../assets/css/bootstrap/bootstrap.less";
import "../../assets/css/m_index.less";
