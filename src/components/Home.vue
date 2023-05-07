<template>
    <div class="home">
        <el-image :src="require('../assets/welcome.jpg')" class="welcome" />
    </div>
</template>

<script>
import request from "../util/request"
export default {
    //import 引入的组件需要注入到对象中才能使用
    name: "Home",
    methods: {
        async doSomething() {
            let ret = await request.get("user/list");
            console.log(ret.data)
        }
    }
}
</script>

<style>
.home {
    width: 100%;
    text-align: center;
}

.welcome {
    width: 70%;
    height: 70%;
}
</style>