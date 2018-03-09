<template>
  <div class="cp-all">
    <div id="app">
      <transition :name="transitionName">
        <template v-if="$route.meta.keepAlive">
          <keep-alive>
              <router-view ></router-view>
          </keep-alive>
        </template>
        <template v-else>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </template>
      </transition>
      <loading :show="isLoading" :text="loadingText"></loading>
    </div>
  </div>
</template>

<script>
const sessionHistory = window.sessionStorage
import config from './configs/index'
export default {
  name: 'app',
  data () {
    return {
      transitionName: '',
    }
  },
  computed: {
      isLoading () {
        return this.$store.state.loading.isShow
      },
      loadingText () {
        return this.$store.state.loading.text
      }
    },

  watch: {
    // 更新页面所在位置，用于判断是前进页还是后退页
    /*'$route' (to, from) {
      if (to && from) {
        let toPath = to.path
        let fromPath = from.path

        let count = parseInt(sessionHistory.getItem('count'))

        // 如果是导航页或者没有初始记录
        if (Number.isNaN(count)) {
          count = 1
          this.transitionName = ''
        } else {
          count += 1
          let fromCount = parseInt(sessionHistory.getItem(fromPath))
          let toCount = parseInt(sessionHistory.getItem(toPath))
          if (toCount < fromCount && fromCount < count ) {
            this.transitionName = 'backward'
            count = toCount
          } else {
            this.transitionName = 'forward'
          }
          if(toPath=="/"){
            this.transitionName = 'backward'
          }
          // if (pageUtil.showNav(toPath)) {
          //   count = 1
          // }
        }

        sessionHistory.setItem(toPath, count)
        sessionHistory.setItem('count', count)
      }
    }*/
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      if(to.path=="/"){
        this.transitionName = 'backward'
        return;
      }
      if(from.name == 'carpool_rides_detail' && to.name=="carpool_rides_comments"){
        this.$route.meta.keepAlive = true;
        console.log(1)
      }
      if(to.name == 'carpool_rides_detail' || to.name == 'carpool_requests_detail' || from.name== 'carpool_rides_detail' || from.name== 'carpool_requests_detail' ){
        this.transitionName = 'fade'
        return;
      }

      this.transitionName = toDepth < fromDepth ? 'backward' : toDepth == fromDepth ? '' :'forward'
    }
  },
  methods :{
    init () {
      const _this = this ;
      if(this.$router.history.current.name=='login'){
        return false;
      }
      this.$tokenAxios.get(config.urls.checkLogin,{params:{more:1}}).then(res => {
        // console.log(res)
         // 登录成功
          if(res.data.code === 0 ) {
            let userDatas = res.data.data;
            userDatas.loginname = userDatas.loginname.toLowerCase()
            localStorage.setItem('CP_loginname',userDatas.loginname);
            // _this.$store.commit('setUserBaseData',userDatas);
            _this.$store.commit('setUserData',userDatas);
            // console.log(config.avatarBasePath + userDatas.avatar)
            if(userDatas.avatar.trim()!=''){
              _this.$store.commit('setUserAvatar',config.avatarBasePath + userDatas.avatar);
            }
          }else{
            _this.$router.push({ name: 'login'})
          }
        })
        .catch(error => {

        })
    },
  },
  mounted () {
  },
  created () {
    let _this = this;
    setTimeout(function(){
      _this.init();
    },500)

  },
  activated () {}
}
</script>
