let express = require("express");
let BlogTables = require("../db/BlogDataDB/blogTable");
let UserTables=require("../db/userCountDB/userTable");
let UserDetailTables=require("../db/userDetailDB/userDetailTable");
let TipOffTables=require("../db/TipOffDB/tipOffTables");

let tipOffApp=express();

tipOffApp.post("/article",function(req,res){
    TipOffTables.create({
        blogId:req.body.blogId,
        description:req.body.description,
        cover:req.body.cover,
        title:req.body.title,
        reason:req.body.reason,
        authorName:req.body.authorName
    }).then(rs=>{
        res.send({
            status:200,
            message:"举报文章成功"
        })
        
    })
})

tipOffApp.get("/article",function(req,res){
    let {offset,limit}=req.query
    UserTables.find({
        token:req.headers.authorization
    }).then(rs=>{
        if(rs.length&&rs[0].isAdmin){
            TipOffTables.find({
            },{
                __v:false
            },{
                skip:Number(offset),
                limit:Number(limit),
                sort:{
                    lastModified:-1
                }
            }).then(rs=>{
                console.log(rs)
                res.send({
                    status:200,
                    message:"查询成功",
                    data:{
                        totalNum:rs.length,
                        tipOffData:rs
                    }
                })
            })
        }else{
            res.send({
                status:500,
                message:"没有权限"
            })
        }
    })    
})

tipOffApp.delete("/article/:tipOffId", function(req,res){
    UserTables.find({
        token:req.headers.authorization 
    }).then(async (rs)=>{
        if(rs.length&&rs[0].isAdmin){
            await TipOffTables.find({
                _id: req.params.tipOffId
            }).then( async(rs) => {
                await BlogTables.deleteOne({
                    blogId: rs[0].blogId
                }).then(()=>{
                    console.log('删除成功')
                })
            })

            TipOffTables.deleteOne({
                _id: req.params.tipOffId
            }).then(rs=>{
                res.send({
                    status: 200,
                    message: '删除成功'
                })
            })
        }
    })
})

tipOffApp.delete("/tipOffData/:tipOffId",function(req,res){
    UserTables.find({
        token:req.headers.authorization 
    }).then(async (rs)=>{
        if(rs.length&&rs[0].isAdmin){
            TipOffTables.deleteOne({
                _id: req.params.tipOffId
            }).then(rs=>{
                res.send({
                    status: 200,
                    message: '删除成功'
                })
            })
        }
    })
})

module.exports={
    tipOffApp
}