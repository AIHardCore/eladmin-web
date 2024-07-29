<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">微信订单号</label>
        <el-input v-model="query.transactionId" clearable placeholder="微信订单号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">商户订单号</label>
        <el-input v-model="query.outTradeNo" clearable placeholder="商户订单号" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">状态</label>
        <el-select
          v-model="query.status"
          clearable
          size="small"
          placeholder="状态"
          class="filter-item"
          style="width: 110px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in statusTypeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
        <date-range-picker v-model="query.createTime" class="date-item" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="微信订单号">
            <el-input v-model="form.transactionId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="商户订单号">
            <el-input v-model="form.outTradeNo" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="form.amount" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="消息或异常">
            <el-input v-model="form.msg" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建者">
            <el-input v-model="form.createBy" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新者">
            <el-input v-model="form.updateBy" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建日期">
            <el-input v-model="form.createTime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" style="width: 370px;" />
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
        <el-table-column prop="transactionId" label="微信订单号" />
        <el-table-column prop="outTradeNo" label="商户订单号" />
        <el-table-column prop="nickName" label="用户昵称">
          <template slot-scope="scope">
            {{ scope.row.member.nickName }}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="价格" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status === 0 ? '已支付' : '未支付' }}
          </template>
        </el-table-column>
        <el-table-column prop="msg" label="消息或异常" />
        <el-table-column prop="createTime" label="创建日期" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column v-if="checkPer(['admin','order:edit','order:del'])" label="操作" width="150px" align="center">
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
import crudOrder from '@/api/order'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'

const defaultForm = { id: null, transactionId: null, outTradeNo: null, amount: null, status: null, msg: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'Order',
  components: { pagination, crudOperation, rrOperation, udOperation, DateRangePicker },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '订单', url: 'api/order', idField: 'id', sort: 'outTradeNo,desc', crudMethod: { ...crudOrder }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'order:add'],
        edit: ['admin', 'order:edit'],
        del: ['admin', 'order:del']
      },
      statusTypeOptions: [
        { key: '0', display_name: '已支付' },
        { key: '2', display_name: '未支付' }
      ],
      rules: {
      },
      queryTypeOptions: [
        { key: 'transactionId', display_name: '微信订单号' },
        { key: 'outTradeNo', display_name: '商户订单号' },
        { key: 'status', display_name: '状态' }
      ]
    }
  },
  computed() {
    this.curd.query.status = 0
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
