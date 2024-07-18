<template>
  <div class="article-container">
    <div id="cover" style="padding-top: 10px;">
      <van-image lazy-load :src="article.cover" fit="contain" />
    </div>
    <div>
      <div>
        <div id="article" ref="article" v-html="article.body ? article.body : article.preview" />
      </div>
    </div>
    <div v-show="!article.body" style="height: 150px">
      <div style="text-align: left;color: red;font-size: 15px;padding-bottom: 10px;">
        <span>进入修真界，了解更多深度、稀缺、硬核内容，每周更新</span>
      </div>
      <div>
        <van-button color="red" block to="/My">立即进入”修真界“</van-button>
      </div>
    </div>
    <div>
      <div class="comment">
        <van-field
          v-model="comment.message"
          rows="2"
          autosize
          type="textarea"
          maxlength="200"
          placeholder="请输入留言"
          show-word-limit
        />
        <p>
          <van-button size="small" type="primary" @click="addComment">发表留言</van-button>
        </p>
      </div>
      <van-divider :style="{borderColor: 'black',color: '#595858'}">留言内容</van-divider>
      <div class="comments">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div v-for="(item,index) in list" :key="index" class="comment">
            <div class="comment_message_user">
              <van-row type="flex" justify="space-between">
                <van-col span="18">
                  <span class="nick_name">{{ processName(item.member.nickName) }}</span>
                  <span class="date">{{ item.createTime }}</span>
                </van-col>
                <van-col offset="3" span="3">
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
    </div>
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
      articleHeight: 0,
      articleHeightNow: 0,
      timer: null,
      member: {
        type: false
      },
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
  mounted() {
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
    addComment() {
      if (!this.comment || !this.comment.message) return
      if (this.member.type) {
        crudComment.add(this.comment).then(res => {
          this.$toast('留言已发表')
          this.list.unshift(res)
          this.comment.message = ''
        }).catch(() => {})
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
    }
  }
}
</script>

<style scoped>
.article-container {
  background-color: #EDEDED;
  padding: 0px 15px;
  min-height: 100vh; /* 设置最小高度为视口的100% */
  overflow-y: auto; /* 如果内容超出屏幕，可以滚动查看 */
}

.comment {
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
</style>
