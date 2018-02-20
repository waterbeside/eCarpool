import axios from 'axios'
import config from '../configs'
import qs from 'qs'
const tokenAxios = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 10000,
  transformRequest: [function (data) {
    // data = Qs.stringify(data);
    return data;
  }],

})
//POST传参序列化(添加请求拦截器)
tokenAxios.interceptors.request.use(config => {
  // config.headers['Content-Type'] = 'application/json;charset=UTF-8';
  // 在发送请求之前做某件事
   if(config.method  === 'post'){
     config.data = qs.stringify(config.data);

    /*  // JSON 转换为 FormData
      const formData = new FormData()
      Object.keys(config.data).forEach(function(value,key,arr){
        if(typeof(config.data[value])=="object"){
          Object.keys(config.data[value]).forEach(function(v,k,a){
            formData.append(value+'['+v+']', config.data[value][v])
          })
        }else{
          formData.append(value, config.data[value])
        }

      })
      config.data = formData
      */
   }

   // config.headers['X-Requested-With'] = 'XMLHttpRequest'
   // config.withCredentials = false
  // 下面会说在什么时候存储 token
  if (localStorage.getItem('CP_U_TOKEN')) {
      config.headers.Authorization = 'Bearer ' + localStorage.getItem('CP_U_TOKEN')
  }
  return config
},error =>{
    alert("错误的传参", 'fail')
    return Promise.reject(error)
})

//返回状态判断(添加响应拦截器)
tokenAxios.interceptors.response.use(res =>{

   /*console.log(res)
   //对响应数据做些事
    if(res.data.code !=200){
      // console.log(res)
       // alert(res.error_msg)
       return Promise.reject(res)
    }*/
    return res
}, error => {
    if(error.response.status === 401) {
      // 401 说明 token 验证失败
      // 可以直接跳转到登录页面，重新登录获取 token
      location.href = '/login'
    } else {
       // do something
    }
    // 返回 response 里的错误信息
    return Promise.reject(error.response.data)
})

// export default tokenAxios;
export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, '$tokenAxios', { value: tokenAxios })
  }
}
