<template>
    <div class="wrapper">
        <div class="login-background">
            <div class="login-logo-title">
                <h1>鑫源数码客户关系管理平台</h1>
            </div>
            <div class="login-form">
                <el-form :rules="rules" :model="user" ref="loginForm">
                    <el-form-item prop="username">
                        <el-input v-model="user.username" placeholder="请输入用户名" style="margin: 10px 0;"
                            prefix-icon="el-icon-user"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="user.password" placeholder="请输入密码" style="margin: 10px 0;"
                            prefix-icon="el-icon-lock" show-password>
                        </el-input>
                    </el-form-item>
                    <el-checkbox v-model="rememberMe" style="margin-top: 10px; margin-bottom: 10px;">记住我</el-checkbox>
                    <div style="margin: 10px 0; text-align: center;">
                        <el-button type="primary" style="width: 100%;" size="medium" @click="submitForm">登录</el-button>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》from '《组件路径》';
// import { get, post } from "../util/request"
import request from "../util/request"
import qs from 'qs'
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/util/jsencrypt";

export default {
    //import 引入的组件需要注入到对象中才能使用
    name: 'login',
    data() {
        return {
            rememberMe: false,
            user: {
                username: '',
                password: ''
            },
            rules: {
                username: { required: true, message: '请输入用户名', trigger: 'blur' },
                password: { required: true, message: '请输入密码', trigger: 'blur' }
            }
        };
    },
    methods: {
        submitForm() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码

                    if (this.rememberMe) {
                        // 过期时间单位30天
                        Cookies.set("username", this.user.username, { expires: 30 });
                        Cookies.set("password", encrypt(this.user.password), { expires: 30 });
                        Cookies.set("rememberMe", this.rememberMe, { expires: 30 });
                    } else {
                        // 否则移除
                        Cookies.remove("username");
                        Cookies.remove("password");
                        Cookies.remove("rememberMe");
                    }

                    this.login();
                } else {
                    return false;
                }
            });
        },
        resetForm() {
            this.$refs.loginForm.resetFields();
        },
        async login() {
            let ret = await request.post("login?" + qs.stringify(this.user));
            let data = ret.data
            if (data.code === 200) {
                //登录成功获取token
                const token = data.authorization;
                //设置token
                this.$store.commit('SET_TOKEN', token)
                this.showMessage('success', data.msg)
                //重置表单
                this.resetForm();
                // 设置菜单
                let menuList = data.menuList
                this.$store.commit('SET_MENU_LIST', menuList)
                // 设置用户信息
                sessionStorage.setItem("userInfo", JSON.stringify(data.userInfo))
                //跳转路由
                this.$router.push({ path: '/' })
            } else {
                this.showMessage('error', data.msg)
            }
        },
        showMessage(status, msg) {
            this.$message({
                message: msg,
                type: status
            });
        },
        getCookie() {
            const username = Cookies.get("username");
            const password = Cookies.get("password");
            const rememberMe = Cookies.get("rememberMe");

            this.user.username = username === undefined ? this.user.username : username
            this.user.password = password === undefined ? this.user.password : decrypt(password)
            this.rememberMe = rememberMe === undefined ? false : Boolean(rememberMe)
        }
    },
    created() {
        this.getCookie();
    }
}
</script>
<style>
.wrapper {
    width: 100%;
    height: 100vh;
    display: block;
    /* position: relative; */
    box-sizing: border-box;
    background-color: #009688;
}

.login-background {
    width: 400px;
    height: 330px;
    position: absolute;
    left: 50%;
    top: 40%;
    margin-left: -180px;
    margin-top: -100px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: rgb(238, 238, 238) 0px 0px 8px;
}

.login-form {
    margin: 10px;
}

.login-logo-title {
    text-align: center;
    letter-spacing: 2px;
    padding-top: 14px;
    padding-right: 0px;
    padding-bottom: 5px;
    padding-left: 0px;
}

.login-logo-title h1 {
    color: rgb(0, 150, 136);
    font-size: 25px;
    font-weight: bold;
}
</style>