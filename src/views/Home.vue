<template>
  <div class="common-layout">
    <el-container>
      <!--aside区-->
      <el-aside width="200px">

        <SideMenu></SideMenu>

      </el-aside>
      <!--header区-->
      <el-container>
        <el-header>
          VueAdmin后台管理系统
          <div class="header-avator">
            <el-avatar
              :size="30"
              :src="userInfo.avator"
            />
            <el-dropdown>
              <span class="el-dropdown-link">
                {{userInfo.username}}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <router-link :to="{name: 'UserCenter'}"><el-dropdown-item>个人中心</el-dropdown-item></router-link>
                  <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-link href="https://www.youtube.com/">网站地址</el-link>
            <el-link href="https://qtccz51k3d.feishu.cn/drive/home/">联系作者</el-link>
          </div>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import SideMenu from '@/views/inc/SideMenu'
import { reactive, ref } from 'vue'
import axios from 'axios'
import store from '@/store';
import router from '@/router';
let userInfo = reactive({
    id: '',
    username: '',
    avator: ''
})
const getUserInfo = () => {
    axios.get('/sys/user').then(res => {
        // userInfo=res.data.data
        userInfo.id=res.data.data.id
        userInfo.username=res.data.data.username
        userInfo.avator=res.data.data.avator
    })
}
//直接执行:vue3不用created
getUserInfo()
const logout = ()=>{
  axios.post('/logout').then(res => {
    localStorage.clear()
    sessionStorage.clear()
    store.commit("resetState")
    router.push("/login")
  })
}
</script>
<style>
.el-container {
  margin: 0;
  padding: 0;
  height: 900px;
}
.header-avator {
  float: right;
  width: 300px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: left;
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

</style>