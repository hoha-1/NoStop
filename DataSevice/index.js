let express=require("express");
let mongoose=require("mongoose");
let bodyParser=require("body-parser");
let cookieParser=require("cookie-parser");
let apiAddr=require("./config/PublicPath");


// 链接数据库
mongoose.connect("mongodb://localhost:27017/blogDB",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("链接成功")
}).catch(()=>{
    console.log("链接失败")
})


//生成服务器实例
let app=express();


// 启用通用中间件
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


// 处理跨域请求
app.all("*",function(req,res,next){
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Methods","GET,POST,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers","X-Requested-With, Content-Type, Authorization");
    res.setHeader("Access-Control-Expose-Headers","Authorization");
    next();
})


// 挂载其他应用
let {uploadImgFileApp}=require("./service/img.file.upload.service");
let {getImgFileApp}=require("./service/img.file.get.service");
let {authenticationApp}=require("./service/identifyAuthenticationService");
let {blogApp}=require("./service/blogDataService");
let {userDetailApp}=require("./service/UserDetailService");
let {tipOffApp}=require("./service/tipOffService");
let {websiteDataApp}=require("./service/websiteDataService");

// 启动各种服务
app.use(apiAddr.uploadImgApiAddr,uploadImgFileApp);
app.use(apiAddr.getImgApiAddr,getImgFileApp);
app.use(apiAddr.authenticationApiAddr,authenticationApp);
app.use(apiAddr.blogApiAddr,blogApp);
app.use(apiAddr.userDetailApiAddr,userDetailApp);
app.use(apiAddr.tipOffApiAddr,tipOffApp);
app.use(apiAddr.websiteDataApiAddr,websiteDataApp)


// 启动服务
app.listen(8888);

let WebSocket= require("ws");
let wss= new WebSocket.Server({port:8089})
let userList=[]
wss.on("connection",function connection(user){
    userList.push(user)
    user.on("message",function iscoming(event){
        for(let i=0,len=userList.length;i<len;i++){
            if(userList[i]!=user){
                userList[i].send(event)
            }
        }
    })
})

