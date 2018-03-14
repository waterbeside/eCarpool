<template>
  <div class="page-view-index" id="Page-user-index">
    <div class="page-view-header">
        <div class="cp-heading btn-ripple" @click="$router.push({ name:'user_profile'})"  >
            <cp-avatar :src="avatar"></cp-avatar>
            <div class="cp-txt">
              <h3> {{userName}} </h3>
              <p> {{loginName}} </p>
            </div>
        </div>
      </div>
      <div class="page-view-content"  >
          <div class=" cp-statis-list">
            <statis-item class="cp-statis-item col-xs-4" :num="statis.people" unit="人次" icon="fa fa-male" :duration="1"></statis-item>
            <statis-item class="cp-statis-item col-xs-4" :num="statis.distance" unit="公里" icon="fa fa-map" :duration="1"></statis-item>
            <statis-item class="cp-statis-item col-xs-4" :num="statis.carbon" unit="千克碳" icon="fa fa-leaf" :duration="1"></statis-item>
          </div>
          <ul class="cp-options-list">
            <li><router-link  class="btn btn-ripple" :to="{ name:'user_profile'}"><i class="fa fa-cog"></i>个人信息</router-link></li>
            <li><router-link  class="btn btn-ripple" to="/disclaimer"><i class="fa fa-legal"></i>免责声明</router-link></li>
            <li><router-link  class="btn btn-ripple" to="/downloadapp"><i class="fa fa-download"></i>下载APP</router-link></li>
            <li><a class="btn btn-ripple" href="javascript:void(0);" ><i class="fa fa-sign-out"></i>退出登录</a></li>
          </ul>
      </div>
    <foot-nav-bar current="user"></foot-nav-bar>
  </div>
</template>

<script>
import config from '../configs'
import statisItem from '../components/StatisItem'
import CpAvatar from '../components/CpAvatar'

export default {
  components: {
    statisItem,CpAvatar
  },
  data () {
    return {
      avatar: config.defaultAvatar,
      statis:{
        people:0,
        distance:0,
        carbon:0
      },
      userName:'-',
      loginName:'-'

    }
  },
  methods: {
    /**
      * 加载用户信息
      * @param  string url
      */
     loadUserInfo () {
       var that = this;
       this.$tokenAxios.get(config.urls.getUserInfo,{}).then(res => {

         if(res.data.code === 0) {
           let data = res.data.data;
           data.avatar = data.imgpath;
           that.$store.commit('setUserData',data);
           if(data.imgpath.trim()!=''){
             that.$store.commit('setUserAvatar',config.avatarBasePath + data.imgpath);
             this.avatar = config.avatarBasePath + data.imgpath
           }
           this.userName = data.name;
           this.loginName = data.loginName;
         }else{

         }
       })
       .catch(error => {
         console.log(error)
       })
     },
     /**
    *  取得用户统计数据
    */
   loadUserStatis : function(){
     var that = this;
     this.$tokenAxios.get(config.urls.getUserStatis,{}).then(res => {
       console.log(res)
       let data = res.data.data;
       if(res.data.code === 0) {
         this.statis.people = parseInt(data.total_trips)
         this.statis.distance = parseInt(data.total_distance)
         this.statis.carbon = parseInt(data.total_carbon)
       }
     })
     .catch(error => {
       console.log(error)
     })
   },


  },
  mounted () {
    setTimeout(()=>{
      if(typeof(this.$store.state.userData.name)!="undefined"){
        this.avatar = this.$store.state.userAvatar;
        this.userName = this.$store.state.userData.name;
        this.loginName = this.$store.state.userData.loginname;
      }else{
        this.loadUserInfo()
      }

      this.loadUserStatis()
    },600)

  },
  activated (){
    // this.loadUserInfo()
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
