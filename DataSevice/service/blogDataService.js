let express = require("express");
let BlogTables = require("../db/BlogDataDB/blogTable");
let UserTables=require("../db/userCountDB/userTable");
let UserDetailTables=require("../db/userDetailDB/userDetailTable");
let { v4 } = require('uuid');
const blogTables = require("../db/BlogDataDB/blogTable");

let blogApp = express();

blogApp.post("/create",async function(req,res){
    let newBlogData={
        title:req.body.title,
        tags:req.body.tags,
        description:req.body.description,
        cover:req.body.cover,
        content:req.body.content,
        comment:[],
        author:{},
        lastModified: new Date(),
        views: 0,
        likes: 0,
        blogId: 1,
        approved: false
    };
    
    await BlogTables.find({},{
        blogId:true  
    },
    {
        sort:{
            blogId:-1
        }
    }).then(rs=>{
        if(rs.length){
            newBlogData.blogId=rs[0].blogId+1
        }else{
            newBlogData.blogId=1
        }      
    })

    //设置博客作者信息
    UserTables.find({
        token:req.headers.authorization
    }).then(rs=>{
        newBlogData.author={
            userName:rs[0].userName,
            avatar:rs[0].avatar
        }

        //往用户详情数据里面的文章列表中添加该博客id
        UserDetailTables.updateOne({
            key:rs[0].key
        },{
            $push:{
                articles:newBlogData.blogId
            }
        }).then(rs=>{
            console.log("更新用户详情信息里的博客信息")
        })

        // 往博客数据表里面创建一个新的文章
        BlogTables.create(newBlogData).then(rs=>{
            // console.log(rs)
            res.send({
                status:200,
                message:"文章发布成功",
            })
        }).catch(err => {
            res.send({
                status: 500,
                message: '文章发布失败'
            })
        })
    })
})

blogApp.get("/getPublicBlog",async function(req,res){
    let params={};
    let blacklist=[];
    let {
        offset,
        limit,
        searchKey
    }=req.query;

    if(searchKey){
        params.title=new RegExp(`${searchKey}`);
    }

    if(req.headers.authorization){
        await UserTables.find({
            token:req.headers.authorization
        }).then(async (userInfos)=>{
            await UserDetailTables.find({
                key:userInfos[0].key
            }).then(userDetails=>{
                blacklist=userDetails[0].blacklist
            })
        })
    }

    if(blacklist.length){
        params["author.userName"]={
            $nin:blacklist
        }
    }
    let totalNum=0;
    await BlogTables.find({
        ...params,
        approved:true
    }).then(rs=>{
        totalNum=rs.length;
    })
    BlogTables.find({
        ...params,
        approved:true
    },{
        content:false,
        _id:false,
        __v:false
    },{
        skip:Number(offset),
        limit:Number(limit),
        sort:{
            lastModified:-1
        }
    }).then(blogList=>{
        res.send({
            status:200,
            message:"查询成功",
            data:{
                blogList,
                totalNum
            }
        })
    })
})

blogApp.get("/getBlogDetailById", async function(req,res){
    let params={
        blogId:Number(req.query.blogId)
    };

    await BlogTables.updateOne(
        params
    ,{
        $inc:{
            views: 1
        }
    }).then(()=>{
       console.log("博客阅览数自增1")
    })

    BlogTables.find(
        params,
        {
            __v: false,
            _id: false
        }
    ).then(rs=>{
        res.send({
            status:200,
            massage:"博客详情查询成功",
            data:{
                blogData:rs[0]
            }
        })
    })
})

blogApp.post("/comment/create",function(req,res){
    // blogTables.updateOne({
    //     blogId:req.body.blogId
    // },{
    //     $set:{comment:[]}
    // }).then(rs=>{
    //     console.log(rs[0].comment   )
    // })

    let reqData=req.body;
    let commentData={
        ...reqData.comment,
        lastModified:new Date(),
        commentId:v4(),
    }

    UserTables.find({
        token:req.headers.authorization
    }).then(rs=>{
        let key=rs[0].key;
        UserDetailTables.updateOne({
            key,
            comments:{
                $elemMatch:{
                    blogId:reqData.blogId
                }
            }
        },{
            $push:{
                "comments.$.commentData":{
                    ...commentData
                }
            }
        }).then(async (rs)=>{
            if(rs.n<1){
                let blogData={};
                await BlogTables.find({
                    blogId:req.blogId
                },{
                    title: true,
                    author: true,
                    cover: true,
                    description: true,
                    lastModified:true
                }).then(rs=>{
                    blogData=rs[0];
                })


                UserDetailTables.updateOne({
                    key
                },{
                    $push:{
                        "comment":{
                            blogId:req.blogId,
                            blogData,
                            commentData:{
                                ...commentData
                            }
                        }
                    }
                })
            }
        })
    })

    if(reqData.fatherId){
        if(reqData.toUser){
            commentData.toUser=`@${reqData.toUser}`
        }
        BlogTables.updateOne({
            blogId:reqData.blogId,
            comment:{
                $elemMatch:{
                    commentId:reqData.fatherId
                }
            }
        },{
            $push:{
                "comment.$.comment":commentData
            }
        }).then(rs=>{
            res.send({
                status:200,
                message:"评论成功",
                data: {
                    commentData
                }
            })
        })
    }else{
        BlogTables.updateOne({
            blogId:reqData.blogId,
        },{
            $push:{
                "comment":commentData
            }
        }).then(rs =>{
            console.log('新增一个二级评论');
            res.send({
                status:200,
                message: '评论成功',
                data: {
                    commentData
                }
            })
        })
    }
})

