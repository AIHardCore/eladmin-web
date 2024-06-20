<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-select
          v-model="query.enabled"
          clearable
          size="small"
          placeholder="状态"
          class="filter-item"
          style="width: 90px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in enabledTypeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
        <date-range-picker v-model="query.vipExpiration" class="date-item" />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="用户类型" prop="type">
            <el-input v-model="form.type" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="VIP到期时间" prop="vipExpiration">
            <el-date-picker v-model="form.vipExpiration" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio v-for="item in dict.user_status" :key="item.id" v-model="form.enabled" :label="item.value">{{ item.label }}</el-radio>
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
        <el-table-column prop="nickName" label="昵称" />
        <el-table-column prop="avater" label="头像" />
        <el-table-column prop="type" label="用户类型" />
        <el-table-column prop="vipExpiration" label="VIP到期时间" />
        <el-table-column prop="enabled" label="状态">
          <template slot-scope="scope">
            {{ dict.label.user_status[scope.row.enabled] }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column v-if="checkPer(['admin','member:edit','member:del'])" label="操作" width="150px" align="center">
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
import crudMember from '@/api/system/member'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'

const defaultForm = { id: null, appid: null, nickName: null, avater: null, type: null, vipExpiration: null, enabled: null, createTime: null, updateTime: null, updateBy: null }
export default {
  name: 'Member',
  components: { pagination, crudOperation, rrOperation, udOperation, DateRangePicker },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['user_status'],
  cruds() {
    return CRUD({ title: 'APP用户', url: 'api/member', idField: 'id', sort: 'id,desc', crudMethod: { ...crudMember },
      optShow: {
        add: false,
        edit: true,
        del: false,
        reset: false
      }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'member:add'],
        edit: ['admin', 'member:edit'],
        del: ['admin', 'member:del']
      },
      enabledTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ],
      rules: {
        appid: [
          { required: true, message: 'appid不能为空', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '昵称不能为空', trigger: 'blur' }
        ],
        avater: [
          { required: true, message: '头像不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '用户类型不能为空', trigger: 'blur' }
        ],
        vipExpiration: [
          { required: true, message: 'VIP到期时间不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'enabled', display_name: '状态' }
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
