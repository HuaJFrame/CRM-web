<template>
    <div class="mod-config">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">

            <el-form-item>
                <el-select v-model="dataForm.dataDicName" placeholder="请选择字典名" v-hasPermi="['system:dict:query']" clearable>
                    <el-option v-for="item in dictNameList" :key="item" :label="item" :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="dataForm.dataDicValue" placeholder="字典值" clearable
                    v-hasPermi="['system:dict:query']"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()" v-hasPermi="['system:dict:query']">查询</el-button>
                <el-button type="primary" @click="addOrUpdateHandle()" v-hasPermi="['system:dict:add']">新增</el-button>
                <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0"
                    v-hasPermi="['system:dict:delete']">批量删除</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle"
            style="width: 100%;">
            <el-table-column type="selection" header-align="center" align="center" width="50">
            </el-table-column>
            <el-table-column prop="id" header-align="center" align="center" label="字典Id">
            </el-table-column>
            <el-table-column prop="dataDicName" header-align="center" align="center" label="字典名">
            </el-table-column>
            <el-table-column prop="dataDicValue" header-align="center" align="center" label="字典值">
            </el-table-column>
            <el-table-column prop="createDate" header-align="center" align="center" label="创建时间">
            </el-table-column>
            <el-table-column prop="updateDate" header-align="center" align="center" label="更新时间">
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="addOrUpdateHandle(scope.row.id)"
                        v-hasPermi="['system:dict:edit']">修改</el-button>
                    <el-button type="danger" size="small" @click="deleteHandle(scope.row.id)"
                        v-hasPermi="['system:dict:delete']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate"
            @refreshDataList="getDataList(), buildDictNameList()"></add-or-update>
    </div>
</template>
  
<script>
import AddOrUpdate from './datadic-add-or-update'
import request from "@/util/request"
import qs from 'qs'

export default {
    data() {
        return {
            dataForm: {
                dataDicName: '',
                dataDicValue: ''
            },
            dictNameList: [],
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false
        }
    },
    components: {
        AddOrUpdate
    },
    mounted() {
        this.buildDictNameList()
        this.getDataList()
    },
    methods: {
        async buildDictNameList() {
            let { data } = await request.get("dict/nameList");
            if (data.code === 200) {
                this.dictNameList = data.dictNameList
            }
        },
        // 获取数据列表
        async getDataList() {
            this.dataListLoading = true
            let { data } = await request.post("dict/list", {
                'page': this.pageIndex,
                'limit': this.pageSize,
                'dataDicName': this.dataForm.dataDicName,
                'dataDicValue': this.dataForm.dataDicValue
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
                let { data } = await request.get("dict/delete?" + qs.stringify({ "ids": ids }, { indices: false }));
                if (data.code === 200) {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                        duration: 1500,
                        onClose: async () => {
                            this.getDataList()
                            this.buildDictNameList()
                        }
                    })
                } else {
                    this.$message.error(data.msg)
                }
            })
        }
    }
}
</script>
  