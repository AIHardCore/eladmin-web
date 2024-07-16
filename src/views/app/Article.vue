<template>
  <div id="article" class="article-container">
    <div style="padding-top: 10px;">
      <van-image lazy-load :src="article.cover" fit="contain" />
    </div>
    <div class="vhtml">
      <div>
        <div v-html="article.body ? article.body : article.preview" />
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
    <div v-show="false">
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
          <div v-for="item in list" :key="item" class="comment_message">
            <div class="comment_message_user">
              <span c>{{ item.member.nickName }}</span>
              <span class="date">{{ item.createTime }}</span>
              <svg-icon icon-class="like" />
              <span class="like">{{ item.likes }}</span>
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
      comment: {
        message: ''
      },
      id: this.$route.query.id,
      loading: false,
      finished: true,
      refreshing: false,
      isVip: false,
      article: {
        cover: defaultImg
      },
      list: [],
      pageData: {
        page: 0,
        size: 20,
        enabled: true,
        sort: ['id,desc']
      }
    }
  },
  computed: {},
  watch: {
  },
  created() {},
  mounted() {
    this.$emit('to', this.$route.path)
    Watermark.set({ text: '道友李三川', time: null })
    this.loadArticle()
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
    addComment() {
      crudMember.info().then(res => {
        if (res.type) {
          crudComment.add(this.comment).then(res => {
            this.$toast('留言已发表')
            this.onload()
          }).catch(() => {})
        } else {
          this.$toast('开通会员才能留言')
        }
      }).catch(() => {})
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

.comment_message {
  background-color: #EDEDED;
  color: #595858;

}

.vhtml {
  font-size: 60%;
  text-align: left;
}
.vhtml >>> img {
  max-width: 100%;
}
</style>
