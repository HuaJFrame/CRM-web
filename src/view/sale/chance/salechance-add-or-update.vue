<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="机会来源" prop="chanceSource">
        <el-input v-model="dataForm.chanceSource" placeholder="机会来源"></el-input>
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input v-model="dataForm.customerName" placeholder="客户名称"></el-input>
      </el-form-item>
      <el-form-item label="成功几率" prop="cgjl">
        <el-input-number v-model="dataForm.cgjl" :min="1" :max="100" label="%为单位"></el-input-number>
      </el-form-item>

      <el-form-item label="联系人" prop="linkMan">
        <el-input v-model="dataForm.linkMan" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="linkPhone">
        <el-input v-model="dataForm.linkPhone" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="概要" prop="overview">
        <el-input v-model="dataForm.overview" placeholder="概要"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="dataForm.description" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item label="指派给" prop="assignMan">
        <el-select v-model="dataForm.assignMan" placeholder="请选择分配人" clearable>
          <el-option v-for="item in allSale" :key="item.id" :label="item.username" :value="item.username">
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
      allSale: [],
      dataForm: {
        id: 0,
        chanceSource: '',
        customerName: '',
        cgjl: 1,
        overview: '',
        linkMan: '',
        linkPhone: '',
        description: '',
        createMan: '',
        assignMan: '',
      },
      dataRule: {
        chanceSource: [
          { required: true, message: '机会来源不能为空', trigger: 'blur' }
        ],
        customerName: [
          { required: true, message: '客户名称不能为空', trigger: 'blur' }
        ],
        cgjl: [
          { required: true, message: '成功几率不能为空', trigger: 'blur' }
        ],
        linkMan: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        linkPhone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1(3[0-9]|4[57]|5[0-35-9]|7[0678]|8[0-9])\d{8}$/, message: "请填写正确的电话号码", trigger: "blur"
          }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      this.buildAssignSelect()
      this.visible = true
      this.$nextTick(async () => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          let { data } = await request.get(`chance/${id}`);
          if (data.code === 200) {
            this.dataForm.chanceSource = data.saleChance.chanceSource
            this.dataForm.customerName = data.saleChance.customerName
            this.dataForm.cgjl = data.saleChance.cgjl
            this.dataForm.overview = data.saleChance.overview
            this.dataForm.linkMan = data.saleChance.linkMan
            this.dataForm.linkPhone = data.saleChance.linkPhone
            this.dataForm.description = data.saleChance.description
            this.dataForm.createMan = data.saleChance.createMan
            this.dataForm.assignMan = data.saleChance.assignMan
          }
        } else {
          this.dataForm.createMan = JSON.parse(sessionStorage.getItem("userInfo")).username
        }
      })
    },
    async buildAssignSelect() {
      let { data } = await request.get("user/role?role=销售");
      if (data.code === 200) {
        this.allSale = data.userRoles
      }
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          let { data } = await request.post("chance/save", {
            'id': this.dataForm.id || undefined,
            'chanceSource': this.dataForm.chanceSource,
            'customerName': this.dataForm.customerName,
            'cgjl': this.dataForm.cgjl,
            'overview': this.dataForm.overview,
            'linkMan': this.dataForm.linkMan,
            'linkPhone': this.dataForm.linkPhone,
            'description': this.dataForm.description,
            'createMan': this.dataForm.createMan,
            'assignMan': this.dataForm.assignMan
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
