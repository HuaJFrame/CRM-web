<template>
    <div class="mod-config">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input v-model="dataForm.username" placeholder="用户名" clearable
                    v-hasPermi="['system:user:query']"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="dataForm.phoneNumber" placeholder="电话号码" clearable
                    v-hasPermi="['system:user:query']"></el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="dataForm.status" placeholder="用户状态" clearable v-hasPermi="['system:user:query']">
                    <el-option label="激活" value="0">激活</el-option>
                    <el-option label="禁用" value="1">禁用</el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()" v-hasPermi="['system:user:query']">查询</el-button>
                <el-button type="primary" @click="addOrUpdateHandle()" v-hasPermi="['system:user:add']"> 新增 </el-button>
                <el-button el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0"
                    v-hasPermi="['system:user:delete']">批量删除</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle">
            <el-table-column type="selection" header-align="center" align="center" width="50">
            </el-table-column>
            <el-table-column prop="id" header-align="center" align="center" label="用户ID">
            </el-table-column>
            <el-table-column prop="username" header-align="center" align="center" label="用户名">
            </el-table-column>
            <el-table-column prop="roles" label="拥有角色" width="200" align="center">
                <template v-slot="scope">
                    <el-tag size="small" type="warning" v-for="item in scope.row.roleList" :key="item.id" effect="dark">
                        {{ item.name }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="phoneNumber" header-align="center" align="center" label="手机号码">
            </el-table-column>
            <el-table-column prop="status" header-align="center" align="center" label="状态" :formatter="showStatus">
                <template v-slot="{ row }">
                    <el-switch v-model="row.status" @change="statusChangeHandle(row)" active-text="正常" inactive-text="禁用"
                        :active-value="0" :inactive-value="1" :disabled="!checkPermi(['system:user:edit'])">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" header-align="center" align="center" label="创建时间">
            </el-table-column>
            <el-table-column prop="updateTime" header-align="center" align="center" label="更新时间">
            </el-table-column>
            <el-table-column prop="remark" header-align="center" align="center" label="备注">
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" label="操作" width="320px">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" v-hasPermi="['system:user:role']"
                        @click="assignRolesHandle(scope.row.id)">分配角色</el-button>
                    <el-button type="warning" size="small" v-hasPermi="['system:user:resetPwd']"
                        @click="resetPwdHandle(scope.row.id)" v-if="isOwn(scope.row.id)">重置密码</el-button>
                    <el-button type="primary" size="small" icon="el-icon-edit" @click="addOrUpdateHandle(scope.row.id)"
                        v-hasPermi="['system:user:edit']" v-if="isOwn(scope.row.id)"></el-button>
                    <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteHandle(scope.row.id)"
                        v-hasPermi="['system:user:delete']" v-if="isOwn(scope.row.id)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        <!-- 分配角色 -->
        <assign-roles v-if="assignRolesVisible" ref="assignRoles" @refreshDataList="getDataList"
            @reset="reset"></assign-roles>
    </div>
</template>

<script>
import AddOrUpdate from './user-add-or-update'
import AssignRoles from './assign-roles'
import request from "@/util/request"
import { checkPermi } from "@/util/permission"
import qs from 'qs'

export default {
    data() {
        return {
            dataForm: {
                username: '',
                phoneNumber: '',
                status: null
            },
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
            assignRolesVisible: false
        }
    },
    components: {
        AddOrUpdate,
        AssignRoles
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        checkPermi,
        // 获取数据列表
        async getDataList() {
            this.dataListLoading = true
            let ret = await request.post("user/list", {
                'page': this.pageIndex,
                'limit': this.pageSize,
                'username': this.dataForm.username,
                'phoneNumber': this.dataForm.phoneNumber,
                'status': this.dataForm.status
            })
            let data = ret.data;
            if (data.code === 200) {
                this.dataList = data.page.list
                this.totalPage = data.page.totalCount
            } else {
                this.dataList = []
                this.totalPage = 0
            }
            this.dataListLoading = false
        },
        // 每页数
        sizeChangeHandle(val) {
            this.pageSize = val
            this.pageIndex = 1
            this.getDataList()
        },
        // 当前页
        currentChangeHandle(val) {
            this.pageIndex = val
            this.getDataList()
        },
        // 多选
        selectionChangeHandle(val) {
            this.dataListSelections = val
        },
        // 新增 / 修改
        addOrUpdateHandle(id) {
            this.addOrUpdateVisible = true
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id)
            })
        },
        //分配角色
        assignRolesHandle(id) {
            this.assignRolesVisible = true
            this.$nextTick(() => {
                this.$refs.assignRoles.init(id)
            })
        },
        reset() {
            this.assignRolesVisible = false
        },
        // 删除
        deleteHandle(id) {
            var ids = id ? [id] : this.dataListSelections.map(item => {
                return item.id
            })
            this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let { data } = await request.get("user/delete?" + qs.stringify({ "ids": ids }, { indices: false }));
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
        },
        async resetPwdHandle(id) {
            let { data } = await request.get("user/resetPwd/" + id);
            if (data.code === 200) {
                this.$message.success("重置成功")
            } else {
                this.$message.error("重置失败")
            }
        },
        showStatus(row, column) {
            if (row.status === 0) {
                return '正常'
            } else {
                return '禁用'
            }
        },
        async statusChangeHandle(row) {
            let { id, status } = row;
            await request.get(`user/${id}/${status}`);
        },
        isOwn(id) {
            let { userId } = JSON.parse(sessionStorage.getItem("userInfo"));
            if (userId === id) {
                return false
            }
            return true
        }
    }
}
</script>

<style>
.el-tag+.el-tag {
    margin-left: 10px;
}
</style>
