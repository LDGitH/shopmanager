<template>
  <el-container class="container">
    <!-- 头部 -->
    <el-header class="header">
      <el-row>
        <el-col :span="3">
          <img src="@/assets/logo.png">
        </el-col>
        <el-col :span="19">
          <h2 class="middle">电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a href class="logout" @click.prevent='handleLogout()'>退出</a>
        </el-col>
      </el-row>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px" class="aside">
        <el-menu
          router
          default-active="2"
          class="el-menu-vertical-demo"
          :unique-opened="true">

          <!-- 1 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>

            <el-menu-item index="users">
              <i class="el-icon-location"></i>
              用户列表
            </el-menu-item>
          </el-submenu>

          <!-- 2 -->
           <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>

            <el-menu-item index="2-1">
              <i class="el-icon-location"></i>
              角色列表
            </el-menu-item>

            <el-menu-item index="2-2">
              <i class="el-icon-location"></i>
              权限列表
            </el-menu-item>
          </el-submenu>

          <!-- 3 -->
           <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>

            <el-menu-item index="3-1">
              <i class="el-icon-location"></i>
              商品列表
            </el-menu-item>
             <el-menu-item index="3-2">
              <i class="el-icon-location"></i>
              分类参数
            </el-menu-item>
             <el-menu-item index="3-3">
              <i class="el-icon-location"></i>
              商品分类
            </el-menu-item>
          </el-submenu>

          <!-- 4 -->
           <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>

            <el-menu-item index="4-1">
              <i class="el-icon-location"></i>
              订单列表
            </el-menu-item>
          </el-submenu>

          <!-- 5 -->
           <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>

            <el-menu-item index="5-1">
              <i class="el-icon-location"></i>
              数据报表
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>

      <!-- 主体内容 -->
      <el-main class="main">
         <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 在组件渲染之前，newVue之前验证token
  beforeCreate () {
    if (!localStorage.getItem('token')) {
      // 回到登录页
      this.$router.push({
        name: 'login'
      })
      // 未登录提示
      this.$message.warning('请先登录')
    }
  },
  methods: {
    handleLogout () {
      // 1.清除token,清空所有
      localStorage.clear()
      // 2.回到登录页
      this.$router.push({
        name: 'login'
      })
      // 3.退出成功提示
      this.$message.success('退出成功')
    }
  }
}
</script>

<style>
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
}
.middle {
  text-align: center;
  line-height: 60px;
}
.logout {
  text-decoration: none;
  line-height: 60px;
}
/* .aside {
  background-color: yellowgreen;
}
.main {
  background-color: pink;
} */
</style>
