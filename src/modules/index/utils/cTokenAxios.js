import Vue from 'vue'
import router from '../router'
import {ToastPlugin} from 'vux'

import axios from '@/utils/axios'
import config from '../config'



var t = {message:[]};
var lang = "zh";

function getLanguage(){
  let  lang_temp = localStorage.getItem('language');
  lang_temp = lang_temp ?  lang_temp : localStorage.getItem('lang');
  lang_temp = lang_temp ?  lang_temp : localStorage.getItem('lag');
  lang = lang_temp ? lang_temp : 'zh';
  return lang;
}

function getLanguageFile(){
  var langPathArray = {
    'zh' : true,
    'vi' : true,
    'en' : true,
  }
  if(lang && typeof(langPathArray[lang])!="undefined" && langPathArray[lang]){
    t =  require('@/assets/lang/'+lang).default;
  }
  return t;
}



const tokenAxios = axios;

//POST传参序列化(添加请求拦截器)
tokenAxios.interceptors.request.use(config => {
  return config
},error =>{
    getLanguage();
    getLanguageFile();
    Vue.$vux.toast.text(t.message['networkFail']);
    return Promise.reject(error)
})

//返回状态判断(添加响应拦截器)
tokenAxios.interceptors.response.use(res =>{
  getLanguage();
  getLanguageFile();
  if(res.status!==200){
    Vue.$vux.toast.text(t.message['networkFail']);
    return Promise.reject(res)
  }
  if(res.status === 401) {

  } else {
     // do something
  }
  // console.log(res)
  //对响应数据做些事
  if(res.data.code !==0){
    switch (res.data.code) {
      case 10004:
          // console.log(10004)
          if(router.history.current.name!='login'){
            Vue.$vux.toast.text(t.message['user.login.pleaselogin']);
            router.push({ name: 'login'});
          }
        break;
      default:
    }
  }
  return res;
}, error => {
  Vue.$vux.toast.text(t.message['networkFail']);
  // 返回 response 里的错误信息
  return Promise.reject(error)
})

export default tokenAxios;
// export default {
//   install(Vue) {
//     Object.defineProperty(Vue.prototype, '$tokenAxios', { value: tokenAxios })
//   }
// }
