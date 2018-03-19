
<template>
  <div class="page-view page-view-profile-edit" id="Page-user-profile-password">
    <title-bar >重置密码</title-bar>
    <div class="page-view-main"   >
      <cp-scroller :position="{top:'46px'}"  :enableRefresh="false" :enableInfinite="false">

          <group class="cp-form-group">
            <x-input   title="<i class='fa fa-key'></i>"  :show-clear="true"   placeholder="请输入旧密码" name="password"  v-model="password" ref="input_password" type="password" :required="true"></x-input>
              <x-input   title="<i class='fa fa-lock'></i>"   :show-clear="true"   placeholder="请输入新密码" name="pw_new"  v-model="pw_new" ref="input_pw_new" type="password"   ></x-input>
              <x-input   title="<i class='fa fa-lock'></i>"   :show-clear="true"   placeholder="请再次输入密码" name="pw_confirm"  v-model="pw_confirm" ref="input_pw_confirm" type="password"   ></x-input>
          </group>
        <div class="container">

          <div class="cp-btn-wrapper">
            <x-button text="完成" :disabled="!isEnableSubmit" @click.native="done" type="submit" class="btn btn-success" :show-loading="isSubmiting"></x-button>
          </div>
        </div>

      </cp-scroller>
    </div>
  </div>
</template>

<script>
import config from '../configs/index'


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
        this.$vux.toast.text('请输入旧密码');
        return false;
      }
      if(this.pw_new.trim().length < 6){
        this.$vux.toast.text('新密码不得少于6位');
        return false;
      }
      if(this.pw_new !== this.pw_confirm){
        this.$vux.toast.text('两次密码不一致');
        return false;
      }
      let postData = {type:"password",password:this.password,pw_new:this.pw_new,pw_confirm:this.pw_confirm}

      this.isSubmiting = true;
      this.$tokenAxios.post(config.urls.editProfile,postData).then(res => {
        this.isSubmiting = false;
        if(res.data.code === 0) {
          this.$vux.toast.text('修改成功');
          this.$router.back();
        }else if(res.data.code === 10001){
          this.$vux.toast.text('旧密码不正确');
        }else{
          this.$vux.toast.text('修改失败，请稍候再试');
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
