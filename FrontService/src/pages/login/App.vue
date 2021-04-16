<template>
  <div style="width:100vw;height:100vh">
    <el-row
    :gutter="10"
    style="width:100%;height:100%"
    >
      <el-col :span="10">
        <div class="login-wrappet" v-if="islogin">
          <h1 style="text-align:center">登录</h1>
          <el-form ref="loginForm" :model="loginForm" label-width="100px" :rules="rules">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="loginForm.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="passWord">
              <el-input type="password" v-model="loginForm.passWord" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
              <el-button type="danger" @click="resetForm('loginForm')">重置</el-button>
            </el-form-item>
          </el-form>
          <div style="text-align:right">
            没有账号,点击<el-button type="primary" @click="switchStatus">注册</el-button>
          </div>
        </div>
        <div class="register-wrappet" v-else>
          <h1 style="text-align:center">注册</h1>
          <el-form ref="registerForm" :model="registerForm" label-width="100px" :rules="rules2">
            <el-form-item label="头像" prop="avatar">
              <el-upload
                class="avatar-uploader"
                :action="`${defaultConfig.baseApiUrl}/uploadImg`"
                name="blogIllustrations"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
              >
                <img v-if="registerForm.avatar" :src="registerForm.avatar" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="registerForm.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="passWord">
              <el-input type="password" v-model="registerForm.passWord" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassWord">
              <el-input type="password" v-model="registerForm.confirmPassWord" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('registerForm')">注册</el-button>
              <el-button type="danger" @click="resetForm('registerForm')">重置</el-button>
            </el-form-item>
          </el-form>
          <div style="text-align:right">
            有账号,点击<el-button type="primary"  @click="switchStatus">登录</el-button>
          </div>
        </div>
      </el-col>
      <el-col
      :span="14"
      class="bg-img"
      style="height:100%"
      >
      </el-col>
    </el-row>
  </div>
</template>

<script>
import defaultConfig from "@/config/config.default";
import AuthorService from "@/service/AuthorService"
export default {
  name: "loginPage",
  data(){
    var  validatePass=(rules,value,callback)=>{
      if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.registerForm.passWord !== '') {
            this.$refs.registerForm.validateField('confirmPassWord');
          }
          callback();
        } 
    };
    var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerForm.passWord) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return{
      defaultConfig,
      islogin:true,
      loginForm:{
        passWord:"",
        userName:""
      },
      registerForm:{
        passWord:"",
        userName:"",
        confirmPassWord:"",
        avatar:""
      },
      rules:{
         userName:[
          {
            required:true,
            message:"请输入用户名",
            trigger:"blur"
          },
          {
            min:4,
            max:10,
            message:"用户名长度在4到10个字符之间",
            trigger:"blur"
          }
        ],
        passWord:[
           {
            required:true,
            message:"请输入密码",
            trigger:"blur"
          },
          {
            min:6,
            max:16,
            message:"密码长度在6到16个字符之间",
            trigger:"blur"
          }
        ]
      },
      rules2:{
        userName:[
          {
            required:true,
            message:"请输入用户名",
            trigger:"blur"
          },
          {
            min:4,
            max:10,
            message:"用户名长度在4到10个字符之间",
            trigger:"blur"
          }
        ],
        passWord:[
           {
            required:true,
            message:"请输入密码",
            trigger:"blur"
          },
          {
            min:6,
            max:16,
            message:"密码长度在6到16个字符之间",
            trigger:"blur"
          },
          {
            validator:validatePass,
            trigger:"blur"
          }
        ],
        confirmPassWord:[
           {
            required:true,
            message:"请输入确认密码",
            trigger:"blur"
          },
          {
            min:6,
            max:16,
            message:"密码长度在6到16个字符之间",
            trigger:"blur"
          },
          {
            validator:validatePass2,
            trigger:"blur"
          }
        ]
      }
    }
  },
  methods:{
    switchStatus(){
      this.islogin=!this.islogin;
    },
    submitForm(formName){
      this.$refs[formName].validate(valid=>{
        if(valid){
          if(formName==="loginForm"){
            AuthorService.loginUser(this.loginForm).then(rs=>{
              if(rs.data.status===200){
                this.$message.success("登录成功");
                sessionStorage.setItem("Authorization",rs.headers.authorization);
                window.location.replace(`${defaultConfig.hostname}/index.html`);
              }else{
                this.$message.error("登录失败"+rs.data.message);
              }
            })
          }else{
            AuthorService.registerUser(this.registerForm).then(rs=>{             
              this.$message.success("注册成功:请等待审核");
              if(rs.data.status===200){
                sessionStorage.setItem("Authorization",rs.headers.authorization);
                // window.location.replace("http://localhost:8080/index.html");
              }
            }) 
          }
        }else{
          this.$message.error("验证失败")
        }
      })
    },
    resetForm(formName){
      this.$refs[formName].resetFields()
    },
    handleAvatarSuccess(rs){
      this.registerForm.avatar=rs.data.imgList[0]
    }
  },
  created(){
    if(sessionStorage.getItem("Authorization")){
      // window.location.replace("http://localhost:8080/index.html");
    }
  }
}
</script>

<style>
  body{
    margin:0;
  }
  .login-wrappet,.register-wrappet{
    width: 80%;
    margin:auto;
  }
  .bg-img{
    background-image: url("./assets/bg-img.webp");
    background-size: cover;
    background-position: center;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px !important;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>