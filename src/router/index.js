import Vue from 'vue'
import VueRouter from 'vue-router'

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
    path: '/carpool/myroute',
    name: 'carpool_myroute',
    component (resolve) {
      require(['../pages/Carpool_myroute'], resolve)
    },
    meta: {keepAlive: true }
  },
  // 行程细览
  {
    path: '/carpool/requests/detail/:id',
    name: 'carpool_requests_detail',
    component (resolve) {
      require(['../pages/Carpool_detail'], resolve)
    },
    meta: {keepAlive: false }
  },
  // 行程细览
  {
    path: '/carpool/rides/detail/:id',
    name: 'carpool_rides_detail',
    component (resolve) {
      require(['../pages/Carpool_detail'], resolve)
    },
    meta: {keepAlive: false }
  },
  // 评论
  {
    path: '/carpool/rides/comments/:id',
    name: 'carpool_rides_comments',
    component (resolve) {
      require(['../pages/carpool_rides_comments'], resolve)
    },
    meta: {keepAlive: false }
  },
  // 加行程
  {
    path: '/carpool/addroute/:type',
    name: 'carpool_addroute',
    component (resolve) {
      require(['../pages/Carpool_addroute'], resolve)
    },
    meta: {keepAlive: false }
  },
  // 历史行程
  {
    path: '/carpool/addroute/history/:type',
    name: 'carpool_addroute_history',
    component (resolve) {
      require(['../pages/carpool_addroute_history'], resolve)
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
      require(['../pages/carpool_address_create'], resolve)
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

]

let router = new VueRouter({
  history: true,
  routes,
  mode: 'hash',
	strict: process.env.NODE_ENV !== 'production',
	scrollBehavior (to, from, savedPosition) {
	    if (savedPosition) {
		    return savedPosition
		} else {
			if (from.meta.keepAlive) {
				from.meta.savedPosition = document.body.scrollTop;
			}
		    return { x: 0, y: to.meta.savedPosition || 0 }
		}
	}
})


export default router
