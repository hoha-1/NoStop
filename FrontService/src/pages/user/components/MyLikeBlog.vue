<template>
    <div>
        <div class="global-article">
            <GlobalArticle
                v-for="(blogItem,index) of blogList"
                :article-data="blogItem"
                :key="index"
            ></GlobalArticle>
        </div>
        <el-pagination
            :page-size="params.limit"
            layout="prev,pager,next"
            :total="totalNum"
            @current-change="handleCurrentChange"
        ></el-pagination>
    </div>
</template>

<script>
import GlobalArticle from "@/components/Global-Article";
import BlogService from "@/service/BlogService"
export default {
    name:"MyLikeBlog",
    components:{
        GlobalArticle
    },
    data(){
        return{
            blogList:[],
            params:{
                limit:8,
                offset:0
            },
            totalNum:0
        }
    },
    created(){
        this.getBlogData()
    },
    methods:{
        getBlogData(){
            BlogService.getMyLikeBlog(this.params).then(rs=>{
                this.blogList=rs.data.data.blogList;
                this.totalNum=rs.data.data.totalNum
            })
        },
        handleCurrentChange(page){
            this.params.offset=(page-1)*this.params.limit;
            this.getBlogData()
        }
    }
}
</script>

<style>
    .global-article{
        display:flex;
        flex-wrap: wrap;

    }
</style>