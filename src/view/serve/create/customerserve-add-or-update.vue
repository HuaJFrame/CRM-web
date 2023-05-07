<template>
  <el-dialog title="服务新增" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="服务类型" prop="serveType">
        <el-select v-model="dataForm.serveType" placeholder="请选择服务类型">
          <el-option v-for="item in serveTypeList" :key="item.id" :label="item.dataDicValue" :value="item.dataDicValue">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户" prop="customer">
        <el-select v-model="dataForm.customer" placeholder="客户">
          <el-option v-for="item in customerList" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="概要" prop="overview">
        <el-input v-model="dataForm.overview" placeholder="概要"></el-input>
      </el-form-item>
      <el-form-item label="服务内容" prop="serviceRequest">
        <el-input v-model="dataForm.serviceRequest" placeholder="服务内容"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from "@/util/request"

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        serveType: '',
        overview: '',
        customer: '',
        serviceRequest: '',
        createPeople: ''
      },
      serveTypeList: [],
      customerList: [],
      dataRule: {
        serveType: [
          { required: true, message: '服务类型不能为空', trigger: 'blur' }
        ],
        overview: [
          { required: true, message: '概要不能为空', trigger: 'blur' }
        ],
        customer: [
          { required: true, message: '客户不能为空', trigger: 'blur' }
        ],
        serviceRequest: [
          { required: true, message: '服务内容不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(serveTypeList) {
      this.visible = true
      this.serveTypeList = serveTypeList
      this.buildCustomerList()
      this.dataForm.createPeople = JSON.parse(sessionStorage.getItem("userInfo")).username
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    async buildCustomerList() {
      let { data } = await request.get("cus/customerList");
      if (data.code === 200) {
        this.customerList = data.customerList;
      } else {
        this.customerList = []
      }
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          let { data } = await request.post("serve/save", {
            'serveType': this.dataForm.serveType,
            'overview': this.dataForm.overview,
            'customer': this.dataForm.customer,
            'serviceRequest': this.dataForm.serviceRequest,
            'createPeople': this.dataForm.createPeople,
            'state': 'fw_001'
          });
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

        }
      })
    }
  }
}
</script>
