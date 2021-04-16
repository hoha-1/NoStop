<template>
  <div>
    <el-row>
      <el-col :span="2" :offset="4">
        <el-avatar
          :src="userData.avatar"
          style="width: 40px; height: 40px; margin-left: 60px"
        ></el-avatar>
      </el-col>
      <el-col :span="10">
        <el-input
          v-model="articleCommentStr"
          placeholder="输入评论内容"
          @keyup.enter.native="addComment('father',comment)"
        ></el-input>
      </el-col>
      <el-col :span="4">
        <el-button 
        type="primary" 
        @click="addComment('father',comment)"
        >发布评论</el-button>
      </el-col>
    </el-row>
    <div v-for="(commentItem, index) of comment" :key="index">
      <el-row>
        <el-col :span="2" style="padding-left:40px">
          <el-avatar
          :src="commentItem.userData.avatar"
          style="width: 60px; height: 60px"
          ></el-avatar>
        </el-col>
        <el-col :span="22">
          <el-row>
            <el-col :span="24">
              <div style="color:rgb(62, 70, 97);line-height:30px;font-weight: bold;">{{ commentItem.userData.userName }}</div>
              <div style="font-size:20px">{{ commentItem.content }}</div>
              <div style="color:rgb(83, 93, 122);line-height:30px">
                <span>{{commentItem.lastModified | transformTime}}</span>
                <el-button
                class="button-reply" 
                type="text"
                @click="switchComment(commentItem,comment,'1level')"
                 >回复</el-button>
              </div>
            </el-col>
            <el-col>    
              <el-row v-if="commentItem.isComment" style="margin-bottom:10px">
                <el-col :span="10">
                  <el-input
                    :ref="commentItem.commentId"
                    v-model="commentStr"
                    :placeholder="`回复@${commentItem.userData.userName}`"
                    @keyup.enter.native="addComment('son',commentItem)"
                  ></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button
                  type="primary" 
                  @click="addComment('son',commentItem)"
                  >回复评论</el-button>
                </el-col>
              </el-row>
            </el-col>  
          
            <el-col :span="24">
              <div v-for="(sonCommentItem, index) of commentItem.comment" :key="index">
                <el-row>
                  <el-col :span="1">
                     <el-avatar
                        :src="sonCommentItem.userData.avatar"
                        style="width: 40px; height: 40px"
                     ></el-avatar>
                  </el-col>
                  <el-col :span=22>
                    <el-row>
                      <el-col :span="24">
                        <span style="color:rgb(62, 70, 97);line-height:30px;font-weight: bold;margin-right:20px">{{sonCommentItem.userData.userName}}</span>
                        <span style="color:#2D9DBF;margin-right:10px " v-if="sonCommentItem.toUser">回复{{sonCommentItem.toUser}}:</span>
                        <span style="font-size:20px">{{sonCommentItem.content }}</span>
                      </el-col>
                      <el-col :span="24">
                        <span>{{sonCommentItem.lastModified | transformTime}}</span>
                        <el-button 
                           class="button-reply"  
                           type="text"
                           @click="switchComment(sonCommentItem,commentItem.comment,'2level')"
                           >回复
                        </el-button>
                      </el-col>
                    </el-row>
                  </el-col>
                </el-row>
                <el-row v-if="sonCommentItem.isComment" style="margin-bottom:10px">
                  <el-col :span="10">
                    <el-input
                      :ref="sonCommentItem.commentId"
                      v-model="commentStr"
                      :placeholder="`回复@${sonCommentItem.userData.userName}`"
                      @keyup.enter.native="addComment('grandson',commentItem,sonCommentItem)"
                    ></el-input>
                  </el-col>
                  <el-col :span="4">
                    <el-button
                     type="primary" 
                     @click="addComment('grandson',commentItem,sonCommentItem)"
                     >回复评论</el-button>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-divider style="width:80%"></el-divider>
    </div>  
  </div>
</template>

