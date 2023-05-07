import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

// 用来存储数据
const state = {
    hasRoutes: false
}
// 响应组件中的事件
const actions = {

}
// 操作数据
const mutations = {
    SET_TOKEN: (state, token) => {
        sessionStorage.setItem("token", token);
    },
    SET_MENU_LIST: (state, menuList) => {
        sessionStorage.setItem("menuList", JSON.stringify(menuList));
    },
    SET_ROUTES_STATE: (state, hasRoutes) => {
        // localStorage.setItem("hasRoutes", hasRoutes);
        state.hasRoutes = hasRoutes
    }
}
// 用来将state数据进行加工
const getters = {
}
// 新建并暴露store
export default new Vuex.Store({
    state,
    actions,
    mutations,
    getters
})
