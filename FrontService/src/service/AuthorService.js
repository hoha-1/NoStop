import axios from "./config/axios.default.config";
import defaultConfig from "../config/config.default";

class AuthorSevice{
    async registerUser(userData){
        return axios.post(`${defaultConfig.baseApiUrl}/authentication/registerUser`,userData)
    }

    async loginUser(userData){
        return axios.post(`${defaultConfig.baseApiUrl}/authentication/loginUser`,userData)
    }

    async checkPermission(){
        return axios.get(`${defaultConfig.baseApiUrl}/authentication/checkPermission`)
    }

    async updateUserInfo(data){
        return axios.post(`${defaultConfig.baseApiUrl}/authentication/updateUserInfo`,data)
    }

    async getUnapprovedUserList(args){
        return axios.get(`${defaultConfig.baseApiUrl}/authentication/unApprovedUser`,{
            params:args
        })
    }

    async deleteUser(data){
        return axios.post(`${defaultConfig.baseApiUrl}/authentication/deleteUser`,data)
    }

    async approvedUser(args) {
        return axios.post(`${defaultConfig.baseApiUrl}/authentication/approvedUser`, args)
    }

    async getAllUser(args) {
        return axios.get(`${defaultConfig.baseApiUrl}/authentication/getAllUser`, {
            params:args
        })
    }
    
    async setAdmin(data){
        return axios.post(`${defaultConfig.baseApiUrl}/authentication/setAdmin`,data)
    }

    async unsetAdmin(data){
        return axios.post(`${defaultConfig.baseApiUrl}/authentication/unsetAdmin`,data)
    }

    async unApprovedUser(data){
        return axios.post(`${defaultConfig.baseApiUrl}/authentication/unApprovedUser`,data)
    }

    async getUserRegisterInfo(){
        return axios.get(`${defaultConfig.baseApiUrl}/authentication/getUserRegisterInfo`)
    }
}

export default new AuthorSevice();