blogApp.get('/getMyBlog',function(req,res){
    let params={};
    let {offset,limit,searchKey}=req.query;

    if(searchKey){
        params.title=searchKey;
    }

    UserTables.find({
        token:req.headers.authorization
    }).then(async (rs)=>{
        await UserDetailTables.find({
            key:rs[0].key
        },{
            articles:true
        }).then(myBlog=>{
            let totalNum=myBlog[0].articles.length;
            BlogTables.find({
                blogId:{
                    $in:myBlog[0].articles
                }
            },{
                content:false,
                __id:false,
                _v:false
            },{
                skip:Number(offset),
                limit:Number(limit),
                sort:{
                    lastModified:-1
                }
            }).then(blogList=>{
                res.send({
                    status:200,
                    massage:"我的文章查询成功",
                    data:{
                        blogList,
                        totalNum
                    }
                })
            }).catch(()=>{
                res.send({
                    status:500,
                    massage:"我的文章查询失败"
                })
            })
        })
    })
})

blogApp.get('/getMyLikeBlog',function(req,res){
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
            likes:true
        }).then(myLikeBlog=>{
            let totalNum=myLikeBlog[0].likes.length;
            BlogTables.find({
                blogId:{
                    $in:myLikeBlog[0].likes
                }
            },{
                content:false,
                __id:false,
                _v:false
            },{
                skip:Number(offset),
                limit:Number(limit),
                sort:{
                    lastModified:-1
                }
            }).then(blogList=>{
                res.send({
                    status:200,
                    massage:"我的文章查询成功",
                    data:{
                        blogList,
                        totalNum
                    }
                })
            }).catch(()=>{
                res.send({
                    status:500,
                    massage:"我的文章查询失败"
                })
            })
        })
    })
})

blogApp.get('/unapprovedBlog',function(req,res){
    let params={};
    let {offset,limit,searchKey}=req.query;
    
    if(searchKey){
         params.title=searchKey
    }

    BlogTables.find({
        approved:false
    },{
        _v:false,
        __id:false
    },{
        skip:Number(offset),
        limit:Number(limit),
        sort:{
            lastModified:-1
        }
    }).then(rs=>{
        res.send({
            status:200,
            message:"查询未审核文章成功",
            data:{
                blogList:rs,
                blogTotalNum:rs.length
            }
        })
    }).catch(()=>{
        res.send({
            status:200,
            message:"查询未审核文章失败",
        })
    })
})

blogApp.post('/deleteBlog',function(req,res){
    let params = {
        blogId: req.body.blogId
    };
    UserTables.find({
        token: req.headers.authorization
    }).then(async (rs)=>{
        if (rs.length && rs[0].isAdmin){
            BlogTables.deleteOne(params).then(rs => {
                res.send({
                    status: 200,
                    message: '删除用户成功'
                })
            })
        }else{
            res.send({
                status: 401,
                message: '没有操作权限'
            })
        }
    })

})

blogApp.post('/approvedBlog',function(req,res){
    let params = {
        blogId: req.body.blogId
    };
    UserTables.find({
        token: req.headers.authorization
    }).then(async (rs)=>{
        if (rs.length && rs[0].isAdmin){
            BlogTables.updateOne(
                params,
                {
                    $set:{
                        approved: true
                    }
                }
            ).then(rs => {
                res.send({
                    status: 200,
                    message: '批准成功'
                })
            })
        }else{
            res.send({
                status: 401,
                message: '没有操作权限'
            })
        }
    })
})

blogApp.get('/getAllBlog',function(req,res){
    let params={};
    let {offset,limit,searchKey}=req.query;
    
    if(searchKey){
         params.title=searchKey
    }

    BlogTables.find({
    },{
        _v:false,
        __id:false
    },{
        skip:Number(offset),
        limit:Number(limit),
        sort:{
            lastModified:-1,
        }
    }).then(rs=>{
        res.send({
            status:200,
            message:"查询全部文章成功",
            data:{
                blogList:rs,
                blogTotalNum:rs.length
            }
        })
    }).catch(()=>{
        res.send({
            status:200,
            message:"查询全部文章失败",
        })
    })
})

blogApp.get('/getBlogInfo',function(req,res){
    UserTables.find({
        token: req.headers.authorization
    }).then(async (rs)=>{
        if (rs.length && rs[0].isAdmin){
            BlogTables.find({
            },{
                lastModified:true
            },).then((rs)=>{
                res.send({
                    status: 200,
                    message: '当前用户总是查询成功',
                    data:{
                        blogInfo:rs
                    }
                })
            })
        }else{
            res.send({
                status: 401,
                message: '没有操作权限'
            })
        }
    })
})
module.exports={
    blogApp
}