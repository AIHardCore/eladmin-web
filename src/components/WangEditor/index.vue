<template>
  <div ref="editor" style="border: 1px solid #ccc;">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editor"
      :default-config="toolbarConfig"
      :mode="editMode"
    />
    <Editor
      v-model="editValue"
      :style="{'height': editorHeight +'px', 'overflow-y': 'hidden'}"
      :default-config="editorConfig"
      :mode="editMode"
      @onCreated="onCreated"
    />
  </div>
</template>

<script>
import { upload } from '@/utils/upload'
import { Toolbar, Editor } from '@wangeditor/editor-for-vue'
import { mapGetters } from 'vuex'

export default {
  name: 'WangEditor',
  components: { Toolbar, Editor },
  props: {
    value: {
      type: String,
      required: false,
      default: ''
    },
    editorHeight: {
      type: Number,
      required: false,
      default: 420
    }
  },
  data() {
    const _this = this
    return {
      toolbarConfig: {},
      editorConfig: { placeholder: '请输入内容...', MENU_CONF: {
        'uploadImage': {
          // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
          allowedFileTypes: ['image/*'],
          // 自定义上传
          async customUpload(file, insertFn) { // JS 语法
            upload(_this.qiNiuUploadApi, file).then(res => {
              const data = res.data
              data.data.forEach(val => {
                // 最后插入图片
                insertFn(val + '-2_500_500_q_75', '', '')
              })
            })
          }
        }
      }},
      editMode: 'defalut',
      editor: null,
      editValue: ''
    }
  },
  watch: {
    editValue(newVal, oldVal) {
      this.$emit('input', newVal)
    }
  },
  computed: {
    ...mapGetters([
      'qiNiuUploadApi',
      'baseApi'
    ])
  },
  mounted() {
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  methods: {
    clearContent() {
      if (this.editor) {
        this.editor.clear() // 清空编辑器内容
        this.editValue = '' // 清空本地数据
        this.$emit('input', '') // 触发input事件，通知父组件内容已清空
      }
    },
    onCreated(editor) {
      this.editor = Object.seal(editor)
      this.editValue = this.value
    }
  }
}
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style scoped>
.text {
  text-align:left;
}
::v-deep .w-e-text-container {
}
</style>
