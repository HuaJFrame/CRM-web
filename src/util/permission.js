/**
 * 字符权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkPermi(value) {
    if (value && value instanceof Array && value.length > 0) {
        const permissions = JSON.parse(sessionStorage.getItem("userInfo")).permissions
        const permissionDatas = value
        const all_permission = "*:*:*";

        const hasPermission = permissions.some(permission => {
            return all_permission === permission || permissionDatas.includes(permission)
        })

        if (!hasPermission) {
            return false
        }
        return true
    } else {
        console.error(`need roles! Like checkPermi="['system:user:add','system:user:edit']"`)
        return false
    }
}