<template>
  <div class="page-view  ">
    <title-bar  :left-options="{showBack: true, preventGoBack:true}" @onClickBack="goHome">
      <span v-show="isShowSearchBox==0">{{$t("message['carpool.title.rides']")}}</span>
      <cp-search-box slot="rightContent" @on-show-input="showSearchBox(1)"
      @on-hide-input="showSearchBox(0)" v-model="keyword" @on-keyup="doSearch"
      :placeholder="$t('message[\'placeholder.keyword\']')"></cp-search-box>
      <!--
      <div slot="rightContent">
        <div class="cp-search-box" v-show="isShowSearchBox"><input name="keyword" class="form-control form-control-line" placeholder="请输入关键字查找"  v-model="keyword" @keyup="doSearch" autocomplete="false" ></div>
        <div class="cp-btn-wrapper">
          <button class="cp-btn-search" v-show="isShowSearchBox==0" @click="showSearchBox(1)"><i class="fa fa-search"></i></button>
          <button class="cp-btn-close" v-show="isShowSearchBox" @click="showSearchBox(0)"><i class="fa fa-times"></i></button>
        </div>
      </div>-->
    </title-bar>
    <div class="page-view-main"   >
      <cp-scroller :position="{top:'46px'}" :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData" :enableInfinite="enableInfinite">

         <cp-trip-card
            v-if="listDatas"
            v-for="(item,index) in listDatas"
           :key="item.id"
           :id="item.id"
           :name="item.d_name"
           :avatar="item.d_imgpath"
           :phone="item.d_phone"
           :department="item.d_department"
           :carnumber="item.d_carnumber"
           :start_name="item.start_addressname"
           :end_name="item.end_addressname"
           :date = "item.time.split(' ')[0]"
           :time = "item.time.split(' ')[1]"
           :class="[{'cancel':item.status > 1},('item-'+item.id)]"
           :ref = "'item-'+item.id"
           :typeLabel="$t('message.driver')"
           data-from="wall"
           @click.native="goDetail(index)"
         >

           <div slot="btnbar" class="cp-btns-wrapper">
              <!-- <div class="cp-fabBtn-wrap " :class="[{'hasLike':item.hasLike===1,'doLike':item.id === doLikeId}]">
                <b class="t">{{$t("message['carpool.detail.clickLike']")}}</b>
                <a href="javascript:void(0);" class="btn  btn-fab" :class="item.hasLike===1 ? 'btn-danger' : 'btn-primary' " @click="likeTrip(item.id,index)">
                  <i class="fa fa-heart" ></i>
                </a>
                <b class="num">{{item.like_count}}</b>
              </div> -->
              <div class="cp-fabBtn-wrap"><b class="t">{{$t("message['carpool.emptySeat']")}}</b><a href="javascript:void(0);" class="btn btn-primary btn-fab "><i class="fa fa-car"></i></a><b class="num">{{item.seat_count - item.took_count}}</b></div>
              <div class="cp-fabBtn-wrap" :class="[{'hasLike':item.hasTake===1}]">
                <b class="t">{{$t("message['carpool.takenSeat']")}}</b>

                <a href="javascript:void(0);" class="btn btn-fab" :class="item.hasTake===1 ? 'btn-danger' : 'btn-primary' "><i class="fa fa-user"></i></a>
                <b class="num">{{item.took_count}}</b></div>
              <span class="pull-right">{{$t("message.detail")}}  <i class="fa fa-arrow-circle-right"></i></span>

           </div>
         </cp-trip-card>

       <span slot="loading-text"><spinner type="dots" size="60px"></spinner></span>
       <div class="text-center">
         <div class="cp-nodata-tips" v-show="noData">
           {{$t("message['scroller.noData']")}} ⁽⁽ƪ(ᵕ᷄≀ ̠˘᷅ )ʃ⁾⁾
         </div>
         <spinner type="dots" size="60px" v-show="page==1 && isLoading"></spinner>
       </div>
      </cp-scroller>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import config from '../config'
import cFuns from '@/utils/cFuns'

