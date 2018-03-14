let avatarPic = require('../assets/images/avatar.png');
let baseDomain = ''
let aMapKey    = ''
let config = {
  baseDomain    : baseDomain ,
  aMapKey       : aMapKey, //高德地图API之KEY。
  avatarBasePath    : '', //头像公共路徑
  defaultAvatar :  avatarPic, //默认头像
  urls          : {
    aMapScript        : 'http://webapi.amap.com/maps?v=1.4.0&key='+aMapKey, //高德地图api
    uploadAvatar      : '',   // 传头像API
    getUserInfo       : baseDomain + 'carpool/user/get_user', //取得用户信息
    getUserStatis     : baseDomain + 'carpool/user/get_user_statis', //取得用户拼车统计数据
    getInfoLists      : baseDomain + 'carpool/info/get_lists', //取得需求列表
    getWallLists      : baseDomain + 'carpool/wall/get_lists', //取空座位求列表
    getAddress        : baseDomain + 'carpool/publics/get_address', //取得地址列表
    getMyAddress      : baseDomain + 'carpool/address/get_myaddress', //取得我的地址
    /*addInfo         : baseDomain + 'carpool/info/add', //发布需求
    addWall           : baseDomain + 'carpool/wall/add', //发布空座位*/
    getOfentTrips     : baseDomain + 'carpool/myroute/get_ofent_trips', //取得常用行程
    getMyroute        : baseDomain + 'carpool/myroute/myroute', //取得我的行程列表
    addRoute          : baseDomain + 'carpool/myroute/add', //发布行呈现
    cancelRoute       : baseDomain + 'carpool/myroute/cancel_route', //取消行程
    finishRoute       : baseDomain + 'carpool/myroute/finish_route', //完结行程
    likeRoute         : baseDomain + 'carpool/wall/like', //点赞行程
    acceptRequest     : baseDomain + 'carpool/info/accept_demand', //接受需求
    riding            : baseDomain + 'carpool/info/riding', //乘车
    getRequestDetail  : baseDomain + 'carpool/info/get_view', // 取得约车需求位详细信息
    getRideDetail     : baseDomain + 'carpool/wall/get_view', // 取得空座位详细信息
    getRidePassengers : baseDomain + 'carpool/info/get_passengers', // 取得空座位乘客
    editProfile       : baseDomain + 'carpool/user/change_profile', // 修改个人资料
    editProfileAdress : baseDomain + 'carpool/user/change_address', // 修改个人资料的公司和家地址
    checkLogin        : baseDomain + 'carpool/index/check_login', // 验证登入状态
    login             : baseDomain + 'carpool/publics/login', // 登入
    logout            : baseDomain + 'carpool/publics/logout', // 登出
    createAddress     : baseDomain + 'carpool/address/add', // 创建站点
    wallComments      : baseDomain + 'carpool/comment/wall', //取得空座位评论列表

    getCompanys       : baseDomain + 'carpool/assist/get_companys', //取得公司列表
    getDepartments       : baseDomain + 'carpool/assist/get_departments', //取得部门列表
    getDisclaimer     : baseDomain + 'carpool/assist/get_disclaimer', //免责声明
  }
}

config = Object.assign({}, config)

export default config
