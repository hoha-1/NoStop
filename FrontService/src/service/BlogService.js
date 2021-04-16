import axios from "./config/axios.default.config";
import defaultConfig from "../config/config.default";

class BlogService{
    async createBlog(blogData){
        return axios.post(`${defaultConfig.baseApiUrl}/blog/create`,blogData)
    }
    
    async getPublicBlog(args){
        return axios.get(`${defaultConfig.baseApiUrl}/blog/getPublicBlog`,{
            params:args
        })
    }

    async getBlogById(args){
        return axios.get(`${defaultConfig.baseApiUrl}/blog/getBlogDetailById`,{
            params:args
        })
    }

    async createBlogComment(data) {
        return axios.post(`${defaultConfig.baseApiUrl}/blog/comment/create`, data)
    }

    async getMyBlog(data) {
        return axios.get(`${defaultConfig.baseApiUrl}/blog/getMyBlog`,{
            params:data
        })
    }

    async getMyLikeBlog(data) {
        return axios.get(`${defaultConfig.baseApiUrl}/blog/getMyLikeBlog`,{
            params:data
        })
    }

    async getUnapprovedBlog(args){
        return axios.get(`${defaultConfig.baseApiUrl}/blog/unapprovedBlog`,{
            params:args
        })
    }

    async approvedBlog(data) {
        return axios.post(`${defaultConfig.baseApiUrl}/blog/approvedBlog`, data)
    }

    async deleteBlog(data) {
        return axios.post(`${defaultConfig.baseApiUrl}/blog/deleteBlog`, data)
    }

    async getAllBlog(args) {
        return axios.get(`${defaultConfig.baseApiUrl}/blog/getAllBlog`, {
            params:args
        })
    }

    async getBlogInfo(){
        return axios.get(`${defaultConfig.baseApiUrl}/blog/getBlogInfo`)
    }
    
}

export default new BlogService