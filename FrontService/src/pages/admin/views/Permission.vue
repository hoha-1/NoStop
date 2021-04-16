<template>
  <div>
    <el-table :data="userList">
        <el-table-column
          label="用户名"
          prop="userName"
        ></el-table-column>
        <el-table-column
          label="头像"
        >
          <template slot-scope="scope">
              <el-image 
                :src="scope.row.avatar"
                fit="fill"
                style="width: 100px;"
              ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="简介"
          prop="description"
        ></el-table-column>
        <el-table-column
          label="是否冻结账号"
        >
          <template slot-scope="scope">
              <el-switch 
                :value="!scope.row.approved" 
                @change="switchApproved(scope.row)"
              ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="是否为管理员"
        >
          <template slot-scope="scope">
            <el-switch 
                v-model="scope.row.isAdmin" 
                @change="switchAdmin(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="danger" @click="rejectedUser(scope.row)">删除</el-button>
          </template>
        </el-table-column>
    </el-table>
    <div>
        <el-pagination
          layout="prev,pager,next"
          :total="userTotalNum"
          :page-size="searchUserParams.limit"
          @current-change="handleUserCurrentChange"
        ></el-pagination>
    </div>
  </div>
</template>

<script>
import AuthorService from "@/service/AuthorService"
export default {
  name: "DBManager",
  data() {
    return {
      searchUserParams:{
          limit:10,
          offset:0
      },
      userList:[],
      userTotalNum:0,
    };
  },
  created(){
      this.getUserList()
  },
  methods:{
      getUserList(){
          AuthorService.getAllUser(this.searchUserParams).then(rs=>{
              this.userList=rs.data.data.userList;
              this.userTotalNum=rs.data.data.userTotalNum;
          })
      },
      rejectedUser(userData){
          AuthorService.deleteUser({
              key:userData.key
          }).then(rs=>{
              console.log(rs)
              if(rs.data.status===200){
                  this.getUserList()
              }
          })
      },
      handleUserCurrentChange(page){
          this.searchUserParams.offset=(page-1)*this.searchUserParams.limit;
          this.getUserList()
      },
      switchAdmin(userData){
          this.$confirm("此操作将改变此用户的权限, 后续影响极大, 请问是否继续?","警告",{
              confirmButtonText:"我心已决",
              cancelButtonText:"取消",
              type:"warning"
          }).then(()=>{
                if(userData.isAdmin){
                    AuthorService.setAdmin({
                      key:userData.key
                    }).then(rs=>{
                        if(rs.data.status===200){
                            this.$message.success("已为该用户开启管理员权限")
                        }
                    })
                }else{
                    AuthorService.unsetAdmin({
                      key:userData.key
                    }).then(rs=>{
                        if(rs.data.status===200){
                            this.$message.success("已关闭该用户已管理员权限")
                        }
                    })
                }
          }).catch(()=>{
              userData.isAdmin=false
              this.$message({
                type: 'info',
                message: '取消操作'
             })
          })
          
      },
      switchApproved(userData){
            this.$confirm("此操作将改变此用户的权限, 后续影响极大, 请问是否继续?","警告",{
              confirmButtonText:"我心已决",
              cancelButtonText:"取消",
              type: 'warning'
          }).then(()=>{
                if(userData.approved){
                  AuthorService.unApprovedUser({
                    key:userData.key
                  }).then(rs=>{
                    if(rs.data.status===200){
                        userData.approved=!userData.approved;  
                        this.$message.success("已冻结该用户")
                      }
                  })
                }else{
                  AuthorService.approvedUser({
                    key:userData.key
                  }).then(rs=>{
                        if(rs.data.status===200){
                          userData.approved=!userData.approved;  
                          this.$message.success("已解冻结该用户")
                      }
                  })
                }             
            }).catch(()=>{
                this.$message({
                type: 'info',
                     message: '取消操作'
                })
            })    
        }
    }
};
</script>

<style>
</style>