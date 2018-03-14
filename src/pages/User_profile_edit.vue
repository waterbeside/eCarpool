
<template>
  <div class="page-view" id="Page-user-profile-edit">
    <title-bar >{{fieldSetting.title}}</title-bar>
    <div class="page-view-main"   >
      <cp-scroller :position="{top:'46px'}"  :enableRefresh="false" :enableInfinite="false">
        <div class="container">
          <div class="cp-form-group ">
              <x-input   class="form-control-line" :show-clear="true"   :placeholder="fieldSetting.placeholder" :name="field"  v-model="value" ref="input"></x-input>

              <div class="help-block" v-html="helpText"> </div>
          </div>
          <div>
            <button class="btn btn-success btn-lg btn-block" @click="done">完成</button>
          </div>
        </div>



      </cp-scroller>
    </div>
  </div>
</template>

<script>
import config from '../configs/index'
import CpScroller from '../components/CpScroller'
var fieldArray = {
  'loginname':{
    title : "修改工号",
    placeholder:"请输入帐号/工号",
    tips:'请输入你所在公司的工号，可使用该工号进行登入',
    len:6
  },
  'carnumber':{
    title : "修改车牌号",
    placeholder:"请输入车牌号",
    tips:'',
    len:0

  },
  'carcolor':{
    title : "修改汽车颜色",
    placeholder:"汽车颜色",
    tips:''
  },
}
export default {
  components: {
    CpScroller,
  },
  data () {
    return {
      field:this.$route.params.field,
      fieldSetting:{},
      isEnableSubmit : false,
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
      this.fieldSetting = fieldArray[this.field] ;

      this.userData = this.$store.state.userData;
      this.value = this.userData[this.field];
    },
    /**
     * 点击完成按钮
     */
    done(){
      var _this = this ;
      var postData = {
        type:_this.field,
      }
      postData[_this.field] = _this.value ;
      var userData_o = this.$store.state.userData;
      if(userData_o[postData.type] == postData[postData.type] ){
        this.$router.back();
        return false;
      }
      // if(user)


      this.$tokenAxios.post(config.urls.editProfile,postData).then(res => {
        if(res.data.code === 0 ){
          userData_o[postData.type] =  postData[postData.type];
          this.$store.commit('setUserData',userData_o);
          this.$router.back();
        }else{
          this.$vux.toast.text("更改失败，请稍候再试");
          return false;
        }
      }).catch(error => {
        this.$vux.toast.text("更改失败，请稍候再试");
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
