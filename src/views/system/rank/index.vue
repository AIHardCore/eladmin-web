<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-select
          v-model="query.type"
          clearable
          size="small"
          placeholder="榜单类型"
          class="filter-item"
          style="width: 100px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.key"
            :label="item.display_name"
            :value="item.key"
          />
        </el-select>
        <label class="el-form-item-label">文章</label>
        <el-input v-model="query.article" clearable placeholder="文章" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="榜单类型" prop="type">
            <el-radio v-for="item in dict.rank_type" :key="item.id" v-model="form.type" :label="item.value">{{ item.label }}</el-radio>
          </el-form-item>
          <el-form-item label="文章" prop="article">
            <template>
              <el-select
                v-model="form.articleId"
                filterable
                remote
                reserve-keyword
                placeholder="请输入文章标题进行检索"
                :remote-method="remoteMethod"
                :loading="loading"
              >
                <el-option
                  v-for="item in options"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="排名" prop="sort">
            <el-input-number v-model="form.sort" controls-position="right" :min="1" :max="10" />
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
        <el-table-column prop="id" label="id" />
        <el-table-column prop="type" label="榜单类型">
          <template slot-scope="scope">
            {{ dict.label.rank_type[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="article" label="文章">
          <template slot-scope="scope">
            {{ scope.row.article.title }}
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排名" />
        <el-table-column v-if="checkPer(['admin','rank:edit','rank:del'])" label="操作" width="150px" align="center">
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
import crudRank from '@/api/rank'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import crudArticle from '@/api/article'

const defaultForm = { id: null, type: 0, article: null, articleId: null, sort: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'Rank',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['rank_type'],
  cruds() {
    return CRUD({ title: '爆文榜', url: 'api/rank', idField: 'id', sort: 'id,desc', crudMethod: { ...crudRank }})
  },
  data() {
    return {
      options: [],
      list: [],
      loading: false,
      states: [],
      permission: {
        add: ['admin', 'rank:add'],
        edit: ['admin', 'rank:edit'],
        del: ['admin', 'rank:del']
      },
      typeOptions: [
        { key: '0', display_name: '人气榜' },
        { key: '1', display_name: '推荐榜' }
      ],
      rules: {
        type: [
          { required: true, message: '榜单类型不能为空', trigger: 'blur' }
        ],
        articleId: [
          { required: true, message: '文章id不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '排名不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '创建日期不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'type', display_name: '榜单类型' },
        { key: 'article', display_name: '文章' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      // this.getFirstArticlePage()
      return true
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      if (form.id) {
        this.articleId = form.article.id
        this.list.push(form.article)
        this.options = this.list.filter(item => {
          return item.title
            .indexOf(form.article.title.toLowerCase()) > -1
        })
      }
      form.type = form.type.toString()
    },
    // 新增前将多选的值设置为空
    [CRUD.HOOK.beforeToAdd]() {
      this.articleId = null
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      crud.form.article = { id: crud.form.articleId }
      return true
    },
    getFirstArticlePage() {
      crudArticle.page(10).then(res => {
        this.states = res.data.content
      }).catch(() => {})
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        crudArticle.find(query).then(res => {
          this.loading = false
          this.list = res
          this.options = this.list.filter(item => {
            return item.title
              .indexOf(query.toLowerCase()) > -1
          })
        }).catch(() => { })
      } else {
        this.options = []
      }
    }
  }
}
</script>

<style scoped>

</style>
