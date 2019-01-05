<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="3">
          <img src="@/assets/logo.png" alt>
        </el-col>
        <el-col :span="19">
          <h2 class="middle">电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a href class="loginout" @click.prevent="handleLoginout()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <!-- 导航 -->
        <el-menu router default-active="2" :unique-opened="true">
          <el-submenu :index="''+item1.order" v-for="(item1,i) in menus" :key="item1.id">
            <template slot="title">
              <i class="el-icon-d-arrow-right"></i>
              <span>{{item1.authName}}</span>
            </template>

            <el-menu-item :index="item2.path" v-for="(item2,i) in item1.children" :key="item2.id">
              <i class="el-icon-location"></i>
              {{item2.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 在组件渲染之前->if token -> newVue之前

  // 在渲染home组件之前 ->在home组件路由配置生效之前
  beforeCreate() {
    // if (!localStorage.getItem("token")) {
    //   // 回到登录
    //   this.$router.push({
    //     name: "login"
    //   });
    //   // 提示
    //   this.$message.warning("请先登录");
    // }
  },
  created() {
    this.getMenus();
  },
  data() {
    return {
      menus: []
    };
  },
  methods: {
    async getMenus() {
      const res = await this.$http.get(`menus`);
      // console.log(res);
      this.menus = res.data.data;
    },
    handleLoginout() {
      // 1. 清除token
      localStorage.clear();
      // 2. 回到登录
      this.$router.push({
        name: "login"
      });
      // 3. 退出成功
      this.$message.success("退出成功");
    }
  }
};
</script>

<style>
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
}

.middle {
  /* width: 100%; */
  line-height: 60px;
  text-align: center;
}
.loginout {
  line-height: 60px;
  text-decoration: none;
}
</style>
