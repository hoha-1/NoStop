<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="文章管理" name="article">
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
            label="审核状态"
          >
              <template slot-scope="scope">
                  <el-tag v-if="!scope.row.approved" type="danger">未审核</el-tag>
                  <span v-else style="color:#C0C4CC">已审核</span>
              </template>
          </el-table-column>
          <el-table-column
            label="操作"
          >
              <template slot-scope="scope">
                  <el-button type="danger" @click="rejectedBlog(scope.row)">删除</el-button>
              </template>
          </el-table-column>
        </el-table>
        <div>
              <el-pagination
                layout="prev,pager,next"
                :total="blogTotalNum"
                :page-size="searchBlogParams.limit"
                @current-change="handleBlogCurrentChange"
              ></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane label="用户管理" name="user">
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
                label="审核状态"
              >
                  <template slot-scope="scope">
                      <el-tag v-if="!scope.row.approved" type="danger">未审核</el-tag>
                      <span v-else style="color:#C0C4CC">已审核</span>
                  </template>
              </el-table-column>
              <el-table-column
                label="是否为管理员"
              >
                <template slot-scope="scope">
                    <el-switch 
                      v-model="scope.row.isAdmin" 
                      disabled
                    ></el-switch>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
              >
                <template slot-scope="scope">
                  <el-button type="danger" @click="rejectedUser(scope.row)">删除</el-button>
                </template>
              </el-table-column>
          </el-table>
          <div>
              <el-pagination
                layout="prev,pager,next"
                :total="userTotalNum"
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
  name: "DBManager",
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
          BlogService. getAllBlog(this.searchBlogParams).then(rs=>{
              this.blogList=rs.data.data.blogList;
              this.blogTotalNum=rs.data.data.blogTotalNum
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
          AuthorService.getAllUser(this.searchUserParams).then(rs=>{
              this.userList=rs.data.data.userList;
              this.userTotalNum=rs.data.data.userTotalNum;
          })
      },
      rejectedUser(userData){
          AuthorService.deleteUser({
              key:userData.key
          }).then(rs=>{
              console.log(rs)
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