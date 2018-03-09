<template>
  <div class="page-view  ">
    <title-bar  :left-options="{showBack: true, preventGoBack:true}" @onClickBack="goHome">
      <span v-show="isShowSearchBox==0">墙上空座位</span>
      <cp-search-box slot="rightContent" @on-show-input="showSearchBox(1)" @on-hide-input="showSearchBox(0)" v-model="keyword" @on-keyup="doSearch" ></cp-search-box>
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
      <cp-scroller :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData" :enableInfinite="enableInfinite">

         <cp-route-card
            v-for="(item,index) in listDatas"
           :key="item.id"
           :id="item.id"
           :name="item.owner_info.name"
           :avatar="item.owner_info.imgpath"
           :phone="item.owner_info.phone"
           :department="item.owner_info.Department"
           :carnumber="item.owner_info.carnumber"
           :start_name="item.start_info.addressname"
           :end_name="item.end_info.addressname"
           :date = "item.time.split(' ')[0]"
           :time = "item.time.split(' ')[1]"
           :class="[{'cancel':item.status > 1},('item-'+item.id)]"
           :ref = "'item-'+item.id"
           typeLabel="司机"
           data-from="wall"
           @click.native="goDetail(index)"
         >
           <div slot="btnbar" class="cp-btns-wrapper">
              <div class="cp-fabBtn-wrap " :class="[{'hasLike':item.hasLike===1,'doLike':item.id === doLikeId}]">
                <b class="t">点赞</b>
                <a href="javascript:void(0);" class="btn  btn-fab" :class="item.hasLike===1 ? 'btn-danger' : 'btn-primary' " @click="likeRoute(item.id,index)">
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
         </cp-route-card>

       <span slot="loading-text"><spinner type="dots" size="60px"></spinner></span>
       <div class="text-center">
         <div class="cp-nodata-tips" v-show="noData">
           暂时没有数据 ⁽⁽ƪ(ᵕ᷄≀ ̠˘᷅ )ʃ⁾⁾
         </div>
         <spinner type="dots" size="60px" v-show="page==1 && isLoading"></spinner>
       </div>
      </cp-scroller>
    </div>
  </div>
</template>

<script>
import config from '../configs/index'
import cFuns from '../utils/cFuns'

import CpSearchBox from '../components/CpSearchBox'
import CpRouteCard from '../components/CpRouteCard'
import CpScroller from '../components/CpScroller'
export default {
  components: {
    CpSearchBox,CpRouteCard,CpScroller
  },
  data () {
    return {
      doLikeId:null,
      keyword : '',
      keyword_o : '',
      page    : 1,
      pageCount:1,
      isLoading : 0,
      listDatas :{},
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
     * [goDetail 跳到详细页]
     */
    goDetail (index){
      let _this = this;
      this.$router.push({name:'carpool_rides_detail',params: { id: _this.listDatas[index].id ,from:"wall"}});
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
      console.log(11)
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
    likeRoute (id,index){
      var _this = this;
      event.stopPropagation();
      _this.$el.querySelector('.load-more').style.display = 'none';

      if(!_this.listDatas[index].hasLike){
        _this.listDatas[index].like_count = parseInt(_this.listDatas[index].like_count) + 1
        _this.listDatas[index].hasLike = 1;
        _this.doLikeId = id;
        this.$tokenAxios.post(config.urls.likeRoute,{id:id}).then(res => {
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
      var _this = this;
      // console.log(config.urls.checkLogin)
      // alert(1)
      let params = {keyword:this.keyword,page:page};

      _this.isLoading = 1;
      _this.noData = 0;
      _this.$tokenAxios.get(config.urls.getWallLists,{params:params}).then(res => {
        let data = res.data.data;
        _this.isLoading = 0;
        if(res.data.code === 0) {
          _this.page = data.page.currentPage + 1;
          _this.pageCount = data.page.pageCount;

          if(_this.page > 1 ){
            var list = _this.listDatas;
            list = list.concat(data.lists);
            _this.listDatas = list;

          }else{
            if(data.lists.length === 0){
              _this.noData = 1 ;
            }
            _this.listDatas = data.lists;
          }
          _this.enableInfinite = _this.listDatas.length < 4 || _this.pageCount ==1  ? false : true;
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
      this.getList(this.page);
      done(); // call done

    },
    /**
     * 列表加载更多
     */
    onInfinite(done) {
      var _this = this;
      if(this.page < this.pageCount){
        this.getList(this.page+1,function(res){
          _this.$el.querySelector('.load-more').style.display = 'none';
        });
      }else{
        this.scrollData.noFlag = true;
        _this.$el.querySelector('.load-more').style.display = 'none';
      }
      done();
    }
  },
  mounted () {

  },
  created () {
    this.init();
    this.getList(1);
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
