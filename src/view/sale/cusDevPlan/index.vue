<template>
    <div class="mod-config">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input v-model="dataForm.customerName" placeholder="客户名称" clearable
                    v-hasPermi="['sale:chance:query']"></el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="dataForm.devResult" placeholder="开发状态" v-hasPermi="['sale:chance:query']" clearable>
                    <el-option label="开发中" value="1">
                    </el-option>
                    <el-option label="开发成功" value="2">
                    </el-option>
                    <el-option label="开发失败" value="3">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()" v-hasPermi="['sale:chance:query']">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column prop="chanceSource" header-align="center" align="center" label="机会来源">
            </el-table-column>
            <el-table-column prop="customerName" header-align="center" align="center" label="客户名称">
            </el-table-column>
            <el-table-column prop="cgjl" header-align="center" align="center" label="成功几率">
            </el-table-column>
            <el-table-column prop="overview" header-align="center" align="center" label="概要">
            </el-table-column>
            <el-table-column prop="linkMan" header-align="center" align="center" label="联系人">
            </el-table-column>
            <el-table-column prop="linkPhone" header-align="center" align="center" label="手机号">
            </el-table-column>
            <el-table-column prop="description" header-align="center" align="center" label="描述">
            </el-table-column>
            <el-table-column prop="createMan" header-align="center" align="center" label="创建人">
            </el-table-column>
            <el-table-column prop="assignMan" header-align="center" align="center" label="分配人">
            </el-table-column>
            <el-table-column prop="assignTime" header-align="center" align="center" label="分配时间">
            </el-table-column>
            <el-table-column prop="devResult" header-align="center" align="center" label="开发状态">
                <template v-slot="scope">
                    <el-tag size="small" v-if="scope.row.devResult === 0" type="warning" effect="dark">未开发</el-tag>
                    <el-tag size="small" v-else-if="scope.row.devResult === 1" effect="dark">开发中</el-tag>
                    <el-tag size="small" v-else-if="scope.row.devResult === 2" type="success" effect="dark">开发成功</el-tag>
                    <el-tag size="small" v-else-if="scope.row.devResult === 3" type="danger" effect="dark">开发失败</el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="warning" size="small" v-if="scope.row.devResult === 1"
                        @click="toCusPlan(scope.row)">开发</el-button>
                    <el-button type="primary" size="small" v-else @click="toCusPlan(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <cusPlan v-if="cusPlanVisible" ref="cusPlan" @refreshDataList="getDataList"></cusPlan>
    </div>
</template>
  
<script>
import request from "@/util/request"
import cusPlan from "./cusPlan.vue"

export default {
    data() {
        return {
            dataForm: {
                customerName: '',
                devResult: null
            },
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            cusPlanVisible: false
        }
    },
    components: {
        cusPlan
    },
    mounted() {
        this.getDataList()
    },
    methods: {
        // 获取数据列表
        async getDataList() {
            this.dataListLoading = true
            let userInfo = JSON.parse(sessionStorage.getItem("userInfo"))
            let { data } = await request.post("chance/list", {
                'page': this.pageIndex,
                'limit': this.pageSize,
                'customerName': this.dataForm.customerName,
                'state': this.dataForm.state,
                "devResult": this.dataForm.devResult,
                "assignMan": userInfo.username
            });
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
        toCusPlan(row) {
            this.cusPlanVisible = true
            this.$nextTick(() => {
                this.$refs.cusPlan.init(row.id, row.devResult === 1)
            })
        }
    }
}
</script>
  