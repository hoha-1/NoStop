let express=require('express');
let visitorTables=require('../db/WebSiteDB/index');
let websiteDataApp=express();

websiteDataApp.post('setServieData',function(req,res){
    let reqData=req.body;
    if((typeof reqData.rectangle)===String){//免费api不解析境外ip,返回的是一个空数组,如果是境内IP返回的则是一个String
        let data={
            ip:reqData.ip,
            visitTime:reqData.visitTime,
            province:reqData.province,
            city:reqData.city,
            location:reqData.rectangle.split(';').split(';')
        };
        visitorTables.create({data}).then(()=>{
            res.send({
                status:200,
                message:'有人来访问啦'
            })
        })
    }else{
        res.send({
            status:200,
            message:'境外ip不予记录'
        })
    }
})

websiteDataApp.get('/websiteData',function(req,res){
    let {offset,limit}=req.query;

    visitorTables.find({},{
        __v:false
    },{
        skip:Number(offset),
        limit:Number(limit)
    }).then(rs=>{
        res.send({
            status:200,
            message:"查询成功",
            data:{
                totalNum:rs.length,
                visitorData:rs
            }
        })
    })
})

module.exports={
    websiteDataApp
}