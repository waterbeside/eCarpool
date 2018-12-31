<template>
  <div class="cp-trip-passennger "  :class="{hide:isCancel}" :data-id="id" :data-uid="uid">
    <cp-avatar :src="avatar" ></cp-avatar>
    <div class="cp-txt">
      <h4 class="media-heading">{{name}}</h4>
      <p>{{department ? department : "-"}}</p>
    </div>
    <div class="time">
      {{time}}
    </div>
    <cp-trip-box :start_name="start_name" :end_name="end_name" labelStart="" labelEnd="">
        <div slot="route-middle" class="cp-center-wrap"><div class="inner"> </div></div>
    </cp-trip-box>
    <div class="cp-btns-bar">
      <a href="javascript:void(0);" class="btn" @click.preventDefault @click="clickPhone"><i class="fa fa-phone"></i> {{$t("message['contact']")}}</a>
      <a href="javascript:void(0);" class="btn" @click.preventDefault @click="onClickPosition(id,uid,$event)"><i class="fa fa-map-marker"></i> {{$t("message['position']")}}</a>
      <a href="javascript:void(0);" class="btn" @click.preventDefault @click="onClickCancel(id,uid,$event)"><i class="fa fa-times"></i> {{$t("message['cancel']")}}</a>
    </div>
  </div>
</template>

<script>
import config from '../config'
import CpTripBox from './CpTripBox'
import CpAvatar from '@/components/CpAvatar'
import { Swipeout, SwipeoutItem, SwipeoutButton} from 'vux'

export default {
  components: {
    CpAvatar,CpTripBox,   Swipeout, SwipeoutItem, SwipeoutButton
  },
  data () {
    return {
      isCancel: false,
    }
  },
  props: {
    id : {
      default:0
    },
    uid : {
      default:0
    },

    name : String,
    avatar : String,
    phone : String,
    department : String,
    start_name : String,
    end_name : String,
    time: String,
    data: Object,
    allowCancel: {
      default:true,
    },
    allowPosition: {
      default:true,
    },
    preventClickPosition:{
      default:false,
    },
    preventClickPhone:{
      default:false,
    },
    preventClickCancel:{
      default:false,
    },


  },
  computed:{
  },

  methods: {
    clickPhone (){
      if(this.phone){
        window.location.href = "tel:"+this.phone;
      }else{
        alert(this.$t('message["carpool.detail.noPhone"]'));
      }
    },
    onClickPosition (id,uid,e){
      if(this.preventClickPosition){
        this.$emit('on-click-position',id,uid,e);
      }else{
        this.$store.commit('setCarpoolInfoDetail',this.data);
        this.$router.push({name:'carpool_position_info',params:{infoid:id,uid:uid}})
      }
    },
    onClickCancel (id,uid,e){
      if(this.preventClickCancel){
        this.$emit('on-click-cancel',id,uid,e);
      }else{
        this.cancelPassenger();
      }
    },
    cancelPassenger () {
      var baseUrl = config.urls.trips+"/info/"+this.id;
      var url =  baseUrl+"/type/cancel";
      var confirmTitle = "";
      var confirmText = this.$t("message['carpool.confirm.cancelPassenger']");
      var successText = this.$t("message['carpool.cancelSuccess']") ;
      var postData = {};
      this.$vux.confirm.show({
        title  : confirmTitle,
        content: confirmText,
        confirmText: this.$t("message.sure"),
        cancelText: this.$t("message.goBack"),
        onConfirm : ()=>{
          this.$store.commit('setLoading',{isShow:true,text:this.$t("message.submitting")});
          // return false;
          this.$http.patch(url,postData).then(res => {
            this.$store.commit('setLoading',{isShow:false});
            if(res.data.code === 0) {
              this.isCancel = true;
              this.$vux.toast.text(successText,'middle');
              this.$emit('on-cancel-success',res,id,uid);

            }else{
              this.$vux.toast.text(res.data.desc,'middle');
            }
          })
          .catch(error => {
            this.$store.commit('setLoading',{isShow:false});
            this.$vux.toast.text(t.message['networkFail']);

          })
        }
      })
    }


  },
  mounted () {


 }
}
</script>

<style scoped>

</style>
