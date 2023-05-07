<template>
    <div class="mod-config">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item v-hasPermi="['cus:info:query']">
                <el-input v-model="dataForm.name" placeholder="客户名称" clearable></el-input>
            </el-form-item>
            <el-form-item v-hasPermi="['cus:info:query']">
                <el-input v-model="dataForm.khno" placeholder="客户编号" clearable></el-input>
            </el-form-item>
            <el-form-item v-hasPermi="['cus:info:query']">
                <el-select v-model="dataForm.level" placeholder="请选择客户级别" v-hasPermi="['cus:info:query']" clearable>
                    <el-option v-for="item in levelList" :key="item.id" :label="item.dataDicValue"
                        :value="item.dataDicValue">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()" v-hasPermi="['cus:info:query']">查询</el-button>
                <el-button v-hasPermi="['cus:info:add']" type="primary" @click="addOrUpdateHandle()">新增</el-button>
                <el-button v-hasPermi="['cus:info:delete']" type="danger" @click="deleteHandle()"
                    :disabled="dataListSelections.length <= 0">批量删除</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle"
            style="width: 100%;">
            <el-table-column type="selection" header-align="center" align="center" width="50">
            </el-table-column>
            <el-table-column prop="khno" header-align="center" align="center" label="客户编号">
            </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" label="客户名称">
            </el-table-column>
            <el-table-column prop="area" header-align="center" align="center" label="地区">
            </el-table-column>
            <el-table-column prop="cusManager" header-align="center" align="center" label="客户经理">
            </el-table-column>
            <el-table-column prop="level" header-align="center" align="center" label="级别">
            </el-table-column>
            <el-table-column prop="myd" header-align="center" align="center" label="满意度">
            </el-table-column>
            <el-table-column prop="xyd" header-align="center" align="center" label="客户信用度">
            </el-table-column>
            <el-table-column prop="address" header-align="center" align="center" label="详细地址" width="150">
            </el-table-column>
            <el-table-column prop="postCode" header-align="center" align="center" label="邮编">
            </el-table-column>
            <el-table-column prop="phone" header-align="center" align="center" label="联系电话">
            </el-table-column>
            <el-table-column prop="fax" header-align="center" align="center" label="传真">
            </el-table-column>
            <el-table-column prop="webSite" header-align="center" align="center" label="网址">
            </el-table-column>
            <el-table-column prop="yyzzzch" header-align="center" align="center" label="营业执照注册号">
            </el-table-column>
            <el-table-column prop="fr" header-align="center" align="center" label="法人代表">
            </el-table-column>
            <el-table-column prop="zczj" header-align="center" align="center" label="注册资金">
            </el-table-column>
            <el-table-column prop="nyye" header-align="center" align="center" label="年营业额">
            </el-table-column>
            <el-table-column prop="khyh" header-align="center" align="center" label="开户银行">
            </el-table-column>
            <el-table-column prop="khzh" header-align="center" align="center" label="开户账号">
            </el-table-column>
            <el-table-column prop="dsdjh" header-align="center" align="center" label="地税登记号">
            </el-table-column>
            <el-table-column prop="gsdjh" header-align="center" align="center" label="国税登记号">
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="250" label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="addOrUpdateHandle(scope.row.id)"
                        v-hasPermi="['cus:info:edit']">修改</el-button>
                    <el-button type="danger" size="small" @click="deleteHandle(scope.row.id)"
                        v-hasPermi="['cus:info:delete']">删除</el-button>
                    <el-button v-hasPermi="['cus:order:list']" type="primary" size="small"
                        @click="orderListHandle(scope.row.id)">查看订单</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
            :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage"
            layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        <order-list v-if="orderListVisible" ref="orderList"></order-list>
    </div>
</template>
  
<script>
import AddOrUpdate from './customer-add-or-update'
import orderList from './order-list.vue'
import request from "@/util/request"
import qs from 'qs'
export default {
    data() {
        return {
            dataForm: {
                name: '',
                khno: '',
                level: ''
            },
            dataList: [],
            levelList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
            orderListVisible: false
        }
    },
    components: {
        AddOrUpdate,
        orderList
    },
    mounted() {
        this.buildLevelList()
        this.getDataList()
    },
    methods: {
        //获取字典中客户级别
        async buildLevelList() {
            let { data } = await request.get("dict/dictValue?dictName=客户等级");
            if (data.code === 200) {
                this.levelList = data.dictValues
            }
        },
        // 获取数据列表
        async getDataList() {
            this.dataListLoading = true
            let { data } = await request.post("cus/list", {
                'page': this.pageIndex,
                'limit': this.pageSize,
                'name': this.dataForm.name,
                'khno': this.dataForm.khno,
                'level': this.dataForm.level
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
                this.$refs.addOrUpdate.init(id, this.levelList)
            })
        },
        orderListHandle(id) {
            this.orderListVisible = true
            this.$nextTick(() => {
                this.$refs.orderList.init(id)
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
                let { data } = await request.get("cus/delete?" + qs.stringify({ "ids": ids }, { indices: false }));
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
        }
    }
}
</script>
  