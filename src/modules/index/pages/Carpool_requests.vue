<template>
  <div class="page-view cp-overhide">
    <title-bar :left-options="{showBack: true, preventGoBack:true}" @onClickBack="goHome">
      <span v-show="!isShowSearchBox">{{$t("message['carpool.title.requests']")}}</span>
      <cp-search-box
        slot="rightContent"
        @on-show-input="showSearchBox(1)"
        @on-hide-input="showSearchBox(0)"
        v-model="keyword"
        @on-keyup="doSearch"
        :placeholder="$t('message[\'placeholder.keyword\']')"
      ></cp-search-box>
    </title-bar>
    <div class="page-view-main">
      <cp-scroller
        :position="{top:'46px'}"
        :on-refresh="onRefresh"
        :on-infinite="onInfinite"
        :dataList="scrollData"
        :enableInfinite="enableInfinite"
        @on-scroll="onScroll"
        ref="scroller"
      >
        <div v-if="listDatas">
          <cp-trip-card
            v-for="(item,index) in listDatas"
            :key="item.id"
            :id="item.id"
            :name="item.p_name"
            :avatar="item.p_imgpath"
            :phone="item.p_phone"
            :department="item.p_department_format"
            :start_name="item.start_addressname"
            :end_name="item.end_addressname"
            :date="item.time.split(' ')[0]"
            :time="item.time.split(' ')[1]"
            :class="[{'cancel':item.status > 0},('item-'+item.id)]"
            :ref="'item-'+item.id"
            data-from="info"
            :typeLabel="$t('message.passenger')"
            @click.native="goDetail(index)"
          >
            <!-- <div slot="btnbar" class="cp-btns-wrapper">
             <a class="cp-btn cp-btn-accept" @click.prevent.stop="acceptRequest(item.id,index)">{{$t("message.accept")}}</a>
            </div>-->
            <div slot="btnbar" class="cp-btns-wrapper cp-goDetail-wrapper">
              <span class="pull-right">
                {{$t("message.detail")}}
                <i class="fa fa-arrow-circle-right"></i>
              </span>
              <!-- <span class="tips-text" v-if="item.status ==0 && item.from=='info'">等待车主接受</span> -->
            </div>
          </cp-trip-card>
        </div>

        <span slot="loading-text">
          <spinner type="dots" size="60px"></spinner>
        </span>
        <div class="text-center">
          <div class="cp-nodata-tips" v-show="noData">
            {{$t("message['scroller.noData']")}} ⁽⁽ƪ(ᵕ᷄≀ ̠˘᷅ )ʃ⁾⁾
            <!-- 暂时没有数据 ⁽⁽ƪ(ᵕ᷄≀ ̠˘᷅ )ʃ⁾⁾ -->
          </div>
          <spinner type="dots" size="60px" v-show="page==1 && isLoading"></spinner>
        </div>
      </cp-scroller>
    </div>
  </div>
</template>

<script>
import config from "../config";
import cFuns from "@/utils/cFuns";
import CpSearchBox from "@/components/CpSearchBox";
import CpTripCard from "../components/CpTripCard";
import cCoord from "@/utils/cCoord";

