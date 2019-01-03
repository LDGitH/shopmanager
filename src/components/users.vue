<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框+添加按钮 -->
    <el-row>
      <el-col>
        <el-input
          @clear="getAllUsers()"
          clearable
          placeholder="请输入用户名"
          v-model="query"
          class="input-with-select"
        >
          <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary" @click="showDiaAdd()">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <!--
        id:  id
        username:  用户名
        email:  邮箱
        mobile:  电话
        create_time: 创建日期
        mg_state: 状态
        role_name: 角色名称
    -->
    <el-table height="200px" :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>
      <el-table-column label="创建日期" width="160">
        <template slot-scope="scope">{{scope.row.create_time | fmtDate}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="140">
        <template slot-scope="scope">
          <el-switch
            @change="changeUserState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-row>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              plain
              circle
              @click="showEditDia(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              plain
              circle
              @click="showDeleConfim(scope.row)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-check"
              size="mini"
              plain
              circle
              @click="showDiaRole(scope.row)"
            ></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页
    @size-change 每页显示条数改变时
@current-change 当前页码改变
current-page当前页码
page-sizes 控制每页显示条数所在的数组[2,4,6,8]
layout 分页组件的小功能
    total 数组总个数-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          {{currUserName}}
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="currUserRoleId">
            <el-option disabled label="请选择" :value="-1"></el-option>
            <el-option v-for='(v,i) in roles' :key="i" 
            :label="v.roleName" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      query: "",
      pagenum: "1",
      pagesize: "2",
      total: -1,
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      formLabelWidth: "100px",
      // 添加用户对话框默认隐藏
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      // 下拉框绑定的数据
      currUserRoleId: -1,
      roles: [],
      currUserName: '',
      currUserId: -1
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 分配角色--发送请求
    async setRole() {
    const res = await this.$http.put(`users/${this.currUserId}/role`, {
     rid: this.currUserRoleId
    });
    // console.log(res);
    this.dialogFormVisibleRole = false;
    },
    // 分配角色-显示对话框
    async showDiaRole(user) {
      // 获取用户id
      this.currUserId = user.id;
      // 将用户名和角色在页面上显示
      this.currUserName = user.username;

      // 获取角色列表
      const res = await this.$http.get(`roles`);
      this.roles = res.data.data;
      // console.log(this.roles);
      // 请求user用户的角色id
      const res2 = await this.$http.get(`users/${user.id}`);
      // console.log(res2);
      this.currUserRoleId = res2.data.data.rid;

      this.dialogFormVisibleRole = true;
    },
    // 修改用户状态
    async changeUserState(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      // console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        // 刷新表格
        this.getTableData();
      } else {
        this.$message.warning(msg);
      }
    },
    // 编辑用户 - 发送请求
    async editUser() {
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      // console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        // 关闭对话框
        this.dialogFormVisibleEdit = false;
        // 刷新表格
        this.getTableData();
      } else {
        this.$message.warning(msg);
      }
    },
    // 编辑用户-展开对话框
    showEditDia(user) {
      // console.log(user);
      this.form = user;
      this.dialogFormVisibleEdit = true;
    },
    // 删除用户-打开提示框
    showDeleConfim(user) {
      // console.log(user);

      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发送删除的请求  id是用户id
          const res = await this.$http.delete(`users/${user.id}`);
          // console.log(res);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.$message.success(msg);
            this.pagenum = 1;
            this.getTableData();
          }
        })
        .catch(() => {
          this.$message.warning("取消删除");
        });
      //
    },
    // 添加用户--发送请求
    async addUser() {
      // 发送请求
      const res = await this.$http.post("users", this.form);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 201) {
        // 提示框
        this.$message.success(msg);
        // 关闭对话框
        this.dialogFormVisibleAdd = false;
        // 刷新表格
        this.getTableData();
      } else {
        this.$message.warning(msg);
      }
    },
    // 添加用户--显示对话框
    showDiaAdd() {
      this.form = {};
      this.dialogFormVisibleAdd = true;
    },
    // 点击清空按钮时
    getAllUsers() {
      this.getTableData();
    },
    // 搜索
    searchUser() {
      this.pagenum = 1;
      this.getTableData();
    },
    // 分页相关的方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.pagenum = 1;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      // console.log(`当前页: ${val}`);
      this.getTableData();
    },
    async getTableData() {
      // query	查询参数	可以为空
      // pagenum	当前页码	不能为空
      // pagesize	每页显示条数	不能为空
      // 发送请求
      // baseURL axios文档
      // 在发起请求(除了登录之外的)之前 需要设置请求头

      //
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;

      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );

      // console.log(res);

      const {
        data: {
          data: { total, users },
          meta: { status, msg }
        }
      } = res;
      if (status === 200) {
        // 1. 给表格数据赋值
        this.tableData = users;
        this.total = total;
        // console.log(this.tableData)
        // 2. 提示
        this.$message.success(msg);
      }
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
.input-with-select {
  margin-top: 20px;
  width: 350px;
}
</style>
