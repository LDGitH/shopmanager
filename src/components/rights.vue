<template>
  <!-- card卡片 -->
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>

    <!-- 表格 -->
    <el-table height="480px" class="table" :data="rights" border style="width: 100%">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column label="层级">
          <template slot-scope="scope">
            <span v-if='scope.row.level==="0"'>一级</span>
            <span v-if='scope.row.level==="1"'>二级</span>
            <span v-if='scope.row.level==="2"'>三级</span>
          </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rights: []
    };
  },
  created() {
    this.getRights();
  },
  methods: {
    async getRights() {
      //   console.log('在rights中发起请求');

      const res = await this.$http.get(`rights/list`);

      //   console.log('请求完成');
      console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.rights = data;
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.table {
  margin-top: 15px;
}
</style>
