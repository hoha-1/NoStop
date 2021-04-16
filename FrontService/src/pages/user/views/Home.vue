<template>
  <el-container>
    <el-header
    style="border-bottom:1px solid #ccc; padding:10px 0; margin-bottom:20px"
    >
      <el-row :gutter="10">
        <el-col 
        :span="18"
        :offset="3"
        style="display:flex;align-items:center;justify-content:space-between">
          <img src="@/assets/logo.png" style="width:40px">
          <el-input
            v-model="searchStr"
            placeholder="请输入搜索内容"
            style="width: 60%"
            @keypress.enter.native="goBlogListPage"
          >
            <el-button slot="append" icon="el-icon-search" @click="goBlogListPage"></el-button>
          </el-input>
          <el-dropdown v-if="hasPermission" @command="handleSelectSetting">
            <el-avatar
            :src="userData.avatar"
            :title="userData.userName"
            fit="contain"
            shape="square"
            >
            </el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item disabled>{{userData.userName}}</el-dropdown-item>
              <el-dropdown-item command="setting">设置</el-dropdown-item>
              <el-dropdown-item command="signOut">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-link type="primary" href="login.html" v-if="!hasPermission">登录</el-link>
          <el-button type="text" icon="el-icon-s-home" v-if="hasPermission" @click="goChartHome">小树洞</el-button>
          <el-button type="text" icon="el-icon-edit" v-if="hasPermission" @click="goEditArticle">写文章</el-button>
          <el-button type="text" icon="el-icon-s-data" v-if="userData.isAdmin" @click="goAdmin">站点管理系统</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="19%" v-if="hasPermission">
        <user-info :userData="userData"></user-info>
      </el-aside>
      <el-container>
        <el-main>
          <el-tabs v-model="activeName" @tab-click="switchTab">
            <el-tab-pane label="广场" name="article">
              <Community></Community>
            </el-tab-pane>
            <el-tab-pane label="我的" name="myself">
              <MyBlog></MyBlog>
            </el-tab-pane>
            <el-tab-pane label="喜欢" name="like">
              <MyLikeBlog></MyLikeBlog>
            </el-tab-pane>
            <el-tab-pane label="关注" name="comment">
              <MyAttention></MyAttention>
            </el-tab-pane>
            <el-tab-pane label="黑名单" name="attention">
              <MyBlacklist></MyBlacklist>
            </el-tab-pane>
            <el-tab-pane label="粉丝" name="blacklist">
              <MyFans></MyFans>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
      <el-dialog 
        title="收货地址" 
        :visible.sync="isShowSetting"
        width="60%"
        >
        <UserSetting @closeSetting="closeSetting"></UserSetting>
      </el-dialog>
    </el-container>
  </el-container>
</template>

<script>
import Authorization from "@/service/AuthorService";
import UserInfo from '../components/userInfo.vue';
import Community from '../components/Community.vue';
import MyBlog from '../components/MyBlog';
import MyLikeBlog from '../components/MyLikeBlog';
import MyBlacklist from '../components/MyBlacklist';
import MyFans from '../components/MyFans';
import MyAttention from '../components/MyAttentions';
import defaultConfig from '@/config/config.default';
import UserSetting from '../components/UserSetting'
export default {
  name: "Home",
  components:{
    UserInfo,
    Community,
    MyBlog,
    MyLikeBlog,
    MyBlacklist,
    MyFans,
    MyAttention,
    UserSetting
  },
  data() {
    return {
      searchStr: "",
      hasPermission:false,
      isAdmin:false,
      userData:{},
      activeName:"",
      isShowSetting: false
    };
  },
  created(){
    Authorization.checkPermission().then(rs=>{
      if(rs.data.status===200){
        this.hasPermission=true;
        this.userData=rs.data.data.userData
        sessionStorage.removeItem("userData");
        sessionStorage.setItem("userData",JSON.stringify(this.userData))
      }else{
        // window.location.replace("http://localhost:8080/login.html")
      }
      this.activeName=this.$route.params.module?this.$route.params.module:"article"
    })
  },
  methods:{
    goEditArticle(){
      this.$router.push("/editArticle")
    },
    switchTab(tab){
      this.$router.push(`/home/${tab.name}`)
    },
    signOut(){
      sessionStorage.removeItem("Authorization");
      window.location.replace(`${defaultConfig.hostname}/index.html`)
    },
    handleSelectSetting(command){
      switch(command){
        case "setting":
          this.isShowSetting=true
          break;
        case "signOut":
          this.signOut()
          break;
      }
    },
    closeSetting(){
      this.isShowSetting=false
    },
    goChartHome(){
      this.$router.push("/chatHome")
    },
    goBlogListPage(){
      if(this.searchStr){
        this.$router.push(`/blogList/${this.searchStr}`)
      }
    },
    goAdmin(){
      window.location.replace(`${defaultConfig.hostname}/admin.html`)
    }
    
  }
};
</script>

<style>
 .el-tabs__item{
   padding-left:60px;
   font-size:18px;
 }
</style>