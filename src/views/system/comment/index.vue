<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <label class="el-form-item-label">内容</label>
        <el-input v-model="query.message" clearable placeholder="内容" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <label class="el-form-item-label">用户昵称</label>
        <el-input v-model="query.nickName" clearable placeholder="用户昵称" style="width: 185px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select
          v-model="query.queryReply"
          clearable
          size="small"
          placeholder="是否回复"
          class="filter-item"
          style="width: 100px"
          @change="crud.toQuery"
        >
          <el-option
            v-for="item in replyOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item v-show="!form.real" label="文章" prop="articleId">
            <template>
              <el-select
                v-model="form.articleId"
                filterable
                remote
                clearable
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
          <el-form-item label="内容" prop="message">
            <el-input v-model="form.message" type="textarea" :rows="5" style="width: 370px;" :disabled="form.real" />
          </el-form-item>
          <el-form-item label="回复" prop="reply">
            <el-input v-model="form.reply" type="textarea" :rows="5" style="width: 370px;" />
          </el-form-item>
          <el-form-item v-show="!form.real" label="用户" prop="openId">
            <el-select
              v-model="form.openId"
              clearable
              size="small"
              placeholder="用户"
              class="filter-item"
              style="width: 110px"
              :disabled="form.real"
              @change="changeMember"
            >
              <el-option
                v-for="item in systemMembers"
                :key="item.openId"
                :label="item.nickName"
                :value="item.openId"
              />
            </el-select>
            <el-image
              :src="headImgUrl"
              :preview-src-list="[headImgUrl]"
              fit="contain"
              lazy
              class="el-avatar"
            >
              <div slot="error">
                <i class="el-icon-document" />
              </div>
            </el-image>
          </el-form-item>
          <el-form-item label="点赞数" prop="likes">
            <el-input-number v-model="form.likes" controls-position="right" :min="0" />
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
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" :header-cell-class-name="crud.setHeaderClass" @selection-change="crud.selectionChangeHandler" @sort-change="crud.sortChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="message" label="内容" />
        <el-table-column prop="reply" label="回复" show-overflow-tooltip />
        <el-table-column prop="article" label="文章">
          <template slot-scope="scope">
            {{ scope.row.article.title }}
          </template>
        </el-table-column>
        <el-table-column prop="member" label="用户">
          <template slot-scope="scope">
            {{ scope.row.member.nickName }}
          </template>
        </el-table-column>
        <el-table-column prop="likes" label="点赞数" sortable="true" />
        <el-table-column prop="enabled" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="changeEnabled(scope.row, scope.row.enabled)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createBy" label="创建者" />
        <el-table-column prop="createTime" label="创建日期" sortable="true" />
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
import crudMember from '@/api/member'
import crudArticle from '@/api/article'

const defaultForm = { id: null, article: null, message: null, reply: null, member: {}, openId: null, likes: null, real: false, enabled: false, createBy: null, updateBy: null, createTime: null, updateTime: null, queryReply: null }
export default {
  name: 'Comment',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  dicts: ['user_status'],
  cruds() {
    return CRUD({ title: '留言', url: 'api/comment', idField: 'id', sort: ['id,desc'], crudMethod: { ...crudComment }})
  },
  data() {
    return {
      options: [],
      list: [],
      loading: false,
      permission: {
        add: ['admin', 'comment:add'],
        edit: ['admin', 'comment:edit'],
        del: ['admin', 'comment:del']
      },
      headImgUrl: null,
      systemMembers: [],
      rules: {
        message: [
          { required: true, message: '内容不能为空', trigger: 'blur' },
          { max: 200, message: '内容长度不能超过200', trigger: 'blur' }
        ],
        reply: [
          { max: 500, message: '内容长度不能超过500', trigger: 'blur' }
        ],
        openId: [
          { required: true, message: '用户不能为空', trigger: 'change' }
        ],
        likes: [
          { required: true, message: '点赞数不能为空', trigger: 'blur' }
        ],
        articleId: [
          { required: true, message: '文章不能为空', trigger: 'change' }
        ]
      },
      replyOptions: [
        { value: false, label: '未回复' },
        { value: true, label: '已回复' }
      ],
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
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.headImgUrl = null
      this.getSystemMember()
      form.enabled = form.enabled.toString()
    },
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      if (!crud.form.real) {
        crud.form.article = { id: crud.form.articleId }
      }
      crud.form.member = {
        openId: crud.form.openId
      }
      return true
    },
    getSystemMember() {
      crudMember.page().then(res => {
        this.systemMembers = res.content
      }).catch(() => {})
    },
    changeMember(data) {
      this.systemMembers.forEach(item => {
        if (item.openId === data) {
          this.headImgUrl = item.headImgUrl
          return
        }
      })
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
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.user_status[val] + '" ' + data.member.nickName + '的这条留言, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudComment.edit(data).then(res => {
          this.crud.notify(this.dict.label.user_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(() => {
          data.enabled = !data.enabled
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    }
  }
}
</script>

<style scoped>

</style>
