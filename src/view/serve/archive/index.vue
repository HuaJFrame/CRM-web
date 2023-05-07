<template>
    <div class="mod-config">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item v-hasPermi="['serve:query']">
                <el-input v-model="dataForm.customer" placeholder="客户名" clearable></el-input>
            </el-form-item>
            <el-form-item v-hasPermi="['serve:query']">
                <el-select v-model="dataForm.serveType" placeholder="请选择服务类型" clearable>
                    <el-option v-for="item in serveTypeList" :key="item.id" :label="item.dataDicValue"
                        :value="item.dataDicValue">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()" v-hasPermi="['serve:query']">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column prop="id" header-align="center" align="center" label="编号">
            </el-table-column>
            <el-table-column prop="customer" header-align="center" align="center" label="客户">
            </el-table-column>
            <el-table-column prop="serveType" header-align="center" align="center" label="服务类型">
            </el-table-column>
            <el-table-column prop="overview" header-align="center" align="center" label="概要">
            </el-table-column>
            <el-table-column prop="createPeople" header-align="center" align="center" label="创建人">
            </el-table-column>
            <el-table-column prop="serviceRequest" header-align="center" align="center" label="服务内容">
            </el-table-column>
            <el-table-column prop="assigner" header-align="center" align="center" label="服务分配人">
            </el-table-column>
            <el-table-column prop="assignTime" header-align="center" align="center" label="分配时间">
            </el-table-column>
            <el-table-column prop="serviceProce" header-align="center" align="center" label="服务处理">
            </el-table-column>
            <el-table-column prop="serviceProcePeople" header-align="center" align="center" label="服务处理人">
            </el-table-column>
            <el-table-column prop="serviceProceTime" header-align="center" align="center" label="服务处理时间">
            </el-table-column>
            <el-table-column prop="serviceProceResult" header-align="center" align="center" label="处理结果">
            </el-table-column>
            <el-table-column prop="myd" header-align="center" align="center" label="满意度">
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
                customer: '',
                serveType: '',
                state: 'fw_005'
            },
            dataList: [],
            serveTypeList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            assignProceFeedVisible: false
        }
    },
    mounted() {
        this.dataForm.assigner = JSON.parse(sessionStorage.getItem("userInfo")).username
        this.getDict()
        this.getDataList()
    },
    methods: {
        async getDict() {
            let { data } = await request.get("dict/dictValue?dictName=服务类型");
            if (data.code === 200) {
                this.serveTypeList = data.dictValues
            } else {
                this.serveTypeList = []
            }
        },
        // 获取数据列表
        async getDataList() {
            this.dataListLoading = true
            let { data } = await request.post("serve/list", {
                'page': this.pageIndex,
                'limit': this.pageSize,
                'customer': this.dataForm.customer,
                'serveType': this.dataForm.serveType,
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
        }
    }
}
</script>
  