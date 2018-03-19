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
            <cp-avatar :src="avatar" @click.native="$router.push({ name:'user_profile_avatar'})" ></cp-avatar>
          </div>
        </div>
        <group class="cp-group">
          <group-title class="cp-group-title" slot="title"><i  class="cp-title-icon fa fa-id-card"></i>个人信息</group-title>
          <cell title="姓名" @click.native="goEdit('name')" :is-loading="false" :value="userData.name" is-link></cell>

          <!-- <cell title="姓名"  :is-loading="false" :value="userData.name"></cell> -->
          <popup-radio class="cp-select" title="性别" :options="sexs" v-model="userData.sex" placeholder="请选择性别" @on-change="onChangeSex"></popup-radio>
          <!-- <popup-picker title="性别" :data="sexs" v-model="sex"   @on-change="onChangeSex" :display-format="formatSexDisplay"  ></popup-picker> -->
          <cell title="手机" @click.native="$router.push({name:'user_profile_phone'})" :is-loading="false" :value="userData.phone" is-link></cell>
        </group>
        <group class="cp-group">
          <!-- <cell title="公司" @click.native="goEdit('company')" :is-loading="false" :value="company" is-link></cell> -->
          <popup-picker title="公司" :data="companys" v-model="company"    @on-change="onChangeCompany" :display-format="formatCompanyDisplay"  ></popup-picker>

          <cell title="部门" @click.native="$router.push({name:'user_profile_departments'})" :is-loading="false" :value="userData.Department" is-link v-show="userData.company_id > 0"></cell>
          <!-- <cell title="工号" @click.native="goEdit('loginname')" :is-loading="false" :value="userData.loginname" is-link></cell> -->
        </group>
        <group  class="cp-group">
          <group-title class="cp-group-title" slot="title"><i  class="cp-title-icon fa fa-car"></i>车辆信息</group-title>
          <cell title="车牌号" class="cp-profile-item"    @click.native="goEdit('carnumber')" :is-loading="false" :value="userData.carnumber" is-link></cell>
          <cell title="汽车颜色" class="cp-profile-item"  @click.native="goEdit('carcolor')" :is-loading="false" :value="userData.carcolor" is-link></cell>
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

import {GroupTitle,PopupRadio,Selector} from 'vux'

import CpRouteCard from '../components/CpRouteCard'
import CpAvatar from '../components/CpAvatar'

export default {
  components: {
    GroupTitle,CpAvatar,PopupRadio,Selector
  },
  data () {
    return {
      isScrollDown: false,
      avatar:'',
      userData:'',
      address_home:'',
      address_work:'',

      //性别
      sexs: [{
        key: '1',
        value: '男'
      }, {
        key: '2',
        value: '女'
      }],
      formatSexDisplay: function (value, name) {
        return value!=="0" ? name : "选择性别";
      },

      company:['0'],
      companys:[[]],
      formatCompanyDisplay: function (value, name) {
        return value!=="0" ? name : "-";
      },

    }
  },
  computed : {

  },
  watch : {
    "userData.company_id" (){
      this.company = [this.userData.company_id]
    }
  },
  methods :{
    init (){
      this.isScrollDown = false;
    },
    /**
    * 加载用户信息
    * @param  string url
    */
    getUserInfo (){
      if(typeof(this.$store.state.userData.isFull)!="undefined" && this.$store.state.userData.isFull){
        this.userData = Object.assign({},this.$store.state.userData);
        this.avatar = this.$store.state.userAvatar;
        this.userName = this.$store.state.userData.name;
        this.loginName = this.$store.state.userData.loginname;
        // this.company = [this.userData.company_id]
      }else{
        this.loadUserInfo()
      }
    },
    /**
    * 从远端取得用户信息
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
         this.userData = Object.assign({},data);

         // this.company = [this.userData.company_id]

       }
     })
     .catch(error => {
       console.log(error)
     })
    },

    /**
    * 当滚动屏幕内容时
    */
    onScroll(e){
     let sTop = e.target.scrollTop;
     if(sTop > 10){
       this.isScrollDown = true;
     }else{
       this.isScrollDown = false;
     }
    },

    /**
    * 当改变性别选择时。
    * @param  {string} value [所选性别值]
    */
    onChangeSex(value){
     this.userData.sex = value;
     this.submitSelect({type:"sex","sex":value});
    },

    /**
    * 取得公司列表。
    */
    getCompanys(){
     this.$tokenAxios.get(config.urls.getCompanys).then(res => {
       // console.log(res)
       if(res.data.code === 0) {
         let data = res.data.data;

         if(data.lists.length > 0){
           let companys = [];

           data.lists.forEach((value,index,arr)=>{
             let vStr = value.company_name == value.short_name ?  value.short_name : value.company_name + ' ('+value.short_name+') ';
             companys[index]  = {
               value:value.company_id,
               name: vStr,
             }  ;
           });
           companys.push({
             value:'0',
             name: '其它',
           });
           this.companys = [companys];
         }
         // console.log(this.companys);
       }
     })
    },




    /**
    * 当显示公司列表时。
    */
    onChangeCompany(value){

     this.userData.company_id = value[0];
     this.submitSelect({type:"company_id",company_id:value[0]});
    },


    /**
    * 提交改变的选择
    */
    submitSelect(postData){
     var userData_o = this.$store.state.userData;


     if(userData_o[postData.type] == postData[postData.type] ){
       return false;
     }

     this.$tokenAxios.post(config.urls.editProfile,postData).then(res => {
       if(res.data.code === 0 ){
         let data = Object.assign({},this.userData);
         this.$store.commit('setUserData',data);
       }else{
         this.$vux.toast.text("更改失败，请稍候再试");
         this.userData[postData.type] = userData_o[postData.type];
       }
     }).catch(error => {
       this.$vux.toast.text("更改失败，请稍候再试");
       this.userData[postData.type] = userData_o[postData.type];
       console.log(error)
     })
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
  created () {
    this.getCompanys();
  },
  mounted () {
    this.init();

  },
  activated (){
    this.getUserInfo();
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
