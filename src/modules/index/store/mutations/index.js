// 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
// this.$store.commit(method, params)

import store from '../'
import cookie from '@/utils/cookie'

import config from '@/config'

export default {
  //设置用户详细数据
  setJumpTo(state,datas){
    state.jumpTo = datas;
  },

  //设置是否刷新拼车页面
  setIsRefreshCarpoolList(state,datas){
    state.isRefreshCarpoolList = datas;
  },

  //设置是否刷新拼车页面
  setUnRefreshCarpoolDetail(state,datas){
    state.unRefreshCarpoolDetail = datas;
  },
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
      text:"Loading"
    }
    var obj = Object.assign(defaults, datas);
    state.loading = obj ;
  },

  setTripFormData(state,datas){
    state.tripFormData = datas ? datas : {}
  },

  //设置预存地址
  setAddressDefaultList(state,datas){
    state.addressDefaultList = datas ? datas : null
  },


  setCarpoolDetailScrollTop(state,datas){
    state.carpoolDetailScrollTop = datas ? datas : 0
  },

  setCarpoolListScrollTop(state,datas){
    state.carpoolListScrollTop = datas ? datas : 0
  },

  setCarpoolInfoDetail(state,datas){
    state.carpoolInfoDetail = datas ? datas : null
  },

  setCarpoolWallDetail(state,datas){
    state.carpoolWallDetail = datas ? datas : null
  },




}
