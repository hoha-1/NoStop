<template>
    <div>
        <el-card v-for="(blackItem,index) in blackList" :key="index">
            <el-row :gutter="10">
                <el-col :span="2">
                    <el-avatar :src="blackItem.avatar"></el-avatar>
                </el-col>
                <el-col :span="18">
                    <span>{{blackItem.userName}}</span>
                    <br>
                    <span>{{blackItem.description}}</span>
                </el-col>
                <el-col :span="4">
                    <el-button 
                        type="danger"
                        icon="el-icon-s-custom"
                        @click="switchBlackList(blackItem.userName)"
                    >
                    {{ userData.userDetail.blacklist.includes(blackItem.userName) ? '已拉黑' : '拉黑' }}
                    </el-button>
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
    name:"MyBlacklist",
    data(){
        return{
            blackList:[],
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
           UserDetailService.getBlackList(this.params).then(rs=>{
                this.blackList=rs.data.data.blackList;
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