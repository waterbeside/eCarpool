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
  },
  // 免责声明
  {
    path: '/disclaimer',
    name: 'disclaimer',
    component (resolve) {
      require(['../pages/Disclaimer'], resolve)
    },
  },
  // 拼车首页
  {
    path: '/carpool',
    name: 'carpool',
    component (resolve) {
      require(['../pages/Carpool_home'], resolve)
    },
  },

  // 乘客约车需求
  {
    path: '/carpool/requests',
    name: 'carpool_requests',
    component (resolve) {
      require(['../pages/Carpool_requests'], resolve)
    }
  },
  // 墙上空座位
  {
    path: '/carpool/rides',
    name: 'carpool_rides',
    component (resolve) {
      require(['../pages/Carpool_rides'], resolve)
    }
  },
  // 行程细览
  {
    path: '/carpool/requests/detail/:id',
    name: 'carpool_requests_detail',
    component (resolve) {
      require(['../pages/Carpool_detail'], resolve)
    }
  },
  // 行程细览
  {
    path: '/carpool/rides/detail/:id',
    name: 'carpool_rides_detail',
    component (resolve) {
      require(['../pages/Carpool_detail'], resolve)
    }
  },
  // 加行程
  {
    path: '/carpool/addroute/:type',
    name: 'carpool_addroute',
    component (resolve) {
      require(['../pages/Carpool_addroute'], resolve)
    }
  },
  // 选地址
  {
    path: '/carpool/address/:to',
    name: 'carpool_address',
    component (resolve) {
      require(['../pages/Carpool_address'], resolve)
    }
  },
  // 选地址
  {
    path: '/carpool/address/add/:to/:keyword',
    name: 'carpool_address_create',
    component (resolve) {
      require(['../pages/carpool_address_create'], resolve)
    }
  },
  // 我的
  {
    path: '/user',
    name: 'user',
    component (resolve) {
      require(['../pages/User'], resolve)
    }
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
