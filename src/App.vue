<template>
  <div class="cp-all">
    <div id="app">
      <transition :name="transitionName">
        <keep-alive>
          <router-view/>
        </keep-alive>
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
      }

      this.transitionName = toDepth < fromDepth ? 'backward' : toDepth == fromDepth ? '' :'forward'
    }
  },
  methods :{
    init () {
      const that = this ;
      this.$tokenAxios.get(config.urls.checkLogin,{}).then(res => {
        // console.log(res)
         // 登录成功
          if(res.data.code === 0 ) {
            let userDatas = res.data.data;
            userDatas.loginname = userDatas.loginname.toLowerCase()
            that.$store.commit('setUserBaseData',userDatas);
            // console.log(config.avatarBasePath + userDatas.avatar)
            if(userDatas.avatar.trim()!=''){
              that.$store.commit('setUserAvatar',config.avatarBasePath + userDatas.avatar);
            }
          }else{
            that.$router.push({ name: 'login'})
          }
        })
        .catch(error => {

        })
          /*.then(function(res){
          console.log(res)
          if(response.data.code==200){

          }
        }, function(error){

        })*/
    },
  },
  mounted () {
    this.init()
  },
  activated () {}
}
</script>
