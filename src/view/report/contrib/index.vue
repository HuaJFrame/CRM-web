<template>
    <div class="mod-config">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" v-hasPermi="['report:contrib:list']">
            <el-form-item>
                <el-input v-model="dataForm.name" placeholder="客户名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="dataForm.type" placeholder="金额区间" clearable>
                    <el-option label="0-1000" :value="1">
                    </el-option>
                    <el-option label="1001-3000" :value="2">
                    </el-option>
                    <el-option label="3001-5000" :value="3">
                    </el-option>
                    <el-option label="5000以上" :value="4">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column prop="name" header-align="center" align="center" label="客户姓名">
            </el-table-column>
            <el-table-column prop="total" header-align="center" align="center" label="总金额(￥)">
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
                name: '',
                type: undefined
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
            let { data } = await request.post("cus/contribution", {
                'page': this.pageIndex,
                'limit': this.pageSize,
                'name': this.dataForm.name,
                'type': this.dataForm.type
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
  