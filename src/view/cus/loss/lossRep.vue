<template>
    <el-dialog title="暂缓信息" :visible.sync="visible" :close-on-click-modal="false" @closed="closing">
        <el-form :inline="true" v-if="sureLoss">
            <el-form-item>
                <el-button v-hasPermi="['cus:lossRep:add']" type="primary" @click="addOrUpdateHandle()">新增暂缓</el-button>
                <el-button v-hasPermi="['cus:lossRep:delete']" type="danger" @click="deleteHandle()"
                    :disabled="dataListSelections.length <= 0">批量删除</el-button>
                <el-button type="danger" v-hasPermi="['cus:lossRep:sure']" @click="sureLossHandle()">确认流失</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle"
            style="width: 100%;">
            <el-table-column type="selection" header-align="center" align="center" width="50">
            </el-table-column>
            <el-table-column prop="measure" header-align="center" align="center" label="措施">
            </el-table-column>
            <el-table-column prop="createDate" header-align="center" align="center" label="创建时间">
            </el-table-column>
            <el-table-column prop="updateDate" header-align="center" align="center" label="更新时间">
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作" v-if="sureLoss">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                    <el-button type="danger" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
import AddOrUpdate from './customerreprieve-add-or-update.vue'
import request from "@/util/request"
import qs from "qs"

export default {
    //import 引入的组件需要注入到对象中才能使用
    data() {
        return {
            lossId: undefined,
            dataList: [],
            pageIndex: 1,
            pageSize: 5,
            totalPage: 0,
            dataListLoading: false,
            dataListSelections: [],
            sureLoss: true,
            addOrUpdateVisible: false,
            visible: false
        }
    },
    components: {
        AddOrUpdate
    },
    methods: {
        init(id, sureLoss) {
            this.lossId = id
            this.visible = true
            this.sureLoss = sureLoss
            this.getDataList()
        },
        // 获取数据列表
        async getDataList() {
            this.dataListLoading = true
            let { data } = await request.post("cusRep/list", {
                'page': this.pageIndex,
                'limit': this.pageSize,
                "lossId": this.lossId
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
                this.$refs.addOrUpdate.init(id, this.lossId)
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
                let { data } = await request.get("cusRep/delete?" + qs.stringify({ "ids": ids }, { indices: false }));
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
        sureLossHandle(devResult) {

            this.$confirm(`确定[id=${this.saleChanceId}]的用户确认流失？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let { data } = await request.get(`loss/sureLoss/${this.lossId}`);
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
            this.lossId = undefined
            this.dataList = []
            this.pageIndex = 1
            this.pageSize = 5
            this.totalPage = 0
            this.dataListLoading = false
            this.dataListSelections = []
            this.sureLoss = true
            this.addOrUpdateVisible = false
            this.visible = false
        }
    }
}
</script>
<style></style>