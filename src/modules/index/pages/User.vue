<template>
  <div class="page-view-index" id="Page-user-index">
    <div class="page-view-header">
        <div class="cp-heading btn-ripple" @click="$router.push({ name:'user_profile_avatar'})"  >
            <cp-avatar :src="avatar"></cp-avatar>
            <div class="cp-txt">
              <h3> {{userName}} </h3>
              <p> {{loginName}} </p>
            </div>
        </div>
      </div>
      <div class="page-view-content" style="margin-bottom:80px;" >
          <div class=" cp-statis-list">
            <statis-item class="cp-statis-item col-xs-4" :num="statis.people" :unit="$t('message.personTime')" icon="fa fa-male" :duration="1"></statis-item>
            <statis-item class="cp-statis-item col-xs-4" :num="statis.distance" :unit="$t('message.kilometre')" icon="fa fa-map" :duration="1"></statis-item>
            <statis-item class="cp-statis-item col-xs-4" :num="statis.carbon" :unit="$t('message.kilogramsCarbon')" icon="fa fa-leaf" :duration="1"></statis-item>
          </div>
          <ul class="cp-options-list">
            <li><router-link  class="btn btn-ripple" :to="{ name:'user_profile'}"><i class="fa fa-cog"></i> {{ $t("message['user.profile.title']" )}} </router-link></li>
            <li><router-link  class="btn btn-ripple" :to="{ name:'user_profile_password'}"><i class="fa fa-key"></i> {{ $t("message['user.profile.label.modifypassword']" )}} </router-link></li>
            <li><router-link  class="btn btn-ripple" to="/disclaimer"><i class="fa fa-legal"></i>{{ $t("message['disclaimer']" )}} </router-link></li>
            <li class="cp-selectbtn-wrap ">
              <popup-picker class="cp-selectbtn"    v-model="language" :data="languages"   @on-change="onChangeLang" :display-format="formatLangDisplay"
              :cancelText="$t('message.cancel')"
              :confirmText="$t('message.done')">
                <template slot="title" slot-scope="props">
                  <span class="cp-label">
                    <i class="fa fa-language"></i><span class="cp-title" style="vertical-align:middle;">{{$t("message.languages")}}</span>
                  </span>
                </template>
              </popup-picker>
            </li>

            <li><router-link  class="btn btn-ripple" to="/downloadapp"><i class="fa fa-download"></i>{{ $t("message['about.downloadEntrance']" )}}</router-link></li>
            <li><a class="btn btn-ripple" @click="logout" ><i class="fa fa-sign-out"></i>{{ $t("message['logout']" )}}</a></li>
          </ul>
      </div>

    <cp-foot-nav-bar current="user"></cp-foot-nav-bar>
  </div>
</template>

<script>
import cFuns from '@/utils/cFuns';
import config from '../config'
import CpFootNavBar from '../components/CpFootNavBar'
import StatisItem from '@/components/StatisItem'
import CpAvatar from '@/components/CpAvatar'
import {PopupRadio} from 'vux'

export default {
  components: {
    StatisItem,CpAvatar,CpFootNavBar,PopupRadio
  },
  data () {
    return {
      avatar: config.defaultAvatar,
      language :["en"],
      languages: [[{
        name: 'ENGILSH',
        value: 'en',
      }, {
        name: '中文',
        value: "zh",
      },
      {
       name: 'Việt Nam',
       value: "vi",
     }]],
      formatLangDisplay:  (value, name)=> {
        let returnName = '';
        return name ? name : value
      },
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
       this.$http.get(config.urls.getUserInfo,{}).then(res => {

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
     this.$http.get(config.urls.getUserStatis,{}).then(res => {
       // console.log(res)
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

   /**
    * [avatar description]
    * @type {[type]}
    */
   logout (){

     this.$vux.confirm.show({
       title  : this.$t("message.AreYouSure"),
       content: this.$t("message.isLogout"),
       confirmText: this.$t("message.sure"),
       cancelText: this.$t("message.cancel"),
       onConfirm: ()=>{
         let uid = localStorage.getItem('CP_uid');
         this.$http.delete(config.urls.passport).then(res => { });
         // this.$http.get(config.urls.logout).then(res => { });

         window.localStorage.removeItem('CP_U_TOKEN');
         window.localStorage.removeItem('CP_uid');
         window.localStorage.removeItem('CP_'+uid+'_');
         this.$store.commit("setUserData",null);
         this.$store.commit("setUserAvatar",null);
         this.$router.push({"name":"login"});

       }
     })
   },

   onChangeLang (){
    localStorage.setItem('language',this.language[0]);
    this.$i18n.locale= cFuns.formartLanguage(this.language[0]);
   }
  },
  mounted () {


  },
  activated (){
    this.language = [cFuns.formartLanguage(cFuns.getLanguage())];
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
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
