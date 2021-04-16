<template>
    <div @click="goArticleDetail">
        <el-card shadow="hover" style="margin:6px;width:300px;height:400px" class="box-card">
            <div slot="header" class="clearfix">
                <el-row>
                    <el-col :span=4>
                        <el-avatar :src="articleData.author.avatar"></el-avatar>
                    </el-col>
                    <el-col :span=20>
                        <el-row>
                            <el-col>
                                <span>{{articleData.author.userName}}</span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <span style="font-size:12px;color:#909399">{{ articleData.lastModified | transformTime }}</span>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </div>
            <el-row>
                <el-col>
                    <el-image
                        style="width: 260px; height: 200px"
                        :src="articleData.cover"
                        fit="cover"
                    >
                    </el-image>
                </el-col>
                <el-row>
                    <el-col style="font-size:20px;line-height:28px">
                        <span>{{articleData.title}}</span>
                        <el-tag type="danger" style="float:right" v-if="!articleData.approved">未审核</el-tag>
                    </el-col>
                </el-row>
                <el-row style="height:38px;line-height:1.3em">
                    <el-col style="font-size:12px;color:#909399; text-indent: 2em;">{{articleData.description}}</el-col>
                </el-row>
                <el-row style="font-size:14px;color:#909399">
                    <el-col :span=4>
                        <i class="el-icon-view"></i>
                        <span>{{articleData.views}}</span>
                    </el-col>
                     <el-col :span=4>
                        <i class="el-icon-chat-dot-square"></i>
                        <span>{{articleData.comment.length  }}</span>
                    </el-col>
                     <el-col :span=4>
                        <i class="el-icon-thumb"></i>
                        <span>{{articleData.likes}}</span>
                    </el-col>
                </el-row>
            </el-row>
        </el-card>
    </div>
</template>

<script>
export default {
    name:"Global-Article",
    props:{
        articleData:{
            type:Object,
            default(){
                return {
                    title: '',
                    tags: [],
                    description: '',
                    cover: '',
                    comment: [],
                    author: {},
                    lastModified: new Date(),
                    views: 0,
                    likes: 0,
                    blogId: 1, // 博客id, 一个递增字段, 用于标识一个独一无二的博客文章数据
                    approved: true
                }
            }
        }

    },
    data(){
        return {
            
        }
    },
    created(){
        if(this.articleData.description.length>40){
            this.articleData.description=`${this.articleData.description.slice(0,35)}......`
        }       
    },
    filters:{
        transformTime(time){
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
        }
    },
    methods:{
        goArticleDetail(){
            this.$router.push(`/article/${this.articleData.blogId}`)
        }
    }

}
</script>

<style>

</style>