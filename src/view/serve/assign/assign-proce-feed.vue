<template>
  <el-dialog title="服务分配" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="服务类型" prop="serveType">
        <el-input v-model="dataForm.serveType" placeholder="服务类型" disabled></el-input>
      </el-form-item>
      <el-form-item label="客户" prop="customer">
        <el-input v-model="dataForm.customer" placeholder="客户" disabled></el-input>
      </el-form-item>
      <el-form-item label="概要" prop="overview">
        <el-input v-model="dataForm.overview" placeholder="概要" disabled></el-input>
      </el-form-item>
      <el-form-item label="服务内容" prop="serviceRequest">
        <el-input v-model="dataForm.serviceRequest" placeholder="服务内容" disabled></el-input>
      </el-form-item>
      <el-form-item label="指派给" prop="assigner">
        <el-select v-model="dataForm.assigner" placeholder="请选择指派人">
          <el-option v-for="item in allService" :key="item.id" :label="item.username" :value="item.username">
          </el-option>
        </el-select>
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
      allService: [],
      dataForm: {
        id: 0,
        serveType: '',
        overview: '',
        customer: '',
        serviceRequest: '',
        createPeople: '',
        assigner: ''
      },
      dataRule: {
        assigner: [
          { required: true, message: '服务分配人不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.visible = true
      this.dataForm.id = id
      this.buildAssignSelect()
      this.$nextTick(async () => {
        this.$refs['dataForm'].resetFields()
        let { data } = await request.get(`serve/${id}`);
        if (data.code === 200) {
          this.dataForm.serveType = data.customerServe.serveType
          this.dataForm.overview = data.customerServe.overview
          this.dataForm.customer = data.customerServe.customer
          this.dataForm.serviceRequest = data.customerServe.serviceRequest
          this.dataForm.createPeople = data.customerServe.createPeople
        }
      })
    },
    async buildAssignSelect() {
      let { data } = await request.get("user/role?role=售后");
      if (data.code === 200) {
        this.allService = data.userRoles
      }
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          let { data } = await request.post("serve/save", {
            'id': this.dataForm.id,
            'serveType': this.dataForm.serveType,
            'overview': this.dataForm.overview,
            'customer': this.dataForm.customer,
            'serviceRequest': this.dataForm.serviceRequest,
            'createPeople': this.dataForm.createPeople,
            'state': 'fw_002',
            'assigner': this.dataForm.assigner
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
