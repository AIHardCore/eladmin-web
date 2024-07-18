<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">手机号</label>
        <el-input v-model="query.phone" clearable placeholder="手机号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">昵称</label>
        <el-input v-model="query.nickName" clearable placeholder="昵称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select
          v-model="query.type"
          clearable
          size="small"
          placeholder="用户类型"
          class="filter-item"
          style="width: 110px"
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
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="120px">
          <el-form-item label="昵称" prop="nickName">
            <el-input v-model="form.nickName" />
          </el-form-item>
          <el-form-item label="头像" prop="headImgUrl">
            <el-input v-model="form.headImgUrl" :disabled="form.createBy === 'System'" />
          </el-form-item>
          <el-form-item label="VIP到期时间" prop="vipExpiration">
            <el-date-picker v-model="form.vipExpiration" type="datetime" style="width: 200px;" />
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
        <el-table-column prop="headImgUrl" label="头像">
          <template slot-scope="{row}">
            <el-image
              :src="row.headImgUrl"
              :preview-src-list="[row.headImgUrl]"
              fit="contain"
              lazy
              class="el-avatar"
            >
              <div slot="error">
                <i class="el-icon-document" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="type" label="用户类型">
          <template slot-scope="scope">
            {{ scope.row.type ? '会员' : '非会员' }}
          </template>
        </el-table-column>
        <el-table-column prop="vipExpiration" label="VIP到期时间">
          <template slot-scope="scope">
            <span :style="difference(scope.row)">{{ scope.row.vipExpiration }}</span>
          </template>
        </el-table-column>
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
import crudMember from '@/api/member'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'

const defaultForm = { openId: null, nickName: null, headImgUrl: null, phone: null, type: null, vipExpiration: null, enabled: null, createTime: null, updateTime: null, updateBy: null, createBy: null }
export default {
  name: 'Member',
  components: { pagination, crudOperation, rrOperation, udOperation, DateRangePicker },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['user_status'],
  cruds() {
    return CRUD({ title: 'APP用户', url: 'api/member', idField: 'id', sort: 'createTime,desc', crudMethod: { ...crudMember },
      optShow: {
        add: true,
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
        { key: 'true', display_name: '会员' },
        { key: 'false', display_name: '非会员' }
      ],
      rules: {
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
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      form.enabled = form.enabled.toString()
    },
    difference(row) {
      const dateTime = new Date()
      const end = new Date(row.vipExpiration)
      const dateDiff = end.getTime() - dateTime.getTime() // 时间差的毫秒数
      const dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)) // 计算出相差天数

      if (dateDiff <= 0) {
        return 'color: red'
      } else if (dayDiff < 30) {
        return 'color: goldenrod'
      } else if (dayDiff < 60) {
        return 'color: green'
      } else if (dayDiff < 90) {
        return 'color: blue'
      }
      return 'color: black'
    }
    /* difference(row) {
      const dateBegin = new Date(row.beginTime)
      const dateEnd = new Date(row.endTime)
      const dateDiff = dateEnd.getTime() - dateBegin.getTime() // 时间差的毫秒数
      const dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)) // 计算出相差天数
      const leave1 = dateDiff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
      const hours = Math.floor(leave1 / (3600 * 1000)) // 计算出小时数
      // 计算相差分钟数
      const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
      const minutes = Math.floor(leave2 / (60 * 1000)) // 计算相差分钟数
      // 计算相差秒数
      const leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
      const seconds = Math.round(leave3 / 1000)
      this.seconds = seconds
      this.minutes = minutes
      return this.seconds
    } */
  }
}
</script>

<style scoped>
.img_div {
  color: goldenrod;
}
</style>
