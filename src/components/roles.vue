<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>

    <!-- 添加按钮 -->
    <el-row class="row">
      <el-col>
        <el-button type="primary">添加角色</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table height="400px" :data="roles" style="width: 100%">
      <el-table-column type="expand" width="200">
        <template slot-scope="scope">
          <!-- 一行 -->
          <!-- item1.id是每个权限的标识  -->
          <el-row v-for="(item1,i) in scope.row.children" :key="item1.id">
            <!-- 一级权限 -->
            <el-col :span="4">
              <el-tag
                @close="deleRights(scope.row,item1)"
                class="level1"
                closable
                type="success"
              >{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>

            <el-col :span="20">
              <!-- 二级权限 -->
              <el-row v-for="(item2,i) in item1.children" :key="item2.id">
                <el-col :span="4">
                  <el-tag
                    @close="deleRights(scope.row,item2)"
                    class="level2"
                    closable
                    type="info"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="20">
                  <el-tag
                    @close="deleRights(scope.row,item3)"
                    class="level3"
                    closable
                    type="warning"
                    v-for="(item3,i) in item2.children"
                    :key="item3.id"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>

          <el-row v-if="scope.row.children.length===0">
            <el-col>
              <span>该角色未分配权限</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column type="index" label="#" width="100"></el-table-column>
      <el-table-column prop="roleName" label="角名名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain circle></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain circle></el-button>
          <el-button
            @click="shopDiaRight(scope.row)"
            type="success"
            icon="el-icon-check"
            size="mini"
            plain
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogVisiblerights" width="50%">
      <!-- 树形结构
      data树形结构绑定的数据
      show-checkbox 是否支持选中
      node-key 每个节点唯一标识
      default-expanded-keys 默认展开 [想要展开的节点的id值]
      default-checked-keys 默认选中 [被选中的节点的id值]
      props:配置选项 {label,children}
      -->
      <!--
                :default-checked-keys="[5]"
      -->
      <el-tree
        ref="tree"
        :data="treeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedArr"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisiblerights = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: [],
      treeData: [],
      dialogVisiblerights: false,
      defaultProps: {
        // label和children的值来源于树形结构绑定数据key名
        // label指的是文本信息
        // children指的树形结构的子节点的数据的key名
        label: "authName",
        children: "children"
      },
      expandedArr: [],
      checkedArr: [],
      currRoleId: -1
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    // 分配权限 - 发送请求
    async setRights() {
      // roleId 角色id
      // rids : 权限id列表
      // 权限id列表-> 1. 全选的节点  2. 半选的节点
      // 获取树形结构el-tree全选节点
      const arr1 = this.$refs.tree.getCheckedKeys();
      // console.log(arr1);
      // 获取树形结构el-tree半选节点
      const arr2 = this.$refs.tree.getHalfCheckedKeys();
      // console.log(arr2);
      // ES5 展开操作运算符  ...容器(数组或者对象)
      const arr = [...arr1, ...arr2];
      // console.log(arr);
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(",")
      });
      this.getRoles();
      this.dialogVisiblerights = false;
    },
    // 分配/设置/修改  - 打开对话框
    async shopDiaRight(rights) {
      // console.log(rights.id);
      this.currRoleId = rights.id;

      // 获取树形结构的权限数据
      const res = await this.$http.get(`rights/tree`);
      // console.log(res);
      this.treeData = res.data.data;

      const tempArr = [];

      rights.children.forEach(item1 => {
        // tempArr.push(item1.id);
        item1.children.forEach(item2 => {
          // tempArr.push(item2.id);
          item2.children.forEach(item3 => {
            tempArr.push(item3.id);
          });
        });
      });
      // console.log(tempArr);
      this.checkedArr = tempArr;

      this.dialogVisiblerights = true;
    },
    // 删除权限
    async deleRights(role, rights) {
      // roleId角色id
      // rightId 权限id
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${rights.id}`
      );
      // console.log(res);
      // 更新当前角色的权限
      role.children = res.data.data;
      // 刷新整个表格
      // this.getRoles();
    },
    async getRoles() {
      const res = await this.$http.get(`roles`);
      // console.log(res);
      this.roles = res.data.data;
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.row {
  margin-top: 20px;
}
.level1,
.level2,
.level3 {
  margin-top: 10px;
}
</style>


