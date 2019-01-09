<template>
  <div  class="cp-btns-wrapper">
    <a v-show="isShowBtn_goback" class="cp-btn-i cp-btn-back "  @click="goBack"><i class="cp-icon fa fa-chevron-left"></i><span>{{$t("message['carpool.detail.btn.goback']")}}</span></a>
    <a v-show="isShowBtn_phone"  class="cp-btn-i cp-btn-phone "  @click="clickPhone"><i class="cp-icon fa fa-phone"></i><span>{{$t("message['carpool.detail.btn.phone']")}}</span></a>
    <a v-show="isShowBtn_pickup" class="cp-btn-p cp-btn-pickup " @click="btnAction('pickup')"><i class="cp-icon fa fa-car"></i><span>{{$t("message['carpool.detail.btn.pickup']")}}</span></a>
    <a v-show="isShowBtn_riding" class="cp-btn-p cp-btn-riding " @click="btnAction('riding')"><i class="cp-icon fa fa-car"></i><span>{{$t("message['carpool.detail.btn.riding']")}}</span></a>
    <a v-show="isShowBtn_cancel" class="cp-btn-p cp-btn-cancel "  @click="btnAction('cancel')"><i class="cp-icon fa fa-times"></i><span>{{$t("message['carpool.detail.btn.cancel']")}}</span></a>
    <a v-show="isShowBtn_finish" class="cp-btn-p cp-btn-ok "  @click="btnAction('finish')"><i class="cp-icon fa fa-check"></i><span>{{$t("message['carpool.detail.btn.finish']")}}</span></a>
    <b v-show="isShowBtn_status" class="cp-btn-p cp-btn-disable "  @click="false"><i class="cp-icon fa fa-check"></i><span>{{alertText}}</span></b>
  </div>
</template>

<script>

import config from '@/modules/index/config'

