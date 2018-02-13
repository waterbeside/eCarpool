
/* 内存数据状态 */
export default {
  // 正在加载中
  loading: {
    isShow:false,
    text:"加载中"
  },

  //当前城市
  localCity : null,

  // 操作是否是刷新页面，刷新初始没有nim实例，会导致时序问题
  isRefresh: true,
  // 全屏显示的原图
  isFullscreenImgShow: false,
  fullscreenImgSrc: "",
  // 切页动画 forward，backward
  transitionName: 'forward',

  //用户基本信息
  // userBaseData:{},
  //用户详细信息
  userData:{},
  //用户完整头像地址
  userAvatar:'',
  //发布行程时填写的表单内容
  routeFormData:{},

}
/*GB_VAR['userBaseInfo'] = '';
  GB_VAR['webim_access_token'] = '';
  GB_VAR['jumpTo'] = '';
  GB_VAR['doMenthods'] = '';
  GB_VAR['addRoute_datas'] = {};
  GB_VAR['seat_picker'] = '';
  GB_VAR['dt_picker']='';
  GB_VAR['user_info'] = '';
  GB_VAR['userAvatar'] = '';
  GB_VAR['flags'] = {};
  GB_VAR['temp'] = {};
  GB_VAR['local_position'] = '';
  GB_VAR['local_city'] = {};*/
