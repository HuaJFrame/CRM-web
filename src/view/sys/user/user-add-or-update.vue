<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="dataForm.username" placeholder="用户名" :disabled="dataForm.id ? true : false"></el-input>
        <el-alert v-if="!dataForm.id" title="默认初始密码：123456" style="line-height: 10px;" type="success">
        </el-alert>
      </el-form-item>
      <el-form-item label="手机号码" prop="phoneNumber">
        <el-input v-model="dataForm.phoneNumber" placeholder="手机号码"></el-input>
      </el-form-item>
      <el-form-item label="用户状态" prop="status">
        <el-switch v-model="dataForm.status" active-color="#13ce66" inactive-color="#ff4949" active-text="激活"
          inactive-text="禁用" :active-value="0" :inactive-value="1">
        </el-switch>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
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
    //判断用户名是否已经重复
    const checkUsername = async (rule, value, callback) => {
      if (this.dataForm.id == 0) {
        const res = await request.post("user/checkUserName", { username: value });
        if (res.data.code == 500) {
          callback(new Error("用户名已存在！"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      visible: false,
      dataForm: {
        id: 0,
        username: '',
        phoneNumber: '',
        status: 0,
        remark: ''
      },
      dataRule: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { required: true, validator: checkUsername, trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          {
            pattern: /^1(3[0-9]|4[57]|5[0-35-9]|7[0678]|8[0-9])\d{8}$/, message: "请填写正确的电话号码", trigger: "blur"
          }
        ],
        status: [
          { required: true, message: '用户状态不能为空', trigger: 'blur' }
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
          let { data: data } = await request.get(`user/${id}`);
          if (data.code === 200) {
            this.dataForm.username = data.user.username
            this.dataForm.phoneNumber = data.user.phoneNumber
            this.dataForm.status = data.user.status
            this.dataForm.remark = data.user.remark
          }
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.formSubmit();
        }
      })
    },
    async formSubmit() {
      let ret = await request.post("user/save", {
        'id': this.dataForm.id || undefined,
        'username': this.dataForm.username,
        'phoneNumber': this.dataForm.phoneNumber,
        'status': this.dataForm.status,
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
  }
}
</script>
