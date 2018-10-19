<template>
  <div class="page-view page-view-profile-edit" id="Page-user-profile-departments">
    <title-bar >{{$t("message['department.title']")}}</title-bar>

    <div class="page-view-main"   >
      <group   class="cp-search-bar">
            <x-input title="<i class='fa fa-search'></i>"   class="form-control-line" :show-clear="true"  :placeholder="$t('message[\'placeholder.keyword\']')"   name="Department"  v-model="keyword" ref="input" @on-change="doSearch"></x-input>
      </group>
      <cp-scroller :position="{top:'90px'}"  :enableRefresh="false" :enableInfinite="false" id="cp-scroll-wrapper">

        <ul class="cp-departments-list">
          <li v-for="(item,index) in listData" class="cp-item btn-ripple"  @click="onSelectItem(index)" v-show="item.is_show" >
          <i class="cp-icon fa fa-circle"></i>
          <b class="name">{{item.department_name}}</b>
          </li>
        </ul>
        <div class="text-center">
          <div class="cp-nodata-tips" v-show="!listData.length>0">
            {{$t("message['department.noData']")}}
          </div>
          <spinner type="dots" size="60px" v-show="isLoading"></spinner>
        </div>


      </cp-scroller>
    </div>
  </div>
</template>

<script>
import config from '../config'
import CpScroller from '../../../components/CpScroller'

export default {
  components: {
    CpScroller,
  },
  data () {
    return {
      userData:{},
      listData:{},
      keyword:'',
      isSearching : false,
      company_id_o : 0,
      isLoading : false,
    }
  },
  computed :{
    helpText (){

    }
  },
  methods:{
    init (){

    },
    /**
     * 点击完成按钮
     */
    onSelectItem(index){
      let itemData = this.listData[index] ;
      var _this = this ;
      var postData = {
        type:"Department",
        Department:itemData.department_name,
        departmentid:itemData.departmentid
      }

      var userData_o = this.$store.state.userData;
      if(userData_o.Department == postData.Department ){
        this.$router.back();
        return false;
      }


      this.$http.post(config.urls.editProfile,postData).then(res => {
        if(res.data.code === 0 ){
          userData_o.Department = postData.Department;
          this.$store.commit('setUserData',userData_o);
          this.$router.back();
        }else{
          this.$vux.toast.text("更改失败，请稍候再试");
          return false;
        }
      }).catch(error => {
        this.$vux.toast.text("网络不通，请稍候再试");
        return false;
      })
    },

    /**
    * 取得部门。
    */
    getDepartments(){
     let params = {company_id:this.userData.company_id}
     this.isLoading = true;
     this.$http.get(config.urls.getDepartments,{params:params}).then(res => {
       this.isLoading = false;
       // console.log(res)
       if(res.data.code === 0) {
         let data = res.data.data;
         if(data.lists.length > 0){
           this.listData = data.lists;
           this.listData.forEach((value,key,arr)=>{
             value.is_show = 1;
           })
         }
       }
     }).catch(error => {
       this.$vux.toast.text("网络不通");
       return false;
     })
    },
    /**
     * 查找
     */
    doSearch(){
      let _this = this;
      this.scrollToTop();
      if( this.keyword.trim()==""){
        this.showAll();
        this.isSearching = false;
      }else{
        let keyword = this.keyword.trim().toLowerCase();
        this.isSearching = true;
        let  temp_array = this.listData;
        this.listData = temp_array.map((value,key,arr)=>{
          let department_name = value.department_name.toLowerCase();

          if(department_name.indexOf(keyword)>-1  ){
            value.is_show = 1
          }else{
            value.is_show = 0
          }
          return value;
        })
      }
    },
    /**
     * 显示所有。
     * @return {[type]} [description]
     */
    showAll(){
      this.listData = this.listData.map((value,key,arr)=>{

        value.is_show = 1
        return value;
      })
    },

    /**
     * 滚回顶部
     */
    scrollToTop(){
      document.getElementById('cp-scroll-wrapper').scrollTop = 0;

    }

  },
  created(){
    this.userData = Object.assign({},this.$store.state.userData);

  },
  mounted(){


  },
  activated(){
    this.userData = Object.assign({},this.$store.state.userData);
    if(this.company_id_o != this.userData.company_id){
      this.company_id_o = this.userData.company_id;
      this.getDepartments();
    }
    this.scrollToTop();

  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
