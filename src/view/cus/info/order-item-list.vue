<template>
    <el-dialog title="订单详情" :visible.sync="visible" :close-on-click-modal="false" @closed="closing" append-to-body>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column prop="goodsName" header-align="center" align="center" label="商品名称">
            </el-table-column>
            <el-table-column prop="goodsNum" header-align="center" align="center" label="商品数量">
            </el-table-column>
            <el-table-column prop="unit" header-align="center" align="center" label="商品单位">
            </el-table-column>
            <el-table-column prop="price" header-align="center" align="center" label="单价">
            </el-table-column>
            <el-table-column prop="sum" header-align="center" align="center" label="总金额">
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                :page-sizes="[5, 10, 15]" :page-size="pageSize" :total="totalPage"
                layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </span>
    </el-dialog>
</template>

<script>
import request from "@/util/request"

export default {
    //import 引入的组件需要注入到对象中才能使用
    data() {
        return {
            orderId: undefined,
            dataList: [],
            pageIndex: 1,
            pageSize: 5,
            totalPage: 0,
            dataListLoading: false,
            visible: false
        }
    },
    methods: {
        init(id) {
            this.visible = true
            this.orderId = id
            this.getDataList()
        },
        // 获取数据列表
        async getDataList() {
            this.dataListLoading = true
            let { data } = await request.post("orderItem/list", {
                'page': this.pageIndex,
                'limit': this.pageSize,
                "orderId": this.orderId
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
        closing() {
            this.restData()
        },
        restData() {
            // this.saleChanceId = undefined
            // this.dataList = []
            // this.pageIndex = 1
            // this.pageSize = 5
            // this.totalPage = 0
            // this.dataListLoading = false
            // this.dataListSelections = []
            // this.isDev = true
            // this.addOrUpdateVisible = false
            // this.visible = false
        }
    }
}
</script>
<style></style>