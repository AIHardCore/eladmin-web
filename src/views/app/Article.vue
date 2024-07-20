<template>
  <div ref="container" class="article-container" onselectstart="return false">
    <van-button :icon="topClassName" round class="block-sidebar" @click="scrollToElement" />
    <div ref="articleContent" class="article-content">
      <div id="cover" style="padding-top: 10px;">
        <van-image :src="article.cover" fit="contain" />
      </div>
      <div>
        <div>
          <div id="article" ref="article" v-html="article.body ? article.body : article.preview" />
        </div>
      </div>
      <div v-show="!member.type" style="height: 150px">
        <div style="text-align: left;color: red;font-size: 15px;padding-bottom: 10px;">
          <span>进入修真界，了解更多深度、稀缺、硬核内容，每周更新</span>
        </div>
        <div>
          <van-button color="red" block to="/My">立即进入”修真界“</van-button>
        </div>
      </div>
    </div>
    <div ref="commentTextDiv" class="commentTextDiv">
      <div style="padding: 10px">
        <div v-if="showCommentText" class="comment">
          <van-field
            ref="comment"
            v-model="comment.message"
            rows="2"
            autosize
            type="textarea"
            maxlength="200"
            placeholder="请输入留言"
            show-word-limit
            @blur="onCommentBlur"
          />
        </div>
        <div>
          <van-row v-show="showCommentText" type="flex" justify="space-between">
            <van-col>
              <p>
                <van-button size="small" color="#cccccc" @click="showCommentText = false">取消</van-button>
              </p>
            </van-col>
            <van-col>
              <p>
                <van-button size="small" type="primary" @click="addComment">发表留言</van-button>
              </p>
            </van-col>
          </van-row>
          <van-row v-show="!showCommentText" type="flex" justify="end">
            <van-col>
              <p @click="showComment">
                <span style="font-size: 12px;">写留言</span>
                <van-icon name="edit" />
              </p>
            </van-col>
          </van-row>
        </div>
      </div>
    </div>
    <div class="comments">
      <van-divider :style="{borderColor: 'black',color: '#595858'}">留言列表</van-divider>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div v-for="(item,index) in list" :key="index" class="comment">
          <div class="comment_message_user">
            <van-row type="flex" justify="space-between">
              <van-col>
                <span class="nick_name">{{ processName(item.member.nickName) }}</span>
                <span class="date">{{ item.createTime }}</span>
              </van-col>
              <van-col>
                <div :class="{ like_active : item.active, like : !item.active}" @click="like(item)">
                  <svg-icon :icon-class="item.active ? 'like_active' : 'like'" />
                  <span>{{ item.likes > 999 ? (item.likes + 999 + '+') : item.likes }}</span>
                </div>
              </van-col>
            </van-row>
          </div>
          <p class="comment_message">
            {{ item.message }}
          </p>
          <van-divider dashed :style="{borderColor: '#cccccc',color: '#595858'}" />
        </div>
      </van-list>
    </div>
    <van-overlay :show="showOverlay">
      <div class="wrapper" @click.stop>
        <div class="block">
          <van-loading type="spinner" />
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import crudArticle from '@/api/app/article'
import crudComment from '@/api/app/comment'
import crudMember from '@/api/app/my'
import Watermark from '@/utils/watermark'
import defaultImg from '@/assets/images/app/default_img.png'

