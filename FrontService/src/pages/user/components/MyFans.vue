<template>
    <div>
        <el-card v-for="(fanItem,index) in fanList" :key="index">
            <el-row :gutter="10">
                <el-col :span="2">
                    <el-avatar :src="fanItem.avatar"></el-avatar>
                </el-col>
                <el-col :span="18">
                    <span>{{fanItem.userName}}</span>
                    <br>
                    <span>{{fanItem.description}}</span>
                </el-col>
                <el-col :span="4">
                    <el-button  
                        type="primary"
                        :icon="userData.userDetail.attentions.includes(fanItem.userName)?'el-icon-check':'el-icon-plus'"
                        @click="switchAttentions(fanItem.userName)"
                    >{{userData.userDetail.attentions.includes(fanItem.userName)?'已互关':'互关'}}</el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-pagination
            :page-size="params.limit"
            layout="prev,pager,next"
            :total="totalNum"
            @current-change="handleCurrentChange"
        ></el-pagination>
    </div>
</template>

<script>
import UserDetailService from "@/service/UserDetailService"
export default {
    name:"MyAttention",
    data(){
        return{
            fanList:[],
            params:{
                limit:8,
                offset:0
            },
            totalNum:0,
            userData:JSON.parse(sessionStorage.getItem('userData')),
        }
    },
    created(){
        this.getBlogData()
    },
    methods:{
        getBlogData(){
           UserDetailService.getFanList(this.params).then(rs=>{
                this.fanList=rs.data.data.fanList;
                this.totalNum=rs.data.data.totalNum
            })
        },
        handleCurrentChange(page){
            this.params.offset=(page-1)*this.params.limit;
            this.getBlogData()
        },
        switchBlackList(userName){
            if(this.userData.userDetail.blacklist.includes(userName)){
                let tempData=JSON.parse(sessionStorage.getItem("userData"));
                tempData.userDetail.blacklist.splice(tempData.userDetail.blacklist.indexOf(userName),1);
                
                sessionStorage.setItem("userData",JSON.stringify(tempData));

                this.userData=tempData;

                UserDetailService.unBlickList({
                    userName: userName
                }).then(rs=>{
                    if(rs.data.status===200){
                        this.$message.success('取消拉黑成功')
                    }else{
                        this.$message.error('取消拉黑失败')
                    }
                })
            }else{
                let tempData=JSON.parse(sessionStorage.getItem("userData"));
                tempData.userDetail.blacklist.push(userName)
                sessionStorage.setItem("userData",JSON.stringify(tempData));

                this.userData=tempData;

                UserDetailService.setBlackList({
                   userName: userName
                }).then(rs=>{
                     if(rs.data.status===200){
                        this.$message.success('拉黑成功')
                    }else{
                        this.$message.error('拉黑失败')
                    }
                })
            }
        },
        switchAttentions(userName){
            if(this.userData.userDetail.attentions.includes(userName)){
                let tempData=JSON.parse(sessionStorage.getItem("userData"));
                tempData.userDetail.attentions.splice(tempData.userDetail.attentions.indexOf(userName),1);
                
                sessionStorage.setItem("userData",JSON.stringify(tempData));

                this.userData=tempData;

                UserDetailService.unAttentions({
                    userName: userName
                }).then(rs=>{
                     if(rs.data.status===200){
                        this.$message.success('取消关注成功')
                    }else{
                        this.$message.error('取消关注失败')
                    }
                })
                
            }else{
                let tempData=JSON.parse(sessionStorage.getItem("userData"));
                tempData.userDetail.attentions.push(userName)
                sessionStorage.setItem("userData",JSON.stringify(tempData));

                this.userData=tempData;

                UserDetailService.setAttentions({
                    userName: userName,
                }).then(rs=>{
                    if(rs.data.status===200){
                        this.$message.success('关注成功')
                    }else{
                        this.$message.error('关注失败')
                    }
                })
            }
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