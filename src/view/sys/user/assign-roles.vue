<template>
    <el-dialog model-value="roleDialogVisible" title="分配角色" :close-on-click-modal="false" :visible.sync="visible"
        width="30%" @closed="closing">
        <el-form ref="form" :model="form" label-width="100px">
            <el-checkbox-group v-model="form.roles">
                <el-checkbox v-for="role in form.roleList" :key="role.id" :label="role.id" name="roles"
                    :checked="role.checked">{{ role.name }}</el-checkbox>
            </el-checkbox-group>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import request from "@/util/request"

export default {
    data() {
        return {
            visible: false,
            form: {
                roles: [],
                roleList: [],
                userId: 0
            }

        }
    },
    methods: {
        init(id) {
            this.form.userId = id
            this.visible = true
            this.form.roleList = []
            this.$nextTick(async () => {
                let { data } = await request.get(`user/listUserAllRole/${id}`);
                if (data.code === 200) {
                    this.form.roleList = data.roleList
                }
            })
        },
        // 表单提交
        async dataFormSubmit() {
            let { data } = await request.post("user/assignRole", {
                'id': this.form.userId,
                "roles": this.form.roles
            });
            // TODO
            let msg = "分配"
            if (data.code === 200) {
                this.$message({
                    message: msg + "成功",
                    type: "success"
                });
                this.$emit('refreshDataList')
            } else {
                this.$message({
                    message: msg + "失败",
                    type: "error"
                });
            }
            this.visible = false
        },
        closing() {
            this.$emit('reset')
        }
    }
}
</script>