<template>
  <div class="page-view cp-page-points  " id="Page-address-select" >
    <title-bar  :left-options="{showBack: true}">
      <span v-show="isShowSearchBox==0">{{pageTitle}}</span>
      <cp-search-box slot="rightContent" @on-show-input="showSearchBox(1)" @on-hide-input="showSearchBox(0)" v-model="keyword" @on-keyup="doSearch"   :placeholder="$t('message[\'placeholder.keyword\']')" ></cp-search-box>

    </title-bar>


    <div class="page-view-main " >
      <cp-scroller :position="{top:'46px'}"  :on-refresh="onRefresh"   :dataList="scrollData" :enableInfinite="false">
        <ul id="J-getAddress" class="cp-list-wrap cp-list-points " :class="{'doSearch':isSearching}"  >
          <li v-for="(item,index) in listDatas" class="cp-item" :class="'cp-type-'+item.address_type"  @click="onSelectAddress(index,0)" v-show="item.is_show">
            <template v-if="item.address_type=='Home'">
              <i class="fa fa-home"></i><h6>{{$t("message['user.profile.label.home']")}}</h6>
            </template>
            <template v-else-if="item.address_type=='Work'">
              <i class="fa fa-suitcase"></i><h6>{{$t("message['user.profile.label.company']")}}</h6>
            </template>
            <template v-else>
              <i class="fa fa-map-pin"></i>
            </template>
          <b class="name">{{item.addressname}}</b>
          <p class="address">{{item.address}}</p>
          </li>
        </ul>
        <ul id="J-list-mapAddress" class="cp-list-wrap cp-list-points"   >
          <li v-for="(item,index) in smListDatas" class="cp-item cp-type-frommap"   @click="onSelectAddress(index,1)" >
          <i class="fa fa-map-marker"></i>
          <b class="name">{{item.addressname}}</b>
          <p class="address">{{typeof(item.address)=="string" ? item.address : item.district}}</p>
          </li>
        </ul>


       <span slot="loading-text"><spinner type="dots" size="60px"></spinner></span>
       <div class="text-center">
         <div class="cp-nodata-tips" v-show="noData">
           {{$t("message['scroller.noData']")}} ⁽⁽ƪ(ᵕ᷄≀ ̠˘᷅ )ʃ⁾⁾
         </div>
         <spinner type="dots" size="60px" v-show="isLoading"></spinner>
       </div>
       <div class="cp-createAddress-box" @click="goCreateAddress" v-show="isShowCreateBtn">
         <p> {{$t("message['address.noAddress']")}}</p>
         <p><i class="fa fa-plus"></i> {{$t("message['address.createAddress']")}}: <b class="cp-keyword"></b></p>
       </div>
      </cp-scroller>

    </div>
    <div style="display:none" id="cp-map-hidden"></div>
  </div>

</template>

