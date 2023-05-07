<template>
    <div style="height: 100%;">
        <el-menu style="overflow-x: hidden; min-height: 100%;" background-color="#2f4056" active-text-color="#ffd04b"
            text-color="#fff" :collapse="isCollapse" :collapse-transition="false" router :default-active="$route.path">
            <div style="height: 60px; display: flex;justify-content: center;align-items: center;">
                <a href="http://localhost:8888/#/" class="logoImg">
                    <img src="../assets/logo.png" />
                    <h2 style="color: white; margin-left: 10px;" v-show="logoTextShow">鑫源数码</h2>
                </a>
            </div>
            <el-menu-item index="/home">
                <i class="el-icon-s-home"></i>
                <span slot="title">首页</span>
            </el-menu-item>

            <el-submenu v-for="item in menuList" :index="item.path + ''" :key="item.id">
                <template slot="title">
                    <svg-icon :icon-class="item.icon"></svg-icon>
                    <span>{{ item.name }}</span>
                </template>
                <el-menu-item v-for="child in item.children" :key="child.id" :index="child.path + ''">
                    <svg-icon :icon-class="child.icon"></svg-icon>{{ child.name }}
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》from '《组件路径》';

export default {
    //import 引入的组件需要注入到对象中才能使用
    name: "Aside",
    props: {
        isCollapse: Boolean,
        logoTextShow: Boolean
    },
    data() {
        return {
            menuList: []
        }
    },
    methods: {
        setMenu() {
            //创建菜单
            let temp = sessionStorage.getItem("menuList")
            this.menuList = JSON.parse(temp)
        }
    },
    created() {
        // 页面加载完成设置菜单
        this.setMenu();
    }
}
</script>
<style scoped>
.logoImg>img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
}

.logoImg {
    text-decoration: none;
    /* 去除默认的下划线 */
    outline: none;
    /* 去除旧版浏览器的点击后的外虚线框 */
    color: #000;
    /* 去除默认的颜色和点击后变化的颜色 */
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>