<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">状态</label>
        <el-input v-model="query.enabled" clearable placeholder="状态" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">描述</label>
        <el-input v-model="query.describe" clearable placeholder="描述" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker
          v-model="query.deadlines"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          class="date-item"
        />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="图片" prop="img">
            <el-input v-model="form.img" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="跳转地址">
            <el-input v-model="form.url" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.describe" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="form.sort" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态" prop="enabled">
            <el-radio v-for="item in dict.user_status" :key="item.id" v-model="form.enabled" :label="item.value">{{ item.label }}</el-radio>
          </el-form-item>
          <el-form-item label="开始时间" prop="beginTime">
            <el-date-picker v-model="form.beginTime" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker v-model="form.endTime" type="datetime" style="width: 370px;" />
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
        <el-table-column prop="img" label="图片" />
        <el-table-column prop="url" label="跳转地址" />
        <el-table-column prop="sort" label="排序" />
        <el-table-column prop="enabled" label="状态">
          <template slot-scope="scope">
            {{ dict.label.user_status[scope.row.enabled] }}
          </template>
        </el-table-column>
        <el-table-column prop="beginTime" label="开始时间" />
        <el-table-column prop="endTime" label="结束时间" />
        <el-table-column prop="describe" label="描述" />
        <el-table-column v-if="checkPer(['admin','banner:edit','banner:del'])" label="操作" width="150px" align="center">
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
import crudBanner from '@/api/system/banner'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'

const defaultForm = { id: null, img: null, url: null, sort: null, enabled: null, beginTime: null, endTime: null, createBy: null, updateBy: null, createTime: null, updateTime: null, describe: null, deadlines: null }
export default {
  name: 'Banner',
  components: { pagination, crudOperation, rrOperation, udOperation, DateRangePicker },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['user_status'],
  cruds() {
    return CRUD({ title: '轮播图', url: 'api/banner', idField: 'id', sort: 'id,desc', crudMethod: { ...crudBanner }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'banner:add'],
        edit: ['admin', 'banner:edit'],
        del: ['admin', 'banner:del']
      },
      rules: {
        img: [
          { required: true, message: '图片不能为空', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ],
        beginTime: [
          { required: true, message: '开始时间不能为空', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '结束时间不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'enabled', display_name: '状态' },
        { key: 'describe', display_name: '描述' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
