import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import axios from 'axios'

import { useStore } from "vuex";
const store = useStore();
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '/sys/user',
        name: 'User',
        component: () => import('../views/sys/User.vue')
      },
      {
        path: '/sys/role',
        name: 'Role',
        component: () => import('../views/sys/Role.vue')
      },
      {
        path: '/sys/menu',
        name: 'Menu',
        component: () => import('../views/sys/Menu.vue')
      },
      {
        path: '/index',
        name: 'Index',
        component: () => import('../views/Index.vue')
      },
      {
        path: '/sys/usercenter',
        name: 'UserCenter',
        component: () => import('../views/sys/UserCenter.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// router.beforeEach((to,from,next)=>{
//     axios.get('/sys/menu/nav',{
//       headers: {
//         //类型断言（第一次用
// 				Authorization: localStorage.getItem("token") as string
//       }
//     }).then(res => {
//       //拿到menuList
//       // console.log(res.data.data)
//       // store.commit("setMenuList",res.data.data.nav)


//       // //拿到用户权限
//       // store.commit("setPermList",res.data.data.authoritys)
//       // console.log(store.state.menu.menuList)
//     })
  
//   next()
// })
export default router
