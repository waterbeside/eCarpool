import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
Vue.use(VueRouter)




// 定义路由
// 每个路由应该映射一个组件。 其中"component"是一个组件配置对象。
const routes = [
  // 设置聊天列表页面为首页
  {
    path: '/',
    redirect: {
      name: 'carpool'
    }
  },
  // 登入页
  {
    path: '/login',
    name: 'login',
    component (resolve) {
      require(['../pages/Login'], resolve)
    },
    meta: {keepAlive: true }
  },
  // 免责声明
  {
    path: '/disclaimer',
    name: 'disclaimer',
    component (resolve) {
      require(['../pages/Disclaimer'], resolve)
    },
    meta: {keepAlive: true }
  },
  // 拼车首页
  {
    path: '/carpool',
    name: 'carpool',
    component (resolve) {
      require(['../pages/Carpool_home'], resolve)
    },
    meta: {keepAlive: true }
  },

  // 乘客约车需求
  {
    path: '/carpool/requests',
    name: 'carpool_requests',
    component (resolve) {
      require(['../pages/Carpool_requests'], resolve)
    },
    meta: {keepAlive: true }
  },
  // 墙上空座位
  {
    path: '/carpool/rides',
    name: 'carpool_rides',
    component (resolve) {
      require(['../pages/Carpool_rides'], resolve)
    },
    meta: {keepAlive: true }
  },
  // 我的行程
  {
    path: '/carpool/mytrip',
    name: 'carpool_mytrip',
    component (resolve) {
      require(['../pages/Carpool_mytrip'], resolve)
    },
    meta: {keepAlive: true }
  },
  // 行程细览
  {
    path: '/carpool/requests/:id',
    name: 'carpool_requests_detail',
    component (resolve) {
      require(['../pages/Carpool_detail'], resolve)
    },
    meta: {keepAlive: true }
  },
  // 行程细览
  {
    path: '/carpool/rides/:id',
    name: 'carpool_rides_detail',
    component (resolve) {
      require(['../pages/Carpool_detail'], resolve)
    },
    meta: {keepAlive: true }
  },
  //用户位置
  {
    path: '/carpool/position/:uid',
    name: 'carpool_position',
    component (resolve) {
      require(['../pages/carpool_position'], resolve)
    },
    meta: {keepAlive: false }
  },
  //用户位置
  {
    path: '/carpool/position/:uid/:infoid',
    name: 'carpool_position',
    component (resolve) {
      require(['../pages/carpool_position'], resolve)
    },
    meta: {keepAlive: false }
  },
  // 评论
  {
    path: '/carpool/rides/:id/comments',
    name: 'carpool_rides_comments',
    component (resolve) {
      require(['../pages/carpool_rides_comments'], resolve)
    },
    meta: {keepAlive: false }
  },
  // 加行程
  {
    path: '/carpool/addtrip/:type',
    name: 'carpool_addtrip',
    component (resolve) {
      require(['../pages/Carpool_addtrip'], resolve)
    },
    meta: {keepAlive: false }
  },
  // 历史行程
  {
    path: '/carpool/addtrip/history/:type',
    name: 'carpool_addtrip_history',
    component (resolve) {
      require(['../pages/Carpool_addtrip_history'], resolve)
    },
    meta: {keepAlive: true }
  },
  // 选地址
  {
    path: '/carpool/address/:to',
    name: 'carpool_address',
    component (resolve) {
      require(['../pages/Carpool_address'], resolve)
    },
    meta: {keepAlive: true }
  },
  // 加地址
  {
    path: '/carpool/address/add/:to/:keyword',
    name: 'carpool_address_create',
    component (resolve) {
      require(['../pages/Carpool_address_create'], resolve)
    },
    meta: {keepAlive: false }
  },
  // 我的
  {
    path: '/user',
    name: 'user',
    component (resolve) {
      require(['../pages/User'], resolve)
    },
    meta: {keepAlive: true }

  },
  // 个人资料修改
  {
    path: '/user/profile',
    name: 'user_profile',
    component (resolve) {
      require(['../pages/User_profile'], resolve)
    },
    meta: {keepAlive: true }

  },

  // 个人资料修改
  {
    path: '/user/profile/edit/:field',
    name: 'user_profile_edit',
    component (resolve) {
      require(['../pages/user_profile_edit'], resolve)
    },
    meta: {keepAlive: true }
  },

  // 个人资料修改
  {
    path: '/user/profile/departments',
    name: 'user_profile_departments',
    component (resolve) {
      require(['../pages/user_profile_departments'], resolve)
    },
    meta: {keepAlive: true }
  },

  // 重新绑定手机
  {
    path: '/user/profile/phone',
    name: 'user_profile_phone',
    component (resolve) {
      require(['../pages/user_profile_phone'], resolve)
    },
    meta: {keepAlive: true }
  },
  // 重置密码
  {
    path: '/user/profile/password',
    name: 'user_profile_password',
    component (resolve) {
      require(['../pages/user_profile_password'], resolve)
    },
    meta: {keepAlive: false }
  },
  // 上传头像
  {
    path: '/user/profile/avatar',
    name: 'user_profile_avatar',
    component (resolve) {
      require(['../pages/user_profile_avatar'], resolve)
    },
    meta: {keepAlive: false }
  },

  // 下载app页
  {
    path: '/downloadapp',
    name: 'downloadapp',
    component (resolve) {
      require(['../pages/downloadapp'], resolve)
    },
    meta: {keepAlive: true }
  },

]

let router = new VueRouter({
  history: true,
  routes,
  mode: 'hash',
	strict: process.env.NODE_ENV !== 'production',
	/*scrollBehavior (to, from, savedPosition) {
    // console.log(savedPosition);
	  if (savedPosition) {
		    return savedPosition
		} else {
			if (from.meta.keepAlive) {
        // console.log(document.querySelector(".cp-scroll"));
				// from.meta.savedPosition = document.querySelector(".cp-scroll").scrollTop;
			}
		  return { x: 0, y: to.meta.savedPosition || 0 }
		}
	}*/
})

router.beforeEach((to, from, next) => {
  store.commit('setLoading',{isShow:true});
  next()
})
router.afterEach((to, from, next) => {
  store.commit('setLoading',{isShow:false});
})

export default router
