<template>
  <div class="page-view  ">
    <title-bar  :left-options="{showBack: true, preventGoBack:true}" @onClickBack="goHome">
      <span  >{{$t("message['discover.currenttrip']")}}</span>
    </title-bar>
    <div class="page-view-main"   >
      <cp-scroller  :position="{top:'46px'}"  :on-refresh="onRefresh"   :dataList="scrollData" :enableInfinite="false">

         <cp-trip-card
            v-for="(item,index) in listDatas"
           :key="item.id"
           :id="item.id"
           :name="item.user.name"
           :avatar="item.user.imgpath"
           :phone="item.user.phone"
           :department="item.user.Department"
           :carnumber="item.user.carnumber"
           :start_name="item.start_info.addressname"
           :end_name="item.end_info.addressname"
           :date = "item.time.split(' ')[0]"
           :time = "item.time.split(' ')[1]"
           :class="[('item-'+item.id)]"
           :ref = "'item-'+item.id"
           :typeLabel="item.typeLabel"
           :data-from="item.from"
           :isShowPhoneBtn="false"
           @click.native="goDetail(index)"
         >
         <div slot="btnbar" class="cp-btns-wrapper cp-goDetail-wrapper">
           <span class="pull-right">{{$t("message.detail")}} <i class="fa fa-arrow-circle-right"></i></span>
           <span class="tips-text" v-if="item.status ==0 && item.from=='info'">{{$t("message['carpool.status.waitingCar']")}}</span>
         </div>
         </cp-trip-card>

       <span slot="loading-text"><spinner type="dots" size="60px"></spinner></span>
       <div class="text-center">
         <div class="cp-nodata-tips" v-show="noData">
           {{$t("message['scroller.noData']")}} ⁽⁽ƪ(ᵕ᷄≀ ̠˘᷅ )ʃ⁾⁾
         </div>
         <spinner type="dots" size="60px" v-show="isLoading"></spinner>
       </div>
      </cp-scroller>
    </div>
  </div>
</template>

<script>
import config from '../config'
import cFuns from '../../../utils/cFuns'

import CpTripCard from '../components/CpTripCard'

export default {
  components: {
    CpTripCard
  },
  data () {
    return {
      doLikeId:null,
      keyword : '',
      keyword_o : '',
      page    : 1,
      pageCount:1,
      isLoading : 0,
      listDatas :[],
      listDatas_o :[],
      noData:0,
      isShowSearchBox:0,
      scrollData: {
          noFlag: false //暂无更多数据显示
      },
      enableInfinite:false,

    }
  },
  methods :{
    init (){
      this.keyword = this.$route.params.keyword ? this.$route.params.keyword : '';
      this.page    = this.$route.params.page ? this.$route.params.page : 1;
    },
    /**
     * [goHome 返回首页]
     */
    goHome (){
      this.$router.push({name:'carpool'})
    },
    /**
     * 跳到详细页
     * @param  {integer} index 数据索引
     */
    goDetail (index){
      let goName = this.listDatas[index].from =="wall" || this.listDatas[index].love_wall_ID ? "carpool_rides_detail" :'carpool_requests_detail' ;
      let goId = this.listDatas[index].love_wall_ID ? this.listDatas[index].love_wall_ID : this.listDatas[index].id;
      this.$router.push({name:goName,params: { id: goId ,from:this.listDatas[index].from}});

    },
    /**
     * 取得列表
     * @param  {function} success 取得列表成功后执行。
     */
    getList (success){

      // console.log(config.urls.checkLogin)
      // alert(1)
      let params = {};

      this.isLoading = 1;
      this.noData = 0;
      this.$tokenAxios.get(config.urls.getMytrip,{params:params}).then(res => {
        let data = res.data.data;
        this.isLoading = 0;
        if(res.data.code === 0) {
          this.listDatas = [];
          if(data.lists.length === 0){
            this.noData = 1 ;
          }
          this.listDatas_o = data.lists;
          this.listDatas_o.forEach((value,index,arr)=>{
            this.listDatas.push({
              from : value.from,
              id : value.id,
              love_wall_ID : value.love_wall_ID,
              status: value.status,
              time: value.time,
              start_info:value.start_info,
              end_info:value.end_info,
              user : value.from == "wall" || value.show_owner ? value.owner_info : value.passenger_info,
              typeLabel : value.from == "wall" || value.show_owner ? this.$t('message.driver') : this.$t('message.passenger'),
              like_count:value.like_count,
              took_count:value.took_count,
              seat_count:value.seat_count
            })
          })

        }else{
          if(res.data.code === 20002 && this.page < 2){
            this.noData = 1 ;
            this.listDatas = data.lists;
          }

        }
        if(typeof(success)==="function"){
          success(res);
        }
      })
      .catch(error => {
        this.isLoading = 0;
        console.log(error)
      })
    },
    /**
     * 下接刷新
     */
    onRefresh(done) {
      this.getList();
      done(); // call done

    },

  },
  mounted () {

  },
  created () {
    this.init();
    // this.$nextTick(function () {
    //  this.$refs['j-herblist-scrollBox'].addEventListener('scroll', this.listScroll); //监听滚动加载更多
    // })
  },
  activated (){
    // if(this.$store.state.isRefreshCarpoolList){
      this.listDatas = [];
      this.getList();
      this.$store.commit('setIsRefreshCarpoolList',false);
    // }
    this.$el.querySelector('.load-more').style.display = 'none';
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
