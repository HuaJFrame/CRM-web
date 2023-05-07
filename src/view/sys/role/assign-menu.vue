<template>
    <el-dialog model-value="roleDialogVisible" title="分配权限" :visible.sync="visible" width="25%" @closed="closing"
        default-expand-all>
        <div class="el-dialog-div">
            <el-tree ref="tree" :data="treeData" :props="defaultProps" show-checkbox node-key="id" :check-strictly="true"
                :default-checked-keys="checkedKeys" />
        </div>
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
            roleId: 0,
            treeData: [],
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            checkedKeys: []

        }
    },
    methods: {
        init(id) {
            this.roleId = id
            this.treeData = []
            this.$nextTick(async () => {
                let { data: data1 } = await request.get(`role/menuTree`);
                if (data1.code === 200) {
                    this.treeData = data1.menuTree
                }
                let { data: data2 } = await request.get(`role/menus/${id}`);
                if (data2.code === 200) {
                    this.checkedKeys = data2.menuIdList
                }
            })
            this.visible = true
        },
        // 表单提交
        async dataFormSubmit() {
            let ids = []
            let menuNode = this.$refs.tree.getCheckedNodes();
            menuNode.forEach(element => {
                ids.push(element.id)
            });
            let { data } = await request.post("role/assignMenu", {
                "roleId": this.roleId,
                "ids": ids
            });
            if (data.code === 200) {
                this.$message({
                    message: '分配成功',
                    type: 'success',
                    duration: 1500
                })

            } else {
                this.$message.error(data.msg)
            }
            this.visible = false;
        },
        closing() {
            this.checkedKeys = []
            this.treeData = []
            this.roleId = 0
        }
    }
}
</script>

<style lang="scss" scoped>
.el-dialog-div {
    height: 40vh; //如果高度过高，可用max-height
    overflow: auto;
}
</style>