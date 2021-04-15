let express=require('express');
let siteApp=express();
let axios=require('axios')
let gaodeMapKey =d22a0baa0fc4081ca11aa21d3128508d;

siteApp.use(express.static(`${__dirname}/site`))

siteApp.all('*',function(req,res,next){
    console.log('有人访问了哦')
    let visitorIP='';
    if(req.ip.substr(0,7)==='::ffff:'){
        visitorIP = req.ip.substr(7);
    }

    axios.get('https://restapi.amap.com/v3/ip',{
        params:{
            key:gaodeMapKey,
            output:'JSON',
            ip:visitorIP
        }
    }).then(rs=>{
        axios.post('http://119.23.61.201:8888/api/v1/websiteData/setVisitorData'{
            ...rs.data,
            ip:visitorIP,
            visitTime=new Data()
        })
    })
    next()
})

siteApp.listen(80)