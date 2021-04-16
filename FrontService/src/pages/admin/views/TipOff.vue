<template>
  <div style="text-align:center"> 
    <el-table 
      :data="tipOffData"
      highlight-current-row
      >
        <!-- <el-table-column type="expand">
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
        </el-table-column> -->
        <el-table-column 
          prop="blogId"
          label="博客Id"
          width="100px"
        ></el-table-column>
        <el-table-column
          prop="authorName"
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
          prop="reason"
          label="投诉原因"
        ></el-table-column>
        <el-table-column
          label="操作"
          width="300px"
        >
            <template slot-scope="scope">
                <el-button type="primary" @click="articleDetail(scope.row)" size="mini">文章详情</el-button>
                <el-button type="danger" @click="ignoreTipOff(scope.row)" size="mini">忽略投诉</el-button>
                <el-button type="danger" @click="rejectedTipOff(scope.row)" size="mini">删除文章</el-button>
            </template>
        </el-table-column>
        </el-table>
        <div>
            <el-pagination
              layout="prev,pager,next"
              :total="TotalNum"
              :page-size="searchParams.limit"
              @current-change="handleCurrentChange"
            ></el-pagination>
        </div>
  </div>
</template>

<script>
import TipOffService from "@/service/TipOffService"
export default {
  name: "DBManager",
  data() {
    return {
      searchParams:{
          limit:10,
          offset:0
      },
     
      tipOffData:[],
      TotalNum:0,
    }
  },
  created(){
      this.getTipOffData()
  },
  methods:{
      articleDetail(article){
          this.$router.push(`/article/${article.blogId}`)
      },
      getTipOffData(){
          TipOffService. getTipOffData(this.searchBlogParams).then(rs=>{
              this.tipOffData=rs.data.data.tipOffData;
              this.TotalNum=rs.data.data.TotalNum
          })
      },
      rejectedTipOff(article){
          TipOffService.deleteTipOffDataById({
              tipOffId:article._id
          }).then(rs=>{
              if(rs.data.status===200){
                this.getTipOffData()
              }
          })
      },
      ignoreTipOff(article){
          TipOffService.ignoreTipOffDataById({
            tipOffId:article._id
          }).then(rs=>{
              if(rs.data.status===200){
                this.getTipOffData()
              }
          })
      },
      handleCurrentChange(page){
          this.searchParams.offset=(page-1)*this.searchParams.limit;
          this.getBlogList()
      },     
  }
};
</script>

<style>
</style>