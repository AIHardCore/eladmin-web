<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">标题</label>
        <el-input v-model="query.title" clearable placeholder="标题" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">内丹学</label>
        <el-select
          v-model="query.specialId"
          size="small"
          placeholder="内丹学-文章"
          class="filter-item"
          style="width: 185px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in specials"
            :key="item.name"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="文章" prop="article">
            <template>
              <el-select
                v-model="form.articleId"
                style="width: 600px;"
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
        <el-table-column prop="article.title" label="标题" />
        <el-table-column prop="article.cover" label="封面">
          <template slot-scope="{row}">
            <el-image
              :src="row.article.cover"
              :preview-src-list="[row.article.cover]"
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
        <el-table-column prop="sort" label="排序" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="updateTime" label="更新时间" />
        <el-table-column v-if="checkPer(['admin','article:edit','article:del'])" label="操作" width="150px" align="center">
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
import { queryAllUnSelectedWithSpecial } from '@/api/article'
import crudArticleSpecials from '@/api/articlesSpecials'
import { getAll } from '@/api/special'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

let id = 0
const defaultForm = { id: null, article: null, specialId: null, articleId: null, sort: null, reading: null, createTime: null, updateTime: null }
export default {
  name: 'ArticleSpecial',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  cruds() {
    return CRUD({ title: '内丹学-文章', url: 'api/articlesSpecials', idField: 'id', sort: ['sort,asc', 'id,desc'], crudMethod: { ...crudArticleSpecials }})
  },
  data() {
    return {
      options: [],
      list: [],
      loading: false,
      specials: null,
      isFirst: true,
      permission: {
        add: ['admin', 'articlesSpecials:add'],
        edit: ['admin', 'articlesSpecials:edit'],
        del: ['admin', 'articlesSpecials:del']
      },
      enabledTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ],
      rules: {
        articleId: [
          { required: true, message: '文章id不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '排名不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'title', display_name: '标题' },
        { key: 'body', display_name: '内容' },
        { key: 'enabled', display_name: '状态' }
      ]
    }
  },
  computed() {
  },
  created() {
    this.getSpecials()
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      if (this.isFirst) {
        const index = window.location.href.indexOf('?')
        const paramStr = window.location.href.substring(index + 1, window.location.href.length)
        const params = paramStr.split('&')
        params.forEach(element => {
          if (element.indexOf('id') >= 0) {
            id = element.substring(element.indexOf('=') + 1, element.length)
            this.query.specialId = id
          }
        })
        this.isFirst = false
      }
      return true
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      if (form.id) {
        this.loading = false
        this.list.push(form.article)
        this.options = this.list.filter(item => {
          return item.title
            .indexOf(form.article.title.toLowerCase()) > -1
        })
        form.articleId = form.article.id
      }
      form.type = form.type.toString()
    },
    // 新增前将多选的值设置为空
    [CRUD.HOOK.beforeToAdd]() {
      this.form.articleId = null
      this.list = []
      this.options = []
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      crud.form.article = { id: crud.form.articleId }
      return true
    },
    getSpecials() {
      getAll().then(res => {
        this.specials = res
      }).catch(() => { })
    },
    remoteMethod(query) {
      if (query !== '') {
        const param = this.form.type + '&title=' + query
        this.loading = true
        queryAllUnSelectedWithSpecial(param).then(res => {
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
