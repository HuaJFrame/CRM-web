<template>
  <el-container style="min-height: 100vh">
    <el-aside :width="sideWidth + 'px'"
      style="background-color: rgb(238, 241, 246); box-shadow: 2px 0 6px rgb(0, 21, 41);">
      <Aside :isCollapse="isCollapse" :logoTextShow="logoTextShow" />
    </el-aside>

    <el-container>
      <el-header style="font-size: 18px; color: #fff;">
        <Header :icon="icon" :collapse="collapse"></Header>
      </el-header>

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.el-header {
  background-color: #0099cc;
  color: #333;

}

.el-aside {
  color: #333;
}

.el-aside::-webkit-scrollbar {
  display: none;
}
</style>

<script>
import Aside from './Aside.vue';
import Header from './Header.vue';

export default {
  name: "Manager",
  data() {
    return {
      isCollapse: false,
      sideWidth: 201,
      icon: "el-icon-s-fold",
      logoTextShow: true
    }
  },
  components: {
    Aside,
    Header,
  },
  methods: {
    collapse() {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        this.sideWidth = 63
        this.icon = "el-icon-s-unfold"
        this.logoTextShow = false
      } else {
        this.sideWidth = 201
        this.icon = "el-icon-s-fold"
        this.logoTextShow = true
      }
    }
  }
};
</script>
