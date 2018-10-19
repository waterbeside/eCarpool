
<template>
  <div class="page-view page-view-profile-edit" id="Page-user-profile-edit">
    <title-bar >{{fieldSetting.title}}</title-bar>
    <div class="page-view-main"   >
      <cp-scroller :position="{top:'46px'}"  :enableRefresh="false" :enableInfinite="false">
        <div class="container">
          <div class="cp-form-group cp-input-wrapper">
              <x-input   class="form-control-line" :show-clear="true"   :placeholder="fieldSetting.placeholder" :name="field"  v-model="value" ref="input"></x-input>

              <div class="help-block" v-html="helpText"> </div>
          </div>
          <div>
            <button class="btn btn-success btn-lg btn-block" @click="done">{{$t("message.done")}}</button>
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
      field:this.$route.params.field,
      fieldSetting:{},
      fieldArray : {
        'carnumber':{
          title : this.$t("message['setting.carNumber']"),
          placeholder:this.$t("message['placeholder.carNumber']") ,
          tips:'',
          len:0
        },
        'carcolor':{
          title : this.$t("message['setting.carColor']"),
          placeholder:this.$t("message['placeholder.carColor']") ,
          tips:''
        },
        'name':{
          title : this.$t("message['setting.editName']"),
          placeholder:this.$t("message['placeholder.carColor']") ,
          tips:''
        },
      },
      isEnableSubmit : false,
      isSubmiting : false,
      title : '',
      isFocus : true,
      value:"",
      placeholder:"",
      userData:{}
      // msg      : 'Welcome to Your Vue.js App'
    }
  },
  computed :{
    helpText (){
      return this.fieldSetting.tips ? '<i class="fa fa-info-circle"></i> '+ this.fieldSetting.tips : "";
    }
  },
  methods:{
    init (){
      this.field = this.$route.params.field;
      this.fieldSetting = this.fieldArray[this.field] ;

      this.userData = this.$store.state.userData;
      this.value = this.userData[this.field];
    },
    /**
     * 点击完成按钮
     */
    done(){

      var postData = {
        type:this.field,
      }
      postData[this.field] = this.value ;
      var userData_o = this.$store.state.userData;
      if(userData_o[postData.type] == postData[postData.type] ){
        this.$router.back();
        return false;
      }
      // if(user)

      this.isSubmiting = true;
      this.$http.post(config.urls.editProfile,postData).then(res => {
        this.isSubmiting = false;
        if(res.data.code === 0 ){
          userData_o[postData.type] =  postData[postData.type];
          this.$store.commit('setUserData',userData_o);
          this.$router.back();
        }else{
          let errMsg = this.$t("message['NetWord.FailTips']");
          this.$vux.toast.text(errMsg);
          return false;
        }
      }).catch(error => {
        let errMsg = this.$t("message['NetWord.FailTips']");
        this.$vux.toast.text(errMsg);
        this.isSubmiting = false;
        return false;
      })
    }
  },
  created(){

  },
  mounted(){


  },
  activated(){
    this.init();
    setTimeout(()=>{
      this.$refs.input.focus()
    },600)
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
