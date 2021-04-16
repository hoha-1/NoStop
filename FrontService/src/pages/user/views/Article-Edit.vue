<template>
    <div>
        <el-page-header
        @back="goBack"
        ></el-page-header>
        <global-editor @publishSuccess="goBack"></global-editor>
    </div>
</template>

<script>
import GlobalEditor from "@/components/Global-Editor"
export default {
name: "UserPage",
components:{
    GlobalEditor
},
methods:{
    goBack(){
        this.$router.go(-1)
    }
},
}
</script>

<style scoped>

</style>