let express=require("express");
let {v4}=require("uuid");
let crypto=require("crypto");
let UserTables=require("../db/userCountDB/userTable");
let UserDetailTables=require("../db/userDetailDB/userDetailTable");
let BlogTables=require("../db/BlogDataDB/blogTable")

function enCryptData(data,key,algorithm){
    if(!crypto.getHashes().includes(algorithm)){
        throw new error("不支持此哈希函数");
    }
    const hmac=crypto.createHmac(algorithm,key);
    hmac.update(data);
    return hmac.digest("hex");
}

let authenticationApp=express();

authenticationApp.post("/registerUser",function(req,res){
    let key=v4();
    let passWord=enCryptData(req.body.passWord,key,"sha256");
    let userName=req.body.userName;
    let avatar=req.body.avatar;
    let token=enCryptData(v4(),v4(),"sha256");

    UserTables.find({
        userName:userName
    }).then(rs=>{
        if(rs.length){
            res.send({
                status:500,
                message:"该用户名已存在,请换一个"
            })
        }else{
            UserTables.create({
                userName,
                passWord,
                key,
                avatar,
                token,
                isAdmin:false,
                introduction:"",
                approved:false,
                createTime:new Date()
            }).then(()=>{
                res.setHeader("Authorization",token);
                res.send({
                    status:200,
                    massage:"注册成功"
                });
            })

            UserDetailTables.create({
                key,
                comments:[],
                articles:[],
                likes:[],
                attentions:[],
                blacklist:[]
            })
        }
    })

})

authenticationApp.get("/checkPermission",function(req,res){
    // console.log(req);
    UserTables.find({
        token:req.headers.authorization
    }).then(async rs=>{
        if(rs.length){
            let userDetail = null;
            await UserDetailTables.find({
                key:rs[0].key
            },{
                key:false,
                _id:false,
                __v:false
            }).then(userDetails=>{
                userDetail=userDetails[0]
            })

            res.send({
                status:200,
                massage:"用户鉴权成功",
                data:{
                    userData:{
                        userName:rs[0].userName,
                        avatar:rs[0].avatar,
                        introduction:rs[0].introduction,
                        isAdmin:rs[0].isAdmin,
                        userDetail:userDetail
                    }
                }
            })
        }else{
            res.send({
                status:500,
                massage:"用户鉴权失败"
            })
        }
    })
})

authenticationApp.post("/loginUser",function(req,res){
    UserTables.find({
        userName:req.body.userName 
    }).then(rs=>{
        if(rs.length){
            if(rs[0].passWord===enCryptData(req.body.passWord,rs[0].key,"sha256")){
                if(rs[0].approved===true){
                    res.setHeader("Authorization",rs[0].token);
                    res.send({
                        status:200,
                        massage:"登录成功"
                    })
                }else{
                    res.send({
                        status:500,
                        massage:"该账号正在等待审核中"
                    })
                }
                
            }else{
                res.send({
                    status:500,
                    message:"密码错误"
                })
            }
        }else{
            res.send({
                status:500,
                massage:"用户名不存在"
            })
        }
    })
})

authenticationApp.post('/updateUserInfo', function (req, res) {
    UserTables.updateOne({
        token: req.headers.authorization
    }, {
        $set: {
            avatar: req.body.avatar,
            introduction: req.body.introduction
        }
    }).then(async rs => {
        res.send({
            status: 200,
            message: '用户信息更新成功'
        })
    })
})

