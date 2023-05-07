<template>
    <div class="mod-config">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" v-hasPermi="['cus:loss:query']">
            <el-form-item v-hasPermi="['report:loss:list']">
                <el-input v-model="dataForm.cusNo" placeholder="客户编号" clearable></el-input>
            </el-form-item>
            <el-form-item v-hasPermi="['report:loss:list']">
                <el-input v-model="dataForm.cusName" placeholder="客户名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()" v-hasPermi="['report:loss:list']">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column prop="cusNo" header-align="center" align="center" label="客户编号">
            </el-table-column>
            <el-table-column prop="cusName" header-align="center" align="center" label="客户姓名">
            </el-table-column>
            <el-table-column prop="cusManager" header-align="center" align="center" label="客户经理">
            </el-table-column>
            <el-table-column prop="lossReason" header-align="center" align="center" label="流失原因">
            </el-table-column>
            <el-table-column prop="lastOrderTime" header-align="center" align="center" label="最后下单时间">
            </el-table-column>
            <el-table-column prop="confirmLossTime" header-align="center" align="center" label="确认流失时间">
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </div>
</template>
  
<script>
import request from "@/util/request"

export default {
    data() {
        return {
            dataForm: {
                cusNo: '',
                cusName: ''
            },
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
        }
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        // 获取数据列表
        async getDataList() {
            this.dataListLoading = true
            let { data } = await request.post("loss/list", {
                'page': this.pageIndex,
                'limit': this.pageSize,
                'cusName': this.dataForm.cusName,
                'cusNo': this.dataForm.cusNo,
                'state': 1
            })
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
        }
    }
}
</script>
  