let express=require("express");
let path=require("path")
let multer=require("multer");
let apiAddr=require("../config/PublicPath")
let {v4}=require("uuid");

let uploadImgFileApp=express();

let storage=multer.diskStorage({
    destination:function(req,file,cb){
        if(file.mimetype.includes("image")){
            cb(null,path.join(__dirname,"../storage/images"))
        }
    },
    filename:function(req,file,cb){
        cb(null,v4()+file.originalname)
    }
})

let uploadParams=multer({
    storage
})

let uploadConfig=uploadParams.fields([
    {
        name:"blogIllustrations",
        maxCount:9
    }
]);

uploadImgFileApp.post("/",uploadConfig,function(req,res){
    let resData=[];
    for(let i=0,len=req.files.blogIllustrations.length;i<len;i++){
        resData.push(`${apiAddr.hostAddr}${apiAddr.getImgApiAddr}/${req.files.blogIllustrations[i].filename}`)
    }

    res.setHeader("Content-Type","application/json;charset=utf-8")
    res.send({
        status:200,
        massage:"上传成功",
        data:{
            imgList:resData
        }
    })
})

module.exports={
   uploadImgFileApp 
}
