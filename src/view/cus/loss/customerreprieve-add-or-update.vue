<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="措施" prop="measure">
        <el-input v-model="dataForm.measure" placeholder="措施"></el-input>
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
        id: 0,
        lossId: undefined,
        measure: ''
      },
      dataRule: {
        measure: [
          { required: true, message: '措施不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id, lossId) {
      this.dataForm.id = id || 0
      this.dataForm.lossId = lossId
      this.visible = true
      this.$nextTick(async () => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          let { data } = await request.get(`cusRep/${id}`);
          if (data.code === 200) {
            this.dataForm.lossId = data.customerReprieve.lossId
            this.dataForm.measure = data.customerReprieve.measure
          }
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          let { data } = await request.post("cusRep/save", {
            'id': this.dataForm.id || undefined,
            'lossId': this.dataForm.lossId,
            'measure': this.dataForm.measure
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
