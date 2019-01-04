<template>
    <el-card class="card">
        <!-- 面包屑 -->
        <my-bread level1="权限管理" level2="权限列表"></my-bread>

        <!-- 按钮 -->
        <el-row class="row">
            <el-col>
                <el-button type="primary">添加角色</el-button>
            </el-col>
        </el-row>

        <!-- 表格 -->
         <el-table height="480px" :data="roles" style="width: 100%">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>

      
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-row>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              plain
              circle
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              plain
              circle
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-check"
              size="mini"
              plain
              circle
            ></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
</template>

<script>
export default {
    data() {
      return {
          roles: []
      }
    },
    created () {
      this.getRoles();  
    },
    methods: {
        async getRoles() {
           const res = await this.$http.get(`roles`);
           console.log(res);
           this.roles = res.data.data;
        }
    }
}
</script>

<style>
.card {
    height: 100%;
}
.row {
    margin-top: 20px;
}
</style>
