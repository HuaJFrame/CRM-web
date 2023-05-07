<template>
    <div class="mod-config">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" v-hasPermi="['cus:loss:query']">
            <el-form-item v-hasPermi="['cus:loss:query']">
                <el-input v-model="dataForm.cusNo" placeholder="客户编号" clearable></el-input>
            </el-form-item>
            <el-form-item v-hasPermi="['cus:loss:query']">
                <el-input v-model="dataForm.cusName" placeholder="客户名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="dataForm.state" placeholder="流失状态" clearable v-hasPermi="['cus:loss:query']">
                    <el-option label="暂缓流失" value="0"></el-option>
                    <el-option label="确认流失" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()" v-hasPermi="['cus:loss:query']">查询</el-button>
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
            <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" v-if="scope.row.state === 0" v-hasPermi="['cus:lossRep:list']"
                        @click="reprieveHandle(scope.row)">添加暂缓</el-button>
                    <el-button type="warning" size="small" v-else v-hasPermi="['cus:lossRep:list']"
                        @click="reprieveHandle(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <lossRep @refreshDataList="getDataList" v-if="lossRepVisible" ref="lossRep"></lossRep>
    </div>
</template>
  
<script>
import request from "@/util/request"
import lossRep from "./lossRep.vue"

export default {
    data() {
        return {
            dataForm: {
                cusNo: '',
                cusName: '',
                state: undefined
            },
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            lossRepVisible: false
        }
    },
    components: {
        lossRep
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
                'state': this.dataForm.state
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
        },
        reprieveHandle(row) {
            this.lossRepVisible = true
            this.$nextTick(() => {
                this.$refs.lossRep.init(row.id, row.state === 0)
            })
        }
    }
}
</script>
  