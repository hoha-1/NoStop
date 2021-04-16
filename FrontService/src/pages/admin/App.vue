<template>
  <div>
    <el-container>
      <el-header style="border-bottom: 1px solid #ccc;">
      <el-row :gutter="10">
        <el-col
            :offset="3"
            :span="18"
            style="display: flex; align-items: center;justify-content: space-between;"
        >
          <img src="@/assets/logo.png" style="height: 30px;" @click="goHome">
          <el-dropdown  @command="handleSelectSetting">
            <el-avatar
                :src="userData.avatar"
                :title="userData.userName"
                fit="scale-down"
                shape="square"
            >
            </el-avatar>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item disabled>{{userData.userName}}</el-dropdown-item>
              <el-dropdown-item command="signOut">登出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
      </el-header>
      <el-container>
        <el-aside>
          <el-menu 
            :default-active="activeIndex"
            class="el-menu-demo"  
            @select="handleSelect"
          >
            <el-menu-item index="1">
              <i class="el-icon-date"></i>
              <span slot="title">数据总览</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-date"></i>
              <span slot="title">审核</span>
            </el-menu-item>
            <el-menu-item index="3">
              <i class="el-icon-date"></i>
              <span slot="title">投诉处理</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-date"></i>
              <span slot="title">用户权限管理</span>
            </el-menu-item>
            <el-menu-item index="5">
              <i class="el-icon-date"></i>
              <span slot="title">数据库管理</span>
            </el-menu-item>
           </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import defaultConfig from '@/config/config.default'; 
import Authorization from '@/service/AuthorService';
export default {
  name: "App",
  data(){
    return {
      userData: {},
      activeIndex:'0'
    }
  },
  watch:{
    $route(){
      switch (this.$route.path){
        case '/dataView':
          this.activeIndex = '1';
          break;  
        case '/review':
          this.activeIndex = '2';
          break;
        case '/tipOff':
          this.activeIndex = '3';
          break;
        case '/permission':
          this.activeIndex = '4';
          break;
        case '/dbmanager':
          this.activeIndex = '5';
          break;
      }
    }
  },
   created(){
    Authorization.checkPermission().then(rs=>{
      if(rs.data.status===200){
        this.userData=rs.data.data.userData
        sessionStorage.removeItem("userData");
        sessionStorage.setItem("userData",JSON.stringify(this.userData))
      }else{
        window.location.replace("http://localhost:8080/login.html")
      }
      this.activeIndex=this.$route.params.module?this.$route.params.module:"1"
    })
  },
  methods:{
    goHome(){
      window.location.replace(`${defaultConfig.hostname}/index.html`)
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
    handleSelect(index){
      if(index!==this.activeIndex){
        switch(index){
          case '1':
            this.activeIndex='1'
            this.$router.push('/dataView');
            break;
          case '2':
            this.activeIndex='2'
            this.$router.push('/review');
            break;
          case '3':
            this.activeIndex='3'
            this.$router.push('/tipOff');
            break;
          case '4':
            this.activeIndex='4'
            this.$router.push('/permission');
            break;
          case '5':
            this.activeIndex='5'
            this.$router.push('/dbmanager');
            break;
        }
      }
      
    }
  }
}
</script>

<style scoped>

</style>