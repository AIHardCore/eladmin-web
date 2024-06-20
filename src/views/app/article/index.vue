<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">标题</label>
        <el-input v-model="query.title" clearable placeholder="标题" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">内容</label>
        <el-input v-model="query.content" clearable placeholder="内容" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
        <el-select
          v-model="query.section"
          clearable
          size="small"
          placeholder="版块"
          class="filter-item"
          multiple
          style="width: 150px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in sections"
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
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" @close="handleClose">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item style="margin-bottom: 0;" label="版块" prop="section">
            <el-select
              v-model="form.section"
              clearable
              size="small"
              placeholder="版块"
              class="filter-item"
              style="width: 370px"
            >
              <el-option
                v-for="item in sections"
                :key="item.name"
                :label="item.name"
                :value="item"
                @change="handleSectionChange"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="封面" prop="cover">
            <el-input v-model="form.cover" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="预览内容" prop="preview">
            <el-row :gutter="10">
              <wang-editor ref="previewRef" v-model="form.preview" style="height: 500px; overflow-y: hidden;" />
            </el-row>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-row :gutter="10">
              <wang-editor ref="contentRef" v-model="form.content" style="height: 500px; overflow-y: hidden;" />
            </el-row>
          </el-form-item>
          <el-form-item label="状态" prop="enabled">
            <el-radio v-for="item in dict.user_status" :key="item.id" v-model="form.enabled" :label="item.value">{{ item.label }}</el-radio>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="form.sort" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="阅读量">
            <el-input v-model="form.reading" style="width: 370px;" />
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
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="section" label="版块">
          <template slot-scope="scope">
            {{ scope.row.section.name }}
          </template>
        </el-table-column>
        <el-table-column prop="cover" label="封面" />
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
        <el-table-column prop="sort" label="排序" />
        <el-table-column prop="reading" label="阅读量" />
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
import crudArticle from '@/api/system/article'
import { getAllSection } from '@/api/system/section'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import WangEditor from '@/components/WangEditor/index'

const defaultForm = { id: null, sections: [], title: null, cover: null, preview: null, content: null, enabled: null, sort: null, reading: null, createTime: null, updateTime: null }
export default {
  name: 'Article',
  components: { pagination, crudOperation, rrOperation, udOperation, WangEditor },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['user_status'],
  cruds() {
    return CRUD({ title: '文章', url: 'api/article', idField: 'id', sort: ['sort,asc', 'id,desc'], crudMethod: { ...crudArticle }})
  },
  data() {
    return {
      sections: [], articleBody: '',
      permission: {
        add: ['admin', 'article:add'],
        edit: ['admin', 'article:edit'],
        del: ['admin', 'article:del']
      },
      enabledTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ],
      rules: {
        section: [
          { required: true, message: '请选择版块', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        cover: [
          { required: true, message: '封面不能为空', trigger: 'blur' }
        ],
        preview: [
          { required: true, message: '预览内容不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'title', display_name: '标题' },
        { key: 'content', display_name: '内容' },
        { key: 'section', display_name: '版块' },
        { key: 'enabled', display_name: '状态' }
      ]
    }
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      this.getSections()
      return true
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      if (form.id == null) {
        form.enabled = 'false'
      } else {
        this.getArticleBody(form.id)
        this.$refs.previewRef.setText(form.preview)
      }
      form.enabled = form.enabled.toString()
    },
    // 新增前将默认选中第一个版块
    [CRUD.HOOK.beforeToAdd](crud, form) {
      this.getSections()
      // form.section = this.sections[0]
    },
    // 初始化编辑时候的版块
    [CRUD.HOOK.beforeToEdit](crud, form) {
    },
    getSections() {
      getAllSection().then(res => {
        this.sections = res.content
      }).catch(() => { })
    },
    getArticleBody(id) {
      crudArticle.detail(id).then(res => {
        this.$refs.contentRef.setText(res.content)
      }).catch(() => { })
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.user_status[val] + '" ' + data.title + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudArticle.edit(data).then(res => {
          this.crud.notify(this.dict.label.user_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(() => {
          data.enabled = !data.enabled
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    handleSectionChange(value) {
      console.log(value)
    },
    handleClose() {
      this.$refs.previewRef.clearContent()
      this.$refs.contentRef.clearContent()
    }
  }
}
</script>

<style scoped>

</style>
