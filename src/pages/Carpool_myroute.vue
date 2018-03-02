<template>
  <div class="page-view  ">
    <title-bar  :left-options="{showBack: true, preventGoBack:true}" @onClickBack="goHome">
      <span  >我的行程</span>
    </title-bar>
    <div class="page-view-main"   >
      <cp-scroller :on-refresh="onRefresh"   :dataList="scrollData" :enableInfinite="false">

         <cp-route-card
            v-for="(item,index) in listDatas"
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

           <div slot="btnbar" class="cp-btns-wrapper" v-if="item.from=='wall'">
              <div class="cp-fabBtn-wrap">
                <b class="t">点赞</b>
                <a href="javascript:void(0);" class="btn  btn-fab btn-primary" >
                  <i class="fa fa-heart" ></i>
                </a>
                <b class="num">{{item.like_count}}</b>
              </div>
              <div class="cp-fabBtn-wrap"><b class="t">空位</b><a href="javascript:void(0);" class="btn btn-primary btn-fab "><i class="fa fa-car"></i></a><b class="num">{{item.seat_count - item.took_count}}</b></div>
              <div class="cp-fabBtn-wrap" :class="[{'hasLike':item.hasTake===1}]">
                <b class="t">已搭</b>
                <a href="javascript:void(0);" class="btn btn-fab" :class="item.hasTake===1 ? 'btn-danger' : 'btn-primary' "><i class="fa fa-user"></i></a>
                <b class="num">{{item.took_count}}</b></div>
           </div>

           <div slot="btnbar" class="cp-btns-wrapper" v-if="item.from=='info'">
             <div class="cp-btns" v-if="item.status ==1">
               <a href="javascript:void(0);" onclick="pageMethods.cencelRoute('+data.id+',\''+data.from+'\',this)"  data-loading-text="..." class="cp-btn  btn-ripple  pull-right"><i class="fa fa-times"></i></a>
               <a href="javascript:void(0);" onclick="pageMethods.finishRoute('+data.id+',\''+data.from+'\',this)"  data-loading-text="..." class="cp-btn   btn-ripple pull-right"><i class="fa fa-check"></i></a>
               <a href="tel:'+ (data.show_owner == 1 ? data.owner_info.phone : data.passenger_info.phone)+'" onclick="event.stopPropagation();"  class="cp-btn  btn-ripple pull-right"><i class="fa fa-phone"></i></a>
               <div class="cp-clear"></div>
             </div>
             <div class="cp-btns" v-if="item.status ==0">
               <a href="javascript:void(0);" onclick="pageMethods.cencelRoute('+data.id+',\''+data.from+'\',this)"  data-loading-text="..." class="cp-btn  btn-ripple   pull-right"><i class="fa fa-times"></i></a>
               <span class="tips-text">等待车主接受</span>
               <div class="cp-clear"></div>
             </div>
           </div>


         </cp-route-card>

       <span slot="loading-text"><spinner type="dots" size="60px"></spinner></span>
       <div class="text-center">
         <div class="cp-nodata-tips" v-show="noData">
           暂时没有数据 ⁽⁽ƪ(ᵕ᷄≀ ̠˘᷅ )ʃ⁾⁾
         </div>
         <spinner type="dots" size="60px" v-show="isLoading"></spinner>
       </div>
      </cp-scroller>
    </div>
  </div>
</template>

<script>
import config from '../configs/index'
import cFuns from '../utils/cFuns'

import CpRouteCard from '../components/CpRouteCard'
import CpScroller from '../components/CpScroller'
export default {
  components: {
    CpRouteCard,CpScroller
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
      console.log(1)
      this.$router.push({name:'carpool'})
    },
    /**
     * 跳到详细页
     * @param  {integer} index 数据索引
     */
    goDetail (index){
      let _this = this;
      let goName = this.listDatas[index].from =="wall" || this.listDatas[index].love_wall_ID ? "carpool_rides_detail" :'carpool_requests_detail' ;
      let goId = this.listDatas[index].love_wall_ID ? this.listDatas[index].love_wall_ID : this.listDatas[index].id;
      this.$router.push({name:goName,params: { id: goId ,from:_this.listDatas[index].from}});

    },
    /**
     * 取得列表
     * @param  {function} success 取得列表成功后执行。
     */
    getList (success){
      var _this = this;
      // console.log(config.urls.checkLogin)
      // alert(1)
      let params = {};

      _this.isLoading = 1;
      _this.noData = 0;
      _this.$tokenAxios.get(config.urls.getMyroute,{params:params}).then(res => {
        let data = res.data.data;
        _this.isLoading = 0;
        if(res.data.code === 0) {
          _this.listDatas = [];
          _this.listDatas_o = data.lists;
          _this.listDatas_o.forEach(function(value,index,arr){
            _this.listDatas.push({
              from : value.from,
              id : value.id,
              love_wall_ID : value.love_wall_ID,
              status: value.status,
              time:value.time,
              start_info:value.start_info,
              end_info:value.end_info,
              user : value.from == "wall" || value.show_owner ? value.owner_info : value.passenger_info,
              typeLabel : value.from == "wall" || value.show_owner ? "司机" : "乘客",
              like_count:value.like_count,
              took_count:value.took_count,
              seat_count:value.seat_count
            })
          })

        }else{

        }
        if(typeof(success)==="function"){
          success(res);
        }
      })
      .catch(error => {
        _this.isLoading = 0;
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
    this.getList();
    // this.$nextTick(function () {
    //  this.$refs['j-herblist-scrollBox'].addEventListener('scroll', this.listScroll); //监听滚动加载更多
    // })
  },
  activated (){
    this.$el.querySelector('.load-more').style.display = 'none';
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
