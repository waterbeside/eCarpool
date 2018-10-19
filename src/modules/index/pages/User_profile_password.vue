
<template>
  <div class="page-view page-view-profile-edit" id="Page-user-profile-password">
    <title-bar >{{$t("message['setting.restpassword']")}}</title-bar>
    <div class="page-view-main"   >
      <cp-scroller :position="{top:'46px'}"  :enableRefresh="false" :enableInfinite="false">

          <group class="cp-form-group">
            <x-input   title="<i class='fa fa-key'></i>"  :show-clear="true"  :placeholder="$t('message[\'placeholder.oldPassword\']')"  name="password"  v-model="password" ref="input_password" type="password" :required="true"></x-input>
              <x-input   title="<i class='fa fa-lock'></i>"   :show-clear="true"  :placeholder="$t('message[\'placeholder.newPassword\']')"  name="pw_new"  v-model="pw_new" ref="input_pw_new" type="password"   ></x-input>
              <x-input   title="<i class='fa fa-lock'></i>"   :show-clear="true"  :placeholder="$t('message[\'placeholder.confirmPassword\']')"   name="pw_confirm"  v-model="pw_confirm" ref="input_pw_confirm" type="password"   ></x-input>
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


export default {
  components: {

  },
  data () {
    return {
      isSubmiting : false,
      password:"",
      pw_new:"",
      pw_confirm:"",
      code:"",
      userData:{}
      // msg      : 'Welcome to Your Vue.js App'
    }
  },
  computed : {
    isEnableSubmit () {
      return  this.password.trim() == "" ||  this.pw_new.trim()=="" || this.pw_confirm.trim()=="" || this.isSubmiting ? false :true;

    },

  },

  methods:{
    init (){
      this.userData = Object.assign({},this.$store.state.userData);

    },

    /**
     * 点击完成按钮
     */

    done(){
      if(this.password.trim()==""){
        this.$vux.toast.text(this.$t("message['verify.oldPassword']"));
        return false;
      }
      if(this.pw_new.trim().length < 6){
        this.$vux.toast.text(this.$t("message['verify.newPasswordLen']"));
        return false;
      }
      if(this.pw_new !== this.pw_confirm){
        this.$vux.toast.text(this.$t("message['verify.confirmPassword']"));
        return false;
      }
      let postData = {type:"password",password:this.password,pw_new:this.pw_new,pw_confirm:this.pw_confirm}

      this.isSubmiting = true;
      this.$http.post(config.urls.editProfile,postData).then(res => {
        this.isSubmiting = false;
        if(res.data.code === 0) {
          this.$vux.toast.text(this.$t("message['setting.modifysucces']"));
          this.$router.back();
        }else if(res.data.code === 10001){
          this.$vux.toast.text(this.$t("message['verify.oldPasswordError']"));
        }else{
          this.$vux.toast.text(this.$t("message['setting.modifyfail']"));
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
