
/* 内存数据状态 */
export default {

  //要从首页跳转去的页面
  jumpTo: {},

  // 正在加载中
  loading: {
    isShow:false,
    text:"Loading"
  },

  //是否刷新拼车页面
  isRefreshCarpoolList: true,

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
  tripFormData:{},

  //预存地址
  addressDefaultList:null,


}
