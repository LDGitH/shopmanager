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
    <el-form class="form" label-position="top" :model="form" label-width="80px">
      <el-tabs @tab-click="changeTab()" tab-position="left" v-model="active">
        <el-tab-pane name="1" label="基本信息">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 级联选择器(表单元素)
            options 数据源
            selectedOptions是[被选中的label的value值]
            props 配置选项 ={label/value/children} 赋值来源都是options数据源中的key名
            clearable 清除
            @change 改变label
            -->
            {{selectedOptions}}
            <el-cascader
              expand-trigger="hover"
              :options="options"
              clearable
              :props="defaultProp"
              v-model="selectedOptions"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="2" label="商品参数">
          <!--
            动态参数属性名 - attr_name
            复选框组 - attr_vals
          -->
          <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDy" :key="item1.attr_id">
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="3" label="商品属性">
          <el-form-item :label="item.attr_name" v-for="(item,i) in arrStatic" :key="item.attr_id">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="4" label="商品图片">
          <el-form-item>
            <el-upload
              action="http://localhost:8888/api/private/v1/upload"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :headers="headers"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane name="5" label="商品内容">
          <el-form-item>
            <el-button type="primary" @click="addGoods()">添加商品</el-button>

            <!-- 富文本 -->
            <quill-editor v-model="form.goods_introduce" class="quill"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
// 引入富文本插件所需样式和包
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    // abcDef  -> abc-def
    quillEditor
  },
  data() {
    return {
      active: "1",

      // 处理完毕
      // goods_name	商品名称	不能为空
      // goods_price	价格	不能为空
      // goods_weight	重量	不能为空
      // goods_number	数量	不能为空
      // goods_introduce	介绍	可以为空

      // goods_cat	以为','分割的分类列表[1,3,6]	不能为空
      // pics	[pic:临时路径]上传的图片临时路径（对象）	可以为空

      // attrs	商品的参数（数组）	可以为空

      form: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",

        // 商品分类 -> 级联选择器的商品分类
        goods_cat: "",
        // 图片  -> 图片上传 -> 图片临时路径
        pics: [],
        // 商品参数  ->  动态参数数据+静态参数数据
        // attr:[{attr_id:?,attr_value:?}]
        attrs: []
      },
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        // label/children/value
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 动态参数数组
      arrDy: [],
      // 静态参数数组
      arrStatic: [],
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getGoodsCate();
  },

  methods: {
    // 添加商品
    async addGoods() {
      // 处理数据
      // 商品分类 ->
      // [1,3,6] = "1,3,6"
      this.form.goods_cat = this.selectedOptions.join(",");
      // 图片  -> this.form.pics

      // 商品参数  -> ? 来源于动态参数数组和静态参数数据 (attr_id和attr_vals)
      // this.arrDy;->item.attr_id和item.attr_vals
      // this.arrStatic;
      // attrs: [{attr_id:?,attr_values:?}]
      const arr1 = this.arrDy;
      // 1. 遍历
      // 2. 返回 return ?
      // 3. 返回新数组

      const arr1New = arr1.map(item => {
        return { attr_id: item.attr_id, attr_values: item.attr_vals };
      });

      // console.log(arr1New);

      const arr2 = this.arrStatic;
      const arr2New = arr2.map(item => {
        return { attr_id: item.attr_id, attr_values: item.attr_vals };
      });
      // console.log(arr2New);

      const arr = [...arr1New, ...arr2New];
      this.form.attrs = arr;

      // 发送请求
      const res = await this.$http.post(`goods`, this.form);
      console.log(res);
      // 回到列表 goodslist.vue
      this.$router.push({
        name: "goods"
      });
    },
    // 图片上传时的方法
    handleRemove(file, fileList) {
      // console.log("remove-----");
      // console.log(file);

      const INDEX = this.form.pics.findIndex(item => {
        return item.pic === file.response.data.tmp_path;
      });
      this.form.pics.splice(INDEX, 1);

      // console.log(this.form.pics);
    },

    handleSuccess(response) {
      this.form.pics.push({
        pic: response.data.tmp_path
      });

      // console.log(this.form.pics);
    },

    async changeTab() {
      // 如果点的是第二个tab
      if (this.active === "2") {
        // 获取商品参数-动态参数数据
        // id 分类 ID->第三级分类的id->cat_id->this.selectedOptions[2]
        if (this.selectedOptions.length === 3) {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          // console.log(res);
          this.arrDy = res.data.data;
          console.log(this.arrDy);
          this.arrDy.forEach(item => {
            // console.log(item.attr_vals);
            // 把字符串->以,分割的数组
            item.attr_vals =
              item.attr_vals.length === 0
                ? []
                : item.attr_vals.trim().split(",");
          });
        } else {
          this.$message.warning("请先选择三级分类");
        }
      }

      if (this.active === "3") {
        // 获取静态参数
        if (this.selectedOptions.length === 3) {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          // console.log(res);
          this.arrStatic = res.data.data;
          console.log(this.arrStatic);
        } else {
          this.$message.warning("请先选择三级分类");
        }
      }
    },
    // 级联选择器的方法
    handleChange() {},
    // 获取三级分类数据
    async getGoodsCate() {
      //
      const res = await this.$http.get(`categories?type=3`);
      this.options = res.data.data;
      // console.log(this.options);
    }
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
.form {
  height: 400px;
  overflow: auto;
}
/* 自己的类名对应样式 -> 不生效 ->组件的样式覆盖  -> 找到类名 */
.ql-editor {
  /* height: 200px; */

  min-height: 200px;
}
</style>
