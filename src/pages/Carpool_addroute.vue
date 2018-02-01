<template>
  <div class="page-view" :class="'cp-modal-add-'+type" id="Page-route-add">
    <div class="page-view-inner" >
      <title-bar  :left-options="{showBack: true}">{{type=="info"?"发布约车需求":"发布空座位"}}</title-bar>
      <div class="page-view-main" >
        <div class="cp-map-wap">
          <el-amap class="amap-box" :vid="'amap-vue'"></el-amap>
          <!-- <cp-map class="cp-map-content" id="map-add-content" style="width:100%; height:100%; min-height:500px;">地图加载中</cp-map> -->
          <div class="cp-map-form">
            <form   method="post" onsubmit="return false;">
              <div class="cp-map-form-inner">

                <div class="cp-selectbtn-wrap cp-needTime-sWrap" id="J-needTime">

                  <popup-picker class="btn-ripple"     v-model="formData.time" :data="timeDataArray" :display-format="formatDateDisplay" >
                    <template slot="title" slot-scope="props"><!-- use scope="props" when vue < 2.5.0 -->
                      <span :class="props.labelClass" :style="props.labelStyle"  >
                        <i class="fa fa-clock-o"></i>
                        <span style="vertical-align:middle;">出发时间</span>
                      </span>
                    </template>
                  </popup-picker>
                </div>
                <div class="cp-selectbtn-wrap cp-seatCount-sWrap" id="J-pick-seatCount">
                  <popup-picker class=""     v-model="formData.seat_count" :data="[[1,2,3,4,5,6,7,8,9,10]]"  >
                    <template slot="title" slot-scope="props"><!-- use scope="props" when vue < 2.5.0 -->
                      <span :class="props.labelClass" :style="props.labelStyle"  >
                        <i class="fa fa-car"></i>
                        <span style="vertical-align:middle;">空位数</span>
                      </span>
                    </template>
                  </popup-picker>
                </div>
                <div>
                  <div class="cp-selectbtn-wrap cp-startp-wrap" id="J-startPoint">
                    <a class="btn btn-ripple" onclick="return  pageMethods.addressSelect(\'start\');" href="javascript:void(0);">
                      <i class="fa fa-map-marker"></i>
                      <span class="cp-ph">起点</span>
                      <span class="cp-text">{{formData.text_start}}</span>
                    </a>
                  </div>
                  <div class="cp-selectbtn-wrap cp-endp-wrap"  id="J-endPoint">
                    <a class="btn" @click="">
                      <i class="fa fa-map-marker"></i>
                      <span class="cp-ph">终点</span>
                      <span class="cp-text">{{formData.text_end}}</span>
                    </a>
                  </div>
                </div>

                <x-button class="cp-btn " type="primary" :disabled="disableSubmitBtn" style="border-radius:99px;"><i class="cp-icon fa fa-paper-plane"></i>发布</x-button>


              </div>
            </form>
          </div>
        </div>
        <!-- /cp-map-wrap -->
      </div>
    </div>
  </div>
</template>

<script>

import config from '../configs'
import cFuns from '../utils/cFuns'


export default {
  components: {

  },
  data () {
    return {
      type: this.$route.params.type,
      formData:{
        time:[],
        seat_count:['4']
      },
      disableSubmitBtn:true,

      time:[],
      formatDemoValue: "请输入时间",
      formatDateDisplay: function (value, name) {
        // console.log(name);
        // console.log(value);
        // return `${value}`
        return name.split(" ")[0]+" "+`${value[1]}`+":"+`${value[2]}`
      }
    }
  },
  computed:{

    timeDataArray (){
      return cFuns.returnNeedTimeDatas(0,0)
    }

  },
  methods: {
    //init
    init (){

    },




  },
  mounted () {


  },
  activated (){
    let d = new Date();
    this.formData.time = [cFuns.formatDayItemData(d).value, cFuns.fixZero(d.getHours())+"",cFuns.fixZero(d.getMinutes())+""];

    // this.loadUserInfo()
  }


}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
