
<template>
  <div class="page-view page-view-profile-edit" id="Page-user-profile-phone">
    <title-bar >{{$t("message['user.profile.bindingPhone']")}}</title-bar>
    <div class="page-view-main"   >
      <cp-scroller :position="{top:'46px'}"  :enableRefresh="false" :enableInfinite="false">

          <group class="cp-form-group">
              <x-input     :show-clear="false"  :placeholder="$t('message[\'placeholder.phone\']')"   name="phone"  v-model="phone" ref="input_phone"></x-input>
              <button class="btn btn-default btn-sendsms "   :disabled="isCounting" @click.prevent="sendCode" id="btnSendCode">
                <span v-show="!isCounting">{{$t("message['user.sms.getVerCode']")}}</span>
                <span v-show="isCounting">{{$t("message['user.sms.sendAgain']")}} ( <countdown v-model="countNum" :start="isCounting" @on-finish="finishCount"></countdown> )</span>
              </button>
              <x-input     :show-clear="true"   :placeholder="$t('message[\'placeholder.verCode\']')" name="code"  v-model="code" ref="input_code"></x-input>
          </group>
        <div class="container">

          <div class="cp-btn-wrapper">
            <x-button :text="$t('message.done')" :disabled="!isEnableSubmit" @click.native="done" type="success" class="cp-btn-submit btn btn-success" :show-loading="isSubmiting"></x-button>
          </div>
        </div>

      </cp-scroller>
    </div>
  </div>
</template>

<script>
import config from '../config'
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
        this.$vux.toast.text(this.$t("message['verify.phoneEmpty']"));
        return false;
      }
      this.$http.get(config.urls.sms+"/103",{params:postData}).then(res => {
      // this.$http.post(config.urls.sendSms,postData).then(res => {
        if(res.data.code === 0) {
          this.$vux.toast.text(this.$t("message['login.verCodeHasBeenSent']"));
          this.isCounting = true;
          this.countNum = 100;
        }else{
          if(res.data.code ==10100) {
            this.$vux.toast.text(this.$t("message['verify.phoneHasBeUsed']"));
          }
          if(res.data.code ==10006) {
            this.$vux.toast.text(this.$t("message['verify.phoneHasBeOccupied']"));
          }

          if(res.data.code == -10002) {
            this.$vux.toast.text(this.$t("message['verify.phoneIncorrectFormat']"));
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
          this.$vux.toast.text(this.$t("message['verify.phoneEmpty']"));
          return false;
        }
        if( !this.code.trim()){
          this.$vux.toast.text(this.$t("message['verify.verCodeEmpty']"));
          return false;
        }
        this.isSubmiting = true;
        this.$http.post(config.urls.sms+'/103',postData).then(res => {
          this.isSubmiting = false;
          if(res.data.code === 0) {
            this.userData.phone = this.phone;
            this.$store.commit('setUserData',this.userData);
            this.$router.back();
          }else if(res.data.code == 10006){
            this.$vux.toast.text(this.$t("message['verify.phoneHasBeOccupied']"));
          }else{
            this.$vux.toast.text(this.$t("message['verify.verCodeWrong']"));
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
