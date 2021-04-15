let express = require("express");
let BlogTables = require("../db/BlogDataDB/blogTable");
let UserTables=require("../db/userCountDB/userTable");
let UserDetailTables=require("../db/userDetailDB/userDetailTable");

let userDetailApp=express();

userDetailApp.post("/likes",function(req,res){
    UserTables.find({
        token:req.headers.authorization
    }).then(async (rs)=>{
        await BlogTables.updateOne({
            blogId: req.body.blogId
        },{
            $inc: {
                likes:1
            }
        }).then(()=>{
            console.log("博客得到一个赞")
        })
        
        UserDetailTables.updateOne({
            key:rs[0].key
        },{
            $push:{
                likes:req.body.blogId
            }
        }).then(()=>{
            res.send({
                status: 200,
                message: '点赞成功'
            })
        }).catch(err => {
            res.send({
                status: 500,
                message: '点赞失败'
            })
        })
    })  
 })

userDetailApp.delete("/likes/:id",function(req,res){
    UserTables.find({
        token:req.headers.authorization
    }).then(async rs=>{
        await BlogTables.updateOne({
            blogId:Number(req.params.id)
        },{
            $inc:{
                likes:-1
            }
        }).then(()=>{
            console.log("有人给博客取消点赞")
        })

        UserDetailTables.updateOne({
            key:rs[0].key
        },{
            $pull:{
                likes:Number(req.params.id)
            }
        }).then(()=>{
            res.send({
                status:200,
                massage:"取消点赞成功"
            })
        }).catch(()=>{
            res.send({
                status:500,
                massage:"取消点赞失败"
            })
        })
    })
})

userDetailApp.post('/attention', function (req, res) {
    UserTables.find({
        token:req.headers.authorization
    }).then(async (rs)=>{
        await UserTables.find({
            userName:req.body.userName
        }).then(userDetail=>{
            UserDetailTables.updateOne({
                key:userDetail[0].key
            },{
                $push:{
                    fans:rs[0].userName
                }
            }).then(()=>{
                console.log("作者粉丝添加成功")
            })
        })
        
        
        UserDetailTables.updateOne({
            key:rs[0].key
        },{
            $push:{
                attentions:req.body.userName
            }
        }).then(()=>{
            UserDetailTables.find({
                userName:req.body.userName
            }).then(()=>{
                //
            })
            res.send({
                status:200,
                massage:"关注添加成功"
            })
        }).catch(()=>{
            res.send({
                status:500,
                massage:"关注添加失败"
            })
        })
    })

})

userDetailApp.delete('/attention/:userName', function (req, res) {
    UserTables.find({
        token:req.headers.authorization
    }).then(async (rs)=>{
        await UserTables.find({
            userName:req.params.userName
        }).then(userDetail=>{
            UserDetailTables.updateOne({
                key:userDetail[0].key
            },{
                $pull:{
                    fans:rs[0].userName
                }
            }).then(()=>{
                console.log("作者粉丝取关成功")
            })
        })
        
        UserDetailTables.updateOne({
            key:rs[0].key
        },{
            $pull:{
                attentions:req.params.userName
            }
        }).then(()=>{
            res.send({
                status:200,
                massage:"取消添加成功"
            })
        }).catch(()=>{
            res.send({
                status:500,
                massage:"取消添加失败"
            })
        })
    })
})

userDetailApp.post('/blacklist',  function (req, res) {
    let key=0
    UserTables.find({
        token:req.headers.authorization
    }).then(rs=>{
        key=rs[0].key
        UserDetailTables.updateOne({
            key:rs[0].key
        },{
            $push:{
                blacklist:req.body.userName
            },
            $pull:{
                attentions:req.body.userName
            }
        }).then(()=>{
            res.send({
                status:200,
                massage:"拉黑成功"
            })
        }).catch(()=>{
            res.send({
                status:500,
                massage:"拉黑失败"
            })
        })
    })
})

userDetailApp.delete('/blacklist/:userName', function (req, res){
    UserTables.find({
        token:req.headers.authorization
    }).then(rs=>{
        UserDetailTables.updateOne({
            key:rs[0].key
        },{
            $pull:{
                blacklist:req.params.userName
            }
        }).then(()=>{
            res.send({
                status:200,
                massage:"拉黑成功"
            })
        }).catch(()=>{
            res.send({
                status:500,
                massage:"拉黑失败"
            })
        })
    })
})

userDetailApp.get('/attention', function(req,res){
    let params={};
    let {offset,limit,searchKey}=req.query;

    if(searchKey){
        params.title=searchKey;
    }

    UserTables.find({
        token:req.headers.authorization
    }).then(rs=>{
        UserDetailTables.find({
            key:rs[0].key
        },{
            attentions:true
        }).then(attentions=>{
            let totalNum=attentions[0].attentions.length
            let attentionsLists=attentions[0].attentions.slice(offset, offset + limit);
            UserTables.find({
                userName:{
                    $in:attentionsLists
                }
            },{
                userName:true,
                avatar:true,
                introduction: true
            }).then(attentionsList=>{
                res.send({
                    status:200,
                    massage:"我的黑名单查询成功",
                    data:{
                        attentionsList,
                        totalNum
                    }
                })
            }).catch((rs)=>{
                res.send({
                    status:500,
                    massage:"我的黑名单查询失败"
                })
            })
        })
    })
})

userDetailApp.get('/blacklist', function(req,res){
    let params={};
    let {offset,limit,searchKey}=req.query;

    if(searchKey){
        params.title=searchKey;
    }

    UserTables.find({
        token:req.headers.authorization
    }).then(rs=>{
        UserDetailTables.find({
            key:rs[0].key
        },{
            blacklist:true
        }).then(black=>{
            let totalNum=black[0].blacklist.length
            let blacklists=black[0].blacklist.slice(offset, offset + limit);
            UserTables.find({
                userName:{
                    $in:blacklists
                }
            },{
                userName:true,
                avatar:true,
                introduction: true
            }).then(blackList=>{
                res.send({
                    status:200,
                    massage:"我的黑名单查询成功",
                    data:{
                        blackList,
                        totalNum
                    }
                })
            }).catch((rs)=>{
                res.send({
                    status:500,
                    massage:"我的黑名单查询失败"
                })
            })
        })
    })
})

userDetailApp.get('/fan', function(req,res){
    let params={};
    let {offset,limit,searchKey}=req.query;

    if(searchKey){
        params.title=searchKey;
    }

    UserTables.find({
        token:req.headers.authorization
    }).then(rs=>{
        UserDetailTables.find({
            key:rs[0].key
        },{
            fans:true
        }).then(fans=>{
            let totalNum=fans[0].fans.length
            let fanLists=fans[0].fans.slice(offset, offset + limit);
            UserTables.find({
                userName:{
                    $in:fanLists
                }
            },{
                userName:true,
                avatar:true,
                introduction: true
            }).then(fanList=>{
                res.send({
                    status:200,
                    massage:"我的黑名单查询成功",
                    data:{
                        fanList,
                        totalNum
                    }
                })
            }).catch((rs)=>{
                res.send({
                    status:500,
                    massage:"我的黑名单查询失败"
                })
            })
        })
    })
})
module.exports={
    userDetailApp
}