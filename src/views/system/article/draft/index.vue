<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">标题</label>
        <el-input v-model="query.title" clearable placeholder="标题" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">预览内容</label>
        <el-input v-model="query.preview" clearable placeholder="预览内容" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">文章内容</label>
        <el-input v-model="query.body" clearable placeholder="文章内容" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">状态</label>
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
            v-for="item in dict.user_status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="query.top"
          clearable
          size="small"
          placeholder="置顶"
          class="filter-item"
          style="width: 100px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in dict.top_status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="form.title" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="封面" prop="cover">
            <el-input v-model="form.cover" style="width: 370px;" @paste.native="pasteCover($event)" />
            <el-image
              :src="form.cover"
              :preview-src-list="[form.cover]"
              fit="contain"
              lazy
              class="el-avatar"
            >
              <div slot="error">
                <i class="el-icon-document" />
              </div>
            </el-image>
            <el-button icon="el-icon-connection" @click="showDrawer">选择</el-button>
          </el-form-item>
          <el-form-item label="预览" prop="preview">
            <el-row :gutter="10">
              <wang-editor :key="previewKey" v-model="form.preview" style="height: 500px; overflow-y: hidden;z-index: 9999;" />
            </el-row>
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <el-row :gutter="10">
              <wang-editor :key="bodyKey" v-model="form.body" style="height: 500px; overflow-y: hidden;z-index: 9999;" />
            </el-row>
          </el-form-item>
          <el-form-item label="状态" prop="enabled">
            <el-switch
              v-model="form.enabled"
              active-color="#409EFF"
              inactive-color="#F56C6C"
            />
          </el-form-item>
          <el-form-item label="置顶" prop="top">
            <el-switch
              v-model="form.top"
              active-color="#409EFF"
              inactive-color="#F56C6C"
            />
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="form.sort" controls-position="right" style="width: 150px;" />
          </el-form-item>
          <el-form-item label="阅读量">
            <el-input-number v-model="form.reading" controls-position="right" :min="0" style="width: 150px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" :header-cell-class-name="crud.setHeaderClass" @selection-change="crud.selectionChangeHandler" @sort-change="crud.sortChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="id" sortable="true" />
        <el-table-column prop="title" label="标题" sortable="true" />
        <el-table-column prop="cover" label="封面" sortable="true">
          <template slot-scope="{row}">
            <el-image
              :src="row.cover"
              :preview-src-list="[row.cover]"
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
        <el-table-column label="置顶" align="center" prop="top" sortable="true">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.top"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="changeTop(scope.row, scope.row.top)"
            />
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="enabled" sortable="true">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="changeEnabled(scope.row, scope.row.enabled)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" sortable="true" />
        <el-table-column prop="reading" label="阅读量" sortable="true" />
        <el-table-column prop="createBy" label="创建人" sortable="true" />
        <el-table-column prop="updateBy" label="修改人" sortable="true" />
        <el-table-column prop="createTime" label="创建时间" sortable="true" />
        <el-table-column prop="updateTime" label="最后修改时间" sortable="true" />
        <el-table-column v-if="checkPer(['admin','articleDraft:edit','articleDraft:del'])" label="操作" width="180px" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" content="新增文章" placement="top">
              <el-button v-permission="['admin','articleDraft:edit']" :loading="crud.status.cu === 2" size="mini" type="primary" icon="el-icon-circle-plus" @click.stop="toAddArticle(scope.row.id)" />
            </el-tooltip>
            <el-button v-permission="['admin','articleDraft:edit']" :loading="crud.status.cu === 2" size="mini" type="primary" icon="el-icon-edit" @click.stop="crud.toEdit(scope.row)" />
            <el-popover
              :ref="scope.row.id"
              v-permission="['admin','articleDraft:del']"
              placement="top"
              width="200"
            >
              <p>确定停止并删除该任务吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.id)">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudArticleDraft from '@/api/articleDraft'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import WangEditor from '@/components/WangEditor/index.vue'
import { mapGetters } from 'vuex'
import { upload } from '@/utils/upload'

const defaultForm = { id: null, title: null, cover: null, preview: null, body: null, version: null, enabled: true, top: false, sort: null, reading: null, createBy: null, updateBy: null, createTime: null, updateTime: null }
export default {
  name: 'ArticleDraft',
  components: { WangEditor, pagination, crudOperation, rrOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['user_status', 'top_status'],
  cruds() {
    return CRUD({ title: '文章草稿', url: 'api/articleDraft', idField: 'id', sort: 'id,desc', crudMethod: { ...crudArticleDraft }})
  },
  data() {
    return {
      bodyKey: 2, previewKey: 1,
      permission: {
        add: ['admin', 'articleDraft:add'],
        edit: ['admin', 'articleDraft:edit'],
        del: ['admin', 'articleDraft:del']
      },
      delLoading: false,
      rules: {
      },
      queryTypeOptions: [
        { key: 'title', display_name: '标题' },
        { key: 'preview', display_name: '预览内容' },
        { key: 'body', display_name: '文章内容' },
        { key: 'enabled', display_name: '状态：1启用、0禁用' },
        { key: 'top', display_name: '是否置顶，1-是、0-否' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'baseApi',
      'qiNiuUploadApi'
    ])
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
    },
    // 新增前的操作
    [CRUD.HOOK.beforeToAdd]() {
    },
    // 初始化编辑时候的操作
    [CRUD.HOOK.beforeToEdit](crud, form) {
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      return true
    },
    toAddArticle(id) {
      this.$router.push({ path: 'article', query: { articleDraftId: id }})
    },
    delMethod(id) {
      this.delLoading = true
      crudArticleDraft.del([id]).then(() => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.crud.dleChangePage(1)
        this.crud.delSuccessNotify()
        this.crud.toQuery()
      }).catch(() => {
        this.delLoading = false
        this.$refs[id].doClose()
      })
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.user_status[val] + '" ' + data.title + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudArticleDraft.enabled(data).then(res => {
          this.crud.notify((val ? '置顶' : '取消置顶') + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(() => {
          data.enabled = !data.enabled
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    // 改变置顶状态
    changeTop(data, val) {
      this.$confirm('此操作将 "' + (val ? '置顶' : '取消置顶') + '" ' + data.title + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudArticleDraft.top(data).then(res => {
          this.crud.notify(this.dict.label.top_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
          this.crud.toQuery()
        }).catch(() => {
          data.top = !data.top
        })
      }).catch(() => {
        data.top = !data.top
      })
    },
    async pasteCover(event) {
      const { items } = event.clipboardData // 获取粘贴板文件对象
      if (items.length) {
        for (const item of items) {
          if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile() // 获取图片文件
            if (file) {
              // 接口返回的是图片线上地址
              upload(this.qiNiuUploadApi, file).then(res => {
                const data = res.data
                data.data.forEach(val => {
                  // 最后插入图片
                  this.crud.form.cover = val + '-2_500_500_q_75'
                })
              })
            }
          }
        }
      }
    },
    showDrawer() {
      this.$showGlobalDrawer(
        {
          url: this.crud.form.cover
        },
        (result) => {
          this.crud.form.cover = result.data.url
        }
      )
    }
  }
}
</script>

<style scoped>

</style>
