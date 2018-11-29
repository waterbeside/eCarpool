<template>
  <div class="cp-all">
    <div id="app">
      <transition :name="transitionName">
        <template v-if="$route.meta.keepAlive">
          <keep-alive>
              <router-view ></router-view>
          </keep-alive>
        </template>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </transition>
      <loading :show="isLoading" :text="loadingText"></loading>
    </div>
  </div>
</template>

<script>
const sessionHistory = window.sessionStorage
import config from './config'
import cCoord from '@/utils/cCoord'

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
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length

      return ;
      /*if(to.path=="/"){
        this.transitionName = 'backward'
        return;
      }
      if(to.name == 'carpool_rides_detail' || to.name == 'carpool_requests_detail' || from.name== 'carpool_rides_detail' || from.name== 'carpool_requests_detail' ){
        this.transitionName = 'fade';
        return;
      }
      this.transitionName = toDepth < fromDepth ? 'backward' : toDepth == fromDepth ? '' :'forward'; */
    }
  },
  methods :{
    init () {
      if(this.$router.history.current.name=='login'){
        return false;
      }

      // this.$tokenAxios.get(config.urls.checkLogin,{params:{more:1}}).then(res => {
      this.$http.get(config.urls.passport,{params:{type:1}}).then(res => {
         // 登录成功
          if(res.data.code === 0 ) {
            let userDatas = res.data.data;
            userDatas.loginname = userDatas.loginname.toLowerCase()
            localStorage.setItem('CP_loginname',userDatas.loginname);
            // _this.$store.commit('setUserBaseData',userDatas);
            this.$store.commit('setUserData',userDatas);
            // console.log(config.avatarBasePath + userDatas.avatar)
            if(userDatas.avatar.trim()!=''){
              this.$store.commit('setUserAvatar',config.avatarBasePath + userDatas.avatar);
            }
          }else{
            this.$router.push({ name: 'login'})
          }
        })
        .catch(error => {

        })
    },
  },
  mounted () {
    this.init()
    cCoord().push(); // 上传用户坐标。

    /*setTimeout(()=>{
      this.init();
    },100)*/
  },
  created () {


  },
  activated () {}
}
</script>
