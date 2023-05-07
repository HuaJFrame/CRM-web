import router from './index'
import store from '../store';

router.beforeEach((to, from, next) => {
    const whiteList = ['/login'] // 白名单
    let hasRoutes = store.state.hasRoutes
    let menuList = JSON.parse(sessionStorage.getItem("menuList"))
    let token = sessionStorage.getItem("token");
    if (token) {
        if (!hasRoutes) {
            bindRoute(menuList);
            store.commit("SET_ROUTES_STATE", true);
            next({ ...to, replace: true })
        } else {
            next();
        }
    } else {
        if (whiteList.includes(to.path)) {
            next();
        } else {
            next("/login");
        }
    }
})

// 动态绑定路由
function bindRoute(menuList) {
    // console.log(menuList)
    let newRoutes = router.options.routes;
    menuList.forEach(menu => {

        if (menu.children) {
            menu.children.forEach(m => {
                // 菜单转成路由
                let route = menuToRoute(m, menu.name);
                if (route) {
                    newRoutes[0].children.push(route); // 添加到路由管理
                }
            })
        }
    })
    // 重新添加到路由
    newRoutes.forEach(route => {
        router.addRoute(route);
    })
}

// 菜单转成路由
const menuToRoute = (menu, parentName) => {
    if (!menu.component) {
        return null
    } else {
        let route = {
            name: menu.name,
            path: menu.path,
            meta: {
                parentName: parentName
            }
        }
        route.component = () => import('@/view/' + menu.component + '.vue')
        return route
    }
}



