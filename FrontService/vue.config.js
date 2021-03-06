module.exports={
    publicPath:'./',
    outputDir:'site',
    pages:{
        admin:{
            //应用入口配置
            entry:'src/pages/admin/main.js',
            template:'public/admin.html',
            filename:'admin.html',
            title:'管理员界面'
        },
        user:{
            entry:'src/pages/user/main.js',
            template:'public/index.html',
            filename:'index.html',
            title:'nonstop'
        },
        login:{
            entry:'src/pages/login/main.js',
            template:'public/login.html',
            filename:'login.html',
            title:'登录界面'
        }
    },
    devServer:{
        host:'localhost',
        port:8080,
        https:false,
        open:true,
        overlay:{
            warning:true,
            error:true
        }
    },
    configureWebpack:{
        //devtool:'source-map'
    },
    productionSourceMap:false

}