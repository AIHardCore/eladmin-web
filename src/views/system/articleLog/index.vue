<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">文章id</label>
        <el-input v-model="query.article" clearable placeholder="文章id" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">用户openId</label>
        <el-input v-model="query.openId" clearable placeholder="用户openId" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
            v-for="item in typeOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="文章id" prop="article">
            <el-input v-model="form.article" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="用户openId" prop="openId">
            <el-input v-model="form.openId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="form.type" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.user_status"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="源ip" prop="ip">
            <el-input v-model="form.ip" style="width: 370px;" />
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
        <el-table-column prop="article" label="文章id" />
        <el-table-column prop="openId" label="用户openId" />
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            {{ scope.row.type ? '付费' : '未付费' }}
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="源ip" />
        <el-table-column prop="createBy" label="创建者" />
        <el-table-column prop="createTime" label="创建日期" />
        <el-table-column v-if="checkPer(['admin','articleReadingLog:edit','articleReadingLog:del'])" label="操作" width="150px" align="center">
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
import crudArticleReadingLog from '@/api/articleReadingLog'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, article: null, openId: null, type: null, ip: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'ArticleReadingLog',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['user_status'],
  cruds() {
    return CRUD({ title: '阅读记录', url: 'api/articleReadingLog', idField: 'id', sort: 'id,desc', crudMethod: { ...crudArticleReadingLog }})
  },
  data() {
    return {
      permission: {
        add: ['admin', 'articleReadingLog:add'],
        edit: ['admin', 'articleReadingLog:edit'],
        del: ['admin', 'articleReadingLog:del']
      },
      rules: {
        article: [
          { required: true, message: '文章id不能为空', trigger: 'blur' }
        ],
        openId: [
          { required: true, message: '用户openId不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ],
        ip: [
          { required: true, message: '源ip不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'article', display_name: '文章id' },
        { key: 'openId', display_name: '用户openId' },
        { key: 'type', display_name: '类型' }
      ],
      typeOptions: [
        { key: 'true', label: '付费' },
        { key: 'false', label: '未付费' }
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