export default {
  name: 'ArticleInfoPage',
  data() {
    return {
      processName: (username) => {
        if (this.member && this.member.nickName === username) return username
        if (username.length <= 2) {
          return username.substring(0, 1) + '***'
        } else if (username.length === 3) {
          return username.substring(0, 1) + '***'
        }
        const strictUsernameRegex = /^(.)([\s\S]*)(.)$/
        return username.replace(strictUsernameRegex, function(match, p1, p2, p3) {
          return p1 + '***' + p3
        })
      },
      showOverlay: false,
      showCommentText: false,
      articleHeight: 0,
      articleHeightNow: 0,
      timer: null,
      member: {
        type: true
      },
      topClassName: 'arrow-down',
      comment: {
        message: '',
        article: {
          id: this.$route.query.id
        },
        active: false
      },
      id: this.$route.query.id,
      isVip: false,
      article: {
        cover: defaultImg
      },
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      pageData: {
        page: 0,
        size: 20,
        enabled: true,
        articleId: this.$route.query.id
      }
    }
  },
  computed: {},
  watch: {
  },
  created() {
    this.getMember()
    this.loadArticle()
  },
  beforeDestroy() {
    // 移除滚动事件监听
    window.removeEventListener('scroll', this.debouncedHandleScroll)
    // 清除可能还在等待的防抖函数
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout)
    }
  },
  mounted() {
    // 监听鼠标按下事件
    document.addEventListener('mousedown', (e) => {
      if (e.button === 2) {
        // 禁用鼠标右键
        e.preventDefault()
      }
    })

    // 监听键盘按下事件
    document.addEventListener('keydown', (e) => {
      // 禁用Ctrl+C和Ctrl+V
      if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v')) {
        e.preventDefault()
      }
    })
    Watermark.set(
      '道友李三川',
      this.$refs.article,
      {
        color: 'rgba(200, 200, 200, 0.40)',
        size: 28,
        offsetX: -40,
        offsetY: -25,
        row: 2,
        height: 120,
        debug: false,
        bgc: '#8EA0E0'
      }
    )
    // 添加滚动事件监听
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    loadArticle() {
      crudArticle.read(this.id).then(res => {
        this.article = res
        document.title = this.article.title
      }).catch(() => { })
    },
    onLoad() {
      if (this.refreshing) {
        this.list = []
        this.refreshing = false
        this.pageData.page = 0
      }
      crudComment.page(this.pageData).then(res => {
        if (res.content.length === 0) {
          this.finished = true
        }
        for (let i = 0; i < res.content.length; i++) {
          this.list.push(res.content[i])
        }
        // 加载状态结束
        this.loading = false
      }).catch(() => { })
      this.pageData.page += 1
    },
    getMember() {
      crudMember.info().then(res => {
        this.member = res
      }).catch(() => {})
    },
    showComment() {
      if (this.member.type) {
        this.showCommentText = true
        this.$nextTick(() => {
          this.$refs.comment.focus()
        })
      } else {
        this.$dialog.confirm({
          message: '您尚未正式进入"修真界"！',
          showConfirmButton: true,
          showCancelButton: false,
          confirmButtonText: '立即进入'
        }).then(() => {
          this.$router.push({
            path: '/My', query: {
              showDesc: false,
              showProduce: true,
              toBuyVip: true
            }
          })
        })
      }
    },
    onCommentBlur() {
      /* if (!this.comment || !this.comment.message || this.comment.message.trim().length === 0) {
        this.showCommentText = false
      } */
    },
    addComment() {
      if (!this.comment || !this.comment.message || this.comment.message.trim().length === 0) {
        this.$toast('请输入留言内容')
        return
      }
      this.showOverlay = true
      crudComment.add(this.comment).then(res => {
        setTimeout(() => {
          this.showOverlay = false
          this.$toast('留言已发表')
          this.list.unshift(res)
          this.comment.message = ''
          this.showCommentText = false
        }, 500)
      }).catch(() => {})
    },
    timestampToYMDHMS(date) {
      const year = date.getUTCFullYear()
      const month = ('0' + (date.getUTCMonth() + 1)).slice(-2) // 月份是从0开始的
      const day = ('0' + date.getUTCDate()).slice(-2)
      const hours = ('0' + date.getUTCHours()).slice(-2)
      const minutes = ('0' + date.getUTCMinutes()).slice(-2)
      const seconds = ('0' + date.getUTCSeconds()).slice(-2)
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    like(comment) {
      if (comment.active) {
        comment.active = false
        comment.likes -= 1
        crudComment.unlike(comment.id).then().catch(() => {})
      } else {
        comment.active = true
        comment.likes += 1
        crudComment.like(comment.id).then().catch(() => {})
      }
    },
    scrollToElement() {
      let el = null
      if (this.topClassName === 'arrow-up') {
        el = this.$refs.articleContent
      } else {
        el = this.$refs.commentTextDiv
      }
      if (el) {
        // 平滑滚动到元素位置
        el.scrollIntoView({ behavior: 'smooth' })
      }
    },
    handleScroll() {
      const scrollTop = document.documentElement.scrollTop // 滚动高度
      const clientHeight = document.documentElement.clientHeight // 可视高度
      const scrollHeight = document.documentElement.scrollHeight // 内容高度
      // 判断是否滚动到底部
      const isBottom = scrollHeight - (scrollTop + clientHeight) < 1 // 这里的1是一个阈值，可以根据需要调整
      if (this.$refs.articleContent.offsetHeight + this.$refs.articleContent.getBoundingClientRect().top < 100 || isBottom) {
        this.topClassName = 'arrow-up'
      } else {
        this.topClassName = 'arrow-down'
      }
    },
    // 防抖处理函数
    debouncedHandleScroll() {
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout) // 清除上一次的防抖
      }
      // 设置新的防抖
      this.scrollTimeout = setTimeout(this.handleScroll, 1000) // 200ms后执行handleScroll
    }
  }
}
</script>

<style scoped>
.article-container {
  background: rgba(0, 0, 0, 0);
  min-height: 100vh; /* 设置最小高度为视口的100% */
  overflow-y: auto; /* 如果内容超出屏幕，可以滚动查看 */
  /* 禁止选中文字 */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* 标准语法 */
}
.article-content {
  padding: 0px 15px;
  min-height: 500px;
}
.commentTextDiv {
  border-top: 1px solid #cccccc;
  border-bottom: 1px solid #cccccc;
  background-color: #e5e2e2;
  min-height: 50px;
}
.comments {
  padding: 0px 15px;
  background-color: #EDEDED;
  color: #595858;
  font-size: 12px;
}
.comment_message{
  color: #2a2828;
  word-wrap: break-word;      /* 旧版本浏览器支持 */
  overflow-wrap: break-word;
  padding-right: 20px;
}
.comment_message_user {
}
.nick_name {
  color: #2a2828;
}
.date {
  font-size: 11px;
}
.like {
  color: #2a2828;
}
.like_active {
  color: #6B4400;
}
#article {
  font-size: 60%;
  text-align: left;
}
#article >>> img {
  max-width: 100%;
}

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
  text-align: center;
}

.block-sidebar {
  position: fixed;
  bottom: 90px;
  right: 5px;
  width: 30px;
  height: 31px;
  z-index: 99;
  background-color: transparent;
  border: 1px solid #cccccc;
}
</style>