import CpSearchBox from '@/components/CpSearchBox'
import CpTripCard from '../components/CpTripCard'
import cCoord from '@/utils/cCoord'

export default {
  components: {
    CpSearchBox,CpTripCard
  },
  data () {
    return {
      doLikeId:null,
      keyword : '',
      keyword_o : '',
      page    : 1,
      pageCount:1,
      isLoading : 0,
      listDatas :null,
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
     * [goDetail 跳到详细页]
     */
    goDetail (index){
      this.$router.push({name:'carpool_rides_detail',params: { id: this.listDatas[index].id ,from:"wall"}});
    },
    /**
     * [showSearchBox 显示或关闭搜索输入]
     */
    showSearchBox (show){
      this.isShowSearchBox = show ? 1 : 0;
      if(show==0  && this.keyword != "" ){
        this.keyword = '';
        this.getList(1);
      }
    },
    /**
     * [doSearch 执行搜索]
     */
    doSearch (){
      if(this.keyword_o !==  this.keyword ){
        this.keyword_o =  this.keyword
        this.getList(1)
      }

    },
    /**
     * [clickLike 点赞]
     * @param  {integer} id    [需求列表行id (infoid)]
     * @param  {integer} index [需求列表行的索引 ]
     */
    likeTrip (id,index){

      event.stopPropagation();
      this.$el.querySelector('.load-more').style.display = 'none';

      if(!this.listDatas[index].hasLike){
        this.listDatas[index].like_count = parseInt(this.listDatas[index].like_count) + 1
        this.listDatas[index].hasLike = 1;
        this.doLikeId = id;
        this.$http.post(config.urls.likeTrip,{id:id}).then(res => {
          if(res.data.code === 0) {

          }else{

          }
        })
        .catch(error => {
          console.log(error)
        })
      }
      return false;


    },
    /**
     * 取得列表
     * @param  {integer} page    页码
     * @param  {function} success 取得列表成功后执行。
     */
    getList (page,success){
      // console.log(config.urls.checkLogin)
      // alert(1)
      let params = {keyword:this.keyword,page:page};

      this.isLoading = 1;
      this.noData = 0;
      this.$http.get(config.urls.trips+"/wall",{params:params}).then(res => {
        let data = res.data.data;
        this.isLoading = 0;
        if(res.data.code === 0) {
          // this.page = data.page.currentPage + 1;
          this.page = data.page.currentPage ;
          this.pageCount = data.page.lastPage;
          data.lists.forEach((value,index,arr)=>{
            value.time = moment(value.time*1000).format('YYYY-MM-DD HH:mm');
            // console.log(time);
          })
          if(this.page > 1 ){
            var list = this.listDatas;
            list = list.concat(data.lists);
            this.listDatas = list;

          }else{
            if(data.lists.length === 0){
              this.noData = 1 ;
            }
            this.listDatas = data.lists;
          }

          this.enableInfinite = this.listDatas.length < 4 || this.pageCount ==1  ? false : true;
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
      this.getList(this.page);
      done(); // call done

    },
    /**
     * 列表加载更多
     */
    onInfinite(done) {
      if(this.page < this.pageCount){
        this.getList(parseInt(this.page)+1,(res)=>{
          this.$el.querySelector('.load-more').style.display = 'none';
        });
      }else{
        this.scrollData.noFlag = true;
        this.$el.querySelector('.load-more').style.display = 'none';
      }
      done();
    }
  },
  created () {
    this.init();
    this.getList(1);
    cCoord().push(); // 上传用户坐标。

    // this.$nextTick(function () {
    //  this.$refs['j-herblist-scrollBox'].addEventListener('scroll', this.listScroll); //监听滚动加载更多
    // })
  },
  mounted () {

  },

  activated (){
    /*if(this.$store.state.isRefreshCarpoolList){
      this.listDatas = [];
      this.getList(1);
      this.$store.commit('setIsRefreshCarpoolList',false);
    }
    this.$el.querySelector('.load-more').style.display = 'none';*/
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "carpool_rides_detail"  ) {
      to.meta.keepAlive = true;
    }else{
      to.meta.keepAlive = false;
    }
    next();
  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
