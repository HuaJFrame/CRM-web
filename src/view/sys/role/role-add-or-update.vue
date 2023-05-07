<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" width="30%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="权限字符" prop="code">
        <el-input v-model="dataForm.code" placeholder="权限字符"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注" type="textarea" :autosize="{ minRows: 3 }"></el-input>
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
        name: '',
        code: '',
        remark: ''
      },
      dataRule: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '角色权限字符串不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(async () => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          let { data: data } = await request.get(`role/${id}`);
          if (data.code === 200) {
            this.dataForm.name = data.role.name
            this.dataForm.code = data.role.code
            this.dataForm.remark = data.role.remark
          }
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          let ret = await request.post("role/save", {
            'id': this.dataForm.id || undefined,
            'name': this.dataForm.name,
            'code': this.dataForm.code,
            'remark': this.dataForm.remark
          });
          let msg = this.dataForm.id ? "修改" : "新增"
          if (ret.data.code === 200) {
            this.$message({
              message: msg + "成功",
              type: "success"
            });
            this.$emit('refreshDataList')
          } else {
            this.$message({
              message: msg + "失败",
              type: "error"
            });
          }
          this.visible = false
        }
      })
    }
  }
}
</script>
