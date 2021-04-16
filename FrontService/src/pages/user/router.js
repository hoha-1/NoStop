import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path:'/',
            redirect:'/home/article'
        },
        {
            path:'/home/:module',
            name:'home',
            component:()=>import('./views/Home')
        },
        {
            path:'/chatHome',
            name:'chatHome',
            component:()=>import('./views/Chathome')
        },
        {
            path:'/editArticle',
            name:'ArticleEdit',
            component:()=>import('./views/Article-Edit')
        },
        {
            path:'/article/:id',
            name:'artcleDetail',
            component:()=>import('../../components/Article-Detail')
        },
        {
            path:'/blogList/:searchKey',
            name:'blogList',
            component:()=>import('./views/BlogList')
        }
    ]
})