<script>
import BlogService from "@/service/BlogService"
export default {
  name: "Global-Comment",
  props: {
    blogId: {
      type: Number,
      default: 0,
    },
    comment: {
      type: Array,
      default() {
        return [

        ]
      }
    }
  },
  data() {
    return {
      userData: JSON.parse(sessionStorage.getItem("userData")),
      articleCommentStr: "",
      commentStr: '',
      isComment:false,
    };
  },
  created(){
    if(!this.userData){
      this.userData={
        avatar:""
    }
  }
  },
  methods: {
    addComment(type,target,target1) {
      let commentData={
          blogId:this.blogId,
          comment:{},
          fatherId:undefined
      }
      
      switch(type){
          case "father":
            if(!this.articleCommentStr){
              this.$message.error(("发布评论不能为空"));
              break;
            }
            target.isComment=false;
              commentData.comment={
                  userData:{
                      userName:this.userData.userName,
                      avatar:this.userData.avatar
                  },
                  content:this.articleCommentStr,
                  isComment: false,
                  comment: []
              }
              this.articleCommentStr="";
              BlogService.createBlogComment(commentData).then(rs=>{
                target.push(rs.data.data.commentData)
              })
              break;
          case "son":
            if(!this.commentStr){
              this.$message.error(("发布评论不能为空"));
              break;
            }
              target.isComment=false;
              commentData.fatherId = target.commentId;
              commentData.comment={
                  userData:{
                      userName:this.userData.userName,
                      avatar:this.userData.avatar
                  },
                  content:this.commentStr,
                  isComment: false,
                  comment: []
              }
              this.commentStr="";
              BlogService.createBlogComment(commentData).then(rs=>{
                target.comment.push(rs.data.data.commentData);
              })
              break;
          case "grandson":
            if(!this.commentStr){
              this.$message.error(("发布评论不能为空"));
              break;
            }
              target1.isComment=false;
              commentData.fatherId = target.commentId;
              commentData.toUser=target.userData.userName;
              commentData.fromCommentId=target1.commentId;
              commentData.comment={
                  userData:{
                      userName:this.userData.userName,
                      avatar:this.userData.avatar
                  },
                  content:this.commentStr,
                  isComment: false,
                  comment: [],
              }
              this.commentStr="";
              BlogService.createBlogComment(commentData).then(rs=>{
                target.comment.push(rs.data.data.commentData);
              })
              break;
      }
    },
    switchComment(preCommentItem,fatherCommentItem,type){
      switch(type){
        case '1level':
          this.articleCommentStr=""
           this.comment.forEach(item=>{
             if(item!==preCommentItem){
               item.isComment=false;
               item.comment.forEach(item2=>{
                 item2.isComment=false
               })
             }
           });
           preCommentItem.comment.forEach(item=>{
             item.isComment=false
           })
           
          break;
        case '2level':
          this.commentStr=""
          this.comment.forEach(item=>{
            item.isComment=false;
            item.comment.forEach(item2=>{
              if(item2!==preCommentItem){
                item2.isComment=false
              }
            })
          })
          fatherCommentItem.forEach(item=>{
            if(item!==preCommentItem){
                item.isComment=false
              }
          })
          break;
      }

      preCommentItem.isComment=!preCommentItem.isComment;

      if(preCommentItem.isComment){
        this.$nextTick(() => {
            this.$refs[preCommentItem.commentId][0].focus();
          });
      }
    }
  },
  filters: {
    transformTime(time) {
      let blogCreateTime = new Date(time); // 获取博客发布的时间
      let currentTime = new Date(); //当前时间
      let offsetTime = currentTime - blogCreateTime; // 时间差 单位是ms
      let offsetST = offsetTime / 1000; // 转成s
      let offsetMT = offsetST / 60; // min
      let offsetHT = offsetMT / 60; // 转成h
      let offsetDT = offsetHT / 24; // days
      if (offsetDT >= 365) {
        return `发表于${Math.floor(offsetDT / 365)} 年之前`;
      } else if (offsetDT >= 30 && offsetDT < 365) {
        return `发表于${Math.floor(offsetDT / 30)} 月之前`;
      } else if (offsetDT >= 7 && offsetDT < 30) {
        return `发表于${Math.floor(offsetDT / 7)} 周之前`;
      } else if (offsetDT >= 1 && offsetDT < 7) {
        return `发表于${Math.floor(offsetDT)} 天之前`;
      } else if (offsetHT >= 1) {
        return `发表于${Math.floor(offsetHT)} 小时之前`;
      } else if (offsetMT >= 1) {
        return `发表于${Math.floor(offsetMT)} 分钟之前`;
      } else if (offsetST >= 0) {
        return `发表于${Math.floor(offsetST)} 秒钟之前`;
      }
    },
  },
};
</script>

<style> 
  .button-reply:hover{
    color:#2D9DBF;
  }
  .button-reply{
    margin-left:30px;
    color:rgb(83, 93, 122)
  }

  /* 设置分割线宽 */
.el-divider--horizontal{
  width: 95%;
  margin:24px auto;
}
</style>