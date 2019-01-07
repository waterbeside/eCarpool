let avatarPic = require('../assets/images/avatar.png');

let baseDomain = '';
let baseUrl = ""
let baseUrl_8080 = baseDomain+':8080'
let baseUrl_8082 = baseDomain

let isGridMapForeign = false; //是否启用海外地图
let aMapKey    =  isGridMapForeign ?  '' : '';//高德地图API之KEY。
let gMapKey   =  "";
let config = {
  appScheme           : "io.ultrarich.carpool", //用于启动app的scheme
  baseDomain          : baseDomain ,
  isGridMapForeign    : isGridMapForeign,
  aMapKey             : aMapKey,
  gMapKey             : gMapKey,
  avatarBasePath      : baseDomain+'/carpool/images/users/', //头像公共路徑
  defaultAvatar       :  avatarPic, //默认头像
  urls         : {
    uploadAvatar      : baseUrl_8080+'/uploadfile/image',   // 传头像API
    getUserStatis     : baseUrl + '/carpool/user/get_user_statis', //取得用户拼车统计数据
    likeTrip          : baseUrl + '/carpool/wall/like', //点赞行程
    editProfileAdress : baseUrl + '/carpool/user/change_address', // 修改个人资料的公司和家地址
    getCompanys       : baseUrl + '/carpool/assist/get_companys', //取得公司列表
    getDepartments    : baseUrl + '/carpool/assist/get_departments', //取得部门列表
    getTripDetail     : baseUrl + '/carpool/assist/get_trip_detail',  //取得行呈现详情（免token）
    /** rest 接口 **/
    passport          : baseUrl_8082 + '/api/v1/passport', // 通行证，post登入，delete登出, get验证。
    sms               : baseUrl_8082 + '/api/v1/sms', // 发送短信接口
    trips             : baseUrl_8082 + '/api/v1/trips', // 行程相关接口 (我和行程)
    address           : baseUrl_8082 + '/api/v1/address', // 地址相关
    docs              : baseUrl_8082 + '/api/v1/docs', //文档相关
    user              : baseUrl_8082 + '/api/v1/user', //用户相关
  }
}
config = Object.assign({}, config)

export default config
