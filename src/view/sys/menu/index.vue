<template>
    <div class="mod-config">
        <div style="margin-bottom: 10px;">
            <el-button v-hasPermi="['system:menu:add']" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        </div>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;" row-key="id"
            :tree-props="{ children: 'children' }">
            <el-table-column prop="name" header-align="center" label="菜单名称" width="220">
            </el-table-column>
            <el-table-column prop="icon" header-align="center" align="center" label="图标">
                <template v-slot="scope">
                    <svg-icon :icon-class="scope.row.icon" />
                </template>
            </el-table-column>
            <el-table-column prop="orderNum" header-align="center" align="center" label="排序">
            </el-table-column>
            <el-table-column prop="path" header-align="center" align="center" label="路由地址">
            </el-table-column>
            <el-table-column prop="component" header-align="center" align="center" label="组件路径" width="200">
            </el-table-column>
            <el-table-column prop="perms" header-align="center" align="center" label="权限标识">
            </el-table-column>
            <el-table-column prop="menuType" header-align="center" align="center" label="菜单类型">
                <template v-slot="scope">
                    <el-tag size="small" v-if="scope.row.menuType === 'M'" type="danger" effect="dark">目录</el-tag>
                    <el-tag size="small" v-else-if="scope.row.menuType === 'C'" type="success" effect="dark">菜单</el-tag>
                    <el-tag size="small" v-else-if="scope.row.menuType === 'F'" type="warning" effect="dark">按钮</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" header-align="center" align="center" label="创建时间">
            </el-table-column>
            <el-table-column prop="updateTime" header-align="center" align="center" label="更新时间">
            </el-table-column>
            <el-table-column prop="remark" header-align="center" align="center" label="备注">
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="200" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="addOrUpdateHandle(scope.row.id)"
                        v-hasPermi="['system:menu:edit']">修改</el-button>
                    <el-button type="danger" size="small" @click="deleteHandle(scope.row.id)"
                        v-hasPermi="['system:menu:delete']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"
            :tableData="dataList"></add-or-update>
    </div>
</template>
  
<script>
import AddOrUpdate from './menu-add-or-update'
import request from "@/util/request"

export default {
    data() {
        return {
            dataList: [],
            dataListLoading: false,
            addOrUpdateVisible: false
        }
    },
    components: {
        AddOrUpdate
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        // 获取数据列表
        async getDataList() {
            this.dataListLoading = true
            let { data } = await request.get("menu/list");
            if (data.code === 200) {
                this.dataList = data.menuTree

            } else {
                this.dataList = []
            }
            this.dataListLoading = false;
        },
        // 新增 / 修改
        addOrUpdateHandle(id) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id)
            })
        },
        // 删除
        deleteHandle(id) {
            this.$confirm(`确定对[id=${id}]进行删除操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let { data } = await request.get(`menu/delete/${id}`);
                if (data.code === 200) {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.getDataList()
                        }
                    })
                } else {
                    this.$message.error(data.msg)
                }
            })
        }
    }
}
</script>
  