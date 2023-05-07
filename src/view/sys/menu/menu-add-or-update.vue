<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" width="30%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="上级菜单" prop="parentId">
        <el-select v-model="dataForm.parentId" placeholder="请选择上级菜单" clearable>
          <el-option label="新的一级菜单" :value="0"></el-option>
          <template v-for="item in tableData">
            <!-- eslint-disable -->
            <el-option :label="item.name" :value="item.id"></el-option>
            <!-- eslint-enable -->
            <template v-for="child in item.children">
              <el-option :label="child.name" :value="child.id">
                <span>{{ "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + child.name }}</span>
              </el-option>
            </template>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单类型" prop="menuType">
        <el-radio-group v-model="dataForm.menuType">
          <el-radio :label="'M'">目录</el-radio>
          <el-radio :label="'C'">菜单</el-radio>
          <el-radio :label="'F'">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelect'].reset()">
          <IconSelect ref="iconSelect" @selected="selected" :active-icon="dataForm.icon" />
          <el-input slot="reference" v-model="dataForm.icon" placeholder="点击选择图标" readonly clearable>
            <svg-icon v-if="dataForm.icon" :icon-class="dataForm.icon" />
            <i v-else slot="prefix" class="el-icon-search el-input__icon" />
          </el-input>
        </el-popover>
      </el-form-item>
      <el-form-item label="显示顺序" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" :min="1" label="显示顺序"></el-input-number>
      </el-form-item>
      <el-form-item label="路由地址" prop="path">
        <el-input v-model="dataForm.path" placeholder="路由地址 形如：/sys/role"></el-input>
      </el-form-item>
      <el-form-item label="组件路径" prop="component">
        <el-input v-model="dataForm.component" placeholder="组件路径 形如：sys/menu/index"></el-input>
      </el-form-item>
      <el-form-item label="权限标识" prop="perms">
        <el-input v-model="dataForm.perms" placeholder="权限标识 形如：sys:test:list"></el-input>
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
import IconSelect from "@/components/IconSelect";
import request from "@/util/request"

export default {
  props: {
    tableData: {
      type: Array,
      default: [],
      required: true
    }
  },
  components: {
    IconSelect
  },
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        name: '',
        icon: '',
        parentId: 0,
        orderNum: 0,
        path: '',
        component: '',
        menuType: 'M',
        perms: '',
        remark: ''
      },
      dataRule: {
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '显示顺序不能为空', trigger: 'blur' }
        ],
        menuType: [
          { required: true, message: '菜单类型不能为空', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '父菜单ID不能为空', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    // 选择图标
    selected(name) {
      this.dataForm.icon = name;
    },
    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(async () => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          let { data: data } = await request.get(`menu/${id}`)
          if (data.code === 200) {
            this.dataForm.name = data.menu.name
            this.dataForm.icon = data.menu.icon
            this.dataForm.parentId = data.menu.parentId
            this.dataForm.orderNum = data.menu.orderNum
            this.dataForm.path = data.menu.path
            this.dataForm.component = data.menu.component
            this.dataForm.menuType = data.menu.menuType
            this.dataForm.perms = data.menu.perms
            this.dataForm.remark = data.menu.remark
          }
        }
      })
    },
    // 选择图标
    selected(name) {
      this.dataForm.icon = name;
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          let { data } = await request.post("menu/save", {
            'id': this.dataForm.id,
            'name': this.dataForm.name,
            'icon': this.dataForm.icon,
            'parentId': this.dataForm.parentId,
            'orderNum': this.dataForm.orderNum,
            'path': this.dataForm.path,
            'component': this.dataForm.component,
            'menuType': this.dataForm.menuType,
            'perms': this.dataForm.perms,
            'remark': this.dataForm.remark
          });
          let msg = this.dataForm.id ? "修改" : "新增"
          if (data.code === 200) {
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
