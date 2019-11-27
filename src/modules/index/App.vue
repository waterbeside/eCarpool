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
      this.$store.dispatch('getUserInfo').then(data=>{
        console.log('Get user data successful')
      }).catch(error=>{
        console.log(error)
        this.$router.push({ name: 'login'})
      })
    },
  },
  mounted () {
    this.init()
    cCoord().push().catch(err=>{console.log(err)}); // 上传用户坐标。

    /*setTimeout(()=>{
      this.init();
    },100)*/
  },
  created () {


  },
  activated () {}
}
</script>
