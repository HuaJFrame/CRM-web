<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" width="30%">
    <div class="el-dialog-div">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
        label-width="110px">
        <el-form-item label="客户名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="客户名称"></el-input>
        </el-form-item>
        <el-form-item label="地区" prop="area">
          <el-input v-model="dataForm.area" placeholder="地区"></el-input>
        </el-form-item>
        <el-form-item label="客户经理" prop="cusManager">
          <el-input v-model="dataForm.cusManager" placeholder="客户经理"></el-input>
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-select v-model="dataForm.level" placeholder="级别">
            <el-option v-for="item in levelList" :key="item.id" :label="item.dataDicValue" :value="item.dataDicValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="满意度" prop="myd">
          <el-select v-model="dataForm.myd" placeholder="满意度">
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
        <el-form-item label="客户信用度" prop="xyd">
          <el-select v-model="dataForm.xyd" placeholder="客户信用度">
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
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="dataForm.address" placeholder="详细地址"></el-input>
        </el-form-item>
        <el-form-item label="邮编" prop="postCode">
          <el-input v-model="dataForm.postCode" placeholder="邮编"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="dataForm.phone" placeholder="联系电话"></el-input>
        </el-form-item>
        <el-form-item label="传真" prop="fax">
          <el-input v-model="dataForm.fax" placeholder="传真"></el-input>
        </el-form-item>
        <el-form-item label="网址" prop="webSite">
          <el-input v-model="dataForm.webSite" placeholder="网址"></el-input>
        </el-form-item>
        <el-form-item label="营业执照注册号" prop="yyzzzch">
          <el-input v-model="dataForm.yyzzzch" placeholder="营业执照注册号"></el-input>
        </el-form-item>
        <el-form-item label="法人代表" prop="fr">
          <el-input v-model="dataForm.fr" placeholder="法人代表"></el-input>
        </el-form-item>
        <el-form-item label="注册资金" prop="zczj">
          <el-input v-model="dataForm.zczj" placeholder="注册资金"></el-input>
        </el-form-item>
        <el-form-item label="年营业额" prop="nyye">
          <el-input v-model="dataForm.nyye" placeholder="年营业额"></el-input>
        </el-form-item>
        <el-form-item label="开户银行" prop="khyh">
          <el-input v-model="dataForm.khyh" placeholder="开户银行"></el-input>
        </el-form-item>
        <el-form-item label="开户账号" prop="khzh">
          <el-input v-model="dataForm.khzh" placeholder="开户账号"></el-input>
        </el-form-item>
        <el-form-item label="地税登记号	" prop="dsdjh">
          <el-input v-model="dataForm.dsdjh" placeholder="地税登记号	"></el-input>
        </el-form-item>
        <el-form-item label="国税登记号" prop="gsdjh">
          <el-input v-model="dataForm.gsdjh" placeholder="国税登记号"></el-input>
        </el-form-item>
      </el-form>
    </div>
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
      levelList: [],
      dataForm: {
        id: 0,
        name: '',
        area: '',
        cusManager: '',
        level: '',
        myd: '',
        xyd: '',
        address: '',
        postCode: '',
        phone: '',
        fax: '',
        webSite: '',
        yyzzzch: '',
        fr: '',
        zczj: '',
        nyye: '',
        khyh: '',
        khzh: '',
        dsdjh: '',
        gsdjh: ''
      },
      dataRule: {
        name: [
          { required: true, message: '客户名称不能为空', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '地区不能为空', trigger: 'blur' }
        ],
        cusManager: [
          { required: true, message: '客户经理不能为空', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '级别不能为空', trigger: 'blur' }
        ],
        myd: [
          { required: true, message: '满意度不能为空', trigger: 'blur' }
        ],
        xyd: [
          { required: true, message: '客户信用度不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' }
        ],
        postCode: [
          { required: true, message: '邮编不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          {
            pattern: /^1(3[0-9]|4[57]|5[0-35-9]|7[0678]|8[0-9])\d{8}$/, message: "请填写正确的电话号码", trigger: "blur"
          }
        ],
        khyh: [
          { required: true, message: '开户银行不能为空', trigger: 'blur' }
        ],
        khzh: [
          { required: true, message: '开户账号不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id, levelList) {
      this.dataForm.id = id || 0
      this.visible = true
      this.levelList = levelList
      this.$nextTick(async () => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          let { data } = await request.get(`cus/${id}`);
          if (data.code === 200) {
            this.dataForm.name = data.customer.name
            this.dataForm.area = data.customer.area
            this.dataForm.cusManager = data.customer.cusManager
            this.dataForm.level = data.customer.level
            this.dataForm.myd = data.customer.myd
            this.dataForm.xyd = data.customer.xyd
            this.dataForm.address = data.customer.address
            this.dataForm.postCode = data.customer.postCode
            this.dataForm.phone = data.customer.phone
            this.dataForm.fax = data.customer.fax
            this.dataForm.webSite = data.customer.webSite
            this.dataForm.yyzzzch = data.customer.yyzzzch
            this.dataForm.fr = data.customer.fr
            this.dataForm.zczj = data.customer.zczj
            this.dataForm.nyye = data.customer.nyye
            this.dataForm.khyh = data.customer.khyh
            this.dataForm.khzh = data.customer.khzh
            this.dataForm.dsdjh = data.customer.dsdjh
            this.dataForm.gsdjh = data.customer.gsdjh
          }
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          let { data } = await request.post("cus/save", {
            'id': this.dataForm.id || undefined,
            'name': this.dataForm.name,
            'area': this.dataForm.area,
            'cusManager': this.dataForm.cusManager,
            'level': this.dataForm.level,
            'myd': this.dataForm.myd,
            'xyd': this.dataForm.xyd,
            'address': this.dataForm.address,
            'postCode': this.dataForm.postCode,
            'phone': this.dataForm.phone,
            'fax': this.dataForm.fax,
            'webSite': this.dataForm.webSite,
            'yyzzzch': this.dataForm.yyzzzch,
            'fr': this.dataForm.fr,
            'zczj': this.dataForm.zczj,
            'nyye': this.dataForm.nyye,
            'khyh': this.dataForm.khyh,
            'khzh': this.dataForm.khzh,
            'dsdjh': this.dataForm.dsdjh,
            'gsdjh': this.dataForm.gsdjh
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

<style lang="scss" scoped>
.el-dialog-div {
  height: 50vh; //如果高度过高，可用max-height
  overflow: auto;
}
</style>
