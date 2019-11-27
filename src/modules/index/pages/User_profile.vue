<template>
  <div class="page-view" id="Page-user-profile" :class="{isScrollDown:isScrollDown}">
    <title-bar v-show="isScrollDown">
      <span>{{ $t("message['user.profile.title']" )}}</span>
    </title-bar>
    <div class="page-view-main">
      <cp-goback-btn v-show="!isScrollDown"></cp-goback-btn>

      <cp-scroller :enableRefresh="false" :enableInfinite="false" @on-scroll="onScroll">
        <div class="page-view-header">
          <div class="cp-heading">
            <cp-avatar :src="avatar" @click.native="$router.push({ name:'user_profile_avatar'})"></cp-avatar>
          </div>
        </div>
        <group class="cp-group">
          <group-title class="cp-group-title" slot="title">
            <i class="cp-title-icon fa fa-id-card"></i>
            {{ $t("message['user.profile.title']")}}
          </group-title>
          <cell
            :title="$t('message.name')"
            @click.native="goEdit('name')"
            :is-loading="false"
            :value="userData.name"
            is-link
          ></cell>
          <!-- <cell :title="$t('message.phone')"  @click.native="goEdit('mobile')" :is-loading="false" :value="userData.mobile" is-link></cell> -->
          <cell :title="$t('message.sex')"  :is-loading="false" :value="sex_format"></cell>

          <!-- <popup-radio
            class="cp-select"
            :title="$t('message.sex')"  
            :options="sexs"
            v-model="userData.sex"
            :placeholder="$t('message[\'placeholder.sex\']')"
            @on-change="onChangeSex"
          ></popup-radio> -->
          <!-- <popup-picker title="性别" :data="sexs" v-model="sex"   @on-change="onChangeSex" :display-format="formatSexDisplay"  ></popup-picker> -->
          <cell
            :title="$t('message.phone')"
            @click.native="$router.push({name:'user_profile_phone'})"
            :is-loading="false"
            :value="userData.phone"
            is-link
          ></cell>
        </group>
        <group class="cp-group">
          <group-title class="cp-group-title" slot="title">
            {{ $t("message['user.profile.label.department']")}}
          </group-title>
          <cell   :is-loading="false" :value="department_format"></cell>
          
        </group>
        <group class="cp-group">
          <group-title class="cp-group-title" slot="title">
            <i class="cp-title-icon fa fa-car"></i>
            {{$t("message['user.profile.label.carInformation']")}}
          </group-title>
          <cell
            :title="$t('message[\'user.profile.label.licensePlateNo\']')"
            class="cp-profile-item"
            @click.native="goEdit('carnumber')"
            :is-loading="false"
            :value="userData.carnumber"
            is-link
          ></cell>
          <cell
            :title="$t('message[\'user.profile.label.carColor\']')"
            class="cp-profile-item"
            @click.native="goEdit('carcolor')"
            :is-loading="false"
            :value="userData.carcolor"
            is-link
          ></cell>
        </group>
        <!-- <group  class="cp-group">
          <group-title class="cp-group-title" slot="title"><i  class="cp-title-icon fa fa-map-marker"></i>{{ $t("message['user.profile.label.address']")}} </group-title>
          <cell :title="$t('message[\'user.profile.label.home\']')"  class="cp-profile-item"   @click.native="selectAddress('home')" :is-loading="false" :value="userData.home_address" is-link></cell>
          <cell :title="$t('message[\'user.profile.label.company\']')" class="cp-profile-item"   @click.native="selectAddress('work')" :is-loading="false" :value="userData.company_address" is-link></cell>
        </group>-->
      </cp-scroller>
    </div>
  </div>
</template>

<script>
import config from "../config";
import cFuns from "@/utils/cFuns";

import { GroupTitle, PopupRadio, Selector } from "vux";

import CpTripCard from "../components/CpTripCard";
import CpAvatar from "@/components/CpAvatar";

export default {
  components: {
    GroupTitle,
    CpAvatar,
    PopupRadio,
    Selector
  },
  data() {
    return {
      isScrollDown: false,
      address_home: "",
      address_work: "",

      //性别
      sexs: [
        {
          key: "1",
          value: this.$t("message.male")
        },
        {
          key: "2",
          value: this.$t("message.female")
        }
      ],
      formatSexDisplay: function(value, name) {
        return value !== "0" ? name : this.$t("message['placeholder.sex']");
      },

      formatCompanyDisplay: function(value, name) {
        return value !== "0" ? name : "-";
      }
    };
  },
  computed: {
    department_format() {
      const department_full = this.userData.full_department;
      if(department_full) {
        return department_full.replace(/\,/g,' / ');
      } else {
        return '';
      }
    },
    sex_format() {
      const sex = this.userData.sex;
      if(sex === 1) {
        return this.$t("message.male");
      } else if (sex === 2) {
        return this.$t("message.female");
      }
      return '-'
    },
    userData (){
      return this.$store.state.userData;
    },
    avatar (){
      return this.$store.state.userAvatar || config.defaultAvatar;
    }
  },
  watch: {
    "userData.company_id"() {
      this.company = [this.userData.company_id];
    }
  },
  methods: {
    init() {
      this.isScrollDown = false;
    },
    /**
     * 当滚动屏幕内容时
     */
    onScroll(e) {
      let sTop = e.target.scrollTop;
      if (sTop > 10) {
        this.isScrollDown = true;
      } else {
        this.isScrollDown = false;
      }
    },

    /**
     * 当改变性别选择时。
     * @param  {string} value [所选性别值]
     */
    onChangeSex(value) {
      this.userData.sex = value;
      this.submitSelect({ type: "sex", sex: value });
    },

    /**
     * 提交改变的选择
     */
    submitSelect(postData) {
      var userData_o = this.$store.state.userData;
      if (userData_o[postData.type] == postData[postData.type]) {
        return false;
      }
      this.$http
        .patch(config.urls.passport + "/" + postData.type, postData)
        .then(res => {
          if (res.data.code === 0) {
            let data = Object.assign({}, this.userData);
            this.$store.commit("setUserData", data);
          } else {
            this.$vux.toast.text(this.$t("message['verify.modifyfail']"));
            this.userData[postData.type] = userData_o[postData.type];
          }
        })
        .catch(error => {
          this.$vux.toast.text(this.$t("message['verify.modifyfail']"));
          this.userData[postData.type] = userData_o[postData.type];
          // console.log(error)
        });
    },
    /**
     * 跳到文本更改页
     * @param  {string} field 要更改的字段
     */
    goEdit(field) {
      this.$router.push({
        name: "user_profile_edit",
        params: { field: field }
      });
    },
    /**
     * 选择家或公司地址
     * @param  {String} to 'home || work'
     */
    selectAddress(to) {
      this.$router.push({ name: "carpool_address", params: { to: to } });
    }
  },
  created() {
  },
  mounted() {
    this.init();
  },
  activated() {
    if (!this.userData.loginname) {
      this.$store.dispatch('getUserInfo');
    }
    // this.getUserInfo();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
