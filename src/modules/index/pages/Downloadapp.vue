<template>
  <div class="page-view " id="Page-downloadapp" >
    <title-bar >{{$t("message['downloadapp.title']")}}</title-bar>
    <div class="page-view-main   " >
      <cp-scroller :position="{top:'46px'}"  :enableRefresh="false" :enableInfinite="false">
        <div class="alert alert-default">
          <p class="text-center">
            {{$t("message['downloadapp.welcomeDownload']")}}
          </p>
          <qrcode value="http://m.esquel.cn/apps/gek/Carpool/" type="img" style=" text-align:center" :size="120"></qrcode>
        </div>
        <div class="container">
          <p>
            <a class="btn btn-primary btn-block btn-lg" href="http://m.esquel.cn/apps/gek/Carpool/downloadandroid.php" target="_blank"><i class="fa fa-android"></i> {{$t("message['downloadapp.android']")}}</a>
          </p>
          <p>
            <a class="btn btn-primary  btn-block btn-lg" href="http://m.esquel.cn/apps/gek/Carpool/downloadios.php"  target="_blank"><i class="fa fa-apple"></i> {{$t("message['downloadapp.ios']")}}</a>
          </p>
        </div>


      </cp-scroller>
    </div>
  </div>

</template>

<script>
import {Qrcode} from 'vux'

export default {
  components: {
    Qrcode,
  },
  data () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  p { margin-bottom: 10px;}
</style>
