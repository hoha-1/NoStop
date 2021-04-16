<template>
    <div>
        <div class="chat-box">
            <el-page-header
                @back="goBack"
            ></el-page-header>
            <div class="content-area" ref="contentArea">
                <div 
                    class="msg-item"
                    v-for="(msgItem,index) in msgList"
                    :key="index"
                    :style="{
                        float:msgItem.type==='other'?'left':'right'
                    }"
                >
                    <div :style="{
                        float:msgItem.type==='other'?'left':'right',
                        }"
                    >
                        <el-avatar :src="msgItem.avatar"></el-avatar>
                        <br>
                        
                        
                    </div>
                    <div :style="{
                        float:msgItem.type==='other'?'left':'right',
                        textAlign:msgItem.type==='other'?'left':'right'
                        }"
                    >  
                        <p style="color:rgb(62, 70, 97)">{{msgItem.userName}}</p>
                        <p class="text-content" v-if="msgItem.msg.type==='text'">{{msgItem.msg.content}}</p>
                        <el-image v-else :src="msgItem.msg.content" style="margin-top:4px"></el-image>
                    </div>
                </div>
            </div>
            <div class="too-bar">
                <el-row style="text-align:center">
                    <el-col :span="2" style="line-height:50px">
                        <input
                            @change="sendImg" 
                            type="file"
                            style="position:absolute;z-index:10;opacity:0;width:24px;margin-top:7px"
                            ref="selectImg"
                        >
                        <i class="el-icon-picture-outline" style="font-size:24px"></i>
                    </el-col>
                    <el-col :span="20">
                        <el-input 
                            v-model="msgText"
                            @keypress.enter.native="sendText"
                        ></el-input>
                    </el-col>
                    <el-col :span="2">
                        <el-button 
                            type="text" icon="el-icon-s-promotion" 
                            @click="sendText"
                        ></el-button>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import defaultConfig from "@/config/config.default"

 async function cutImageBase64(files,width,quality){
    return new Promise(resolve=>{
        let file=files[0];
        let URL=window.URL || window.webkitURL;
        const blob= URL.createObjectURL(file);
        let base64;
        let img=new Image();
        img.src=blob;
        img.onload=function(){
            const that=this;
            let w=that.width;
            let h=that.height;
            let scale=w/h;
            w=width;
            h=w/scale;
            const canvas=document.createElement('canvas');
            const canCon=canvas.getContext('2d');
            canvas.width=w;
            canvas.height=h;
            canCon.drawImage(that,0,0,w,h);
            base64=canvas.toDataURL('image/jpeg',quality ||0.8);
            resolve(base64)
            
        }
    })
}
export default {
    name: "ChatHome",
    data(){
        return {
            message:{
                userName:"",
                avatar:"",
                msg:{
                    type:"",
                    content:""
                }
            },
            msgText:"",
            userData: JSON.parse(sessionStorage.getItem('userData')),
            msgList:[],
            socket:null
        }
    },
    watch:{
        userData:{
            handler(){
                this.message.userName=this.userData.userName;
                this.message.avatar=this.userData.avatar;
            },
            immediate:true

        }
    },
    methods:{
        goBack(){
            this.$router.go(-1)
        },
        sendText(){
            if(this.msgText){
                this.message.msg.type='text';
                this.message.msg.content=this.msgText;
                this.socket.send(JSON.stringify(this.message));
                this.msgList.push({
                    ...JSON.parse(JSON.stringify(this.message)),
                    type: 'me' 
                });
                this.msgText="";
                this.$nextTick(function(){
                    this.$refs.contentArea.scrollTop= this.$refs.contentArea.scrollHeight
                })
            }
        },
        sendImg(){
            cutImageBase64(this.$refs.selectImg.files,400,0.6).then((rs)=>{
                this.message.msg.content=rs;
                this.message.msg.type='img';
                this.socket.send(JSON.stringify(this.message));
                this.msgList.push({
                    ...JSON.parse(JSON.stringify(this.message)),
                    type:'me'
                })
                setTimeout(() => {
                     this.$nextTick(function(){
                this.$refs.contentArea.scrollTop= this.$refs.contentArea.scrollHeight
                })
                }, 500);
               
            })
        }
    },
    mounted(){
        this.socket=new WebSocket(`${defaultConfig.wssApiUrl}`);
        let vm=this;//在addEventListener里的this指向的是调用该函数的对象socke,所以指向vue的this要在外面存起来
        this.socket.addEventListener('open',function(){
            vm.$message.success("进入聊天")
        });
        this.socket.addEventListener('message',function(event){
            vm.msgList.push({
                ...JSON.parse(event.data),
                type:'other'
            })
            setTimeout(() => {
                vm.$nextTick(function(){
                 vm.$refs.contentArea.scrollTop= vm.$refs.contentArea.scrollHeight
                })
            }, 500); 
        })
    }
}
</script>
    
<style>
    body{
        margin: 0;
    }
    p{
        margin:0 6px;
    }
    .chat-box{
        width:100vw;
         height:100vh;
    }
    .content-area{
        width:100vw;
        height: calc(100vh - 80px);
        overflow-y:scroll;
        background-color: rgb(243, 239, 239);
    }
    .too-bar{
        position:absolute;
        bottom:0;
        height: 50px;
        width:100vw;
    }
    .msg-item{
        box-sizing: border-box;
        width:90vw;
        margin: 8px;
        
    }
    .text-content{
        margin-top:4px;
        background-color: #fff;
        border-radius: 8px;
        font-size: 18px;
        text-align: center;
        padding: 10px;
    }
</style>