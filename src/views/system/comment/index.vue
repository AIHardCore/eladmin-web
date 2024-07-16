<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">内容</label>
        <el-input v-model="query.message" clearable placeholder="内容" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">用户昵称</label>
        <el-input v-model="query.openId" clearable placeholder="用户昵称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">点赞数</label>
        <el-input v-model="query.likes" clearable placeholder="点赞数" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">状态</label>
        <el-input v-model="query.enabled" clearable placeholder="状态" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="内容" prop="message">
            <el-input v-model="form.message" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户">
            <el-select v-model="form.enabled" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.user_status"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="点赞数" prop="likes">
            <el-input v-model="form.likes" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="form.enabled" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.user_status"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
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
        <el-table-column prop="message" label="内容" />
        <el-table-column prop="member" label="用户">
          <template slot-scope="scope">
            {{ scope.row.member.nickName }}
          </template>
        </el-table-column>
        <el-table-column prop="likes" label="点赞数" />
        <el-table-column prop="enabled" label="状态">
          <template slot-scope="scope">
            {{ dict.label.user_status[scope.row.enabled] }}
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建者" />
        <el-table-column prop="createTime" label="创建日期" />
        <el-table-column v-if="checkPer(['admin','comment:edit','comment:del'])" label="操作" width="150px" align="center">
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
import crudComment from '@/api/comment'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, message: null, openId: null, likes: null, enabled: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'Comment',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['user_status'],
  cruds() {
    return CRUD({ title: '留言', url: 'api/comment', idField: 'id', sort: 'id,desc', crudMethod: { ...crudComment }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'comment:add'],
        edit: ['admin', 'comment:edit'],
        del: ['admin', 'comment:del']
      },
      rules: {
        message: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        openId: [
          { required: true, message: '用户openId不能为空', trigger: 'blur' }
        ],
        likes: [
          { required: true, message: '点赞数不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'message', display_name: '内容' },
        { key: 'openId', display_name: '用户openId' },
        { key: 'likes', display_name: '点赞数' },
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