<template>
  <div class="page-view cp-overhide">
    <title-bar  :left-options="{showBack: true}" >
      <span >历史行程</span>

    </title-bar>
    <div class="page-view-main"   >
      <cp-scroller :on-refresh="onRefresh"  :dataList="scrollData" :enableInfinite="false">

        <div v-for="(item,index) in listDatas">
          <cp-route-box :start_name="item.start_info.addressname" :end_name="item.end_info.addressname">
          </cp-route-box>
        </div>


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

import CpRouteCard from '../components/CpRouteCard'
import CpScroller from '../components/CpScroller'
import CpRouteBox from '../components/CpRouteBox'
export default {
  components: {
    CpRouteCard,CpScroller,CpRouteBox
  },
  data () {
    return {

      page    : 1,
      pageCount:1,
      isLoading : 0,
      listDatas :{},
      noData:0,
      scrollData: {
          noFlag: false //暂无更多数据显示
      },

    }
  },
  methods :{
    init (){


    },
    /**
     * [goHome 返回首页]
     */
    goHome (){
      this.$router.push({name:'carpool'})
    },


    getList (page,success){
      var _this = this;
      // console.log(config.urls.checkLogin)
      // alert(1)
      let params = {page:page};

      _this.isLoading = 1;
      _this.noData = 0;
      _this.$tokenAxios.get(config.urls.getInfoLists,{params:params}).then(res => {
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
          console.log(error)
        })
    },

    onRefresh(done) {
      this.getList(this.page);
      done(); // call done

    },

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
