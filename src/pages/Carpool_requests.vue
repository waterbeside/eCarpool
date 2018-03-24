<template>
  <div class="page-view cp-overhide">
    <title-bar  :left-options="{showBack: true, preventGoBack:true}" @onClickBack="goHome">
      <span v-show="!isShowSearchBox">约车需求</span>
      <cp-search-box slot="rightContent" @on-show-input="showSearchBox(1)" @on-hide-input="showSearchBox(0)" v-model="keyword" @on-keyup="doSearch" ></cp-search-box>
    </title-bar>
    <div class="page-view-main"   >
      <cp-scroller :position="{top:'46px'}" :on-refresh="onRefresh" :on-infinite="onInfinite" :dataList="scrollData" :enableInfinite="enableInfinite">
         <cp-route-card
          v-for="(item,index) in listDatas"
           :key="item.id"
           :id="item.id"
           :name="item.passenger_info.name"
           :avatar="item.passenger_info.imgpath"
           :phone="item.passenger_info.phone"
           :department="item.passenger_info.Department"
           :carnumber="item.passenger_info.carnumber"
           :start_name="item.start_info.addressname"
           :end_name="item.end_info.addressname"
           :date = "item.time.split(' ')[0]"
           :time = "item.time.split(' ')[1]"
           :class="[{'cancel':item.status > 0},('item-'+item.id)]"
           :ref = "'item-'+item.id"
           data-from="info"
           typeLabel="乘客"
           @click.native="goDetail(index)"

         >
           <div slot="btnbar" class="cp-btns-wrapper">
             <a class="cp-btn cp-btn-accept" @click.prevent.stop="acceptRequest(item.id,index)">接受</a>
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

export default {
  components: {
    CpSearchBox,CpRouteCard
  },
  data () {
    return {
      keyword : '',
      keyword_o : '',
      isShowSearchBox:0,
      page    : 1,
      pageCount:1,
      isLoading : 0,
      listDatas :[],
      noData:0,
      scrollData: {
          noFlag: false //暂无更多数据显示
      },
      enableInfinite:false,
      // msg      : 'Welcome to Your Vue.js App'
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
      let _this = this;
      this.$router.push({name:'carpool_requests_detail',params: { id: this.listDatas[index].id ,from:"info"}});
    },
    /**
     * [showSearchBox 显示或关闭搜索输入]
     */
    showSearchBox (show){
      this.isShowSearchBox = show ? 1 : 0;
      if( show==0 && this.keyword != "" ){
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
     * [acceptRequest 接受约车需求]
     * @param  {integer} id    [需求列表行id (infoid)]
     * @param  {integer} index [需求列表行的索引 ]
     */
    acceptRequest (id,index){

      var _this = this;
      var itemData = _this.listDatas[index];
      // event.stopPropagation();
      this.$vux.confirm.show({
        title: '请确认',
        content: '是否接受【'+itemData.passenger_info.name+'】的约车',
        onConfirm () {
          _this.$el.querySelector('.load-more').style.display = 'none';
          _this.$store.commit('setLoading',{isShow:true,text:"提交中"});
          // return false;

          _this.$tokenAxios.post(config.urls.acceptRequest,{id:id}).then(res => {
            _this.$store.commit('setLoading',{isShow:false});
            if(res.data.code === 0) {
              _this.listDatas[index].status = 1
              _this.$vux.toast.text('搭载成功');
              setTimeout(function(){
                // this.listDatas.splice(index, 1);
                _this.listDatas = _this.listDatas.filter(t => t.infoid != id);
              },600)
            }else{
              _this.$vux.toast.text('网络好像不太畅通');
            }
          })
          .catch(error => {
            _this.$store.commit('setLoading',{isShow:false});
            console.log(error)
          })
        }
      })

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
    // this.$nextTick(function () {
    //  this.$refs['j-herblist-scrollBox'].addEventListener('scroll', this.listScroll); //监听滚动加载更多
    // })
  },
  activated (){
    if(this.$store.state.isRefreshCarpoolList){
      this.listDatas = [];
      this.getList(1);
      this.$store.commit('setIsRefreshCarpoolList',false);
    }
    this.$el.querySelector('.load-more').style.display = 'none';
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