export default {
  components: {
    CpSearchBox,
    CpTripCard
  },
  data() {
    return {
      keyword: "",
      keyword_o: "",
      isShowSearchBox: 0,
      page: 1,
      pageCount: 1,
      isLoading: 0,
      listDatas: null,
      noData: 0,
      scrollData: {
        noFlag: false //暂无更多数据显示
      },
      enableInfinite: true
      // msg      : 'Welcome to Your Vue.js App'
    };
  },
  watch: {
    "scrollData.noFlag"(val, oldval) {}
  },
  methods: {
    init() {
      this.keyword = this.$route.params.keyword
        ? this.$route.params.keyword
        : "";
      this.page = this.$route.params.page ? this.$route.params.page : 1;
    },
    /**
     * [goHome 返回首页]
     */
    goHome() {
      this.$router.push({ name: "carpool" });
    },
    /**
     * [goDetail 跳到详细页]
     */
    goDetail(index) {
      this.$router.push({
        name: "carpool_requests_detail",
        params: { id: this.listDatas[index].id, from: "info" }
      });
    },
    /**
     * [showSearchBox 显示或关闭搜索输入]
     */
    showSearchBox(show) {
      this.isShowSearchBox = show ? 1 : 0;
      if (show == 0 && this.keyword != "") {
        this.keyword = "";
        this.getList(1);
      }
    },
    /**
     * [doSearch 执行搜索]
     */
    doSearch() {
      if (this.keyword_o !== this.keyword) {
        this.keyword_o = this.keyword;
        this.getList(1);
      }
    },
    /**
     * [acceptRequest 接受约车需求]
     * @param  {integer} id    [需求列表行id (infoid)]
     * @param  {integer} index [需求列表行的索引 ]
     */
    acceptRequest(id, index) {
      var itemData = this.listDatas[index];
      // event.stopPropagation();
      this.$vux.confirm.show({
        title: this.$t("message.AreYouSure"),
        content: this.$t("message['carpool.whetherAccept']", {
          username: itemData.passenger_info.name
        }),
        confirmText: this.$t("message.sure"),
        cancelText: this.$t("message.cancel"),
        onConfirm: () => {
          this.$el.querySelector(".load-more").style.display = "none";
          this.$store.commit("setLoading", {
            isShow: true,
            text: this.$t("message.submitting")
          });
          // return false;

          this.$http
            .post(config.urls.acceptRequest, { id: id })
            .then(res => {
              this.$store.commit("setLoading", { isShow: false });
              if (res.data.code === 0) {
                this.listDatas[index].status = 1;
                this.$vux.toast.text(this.$t("message.acceptSuccess"));
                setTimeout(() => {
                  // this.listDatas.splice(index, 1);
                  this.listDatas = this.listDatas.filter(t => t.infoid != id);
                }, 600);
              } else {
                this.$vux.toast.text(res.data.desc);
              }
            })
            .catch(error => {
              this.$store.commit("setLoading", { isShow: false });
              console.log(error);
            });
        }
      });
    },
    /**
     * 取得列表
     * @param  {integer} page    页码
     * @param  {function} success 取得列表成功后执行。
     */
    getList(page, success) {
      // console.log(config.urls.checkLogin)
      // alert(1)
      let params = { keyword: this.keyword, page: page };

      this.isLoading = 1;
      this.noData = 0;
      this.$http
        .get(config.urls.trips + "/info", { params: params })
        .then(res => {
          let data = res.data.data;
          this.isLoading = 0;
          if (res.data.code === 0) {
            // this.page = data.page.currentPage + 1;
            this.page = data.page.currentPage;
            this.pageCount = data.page.pageCount;
            data.lists.forEach((value, index, arr) => {
              value.time = cFuns.formatDate(
                new Date(value.time * 1000),
                "yyyy-mm-dd hh:ii"
              );
              value.p_department_format = value.p_full_department
                ? cFuns.formatDepartment(value.p_full_department)
                : value.p_department;

              // console.log(time);
            });

            if (this.page > 1) {
              var list = this.listDatas;
              list = list.concat(data.lists);
              this.listDatas = list;
            } else {
              if (data.lists.length === 0) {
                this.noData = 1;
              }
              this.listDatas = data.lists;
            }

            // this.enableInfinite = this.listDatas.length < 4 || this.pageCount ==1  ? false : true;
          } else {
            if (res.data.code === 20002 && this.page < 2) {
              this.noData = 1;
              this.listDatas = data.lists;
            }
          }
          if (typeof success === "function") {
            success(res);
          }
        })
        .catch(error => {
          this.isLoading = 0;
          console.log(error);
        });
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
      if (this.page < this.pageCount) {
        this.getList(this.page + 1, res => {
          this.$el.querySelector(".load-more").style.display = "none";
        });
      } else {
        this.scrollData.noFlag = true;
        this.$el.querySelector(".load-more").style.display = "none";
      }
      done();
    },
    /**
     * 滚动事件
     */
    onScroll(e) {
      let sTop = e.target.scrollTop;
      this.$store.commit("setCarpoolListScrollTop", sTop);
    }
  },
  created() {
    this.init();
    this.getList(1);
    cCoord().push(); // 上传用户坐标。
    // this.$nextTick(function () {
    //  this.$refs['j-herblist-scrollBox'].addEventListener('scroll', this.listScroll); //监听滚动加载更多
    // })
  },
  mounted() {},
  activated() {
    this.$refs.scroller.$el.scrollTop =
      this.$store.state.carpoolListScrollTop - 50;
    this.$el.querySelector(".load-more").style.display = "none";
    /*if(this.$store.state.isRefreshCarpoolList){
      this.listDatas = [];
      this.$store.commit('setIsRefreshCarpoolList',false);
    }
    */
  },
  beforeRouteLeave(to, from, next) {
    if (to.name == "carpool_requests_detail") {
      to.meta.keepAlive = true;
    } else {
      to.meta.keepAlive = false;
      this.$store.commit("setCarpoolListScrollTop", 0);
    }
    next();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
