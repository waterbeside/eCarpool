<template>
  <div class="page-view-login " id="Page-login">
      <div class="cp-pagebg "></div>
      <div class="page-view-content">
        <div class="page-view-header">
          <div class="cp-loginlogo-wrapper">
            <img class="cp-logo"  src="../../../assets/images/login_logo.png">
          </div>
        </div>
        <div class="container">
          <div class="cp-login-wrap" id="login">
            <div class="cp-form-wrap">
              <form class="form form-login form-horizontal"　 method="post"  @submit.prevent="login">
                <group class="cp-form-group">
                  <x-input   title="<i class='fa fa-id-card'></i>" placeholder="用户名" name="username"  v-model="username"   novalidate  @on-change="resetError"></x-input>
                </group>
                <group class="cp-form-group">
                  <x-input     title="<i class='fa fa-key'></i>" placeholder="密码" name="password" type="password"  v-model="password" novalidate @on-change="resetError" ></x-input>
                </group>
                <div class="cp-error-tips"    v-if="isShowError" ><i class="fa fa-exclamation-circle"></i> {{errorTips}}</div>

                <div class="cp-tips-disclaimer">点击“登入”按钮即代表阅读并同意<a href="#/disclaimer">《使用协议》</a></div>

                <x-button  type="primary" :disabled="subBtnIsDisabled" >{{subBtnText}}</x-button>
                <!-- <button class="btn btn-primary btn-lg J-btn-submit" type="submit" data-loading-text="登 入 中...">登 入</button> -->
                <!-- <p class="cp-register"><a  href="register.html">注册carpool帐号</a></p> -->
              </form>
            </div>
          </div>
        </div>


      </div>
    </div>
</template>

<script>
import config from '../config'

export default {
  components: {

  },
  data () {
    return {
      username: '',
      password:'',
      isShowError: false,
      errorTips:'',
      subBtnText:'登 入',
      isSubmiting: false,
      iconType:'',
    }
  },
  computed : {
    subBtnIsDisabled () {
      return this.username == "" ||  this.password == "" || this.isSubmiting  ? true :false;
    },
  },
  methods :{
    resetError (){

        this.iconType = ''
        this.isShowError = false;

    },
    login (){
      // console.log(config.urls.checkLogin)
      // alert(1)
      let postData = {username:this.username,password:this.password,client:'h5'};
      this.isSubmiting = true;
      this.subBtnText = '登 入 中'
      this.$tokenAxios.post(config.urls.passport,postData).then(res => {
      // this.$tokenAxios.post(config.urls.login,postData).then(res => {
          this.isSubmiting = false;
          this.subBtnText = '登 入'
          // 登录成功
          if(res.data.code === 0) {
            this.$vux.toast.text('登入成功');
            let data = res.data.data;
            localStorage.setItem('CP_U_TOKEN',data.token);
            localStorage.setItem('CP_uid',data.user.uid);
            data.user.loginname = data.user.loginname.toLowerCase();
            this.password = "";
            // console.log(data.user)
            // this.$store.commit('setUserBaseData',data.user);
            this.$store.commit('setUserData',data.user);
            // console.log(config.avatarBasePath + data.user.imgpath)
            if(data.user.avatar && data.user.avatar.trim()!=''){
              this.$store.commit('setUserAvatar',config.avatarBasePath + data.user.avatar);
            }
            this.errorTips = res.data.desc;
            // this.isShowToast = true;
            this.$router.push({name:'carpool'});
          }else{
            // alert(res.data.msg);
            let errorMsg = res.data.code === 10001 ? "用户名或密码错误" : res.data.desc;

            this.$vux.toast.text(errorMsg);
            this.errorTips = errorMsg;
            this.isShowError = true;
            this.iconType  = 'error';
            // this.password  = "";
          }
        })
        .catch(error => {
          this.isSubmiting = false;
          this.subBtnText = '登 入'
        })
    }
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="less">
@import "../../../assets/css/cp_base.less";

#Page-login {
  @color-placeholder:lighten( desaturate(@color-primary,10%),40%);
  height: 100%;
  .cp-pagebg {position: absolute; top: 0; left: 0; right:0; bottom: 0;background-image: url(../../../assets/images/carpool_bg.jpg); background-position: center ; background-size: cover;}
  .page-view-header { height:120px;  background: none}
  .cp-loginlogo-wrapper {
     padding-top:80px;
  }
  .cp-logo {width: 90px; height:90px; /* border:1px solid rgba(255,255,255,.2) ; box-shadow: 0 0 30px lighten(@color-primary,50%)*/}
  .cp-login-wrap { margin-top: 60px}
  .cp-error-tips { /*position: absolute; right:10px ; top:86px;*/margin:0 ;  padding: 3px 12px;  text-align: left;background: #F43530; border:1px solid #b41c18; color:#FFF; border-radius: 3px;}
  .cp-form-group .vux-no-group-title {
    border-radius: 4px; margin:  0 0 12px;
    .vux-x-input {padding-left: 5px;  }
    .weui-cell__hd {width: 36px; }
    .weui-label {
      width: 40px; text-align: center; font-size: 18px;margin: 0;color:@color-placeholder;
    }
    .weui-cell__ft { line-height: 1}
    .weui-input {
      &::-webkit-input-placeholder {color:@color-placeholder;}
      &::-moz-placeholder {color:@color-placeholder}
      &:-ms-input-placeholder {color:@color-placeholder}
      &:focus {border-color: lighten(@color-primary,10%)}
    }
  }

  .cp-tips-disclaimer { color: lighten(@color-primary,48%); font-size: 12px; padding: 8px 0;
    a {color: #FFF; text-decoration: underline;}
  }
}
</style>