authenticationApp.get('/unApprovedUser',function(req,res){
    UserTables.find({
        token: req.headers.authorization
    }).then(async (rs)=>{
        if (rs.length && rs[0].isAdmin){
            let {offset, limit} = req.query; // 获取参数
            let userTotalNum = 0;
            await UserTables.find({
                approved: false
            }).then(unapprovedUsers=>{
                userTotalNum = unapprovedUsers.length; // 获取未授权用户的总数
            })
            UserTables.find({
                approved: false
            },{
                _id: false,
                __v: false
            },{
                skip: Number(offset),
                limit: Number(limit),
                sort:{
                    lastModified:-1,
                }
            }).then(unapprovedUsers=>{
                res.send({
                    status: 200,
                    message: '查询成功',
                    data: {
                        userTotalNum,
                        userList: unapprovedUsers
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

authenticationApp.post('/deleteUser',function(req,res){
    UserTables.find({
        token: req.headers.authorization
    }).then(async (rs)=>{
        if (rs.length && rs[0].isAdmin){
            await UserTables.find({
                key: req.body.key
            }).then( async (userInfos) => {
                await BlogTables.deleteMany({
                    'author.userName': userInfos[0].userName
                }).then((rs)=>{
                    // console.log(rs)
                })
            })

            await UserDetailTables.deleteOne({
                key: req.body.key
            }).then(()=>{
                console.log('删除用户的详细数据')
            })

            await UserTables.deleteOne({
                key: req.body.key
            }).then(()=>{
                console.log('删除用户的主数据')
            })

            res.send({
                status: 200,
                message: '删除用户成功'
            })
        }else{
            res.send({
                status: 401,
                message: '没有操作权限'
            })
        }
    })
})

authenticationApp.post('/approvedUser',function(req,res){
    UserTables.find({
        token: req.headers.authorization
    }).then(async (rs)=>{
        if (rs.length && rs[0].isAdmin){
            UserTables.updateOne({
                key: req.body.key
            },{
                $set:{
                    approved: true
                }
            }).then(()=>{
                res.send({
                    status: 200,
                    message: '批准用户注册'
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

authenticationApp.get('/getAllUser',function (req,res){
    UserTables.find({
        token: req.headers.authorization
    }).then(async (rs)=>{
        if (rs.length && rs[0].isAdmin){
            let {offset, limit} = req.query; // 获取参数
            let userTotalNum = 0;
            await UserTables.find({
            }).then(unapprovedUsers=>{
                userTotalNum = unapprovedUsers.length; // 获取未授权用户的总数
            })
            UserTables.find({
            },{
                _id: false,
                __v: false
            },{
                skip: Number(offset),
                limit: Number(limit),
                sort:{
                    lastModified:-1
                }
            }).then(unapprovedUsers=>{
                res.send({
                    status: 200,
                    message: '查询成功',
                    data: {
                        userTotalNum,
                        userList: unapprovedUsers
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

authenticationApp.post('/setAdmin',function(req,res){   
    UserTables.find({
        token:req.headers.authorization
    }).then(rs=>{
        if(rs.length&&rs[0].isAdmin===true){
            UserTables.updateOne({
                key:req.body.key
            },{
                $set:{
                    isAdmin:true
                }
            }).then(rs=>{
                res.send({
                    status:200,
                    message:"操作成功"
                })
            })
        }else{
            res.send({
                status:200,
                message:"没有操作权限"
            })
        }
    })
})

authenticationApp.post('/unsetAdmin',function(req,res){
    UserTables.find({
        token:req.headers.authorization
    }).then(rs=>{
        if(rs.length&&rs[0].isAdmin===true){
            UserTables.updateOne({
                key:req.body.key
            },{
                $set:{
                    isAdmin:false
                }
            }).then(rs=>{
                res.send({
                    status:200,
                    message:"操作成功"
                })
            })
        }else{
            res.send({
                status:200,
                message:"没有操作权限"
            })
        }
    })
})

authenticationApp.post('/unApprovedUser',function(req,res){
    UserTables.find({
        token: req.headers.authorization
    }).then(async (rs)=>{
        if (rs.length && rs[0].isAdmin){
            UserTables.updateOne({
                key: req.body.key
            },{
                $set:{
                    approved: false
                }
            }).then(()=>{
                res.send({
                    status: 200,
                    message: '已冻结用户账号'
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

authenticationApp.get('/getUserRegisterInfo',function(req,res){
     UserTables.find({
        token: req.headers.authorization
    }).then(async (rs)=>{
        if (rs.length && rs[0].isAdmin){
            UserTables.find({
            },{
                createTime:true
            }).then((rs)=>{
                res.send({
                    status: 200,
                    message: '当前用户总是查询成功',
                    data:{
                        userInfo:rs
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
    authenticationApp
}   