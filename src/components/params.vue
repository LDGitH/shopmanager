<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <!-- 提示alert -->
    <el-alert class="alert" title="注意:只允许为第三级分类设置参数" type="warning"></el-alert>
    <!-- 级联选择器 -->
    <el-form :model="form">
      <el-form-item label="请选择商品分类">
        <el-cascader
          :show-all-levels="false"
          expand-trigger="hover"
          :options="options"
          clearable
          :props="defaultProp"
          v-model="selectedOptions"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 级联选择器的数据
      options: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      selectedOptions: [],
      form: {}
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    handleChange() {},
    async getGoodsCate() {
      const res = await this.$http.get(`categories?type=3`);
      this.options = res.data.data;
      console.log(this.options);
    }
  }
};
</script>

<style>
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
