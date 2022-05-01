<template>
        <el-menu default-active="2" class="el-menu-vertical-demo">
          <!--回到首页-->
          <router-link to="/index">
            <el-menu-item index="Index"> 
              首页
            </el-menu-item>
          </router-link>

          <el-sub-menu :index="menu.name" v-for="menu in memuList">
            <template #title>
              <span>{{ menu.title }}</span>
            </template>

            <router-link :to="item.path" v-for="item in menu.children" >
              <el-menu-item :index="item.name">{{ item.title }}</el-menu-item>
            </router-link>

          </el-sub-menu>

        </el-menu>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useStore } from "vuex";
import { computed } from '@vue/reactivity';
const store = useStore();
const memuList = computed(()=>{
  return store.state.menu.menuList
})


</script>
<style lang="">

</style>