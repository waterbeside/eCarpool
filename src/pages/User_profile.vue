<template>
  <div class="page-view  " id ="Page-user-profile" :class="{isScrollDown:isScrollDown}">
    <title-bar  v-show="isScrollDown">
      <span  >我的资料</span>
    </title-bar>
    <div class="page-view-main"   >
      <cp-goback-btn  v-show="!isScrollDown" ></cp-goback-btn>

      <cp-scroller :enableRefresh="false" :enableInfinite="false" @on-scroll="onScroll">
        <div class="page-view-header" >

          <div class="cp-heading " >
            <cp-avatar :src="avatar"></cp-avatar>
          </div>
        </div>
        <group class="cp-group">
          <group-title class="cp-group-title" slot="title"><i  class="cp-title-icon fa fa-id-card"></i>个人信息</group-title>
          <cell title="姓名"  :is-loading="false" :value="userData.name"></cell>
          <popup-picker title="性别" :data="sexs" v-model="sex"   @on-change="onChangeSex" :display-format="formatSexDisplay"  ></popup-picker>

          <cell title="手机" @click.native="onClick" :is-loading="false" :value="userData.phone" is-link></cell>
        </group>
        <group class="cp-group">
          <cell title="公司" @click.native="onClick" :is-loading="false" :value="company" is-link></cell>
          <cell title="部门" @click.native="onClick" :is-loading="false" :value="userData.Department" is-link></cell>
          <cell title="工号" @click.native="onClick" :is-loading="false" :value="userData.loginname" is-link></cell>
        </group>
        <group  class="cp-group">
          <group-title class="cp-group-title" slot="title"><i  class="cp-title-icon fa fa-car"></i>车辆信息</group-title>
          <cell title="车牌号" class="cp-profile-item"    @click.native="" :is-loading="false" :value="userData.carnumber" is-link></cell>
          <cell title="汽车颜色" class="cp-profile-item"  @click.native="" :is-loading="false" :value="userData.carcolor" is-link></cell>
        </group>
        <group  class="cp-group">
          <group-title class="cp-group-title" slot="title"><i  class="cp-title-icon fa fa-map-marker"></i>常用站点</group-title>
          <cell title="家" class="cp-profile-item"   @click.native="selectAddress('home')" :is-loading="false" :value="userData.home_address" is-link></cell>
          <cell title="公司" class="cp-profile-item"   @click.native="selectAddress('work')" :is-loading="false" :value="userData.company_address" is-link></cell>
        </group>

      </cp-scroller>
    </div>
  </div>
</template>

<script>
import config from '../configs/index'
import cFuns from '../utils/cFuns'

import {GroupTitle,PopupRadio} from 'vux'

import CpRouteCard from '../components/CpRouteCard'
import CpScroller from '../components/CpScroller'
import CpAvatar from '../components/CpAvatar'

export default {
  components: {
    CpScroller,GroupTitle,CpAvatar,PopupRadio
  },
  data () {
    return {
      isScrollDown: false,
      avatar:'',
      userData:'',
      address_home:'',
      address_work:'',
      company:'',


      sex:['0'],
      //性别
      sexs: [[{
        value: '1',
        name: '男'
      }, {
        value: '2',
        name: '女'
      }]],
      formatSexDisplay: function (value, name) {
        return value!=="0" ? name : "选择性别";
      },


    }
  },
  computed : {

  },
  methods :{
    init (){

      this.isScrollDown = false;
      setTimeout(()=>{
        if(typeof(this.$store.state.userData.isFull)!="undefined" && this.$store.state.userData.isFull){
          console.log(this.$store.state.userData);
          this.userData = this.$store.state.userData;
          this.avatar = this.$store.state.userAvatar;
          this.userName = this.$store.state.userData.name;
          this.loginName = this.$store.state.userData.loginname;
          this.sex = [this.userData.sex]
        }else{
          this.loadUserInfo()
        }

      },600)
    },

    /**
      * 加载用户信息
      * @param  string url
      */
     loadUserInfo () {
       var that = this;
       this.$tokenAxios.get(config.urls.getUserInfo,{}).then(res => {

         if(res.data.code === 0) {
           let data = res.data.data;
           data.isFull = true;
           data.avatar = data.imgpath;
           that.$store.commit('setUserData',data);
           if(data.imgpath.trim()!=''){
             that.$store.commit('setUserAvatar',config.avatarBasePath + data.imgpath);
             this.avatar = config.avatarBasePath + data.imgpath;
           }
           this.userData = data;
           this.sex = [this.userData.sex]


         }else{

         }
       })
       .catch(error => {
         console.log(error)
       })
     },
     onScroll(e){
       let sTop = e.target.scrollTop;
       if(sTop > 10){
         this.isScrollDown = true;
       }else{
         this.isScrollDown = false;
       }
     },

     onChangeSex(value){
       this.userData.sex = value[0];
       let data = this.userData;
       this.$store.commit('setUserData',data);
     },

     submitSex(){

     },
     /**
      * 跳到文本更改页
      * @param  {string} field 要更改的字段
      */
     goEdit (field){
       this.$router.push({name:'user_profile_edit',params: {field:field}})
     },
     /**
      * 选择家或公司地址
      * @param  {String} to 'home || work'
      */
     selectAddress (to){
       this.$router.push({name:'carpool_address',params: {to:to}})
     },


  },
  mounted () {
    this.init();
  },
  created () {

    // this.$nextTick(function () {
    //  this.$refs['j-herblist-scrollBox'].addEventListener('scroll', this.listScroll); //监听滚动加载更多
    // })
  },
  activated (){

  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
