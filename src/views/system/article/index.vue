<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">标题</label>
        <el-input v-model="query.title" clearable placeholder="标题" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">内容</label>
        <el-input v-model="query.body" clearable placeholder="内容" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
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
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" @close="clearAutoSaveInterval">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-row>
            <el-col :span="18">
              <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" style="width: 370px;" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-select
                v-model="articleLog"
                clearable
                size="small"
                placeholder="历史版本"
                value-key="createTime"
                @change="changeArticleLog"
              >
                <el-option
                  v-for="item in articleLogList"
                  :key="item.id"
                  :label="item.createTime"
                  :value="item"
                />
              </el-select>
            </el-col>
          </el-row>
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
            <!--<el-radio v-for="item in dict.user_status" :key="item.id" v-model="form.enabled" :label="item.value">{{ item.label }}</el-radio>-->
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
        <el-table-column prop="createTime" label="创建时间" sortable="true" />
        <el-table-column prop="updateTime" label="更新时间" sortable="true" />
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
import crudArticle from '@/api/article'
import crudArticleLog from '@/api/articleLog'
import crudArticleDraft from '@/api/articleDraft'
import CRUD, { crud, form, header, presenter } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import WangEditor from '@/components/WangEditor'
import { mapGetters } from 'vuex'
import { upload } from '@/utils/upload'