export default {
  components: {

  },
  data () {
    return {
      myStatus:this.status,
      alertText:"",
      //按钮相关
      isShowBtn_phone   :true,
      isShowBtn_goback  :true,
      isShowBtn_pickup  :false,
      isShowBtn_riding  :false,
      isShowBtn_cancel  :false,
      isShowBtn_finish :false,
      isShowBtn_status : false,
    }
  },
  props: {


    type:String,
    uid :{
      default:0,
    },
    user:Object,
    detailData:Object,

  },
  watch :{
    "detailData.status" :{
      handler (val, oldval) {
        console.log("detailData.status");
        console.log(val);
        this.changeStatus(val);
      },
     // deep: true,
     immediate:true,
   },
   "detailData.hasTake" :{
     handler (val, oldval) {
       console.log("detailData.hasTake");
       console.log(val);
       this.changeStatus(val);
     },
    // deep: true,
    immediate:true,
  },


  },
  computed: {

  },
  methods : {
    init(){
      // this.uid = this.$store.state.userData.uid;
      // console.log(this.uid)
    },
    goBack () {
        this.$router ? this.$router.back() : window.history.back();
    },
    clickPhone (){
      if(this.phone){
        window.location.href = "tel:"+this.user.phone;
      }else{
        alert(this.$t('message["carpool.detail.noPhone"]'));
      }
    },
    /**
     * 改变状态后界面所做的变化
     */
    changeStatus(status){
      status = status || 0;
      console.log('status:'+status)
      this.isShowBtn_phone   = false;
      this.isShowBtn_goback  = true;
      this.isShowBtn_pickup  = false;
      this.isShowBtn_riding  = false;
      this.isShowBtn_cancel  = false;
      this.isShowBtn_finish= false;
      // this.isShowBtn_cancel_alert = false;
      // this.isShowBtn_finish_alert = false;
      this.isShowBtn_status = false;

      this.isShowBtn_phone = this.uid == this.user.uid ? false : true;
      this.isShowAlert = this.type=="info" ? true : false
      // console.log(this.type);
      switch (parseInt(status)) {
        case 0:
            this.isShowBtn_cancel = this.uid == this.user.uid ? true : false;
            if(this.type=="wall"){
              this.isShowBtn_finish = this.uid == this.user.uid ? true : false;
              if(this.hasTake > 0){
                  this.isShowBtn_cancel = true;
                  this.isShowBtn_finish = true;
              }else if(this.hasTake_finish > 0){

              }else{
                this.isShowBtn_riding = this.uid == this.user.uid ? false : true;
              }
            }
            if(this.type=="info"){
              this.isShowBtn_pickup = this.uid == this.user.uid ? false : true;
            }

          break;
        case 1:
            if(this.type=="wall"){
              this.isShowBtn_cancel = this.uid == this.user.uid ? true : false;
              this.isShowBtn_finish = this.uid == this.user.uid ? true : false;
              if(this.detailData.hasTake > 0){
                  this.isShowBtn_cancel = true;
                  this.isShowBtn_finish = true;
              }else if(this.detailData.hasTake_finish > 0){

              }else{
                this.isShowBtn_riding = this.uid == this.user.uid ? false : true;
              }

            }
            if(this.type=="info"){
              this.isShowBtn_cancel = this.uid == this.user.uid || this.uid == this.detailData.d_uid ? true : false;
              this.isShowBtn_finish = this.uid == this.user.uid || this.uid == this.detailData.d_uid ? true : false;
            }

          break;
        case 2:
            this.alertText = this.$t("message['carpool.status.alert.hasCanceled']");
            this.isShowBtn_status = true;
          break;
        case 3:
            this.alertText = this.$t("message['carpool.status.alert.hasFinished']");
            this.isShowBtn_status = true;

          break;
        default:
      }

    },
    /******* 按钮相关方法 *******/
    /**
     * 按钮动作
     */
    btnAction (action){
      var url,postData,confirmText;
      var successText = this.$t("message.success");
      var confirmTitle = this.$t("message.AreYouSure");
      var isJumpToMytrip = false;
      var postData = {};
      var baseUrl = config.urls.trips+"/"+this.type+"/"+this.detailData.id;
      var res = {code:0}


      switch (action) {
        case 'pickup':
          // url = config.urls.acceptRequest;
          url = baseUrl+"/type/pickup";
          confirmText = this.$t("message['carpool.confirm.accept']",{"username":this.user.name});
          successText = this.$t("message['carpool.acceptSuccess']") ;
          isJumpToMytrip = true;
          break;
        case 'riding':
          // url = config.urls.riding;
          url = baseUrl+"/type/hitchhiking";
          confirmText = this.$t("message['carpool.confirm.riding']",{"username":this.user.name});
          successText = this.$t("message['carpool.ridingSuccess']") ;
          isJumpToMytrip = true;
          break;
        case 'finish':
          // url = config.urls.finishTrip;
          url =  baseUrl+"/type/finish";
          confirmText = this.$t("message['carpool.confirm.finish']");
          successText = this.$t("message['carpool.finishSuccess']") ;
          isJumpToMytrip = false;
          var success = (rs)=>{
            if( this.uid == this.user.uid){
              this.changeStatus(3);
            }else{
              this.changeStatus(this.detailData.status);
            }
          }
          break;
        case 'cancel':
          url =  baseUrl+"/type/cancel";
          confirmText = this.$t("message['carpool.confirm.cancel']");
          successText = this.$t("message['carpool.cancelSuccess']") ;
          isJumpToMytrip = false;
          var success =  (rs)=>{
            if( this.uid == this.user.uid){
              this.changeStatus(2);
            }else{
              this.changeStatus(this.detailData.status);
            }
          }
          break;
      }


      // event.stopPropagation();
      this.$vux.confirm.show({
        title  : confirmTitle,
        content: confirmText,
        confirmText: this.$t("message.sure"),
        cancelText: this.$t("message.cancel"),
        onConfirm : ()=>{
          this.$store.commit('setLoading',{isShow:true,text:this.$t("message.submitting")});
          // return false;
          this.$http.patch(url,postData).then(res => {
            this.$store.commit('setLoading',{isShow:false});
            if(res.data.code === 0) {
              this.$vux.toast.text(successText);
              if(typeof(success)==="function"){
                success(res.data);
              }
              this.$emit('on-submit-success',action,res);

              if(isJumpToMytrip){
                this.$store.commit('setJumpTo',{name:"carpool_mytrip"});
                this.$router.push({name:'carpool'});
              }

            }else{
              this.$vux.toast.text(res.data.desc,'middle');
            }
          })
          .catch(error => {
            this.$store.commit('setLoading',{isShow:false});
            this.$vux.toast.text(t.message['networkFail']);
            console.log(error)
          })
        }
      })
    },
  },
  mounted () {
    this.init();
 },
}
</script>
