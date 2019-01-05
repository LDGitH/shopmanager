<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 消息提示 -->
    <el-row class="alert">
      <el-col>
        <el-alert :closable="false" title="添加商品信息" type="info" center show-icon></el-alert>
      </el-col>
    </el-row>

    <!-- 步骤条
    通过active的值控制当前是第几个step
    -->
    <el-steps :active="1*active" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 标签页el-tabs
    当选中某个tab时  v-model绑定的数据active其值就是被选中的name值
    -->
    <el-tabs tab-position="left" v-model="active">
      <el-tab-pane name="1" label="基本信息">基本信息基本信息</el-tab-pane>
      <el-tab-pane name="2" label="商品参数">商品参数商品参数</el-tab-pane>
      <el-tab-pane name="3" label="商品属性">商品属性商品属性</el-tab-pane>
      <el-tab-pane name="4" label="商品图片">商品图片商品图片</el-tab-pane>
      <el-tab-pane name="5" label="商品内容">商品内容商品内容</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      active: "1"
    };
  }
};
</script>

<style>
.card {
  height: 100%;
}
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
