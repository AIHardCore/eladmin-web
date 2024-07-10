<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">名称</label>
        <el-input v-model="query.name" clearable placeholder="名称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">价格</label>
        <el-input v-model="query.price" clearable placeholder="价格" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">时间单位</label>
        <el-input v-model="query.timeUnit" clearable placeholder="时间单位" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">时间长度</label>
        <el-input v-model="query.timeLength" clearable placeholder="时间长度" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">状态</label>
        <el-input v-model="query.enabled" clearable placeholder="状态" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="价格()" prop="price">
            <el-input-number v-model="form.priceOfYuan" controls-position="right" :precision="2" :min="1" style="width: 100%" />
          </el-form-item>
          <el-form-item label="时间单位" prop="timeUnit">
            <el-select v-model="form.timeUnit" filterable placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in dict.time_unit"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!--          <el-form-item label="时间单位" prop="timeUnit">
            <el-radio-group v-model="form.timeUnit">
              <el-radio
                v-for="item in dict.time_unit"
                :key="item.id"
                :label="item.value"
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>-->
          <el-form-item v-enable="form.timeUnit" label="时间长度" prop="timeLength">
            <el-input-number v-model="form.timeLength" controls-position="right" :min="1" :max="11" style="width: 100%" />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="form.enabled">
              <el-radio
                v-for="item in dict.user_status"
                :key="item.id"
                :label="item.value"
              >{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="priceOfYuan" label="价格" />
        <el-table-column prop="timeUnit" label="时间单位">
          <template slot-scope="scope">
            {{ dict.label.time_unit[scope.row.timeUnit] }}
          </template>
        </el-table-column>
        <el-table-column prop="timeLength" label="时间长度" />
        <el-table-column label="状态" align="center" prop="enabled">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="changeEnabled(scope.row, scope.row.enabled)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建日期" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column v-if="checkPer(['admin','produce:edit','produce:del'])" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudProduce from '@/api/produce'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import crudUser from '@/api/system/user'

const defaultForm = { id: null, name: null, price: null, priceOfYuan: null, timeUnit: 0, timeLength: null, enabled: 'false', createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'Produce',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['time_unit', 'user_status'],
  cruds() {
    return CRUD({ title: '商品', url: 'api/produce', idField: 'id', sort: 'id,desc', crudMethod: { ...crudProduce }})
  },
  data() {
    return {
      timeUnit: null,
      timeUnitData: {},
      permission: {
        add: ['admin', 'produce:add'],
        edit: ['admin', 'produce:edit'],
        del: ['admin', 'produce:del']
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '价格不能为空', trigger: 'blur' }
        ],
        timeUnit: [
          { required: true, message: '时间单位不能为空', trigger: 'blur' }
        ],
        timeLength: [
          { required: true, message: '时间长度不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'name', display_name: '名称' },
        { key: 'price', display_name: '价格' },
        { key: 'timeUnit', display_name: '时间单位' },
        { key: 'timeLength', display_name: '时间长度' },
        { key: 'enabled', display_name: '状态' }
      ]
    }
  },
  mounted() {
    console.log(JSON.parse(JSON.stringify(this.dict.time_unit)))
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      form.timeUnit = form.timeUnit.toString()
      form.enabled = form.enabled.toString()
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      crud.form.price = crud.form.priceOfYuan * 100
      return true
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.user_status[val] + '" ' + data.username + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudUser.edit(data).then(res => {
          this.crud.notify(this.dict.label.user_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(() => {
          data.enabled = !data.enabled
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    }
  }
}
</script>

<style scoped>

</style>
