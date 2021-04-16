<template>
    <el-card class="box-card">
        <el-image
        :src=userData.avatar
        style="width : 100%;height:300px;margin : auto"
        fit="cover"
        >
        </el-image>
        <el-row>
            <el-col :span="24" style="text-align:center">
                <span>{{userData.userName}}</span>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top:20px"> 
            <el-col :span="24" style="text-align:center">
                <span>{{userData.introduction}}</span>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="text-align:center;margin-top:20px">
            <el-col :span="8">
                <el-badge class="mark" :value="120" size="mini" :max="99">
                    <el-button type="primary" size="mini">关注</el-button>
                </el-badge>
            </el-col>
            <el-col :span="8">
               <el-badge class="mark" :value="110" size="mini" :max="99">
                    <el-button type="primary" size="mini">粉丝</el-button>
                </el-badge>
            </el-col>
            <el-col :span="8">
               <el-badge class="mark" :value="140" size="small" :max="99">
                    <el-button type="primary" size="mini">黑名单</el-button>
                </el-badge>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
export default {
    name:"userInfo",
    props:{
        userData:{
            type:Object,
            default(){
                return{

                }
            }
        }
    },
    components:{

    }
}
</script>

<style>

</style>