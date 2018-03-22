
<template>
  <div class="page-view page-view-profile-edit" id="Page-user-profile-phone">
    <title-bar >绑定手机号</title-bar>
    <div class="page-view-main"   >
      <cp-scroller :position="{top:'46px'}"  :enableRefresh="false" :enableInfinite="false">

          <group class="cp-form-group">
              <x-input     :show-clear="false"   placeholder="请输入手机号" name="phone"  v-model="phone" ref="input_phone"></x-input>
              <button class="btn btn-default btn-sendsms "   :disabled="isCounting" @click.prevent="sendCode" id="btnSendCode">
                <span v-show="!isCounting">获取验证码</span>
                <span v-show="isCounting">重发 ( <countdown v-model="countNum" :start="isCounting" @on-finish="finishCount"></countdown> )</span>
              </button>
              <x-input     :show-clear="true"   placeholder="请输入验证码" name="code"  v-model="code" ref="input_code"></x-input>
          </group>
        <div class="container">

          <div class="cp-btn-wrapper">
            <x-button text="完成" :disabled="!isEnableSubmit" @click.native="done" type="success" class="cp-btn-submit btn btn-success" :show-loading="isSubmiting"></x-button>
          </div>
        </div>

      </cp-scroller>
    </div>
  </div>
</template>

<script>
import config from '../configs/index'
import { Countdown } from 'vux'

export default {
  components: {
    Countdown
  },
  data () {
    return {


      isSubmiting : false,
      //倒计时相关
      countNum:100,
      isCounting:false,

      phone:"",
      code:"",
      userData:{}
      // msg      : 'Welcome to Your Vue.js App'
    }
  },
  computed : {
    isEnableSubmit () {
      return  this.phone.trim() == "" ||  this.code.trim()=="" || this.isSubmiting ? false :true;

    },

  },

  methods:{
    init (){
      this.userData = Object.assign({},this.$store.state.userData);
      this.phone = "";
      this.code = "";
      this.countNum = 100;
      this.isCounting = false;
      this.isSubmiting = false;

    },
    //发送验证码
    sendCode(){

      let postData = {phone:this.phone,usage:103}
      if(!this.phone || !this.phone.trim()){
        this.$vux.toast.text('手机号不能为空');
        return false;
      }
      this.$tokenAxios.post(config.urls.sendSms,postData).then(res => {
        if(res.data.code === 0) {
          this.$vux.toast.text('验证码已发送');
          this.isCounting = true;
          this.countNum = 100;
        }else{
          if(res.data.code ==10100) {
            this.$vux.toast.text('手机号已正在使用,无需重绑定');
          }
          if(res.data.code ==10006) {
            this.$vux.toast.text('手机号已被使用，请输入新的手机号');
          }

          if(res.data.code == -10002) {
            this.$vux.toast.text('手机号格式不正确');
          }
        }
      })
      .catch(error => {
        console.log(error)
      })
      return false;
    },
    /**
     * 当倒计秒数完成时。
     */
    finishCount (){
      this.isCounting = false;
      countNum:100;
    },

    /**
     * 点击完成按钮
     */

    done(){
      let postData = {phone:this.phone,code:this.code,usage:103,step:0}

        if( !this.phone.trim()){
          this.$vux.toast.text('手机号不能为空');
          return false;
        }
        if( !this.code.trim()){
          this.$vux.toast.text('请输入验证码');
          return false;
        }
        this.isSubmiting = true;
        this.$tokenAxios.post(config.urls.checkSmsCode,postData).then(res => {
          this.isSubmiting = false;
          if(res.data.code === 0) {
            this.userData.phone = this.phone;
            this.$store.commit('setUserData',this.userData);
            this.$router.back();
          }else if(res.data.code == 10006){
            this.$vux.toast.text('该手机号已被使用');
          }else{
            this.$vux.toast.text('验证码错误');
          }
        })
        .catch(error => {
          this.isSubmiting = false;
          console.log(error)
        })

    }
  },
  created(){

  },
  mounted(){


  },
  activated(){
    this.init();

  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
