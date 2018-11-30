// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueI18n from 'vue-i18n';
import axios from '@/utils/axios';
import cFuns from '@/utils/cFuns';

// import VueAMap from 'vue-amap';
import {Group, Cell, ConfirmPlugin,ToastPlugin,Loading} from 'vux'
import config from './config';

import CpViewBox from '@/components/CpViewBox'
// 全局注册vux的组件
Vue.component('Group', Group)
Vue.component('Cell', Cell)
Vue.component('Loading', Loading)
Vue.component('CpViewBox', CpViewBox)

Vue.use(VueI18n)
Vue.use(ToastPlugin);
Vue.use(ConfirmPlugin);

Vue.prototype.$http = axios;
Vue.config.productionTip = false


var _language = cFuns.getLanguage(1);
var lang = cFuns.formartLanguage(_language);
const i18n = new VueI18n({
    locale: lang,
    messages: {
      'zh': require('@/assets/lang/zh').default,
      'zh-TW': require('@/assets/lang/zh-TW').default,
      'zh-HK': require('@/assets/lang/zh-TW').default,
      'vi': require('@/assets/lang/vi').default,
      'en': require('@/assets/lang/en').default
    }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  template: '<App/>',
  components: { App }
})

import "../../assets/css/bootstrap/bootstrap.less";
import "../../assets/css/m_share.less";
