<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" append-to-body
    width="20%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="计划内容" prop="planItem">
        <el-input v-model="dataForm.planItem" placeholder="计划内容"></el-input>
      </el-form-item>
      <el-form-item label="计划日期" prop="planDate">
        <el-date-picker v-model="dataForm.planDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
          format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label=" 执行效果" prop="exeAffect">
        <el-select v-model="dataForm.exeAffect" placeholder="执行效果">
          <el-option label="☆" value="☆">
          </el-option>
          <el-option label="☆☆" value="☆☆">
          </el-option>
          <el-option label="☆☆☆" value="☆☆☆">
          </el-option>
          <el-option label="☆☆☆☆" value="☆☆☆☆">
          </el-option>
          <el-option label="☆☆☆☆☆" value="☆☆☆☆☆">
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
      dataForm: {
        id: 0,
        saleChanceId: undefined,
        planItem: '',
        planDate: '',
        exeAffect: ''
      },
      dataRule: {
        planItem: [
          { required: true, message: '计划内容不能为空', trigger: 'blur' }
        ],
        planDate: [
          { required: true, message: '计划日期不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id, saleChanceId) {
      this.dataForm.id = id || 0
      this.dataForm.saleChanceId = saleChanceId
      this.visible = true
      this.$nextTick(async () => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          let { data } = await request.get(`cusDevPlan/${id}`);
          if (data.code === 200) {
            this.dataForm.saleChanceId = data.cusDevPlan.saleChanceId
            this.dataForm.planItem = data.cusDevPlan.planItem
            this.dataForm.planDate = data.cusDevPlan.planDate
            this.dataForm.exeAffect = data.cusDevPlan.exeAffect
          }
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          let { data } = await request.post("cusDevPlan/save", {
            'id': this.dataForm.id || undefined,
            'saleChanceId': this.dataForm.saleChanceId,
            'planItem': this.dataForm.planItem,
            'planDate': this.dataForm.planDate,
            'exeAffect': this.dataForm.exeAffect
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
