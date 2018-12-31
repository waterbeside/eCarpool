<template>
  <div class="page-view " id="Page-comment-lists">
    <title-bar  >{{$t("message['carpool.comments.title']" )}}  </title-bar>
    <div class="page-view-main"   >
      <cp-scroller :position="{top:'46px'}"  :on-refresh="onRefresh"  :dataList="scrollData" :enableInfinite="enableInfinite" id="cp-scroll-wrapper" innerID="cp-scroll-inner">
        <ul v-if="comments.length" class="cp-comment-list">
          <comment-item
            v-for="(item,index) in comments "
            :key = "index"
            :avatar = "item.avatar"
            :name = "item.name"
            :time = "item.time"
            :content = "item.content"
            :isSubmiting = "item.isSubmiting"
            :isError = "item.isError"
          ></comment-item>
        </ul>


       <span slot="loading-text"><spinner type="dots" size="60px"></spinner></span>
       <div class="text-center">
         <div class="cp-nodata-tips" v-show="noData">
           {{ $t("message['carpool.detail.noComment']" )}}
         </div>
         <spinner type="dots" size="60px" v-show="page==1 && isLoading"></spinner>
       </div>
      </cp-scroller>
      <div class="cp-comment-addbox">
        <form class="form" onsubmit="return false;">
        <div class="cp-input-wrapper" v-show="isShowAddBox">
            <textarea class="form-control" name="content" v-model="content" v-focus="isFocusContent" @focus="isFocusContent=true" @blur="isFocusContent=false"></textarea>
            <button class="btn-submit btn btn-default" :disabled="isDisabledSubmit || isSubmiting"   @click="submitComment">{{ $t("message.submit" )}} </button>
        </div>
        </form>
        <div class="cp-startBtn-wrapper" v-show="!isShowAddBox">
          <button class="btn btn-block btn-default" @click="isShowAddBox=true;isFocusContent=true">{{ $t("message['placeholder.comment']" )}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import config from '../config'
import cFuns from '@/utils/cFuns'

import CpAvatar from '@/components/CpAvatar'
import CommentItem from '../components/CpTripComment'



export default {
  components: {
    CpAvatar,CommentItem
  },
  data () {
    return {
      id       : this.$route.params.id,
      comments : [],  //列表
      comments_total:0,

      isShowAddBox : false,
      isFocusContent :false,
      content   :'',
      isSubmiting : false,


      isLoading : 0,
      noData    : 0,
      scrollData: {
          noFlag: false //暂无更多数据显示
      },
      enableInfinite:false,
      // msg      : 'Welcome to Your Vue.js App'
    }
  },
  computed:{
    isDisabledSubmit (){

      return this.content.trim() == "" ? true : false;
    }

  },
  methods :{
    init (){
      this.page    = this.$route.params.page ? this.$route.params.page : 1;
    },

    /**
    * 取得评论列表数据
    */
    getCommentLists (){
      var nowTimestamp = new Date().getTime();
      if(this.comments.length > 5  || nowTimestamp - this.comments_time < 60*1000){
        return false;
      }
      this.isLoading = true;

      let params = {
        // pagesize:20
      };
      this.$http.get(config.urls.trips+'/wall/'+this.id+'/comments',{params:params}).then(res => {

        this.isLoading = false;
        if(res.data.code == 0){
          var data = res.data.data;
          if(!data.lists.length){
            this.noData = true;
          }
          data.lists.forEach((value,index,arr)=>{
            value.avatar = value.imgpath ? config.avatarBasePath + value.imgpath : this.defaultAvatar;
            value.isSubmiting = false;
            value.time = cFuns.formatDate((new Date(value.time*1000)),"yyyy-mm-dd hh:ii");
          })
          this.comments_total = data.total ? data.total : 0;
          this.comments = data.lists;
        }else{
          this.noData = true;
        }
      }).catch(error => {
        this.isLoading = false;
        this.noData = true;
        console.log(error)
      });
    },

    /**
     * 下接刷新
     */
    onRefresh(done) {
      this.getCommentLists();
      done(); // call done

    },

    submitComment(){

      if(this.content.trim()==''){
        this.$vux.toast.text(this.$t("message['fillContent']"));
        return false;
      }
      let userData =  this.$store.state.userData;
      // console.log(userData)
      var newData = {
        content : this.content.trim(),
        time : cFuns.formatDate((new Date()),"yyyy-mm-dd hh:ii"),
        avatar : this.$store.state.userAvatar,
        name : userData.name,
        className:'cp-newAdd',
        isSubmiting : true,
        uid : userData.uid,
      }
      newData.id = 'tmp_'+(new Date().getTime());
      this.comments.push(newData);
      this.noData = false



      let postDatas = {content:this.content}

      this.$http.post(config.urls.trips+'/wall/'+this.id+'/comments',postDatas).then(res => {
        if(res.data.code === 0){
          this.content = "";
        }else{
          newData.isError = true;
          // this.comments = this.comments.filter(t => t.id != newData.id); //提交失败则从数组中删除
        }
        newData.isSubmiting = false;
        document.getElementById('cp-scroll-wrapper').scrollTop = document.getElementById('cp-scroll-wrapper').scrollHeight;
      }).catch(error => {
        newData.isSubmiting = false;
        newData.isError = true;
        console.log(error)
      })
    },

  },
  mounted () {

  },
  created () {

    this.init();
    this.getCommentLists();
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
