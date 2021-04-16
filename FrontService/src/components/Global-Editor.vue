<template>
    <el-card class="box-card" v-loading="isPublishing">
        <div slot="header" class="clearfix">
            <span>写文章</span>
            <el-button style="float: right; padding:3px 0" type="text" @click="publishBlog">发布</el-button>
        </div>
        <el-row :gutter="3">
            <el-col :span="6">
                <el-upload
                    class="avatar-uploader"
                    :action="`${defaultConfig.baseApiUrl}/uploadImg`"
                    name="blogIllustrations"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                >
                    <img v-if="cover" :src="cover" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-col>
            <el-col :span="18">
                <el-row :gutter="10">
                    <el-col :span="24">
                        <el-input v-model="title" placeholder="请输入文章标题"></el-input>
                    </el-col>
                </el-row>
                 <el-row :gutter="10" style="margin-top:20px">
                    <el-col :span="24">
                        <el-input v-model="description" placeholder="请输入文章描述"></el-input>
                    </el-col>
                </el-row>
                 <el-row :gutter="10" style="margin-top:20px">
                    <el-col :span="24">
                        <el-tag
                            :key="tag"
                            v-for="tag in tags"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(tags)">
                            {{tag}}
                        </el-tag>
                        <el-input
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="inputValue"
                            ref="saveTagInput"
                            size="small"
                            v-on:keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                            >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col>
                <div id="editor" ref="editor"></div>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
import defaultConfig from "@/config/config.default";
import ImgFileService from "@/service/ImgFileService";
import BlogService from "@/service/BlogService"
import Editor from "wangeditor";
import hljs from "highlight.js"
export default {
    name:"Global-Editor",
    data(){
        return {
            defaultConfig,
            title:"",
            description:"",
            tags:[],
            cover:"",
            inputVisible:false,
            inputValue:"",
            editor:null,
            isPublishing:false
            
        }
    },
    mounted(){
        this.editor=new Editor(this.$refs.editor);//初始化编辑器实例
        this.editor.highlight=hljs;//实现编辑器的代码高亮
        
        //编辑器的基本尺寸,聚焦,占位符等相关配置
        this.editor.config.height=800;
        this.editor.config.zIndex=1000;
        this.editor.config.plaseholder="请输入文章内容";
        this.editor.config.foucus=true;

        //插入本地图片,实现本地图片上传并插入编辑器里面
        this.editor.config.uploadImgMaxSize=2*1024*1024;
        this.editor.config.uploadImgMaxLength=9;
        this.editor.config.customUploadImg=function(resultFiles,inserImgFn){
        // resultFiles 相当于是input type=file 所选中的目标
        // insertImgFn 回调函数, 获取图片的最终地址, 插入到编辑器里面
            let imgData=new FormData();
            for(let i=0;i<resultFiles.length;i++){
                imgData.append("blogIllustrations",resultFiles[i])
            }
            ImgFileService.uploadImgFile(imgData).then(rs=>{
                for(let i=0;i<resultFiles.length;i++){
               inserImgFn(rs.data.data.imgList[i])
            }
            })

        }

        this.editor.create()
    },
    methods:{
        handleAvatarSuccess(rs){
            this.cover=rs.data.imgList[0]
        },
        handleClose(tags){
            //删除tag
            this.tags.splice(tags.indexOf(tags),1)
        },
        handleInputConfirm(){
            if(this.inputValue){
                this.tags.push(this.inputValue)
            }
            this.inputVisible=false;
            this.inputValue="";
            
           
        },
        showInput(){
            this.inputVisible=true;
            console.log(this.$refs.saveTagInput);
            this.$nextTick(()=> {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        publishBlog(){
            let blogData={
            title:this.title,
            description:this.description,
            tags:this.tags,
            cover:this.cover,
            content:this.editor.txt.html()
            };
            if(this.title&&this.description&&this.tags.length&&this.cover&&blogData.content){
                this.isPublishing = true;
                BlogService.createBlog(blogData).then(rs=>{
                    if(rs.data.status===200){
                        this.$message.success("发布成功");
                        this.$emit("publishSuccess")
                    }else{
                        this.$message.error("发布失败")
                    }
                }).finally(()=>{
                    this.isPublishing=false;
                })
            }else{
                 this.$message.warning('博客数据不全, 请完善后再发表');
            }
        },
        beforeDestroy(){
            this.editor.destroy();
        }
    }
}
</script>

<style>
/* 上传样式 */
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

/* 标签样式 */
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
