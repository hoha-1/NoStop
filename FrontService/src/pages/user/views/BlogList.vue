<template>
    <div>
        <el-page-header
            @back="gaBack"
        ></el-page-header>
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
    name:"BlogList",
    components:{
        GlobalArticle
    },
    data(){
        return{
            blogList:[],
            params:{
                limit:8,
                offset:0,
                searchKey:this.$route.params.searchKey
            },
            totalNum:0
        }
    },
    created(){
        this.getBlogData()
    },
    methods:{
        getBlogData(){
            BlogService.getPublicBlog(this.params).then(rs=>{
                this.blogList=rs.data.data.blogList;
                this.totalNum=rs.data.data.totalNum
            })
        },
        handleCurrentChange(page){
            this.params.offset=(page-1)*this.params.limit;
            this.getBlogData()
        },
        gaBack(){
            this.$router.go(-1)
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