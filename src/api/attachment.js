import axios from '@/modules/index/utils/cTokenAxios'
import config from '@/config'

export default {
  upload(data,setting){
    return new Promise((resole,reject)=>{
      axios({
        url: config.apiBaseUrl+'/api/v2/attachment',
        method: 'post',
        data,
        ...setting
      }).then(res=>{
        if(res.data.code === 0){
          resole(res.data);
        }else{
          reject(res);
        }
      }).catch(error=>{
        reject(error);
      })
    })
  }
}


