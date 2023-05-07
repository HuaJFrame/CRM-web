<template>
    <el-dialog title="开发计划" :visible.sync="visible" :close-on-click-modal="false" @closed="closing">
        <el-form :inline="true" v-if="isDev">
            <el-form-item>
                <el-button v-hasPermi="['sale:cusDevPlan:add']" type="primary"
                    @click="addOrUpdateHandle()">新增计划项</el-button>
                <el-button v-hasPermi="['sale:cusDevPlan:delete']" type="danger" @click="deleteHandle()"
                    :disabled="dataListSelections.length <= 0">批量删除</el-button>
                <el-button type="success" @click="modifyDevResult(2)" v-hasPermi="['sale:chance:edit']">开发成功</el-button>
                <el-button type="danger" @click="modifyDevResult(3)" v-hasPermi="['sale:chance:edit']">开发失败</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle"
            style="width: 100%;">
            <el-table-column type="selection" header-align="center" align="center" width="50">
            </el-table-column>
            <el-table-column prop="planItem" header-align="center" align="center" label="计划内容">
            </el-table-column>
            <el-table-column prop="planDate" header-align="center" align="center" label="计划日期">
            </el-table-column>
            <el-table-column prop="exeAffect" header-align="center" align="center" label="执行效果">
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作" v-if="isDev">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" v-hasPermi="['sale:cusDevPlan:edit']"
                        @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                    <el-button type="danger" size="small" v-hasPermi="['sale:cusDevPlan:delete']"
                        @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <span slot="footer" class="dialog-footer">
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                :page-sizes="[5, 10, 15]" :page-size="pageSize" :total="totalPage"
                layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </span>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </el-dialog>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》from '《组件路径》';
import AddOrUpdate from './cusdevplan-add-or-update'
import request from "@/util/request"
import qs from "qs"

export default {
    //import 引入的组件需要注入到对象中才能使用
    data() {
        return {
            saleChanceId: undefined,
            dataList: [],
            pageIndex: 1,
            pageSize: 5,
            totalPage: 0,
            dataListLoading: false,
            dataListSelections: [],
            isDev: true,
            addOrUpdateVisible: false,
            visible: false
        }
    },
    components: {
        AddOrUpdate
    },
    methods: {
        init(id, isDev) {
            this.saleChanceId = id
            this.visible = true
            this.isDev = isDev
            this.getDataList()
        },
        // 获取数据列表
        async getDataList() {
            this.dataListLoading = true
            let { data } = await request.post("cusDevPlan/list", {
                'page': this.pageIndex,
                'limit': this.pageSize,
                "sid": this.saleChanceId
            })
            if (data.code === 200) {
                this.dataList = data.page.list
                this.totalPage = data.page.totalCount
            } else {
                this.dataList = []
                this.totalPage = 0
            }
            this.dataListLoading = false;
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
                this.$refs.addOrUpdate.init(id, this.saleChanceId)
            })
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
                let { data } = await request.get("cusDevPlan/delete?" + qs.stringify({ "ids": ids }, { indices: false }));
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
        closing() {
            this.restData()
        },
        modifyDevResult(devResult) {
            let msg = devResult === 2 ? "成功" : "失败"
            this.$confirm(`确定[id=${this.saleChanceId}]的营销机会开发${msg}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let { data } = await request.get(`chance/devResult/${this.saleChanceId}/${devResult}`);
                if (data.code === 200) {
                    this.visible = false
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            this.$emit('refreshDataList')
                        }
                    })
                } else {
                    this.$message.error(data.msg)
                }
            })
        },
        restData() {
            this.saleChanceId = undefined
            this.dataList = []
            this.pageIndex = 1
            this.pageSize = 5
            this.totalPage = 0
            this.dataListLoading = false
            this.dataListSelections = []
            this.isDev = true
            this.addOrUpdateVisible = false
            this.visible = false
        }
    }
}
</script>
<style></style>