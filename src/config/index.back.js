let avatarPic = require('../assets/images/avatar.png');

let baseDomain = '';
let baseUrl = ""
let baseUrl_8080 = baseDomain+':8080'
let baseUrl_8082 = baseDomain

let isOverSeas = false; //是否启用海外地图
let aMapKey    =  isOverSeas ?  '' : '';//高德地图API之KEY。

let config = {
  appScheme       : "", //用于启动app的scheme
  baseDomain      : baseDomain ,
  isOverSeas      : isOverSeas,
  aMapKey         : aMapKey,
  avatarBasePath  : baseDomain+'/carpool/images/users/', //头像公共路徑
  defaultAvatar   :  avatarPic, //默认头像
  urls            : {
    aMapScript        : 'http://webapi.amap.com/maps?v=1.4.0&key='+aMapKey, //高德地图api
    uploadAvatar      : baseUrl_8080+'/uploadfile/image',   // 传头像API
    // uploadAvatar      : 'http://localhost:8080/uploadfile/image',   // 传头像API

    getUserInfo       : baseUrl + '/carpool/user/get_user', //取得用户信息
    getUserStatis     : baseUrl + '/carpool/user/get_user_statis', //取得用户拼车统计数据
    getInfoLists      : baseUrl + '/carpool/info/get_lists', //取得需求列表
    getWallLists      : baseUrl + '/carpool/wall/get_lists', //取空座位求列表
    getAddress        : baseUrl + '/carpool/publics/get_address', //取得地址列表
    getMyAddress      : baseUrl + '/carpool/address/get_myaddress', //取得我的地址
    /*addInfo         : baseDomain + 'carpool/info/add', //发布需求
    addWall           : baseDomain + 'carpool/wall/add', //发布空座位*/
    getOfentTrips     : baseUrl + '/carpool/mytrip/get_ofent_trips', //取得常用行程
    getMytrip         : baseUrl + '/carpool/mytrip/index', //取得我的行程列表
    addTrip           : baseUrl + '/carpool/mytrip/add', //发布行呈现
    cancelTrip        : baseUrl + '/carpool/mytrip/cancel', //取消行程
    finishTrip        : baseUrl + '/carpool/mytrip/finish', //完结行程
    likeTrip          : baseUrl + '/carpool/wall/like', //点赞行程
    acceptRequest     : baseUrl + '/carpool/info/accept_demand', //接受需求
    riding            : baseUrl + '/carpool/info/riding', //乘车
    getRequestDetail  : baseUrl + '/carpool/info/detail', // 取得约车需求位详细信息
    getRideDetail     : baseUrl + '/carpool/wall/detail', // 取得空座位详细信息
    getRidePassengers : baseUrl + '/carpool/info/get_passengers', // 取得空座位乘客
    editProfile       : baseUrl + '/carpool/user/change_profile', // 修改个人资料
    editProfileAdress : baseUrl + '/carpool/user/change_address', // 修改个人资料的公司和家地址
    checkLogin        : baseUrl + '/carpool/index/check_login', // 验证登入状态
    login             : baseUrl + '/carpool/publics/login', // 登入
    logout            : baseUrl + '/carpool/publics/logout', // 登出
    createAddress     : baseUrl + '/carpool/address/add', // 创建站点
    wallComments      : baseUrl + '/carpool/comment/wall', //取得空座位评论列表

    getCompanys       : baseUrl + '/carpool/assist/get_companys', //取得公司列表
    getDepartments    : baseUrl + '/carpool/assist/get_departments', //取得部门列表
    getDisclaimer     : baseUrl + '/carpool/assist/get_disclaimer', //免责声明

    sendSms           : baseUrl + '/carpool/service/send_code', //发送短信
    checkSmsCode      : baseUrl + '/carpool/service/check_code', //发送短信

    getTripDetail     : baseUrl + '/carpool/assist/get_trip_detail',  //取得行呈现详情（免token）

    /** rest 接口 **/
    passport          : baseUrl_8082 + '/api/v1/passport', // 通行证，post登入，delete登出, get验证。
    sms               : baseUrl_8082 + '/api/v1/sms', // 发送短信接口

    //文档相关
    docs :  baseUrl_8082 + '/api/v1/docs', //
  }
}

config = Object.assign({}, config)

export default config
