<template>
    <el-dialog title="订单查看" :visible.sync="visible" :close-on-click-modal="false" @closed="closing">
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column prop="orderNo" header-align="center" align="center" label="订单编号">
            </el-table-column>
            <el-table-column prop="orderDate" header-align="center" align="center" label="下单时间">
            </el-table-column>
            <el-table-column prop="address" header-align="center" align="center" label="地址">
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" v-hasPermi="['cus:orderItem:list']"
                        @click="orderItemListHandle(scope.row.id)">订单详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                :page-sizes="[5, 10, 15]" :page-size="pageSize" :total="totalPage"
                layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>
        </span>
        <order-item-list v-if="orderItemVisible" ref="orderItemList"></order-item-list>
    </el-dialog>
</template>

<script>
import request from "@/util/request"
import orderItemList from "./order-item-list.vue"

export default {
    //import 引入的组件需要注入到对象中才能使用
    data() {
        return {
            cusId: undefined,
            dataList: [],
            pageIndex: 1,
            pageSize: 5,
            totalPage: 0,
            dataListLoading: false,
            orderItemVisible: false,
            visible: false
        }
    },
    components: {
        orderItemList
    },
    methods: {
        init(id) {
            this.visible = true
            this.cusId = id
            this.getDataList()
        },
        // 获取数据列表
        async getDataList() {
            this.dataListLoading = true
            let { data } = await request.post("order/list", {
                'page': this.pageIndex,
                'limit': this.pageSize,
                "cusId": this.cusId
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
        orderItemListHandle(id) {
            this.orderItemVisible = true
            this.$nextTick(() => {
                this.$refs.orderItemList.init(id)
            })
        },
        closing() {
            this.restData()
        },
        restData() {
            this.cusId = undefined
            this.dataList = []
            this.pageIndex = 1
            this.pageSize = 5
            this.totalPage = 0
            this.dataListLoading = false
            this.orderItemVisible = false
            this.visible = false
        }
    }
}
</script>
<style></style>