<script>
import config from '../config'
import cFuns from '@/utils/cFuns'
import CpSearchBox from '@/components/CpSearchBox'
import cModel from '@/utils/cModel'
import cGmap from '@/utils/cGmap'
export default {
  components: {
    CpSearchBox
  },
  data () {
    return {
      to: this.$route.params.to,
      keyword : '',
      mapObj:null,
      isShowSearchBox:0,
      listDatas :[],
      smListDatas :[],
      noData:0,
      scrollData: {
          noFlag: false //暂无更多数据显示
      },
      enableInfinite:false,
      isLoading:true,
      isSearching:false,
      uid:localStorage.getItem('CP_uid'),
    }
  },
  computed:{
    pageTitle (){
      let titlesArray = {
        "start": this.$t("message['label.from']"),
        "end": this.$t("message['label.to']"),
        "home":this.$t("message['user.profile.label.home']"),
        "work":this.$t("message['user.profile.label.company']"),
      }
      return typeof(titlesArray[this.to]!=="undefault") ? titlesArray[this.to] : this.$t("message['placeholder.selectAddress']")
    },
    isShowCreateBtn (){
      return this.to == "start" || this.to=="end" ? true : false;
    }
  },
  methods:{
    /**
     * 初始化地图
     */
     mapInit (){
      return new Promise ((resolve, reject) => {
        if(!this.mapObj){
          cGmap.showMap('cp-map-hidden',{autoCenter:false}).then(map=>{
            this.mapObj = map;
            this.getList();
            resolve(map);
          }).catch(error=>{
            reject(error);
          })
        }else{
          resolve(this.mapObj);
        }

      })
    },
    /**
     * [showSearchBox 显示或关闭搜索输入]
     */
    showSearchBox (show){
      this.isShowSearchBox = show ? 1 : 0;
      if(show==0){
        this.keyword = '';
        this.getList();
        this.isSearching = false;
      }
    },

    /**
     * [doSearch 进行搜索]
     */
    doSearch (){
      if(this.keyword_o !==  this.keyword ){
        this.keyword_o =  this.keyword
        // console.log(this.keyword)
        if(this.keyword==""){
          this.getList();
          this.isSearching = false;
        }else{
          this.isSearching = true;
          let  temp_array = this.listDatas;
          this.listDatas = temp_array.map((value,key,arr)=>{
            if(value.addressname && value.addressname.indexOf(this.keyword)>-1  ){
              value.is_show = 1
            }else{
              value.is_show = 0
            }
            return value;
          })
          this.searchMapAddress();
        }
        // console.log(this.listDatas);
        // this.getList(1)
      }
    },
    /**
     * [getList 显示或关闭搜索输入]
     */
    getList(refresh){
      this.isLoading = 1;

      return new Promise ((resolve, reject) => {
        if(this.$store.state.addressDefaultList){
          let list = this.$store.state.addressDefaultList;
          this.smListDatas = list;
          this.isLoading= false;
          resolve(list);
        }else{
          this.searchMapAddress("").then(res=>{
            this.$store.commit('setAddressDefaultList',res);
            this.isLoading= false;
            resolve(res);
          }).catch(error => {
            this.isLoading = 0;
            reject(error)
          });
        }

      })
      /*var nowTimestamp = new Date().getTime();
      refresh = refresh || 0;
      if(refresh){
        return this.loadList();
      }
      //打开本地数据库 查询地址列表
      cModel.myAddress('getAll',{
        orderBy:'listorder',
        success:(results,server)=>{
          var overTime = window.localStorage.getItem('CP_'+this.uid+'_addressOverTime'); //上次记录本地数据的时间
          overTime = overTime ? overTime : 0;
          // console.log(overTime)
          //当本地数据为空，或者数据过期时，重新获取
          if(!results || !results.length || ((nowTimestamp - overTime) > 7*24*60*60*1000) ){
            // console.log(overTime)
            this.loadList();
          }else{
            this.listDatas = results;
            this.isLoading = 0;
            this.listDatas.forEach((value,key,arr)=>{
              // console.log(value)
              value.is_show = 1;
              // console.log(value.address_type);
            })
          }
        }
      });*/
    },

    /**
     * 通过接口取地址列表数据
     * @param  {function} success [成功回调]
     */
    loadList (success) {
      var nowTimestamp = new Date().getTime();
      // console.log(config.urls.checkLogin)
      // alert(1)
      let params = {keyword:this.keyword,page:1};
      this.isLoading = 1;
      this.noData = 0;

      this.$http.get(config.urls.getMyAddress,{params:params}).then(res => {
        // console.log(res)
          this.isLoading = 0;
          if(res.data.code === 0) {
            let data = res.data.data;
            cModel.myAddress('clear');
            window.localStorage.setItem('CP_'+this.uid+'_addressOverTime',nowTimestamp);
            this.listDatas = data.lists.map((value,key,arr)=>{
              value.listorder = key;
              value.address = '';
              let address;
              if(value.address_type!='Home' && value.address_type!='Work'){
                if(value.addressid==arr[0].addressid || value.addressid==arr[1].addressid){
                  return value;
                }
              }
              cModel.myAddress('add',{data:value});
              value.is_show = true;
              return value;
            })

          }else{

          }
          if(typeof(success)==="function"){
            success(res);
          }
        })
        .catch(error => {
          this.isLoading = 0;
          reject(error)
        })
    },
    /**
     * 下接刷新
     */
    onRefresh(done) {
      this.getList(1);
      done(); // call done
    },
    /**
     * 通过地图查找地址
     */
    searchMapAddress (kw=""){
      return new Promise ((resolve, reject) => {

        var keyword = kw ? kw : this.keyword;
        // var keyword = "ROTH";
        // 檢查是存在本地城市信息
        var lang = cFuns.getLanguage();
        var local_city =  this.$store.state.localCity != null && typeof(this.$store.state.localCity) != "undefined" && typeof(this.$store.state.localCity.city) == 'string' ?  this.$store.state.localCity.city : "";
        // var local_city =  this.$store.state.localCity != null && typeof(this.$store.state.localCity) != "undefined" && typeof(this.$store.state.localCity.city) == 'string' ?  this.$store.state.localCity.province : "";
        cGmap.placeSearch(keyword,this.mapObj).then(res=>{

        // cFuns.amap.autoComplete(keyword,{city:local_city}).then(res=>{
          // console.log(res)
          var results = res.results;
          var status = res.status;
          if(status == 'OK'){
            this.smListDatas = [];
            if(  results.length>0){
              results.forEach((value,index,arr)=>{
                if(value.plus_code){
                  let district = cGmap.formatPlusCodeCity(value.plus_code.compound_code);
                  console.log(district)
                  let itemValue =  {
                    addressid:-1,
                    gid:value.place_id,
                    map_type: 1,
                    addressname:value.name,
                    address:value.formatted_address ? value.formatted_address : value.vicinity,
                    district:district,
                    latitude:value.geometry.location.lat(),
                    longitude:value.geometry.location.lng(),
                  }
                  this.smListDatas.push(itemValue);
                }
              })
              resolve(this.smListDatas);
            }else{
              reject(res);
            }

          }else{
            reject(res);
          }
        }).catch(error=>{
          this.$vux.toast.text(this.$t('message.networkFail'));

        })
      })
    },
    /**
     * [onSelectAddress 当选择地址时]
     * @param  {index}  index     [数据索引]
     * @param  {Boolean} isFromMap [是否来自地图]
     */
    onSelectAddress (index,isFromMap){
      var data = isFromMap ? this.smListDatas[index] : this.listDatas[index]
      var  to = this.to;
      let formData = this.$store.state.tripFormData;
      //如果是选择起点和终点
      if(to=="start"||to=="end"){
        formData[to] = data;
        this.$store.commit('setTripFormData',formData);
        this.$router.back();
        return false;
      }

    },
    goCreateAddress (){
      this.$router.push({name:'carpool_address_create',params: {to:this.to,keyword:this.keyword}})
    }
  },
  created () {
    // this.init();
    // this.$nextTick(function () {
    //  this.$refs['j-herblist-scrollBox'].addEventListener('scroll', this.listScroll); //监听滚动加载更多
    // })
  },
  activated (){
    this.mapInit();

    this.to = this.$route.params.to;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
