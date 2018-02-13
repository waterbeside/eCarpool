// 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
// this.$store.commit(method, params)

import store from '../'
import cookie from '../../utils/cookie'

import config from '../../configs'

export default {

  //设置用户基础数据
/*  setUserBaseData(state,datas){
    state.userBaseData = datas;
  },*/
  //设置用户详细数据
  setUserData(state,datas){
    state.userData = datas;
  },
  //设置用户头像
  setUserAvatar(state,datas){
    state.userAvatar = datas ? datas : config.defaultAvatar
  },

  //设置本地城市
  setLocalCity(state,datas){
    state.localCity = datas ? datas : {}
  },

  //设置 loading
  setLoading(state,datas){
    let defaults = {
      isShow:false,
      text:"加载中"
    }
    var obj = Object.assign(defaults, datas);
    state.loading = obj ;
  },

  setRouteFormData(state,datas){
    state.routeFormData = datas ? datas : {}
  },

}
