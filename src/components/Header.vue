<template>
    <div style=" display: flex; line-height: 60px;">
        <div style="flex: 1;">
            <span :class="icon" style="cursor: pointer; font-size: 20px;" @click="collapse" />
        </div>

        <el-dropdown style="width: 120px; cursor: pointer; " @command="handleCommand">
            <span style="margin-left: 15px; color: #fff;">
                {{ passwordModify.username }}<i class="el-icon-arrow-down" style="margin-left: 10px;" />
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="modifyPassword">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

        <el-dialog title="修改密码" :visible.sync="isVisible" @close="closeDialog">
            <el-form :model="passwordModify" :rules="password" ref="passwordModify">
                <el-form-item label="旧密码" prop="oldPassword">
                    <el-input v-model="passwordModify.oldPassword" auto-complete="off" show-password></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input v-model="passwordModify.newPassword" auto-complete="off" show-password></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirmPassword">
                    <el-input v-model="passwordModify.confirmPassword" auto-complete="off" show-password></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyPwd">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import router from "../router";
import request from "../util/request"

export default {
    //import 引入的组件需要注入到对象中才能使用
    name: "Header",
    props: {
        icon: String,
        collapse: Function
    },
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else if (value !== this.passwordModify.newPassword) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            isVisible: false,
            passwordModify: {
                userId: null,
                username: '',
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
            password: {
                oldPassword: [
                    { required: true, message: '请输入旧密码', trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    {
                        pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,    //正则校验不用字符串
                        message: "请填写6-16位数字和字母组合", trigger: "blur"
                    }
                ],
                confirmPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { validator: validatePass, trigger: 'blur' }
                ]
            }
        }


    },
    methods: {
        handleCommand(command) {
            if (command == "modifyPassword") {
                this.isVisible = true
            }
            if (command == "logout") {
                this.logout()
            }
        },
        logout() {
            sessionStorage.clear();
            localStorage.removeItem("hasRoutes")
            request.get("logout");
            router.push("/login")
        },
        modifyPwd() {
            this.$refs.passwordModify.validate((valid) => {
                if (valid) {
                    this.doModify();
                } else {
                    return false;
                }
            });
        },
        closeDialog() {
            //表单数据置空
            this.$refs.passwordModify.resetFields();
        },
        async doModify() {
            let ret = await request.post("user/updateUserPwd", this.passwordModify)
            let data = ret.data;
            if (data.code === 200) {
                this.showMessage('success', "修改密码成功！")
                this.logout()
            } else {
                this.showMessage('error', data.msg)
            }
        },
        showMessage(status, msg) {
            this.$message({
                message: msg,
                type: status
            });
        }
    },
    mounted() {
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
        this.passwordModify.userId = userInfo.userId;
        this.passwordModify.username = userInfo.username
    }
}
</script>

<style></style>