let articleDraftId = null
let firstChange = true
let editFlag = false
const defaultForm = { id: null, title: null, cover: null, preview: '', body: '<p><br></p>', enabled: false, top: false, sort: 9999, reading: 0, updateBy: null, createBy: null, createTime: null, updateTime: null }
export default {
  name: 'Article',
  components: { pagination, crudOperation, rrOperation, udOperation, WangEditor },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['user_status', 'top_status'],
  cruds() {
    return CRUD({ title: '文章', url: 'api/article', idField: 'id', sort: ['sort,asc', 'id,desc'], crudMethod: { ...crudArticle }})
  },
  data() {
    return {
      bodyKey: 2, previewKey: 1,
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
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        cover: [
          { required: true, message: '封面不能为空', trigger: 'blur' }
        ],
        preview: [
          { required: true, message: '预览内容不能为空', trigger: 'blur' }
        ],
        body: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        enabled: [
          { required: true, message: '状态不能为空', trigger: 'blur' }
        ],
        top: [
          { required: true, message: '置顶状态不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'title', display_name: '标题' },
        { key: 'body', display_name: '内容' },
        { key: 'enabled', display_name: '状态' }
      ],
      articleLogList: [],
      articleLog: '',
      articleOld: {},
      autoSaveInterval: null,
      autoSaveTimeout: null
    }
  },
  computed: {
    form2() {
      return JSON.stringify(this.form)
    },
    ...mapGetters([
      'baseApi',
      'qiNiuUploadApi'
    ])
  },
  watch: {
    form2: {
      handler(newVal) {
        if (editFlag && (!this.articleLog)) {
          this.debouncedHandleAutoSave(newVal)
        }
      },
      deep: true // 重要：启用深度监听
    }
  },
  created() {
  },
  methods: {
    // 钩子：在获取表格数据之前执行，false 则代表不获取数据
    [CRUD.HOOK.beforeRefresh]() {
      articleDraftId = this.$route.query.articleDraftId
      if (articleDraftId) {
        crudArticleDraft.findById(articleDraftId).then(res => {
          res['id'] = null
          res['updateTime'] = null
          res['createTime'] = null
          res['updateBy'] = null
          res['createBy'] = null
          this.crud.toFillAdd(res)
          Object.assign(this.articleOld, this.form)
          this.bodyKey++
          this.previewKey--
          this.articleLog = null
          editFlag = true
        }).catch(() => { })
      }
      return true
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.previewKey--
      if (form.id) {
        this.getArticleBody(form)
        this.getArticleLogList(form)
      } else {
        editFlag = true
      }
      this.startAutoSaveInterval(form)
      this.articleLog = null
    },
    // 新增前将多选的值设置为空
    [CRUD.HOOK.beforeToAdd]() {
      this.crud.form.body = ''
      this.crud.form.preview = ''
      this.bodyKey++
      this.previewKey--
    },
    // 新增取消之前
    [CRUD.HOOK.beforeAddCancel]() {
      this.clearAutoSaveInterval()
    },
    // 编辑取消之前
    [CRUD.HOOK.beforeEditCancel]() {
      this.clearAutoSaveInterval()
    },
    // 提交 - 之后
    [CRUD.HOOK.afterSubmit]() {
      this.clearAutoSaveInterval()
      this.$router.replace({ path: 'article' })
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
    startAutoSaveInterval(form) {
      let currArtcile = localStorage.getItem('currArticle')
      if (currArtcile) {
        currArtcile = JSON.parse(currArtcile)
        if ((form.id == null && currArtcile.form.id === null) || (form.id === currArtcile.form.id && new Date(currArtcile.time) > new Date(Date.parse(form.updateTime)))) {
          this.$confirm('检测到未保存的草稿，是否加载？', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '加载',
            cancelButtonText: '放弃草稿'
          })
            .then(() => {
              this.$message({
                type: 'info',
                message: '已加载本地草稿'
              })
              this.setFormVaule(currArtcile.form)
            })
            .catch(action => {
              this.$message({
                type: 'info',
                message: action === 'cancel'
                  ? '已删除本地草稿'
                  : '已忽略本地草稿'
              })
              if (action === 'cancel') {
                localStorage.removeItem('currArticle')
              }
            })
        }
      }
      if (!this.autoSaveInterval) {
        this.autoSaveInterval = setInterval(this.saveArticleToServer, 1000 * 60 * 5)
        console.log('启动定时：', new Date())
      }
    },
    // 防抖处理函数
    debouncedHandleAutoSave(newVal) {
      if (this.autoSaveTimeout) {
        clearTimeout(this.autoSaveTimeout) // 清除上一次的防抖
      }
      // 设置新的防抖
      this.autoSaveTimeout = setTimeout(this.saveArticleToLocal, 1000, newVal) // 5000ms后执行handler
    },
    // 保存草稿到本地缓存
    saveArticleToLocal(newVal) {
      newVal = JSON.parse(newVal)
      // 最新值与默认defaultForm进行对比
      if (this.findChanges(newVal, defaultForm).length === 0) return
      // 最新值与已保存的值进行对比
      if (this.findChanges(newVal, this.articleOld).length === 0) return
      let source = localStorage.getItem('currArticle')
      if (source) {
        source = JSON.parse(source)
        // 最新值与已缓存数据进行对比
        if (this.findChanges(newVal, source.form).length === 0) return
      }
      const currArticle = {
        time: new Date(),
        form: newVal
      }
      localStorage.setItem('currArticle', JSON.stringify(currArticle))
      this.showMessage('success', '草稿已缓存')
    },
    // 保存草稿到数据库
    saveArticleToServer() {
      console.log('定时保存时间：', new Date())
      if (this.form.id) {
        if (!articleDraftId) {
          // 保存到数据库
          this.addArticleDraft(this.form)
        } else {
          const source = {}
          Object.assign(source, this.form)
          source.id = articleDraftId
          // 保存到数据库
          this.updateArticleDraft(source)
        }
      } else {
        if (!articleDraftId) {
          // 保存到数据库
          this.addArticleDraft(this.form)
        } else {
          const source = {}
          Object.assign(source, this.form)
          source.id = articleDraftId
          // 保存到数据库
          this.updateArticleDraft(source)
        }
      }
    },
    // 更新文章草稿
    updateArticleDraft(data) {
      // 保存到数据库
      crudArticleDraft.edit(data).then(() => {
        this.showMessage('success', '草稿已存档')
      }).catch(() => { })
    },
    // 新增文章草稿
    addArticleDraft(data) {
      // 保存到数据库
      crudArticleDraft.add(data).then(res => {
        articleDraftId = res.id
        this.showMessage('success', '草稿已存档')
      }).catch(() => { })
    },
    // 对比对象查出修改的属性列表
    findChanges(newData, oldData) {
      // 找出新旧数据中存在但对方不存在的属性，即新增属性或被删除的属性
      // const newKeys = Object.keys(newData).filter(key => !Object.keys(oldData).includes(key))
      // const oldKeys = Object.keys(oldData).filter(key => !Object.keys(newData).includes(key))
      // console.log('新增属性:', newKeys) // 新增属性或被删除的属性
      // console.log('被删除属性:', oldKeys) // 新增属性或被删除的属性
      // 对比新旧数据属性值是否发生改变，这里只简单判断新旧值是否相等，实际应用中可能需要更为详细的对比逻辑。
      const changes = []
      Object.keys(newData).forEach(key => {
        if (newData[key] !== oldData[key]) {
          changes.push({ key, oldValue: oldData[key], newValue: newData[key] })
        }
      })
      // console.log('发生改变的属性:', changes) // 发生改变的属性及其新旧值
      return changes
    },
    showMessage(type, message) {
      this.$message({
        type: type,
        message: message
      })
    },
    // 设置表单数据
    setFormVaule(data) {
      this.crud.resetForm(data)
      this.bodyKey++
      this.previewKey--
    },
    // 清除定时器
    clearAutoSaveInterval() {
      editFlag = false
      if (this.autoSaveInterval) {
        clearInterval(this.autoSaveInterval)
        this.autoSaveInterval = null
        console.log('清除定时器：', new Date())
      }
    },
    // 获取文章正文
    getArticleBody(form) {
      crudArticle.detail(form.id).then(res => {
        this.form.body = res.body
        this.bodyKey++
        editFlag = true
        Object.assign(this.articleOld, this.form)
      }).catch(() => { })
    },
    // 获取文章历史记录列表
    getArticleLogList() {
      crudArticleLog.findByArticleId(this.form.id).then(res => {
        this.articleLogList = res
      }).catch(() => { })
    },
    // 切换选中的文章历史记录
    changeArticleLog(data) {
      if (data) {
        if (firstChange) {
          Object.assign(this.articleOld, this.form)
          firstChange = false
        }
        this.articleLog = data
        this.setFormVaule(data)
      } else {
        this.articleLog = null
        Object.assign(this.form, this.articleOld)
        this.bodyKey++
        this.previewKey--
      }
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.user_status[val] + '" ' + data.title + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudArticle.enabled(data).then(() => {
          this.crud.notify(this.dict.label.user_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
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
        crudArticle.top(data).then(() => {
          this.crud.notify((val ? '置顶' : '取消置顶') + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
          this.crud.toQuery()
        }).catch(() => {
          data.top = !data.top
        })
      }).catch(() => {
        data.top = !data.top
      })
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
