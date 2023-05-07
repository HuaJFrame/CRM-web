<template>
    <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
            label-width="80px">
            <el-form-item label="字典名" prop="dataDicName">
                <el-input v-model="dataForm.dataDicName" placeholder="字典名"></el-input>
            </el-form-item>
            <el-form-item label="字典值" prop="dataDicValue">
                <el-input v-model="dataForm.dataDicValue" placeholder="字典值"></el-input>
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
                dataDicName: '',
                dataDicValue: '',
            },
            dataRule: {
                dataDicName: [
                    { required: true, message: '字典名不能为空', trigger: 'blur' }
                ],
                dataDicValue: [
                    { required: true, message: '字典值不能为空', trigger: 'blur' }
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
                    let { data } = await request.get(`dict/${id}`);
                    if (data.code === 200) {
                        this.dataForm.dataDicName = data.dict.dataDicName
                        this.dataForm.dataDicValue = data.dict.dataDicValue
                    }
                }
            })
        },
        // 表单提交
        dataFormSubmit() {
            this.$refs['dataForm'].validate(async (valid) => {
                if (valid) {
                    let { data } = await request.post("dict/save", {
                        'id': this.dataForm.id || undefined,
                        'dataDicName': this.dataForm.dataDicName,
                        'dataDicValue': this.dataForm.dataDicValue
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
  