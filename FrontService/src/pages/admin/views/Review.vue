<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="文章审核" name="article">
        <el-table :data="blogList">
          <el-table-column type="expand">
              <template slot-scope="scope">
                  <div v-html="scope.row.content"></div>
                  <el-tag 
                    v-for="(tag,index) in scope.row.tags" 
                    :key="index"
                    style="margin-right:6px"
                  >
                    <span>{{tag}}</span>
                  </el-tag>
              </template>
          </el-table-column>
          <el-table-column 
            prop="blogId"
            label="博客Id"
          ></el-table-column>
          <el-table-column
            prop="author.userName"
            label="作者"
          ></el-table-column>
          <el-table-column 
            label="博客封面"
          >
            <template slot-scope="scope">
                <el-image 
                 :src="scope.row.cover"
                 style="width:100px"
                ></el-image>
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="博客标题"
          ></el-table-column>
          <el-table-column
            prop="description"
            label="简介"
          ></el-table-column>
          <el-table-column
            label="操作"
            width="200px"
          >
              <template slot-scope="scope">
                  <el-button type="primary" @click="approvedBlog(scope.row)">通过</el-button>
                  <el-button type="danger" @click="rejectedBlog(scope.row)">删除</el-button>
              </template>
          </el-table-column>
        </el-table>
        <div>
              <el-pagination
                layout="prev,pager,next"
                :total="searchBlogParams.totalNum"
                :page-size="searchBlogParams.limit"
                @current-change="handleBlogCurrentChange"
              ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="新用户审核" name="user">
          <el-table :data="userList">
              <el-table-column
                label="用户名"
                prop="userName"
              ></el-table-column>
              <el-table-column
                label="头像"
              >
                <template slot-scope="scope">
                    <el-image 
                      :src="scope.row.avatar"
                      fit="fill"
                      style="width: 100px;"
                    ></el-image>
                </template>
              </el-table-column>
              <el-table-column
                label="简介"
                prop="description"
              ></el-table-column>
              <el-table-column
                label="操作"
                width="200px"
              >
                <template slot-scope="scope">
                  <el-button type="primary" @click="approvedUser(scope.row)">通过</el-button>
                  <el-button type="danger" @click="rejectedUser(scope.row)">删除</el-button>
                </template>
              </el-table-column>
          </el-table>
          <div>
              <el-pagination
                layout="prev,pager,next"
                :total="searchUserParams.totalNum"
                :page-size="searchUserParams.limit"
                @current-change="handleUserCurrentChange"
              ></el-pagination>
          </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BlogService from "@/service/BlogService";
import AuthorService from "@/service/AuthorService"
export default {
  name: "Review",
  data() {
    return {
      searchBlogParams:{
          limit:10,
          offset:0
      },
      blogList: [],
      blogTotalNum:0,
      searchUserParams:{
          limit:10,
          offset:0
      },
      userList:[],
      userTotalNum:0,
      activeName:'article'
    };
  },
  created(){
      this.getBlogList();
      this.getUserList()
  },
  methods:{
      getBlogList(){
          BlogService. getUnapprovedBlog(this.searchBlogParams).then(rs=>{
              this.blogList=rs.data.data.blogList;
              this.blogTotalNum=rs.data.data.blogTotalNum
              console.log ()
          })
      },
      approvedBlog(article){
          BlogService.approvedBlog({
              blogId:article.blogId
          }).then(rs=>{
              if(rs.data.status===200){
                  this.getBlogList()
              }
          })
      },
      rejectedBlog(article){
          BlogService.deleteBlog({
              blogId:article.blogId
          }).then(rs=>{
              if(rs.data.status===200){
                  this.getBlogList()
              }
          })
      },
      handleBlogCurrentChange(page){
          this.searchBlogParams.offset=(page-1)*this.searchBlogParams.limit;
          this.getBlogList()
      },
      getUserList(){
          AuthorService.getUnapprovedUserList(this.searchUserParams).then(rs=>{
              this.userList=rs.data.data.userList;
              this.userTotalNum=rs.data.data.userTotalNum;
          })
      },
      approvedUser(userData){
          AuthorService.approvedUser({
            key:userData.key
        }).then(rs=>{
            if(rs.data.status===200){
                this.getUserList()
            }
        })
      },
      rejectedUser(userData){
          AuthorService.deleteUser({
              key:userData.key
          }).then(rs=>{
              if(rs.data.status===200){
                  this.getUserList()
              }
          })
      },
      handleUserCurrentChange(page){
          this.searchUserParams.offset=(page-1)*this.searchUserParams.limit;
          this.getUserList()
      },


      
  }
};
</script>

<style>
</style>