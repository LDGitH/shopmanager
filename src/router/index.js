import Vue from 'vue'
import Router from 'vue-router'

// 单独引入组件
import {
    Message
} from 'element-ui';


// import Login from '../components/login.vue'
// @符号->  src
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'

import Roles from '@/components/roles.vue'
import Goodslist from '@/components/goodslist.vue'
import GoodsAdd from '@/components/goodsadd.vue'






Vue.use(Router)


const router = new Router({
    routes: [{
            name: 'home',
            path: '/',
            component: Home,
            children: [{
                    name: 'users',
                    path: '/users',
                    component: Users
                },
                {
                    name: 'rights',
                    path: '/rights',
                    component: Rights
                },
                {
                    name: 'roles',
                    path: '/roles',
                    component: Roles
                },
                {
                    name: 'goods',
                    path: '/goods',
                    component: Goodslist
                },
                {
                    name: 'goodsadd',
                    path: '/goods/add',
                    component: GoodsAdd
                }
            ]

            // redirect: {
            //     name: 'login'
            // }
        },
        {
            name: 'login',
            path: '/login',
            component: Login
        }
    ]
})


// 拦截路由配置

// app.use((req,res,next)=>{
//   next();
// });

router.beforeEach((to, from, next) => {
    // ...
    // 如果要去的是登录 -> 继续执行路由配置 next()
    if (to.name === 'login') {
        next();
    } else {

        // 如果要去的是home -> 判断token -> 如果有token -> next() -> 如果没有token->回到login登录
        const token = localStorage.getItem('token');
        if (!token) {
            // js代码编程式导航->去login组件
            // this.$router->vm.路由对象 -> 路由对象.push
            // this.$message.warning("请先登录");
            Message.warning("请先登录");

            router.push({
                name: 'login'
            });
        } else {
            next();
        }
    }



})

export default router;


// 在路由配置生效之前 -> 在路由配置生效之前  -> 拦截路由配置
// 去判断token
// 如果有  继续让路由配置生效 渲染home
// 如果token没有 执行登录的路由配置