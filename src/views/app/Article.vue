<template>
  <div id="article" class="article-container">
    <div>
      <van-image lazy-load :src="article.cover" width="100%" height="250px" fit="fill" />
    </div>
    <div v-show="article.body" class="vhtml">
      <div v-html="article.body" />
    </div>
    <div v-show="!article.body" class="vhtml">
      <div>
        <div v-html="article.preview" />
      </div>
      <div>
        <div style="text-align: left;color: red;font-size: 15px;padding-bottom: 10px;">
          <span>看更多精彩内容可升级包年会员，海量解密文章每周二、四更新</span>
        </div>
        <div>
          <van-button color="red" block to="/My">立即解锁”修仙界“会员资格</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import crudArticle from '@/api/app/article'
import Watermark from '@/utils/watermark'
import defaultImg from '@/assets/images/app/default_img.png'

export default {
  name: 'ArticleInfoPage',
  data() {
    return {
      id: this.$route.query.id,
      loading: false,
      finished: false,
      refreshing: false,
      isVip: false,
      article: {
        cover: defaultImg
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.$emit('to', this.$route.path)
    Watermark.set({ text: '修仙界', time: null })
    this.onLoad()
  },
  methods: {
    onLoad() {
      crudArticle.read(this.id).then(res => {
        this.article = res
        document.title = this.article.title
      }).catch(() => { })
    }
  }
}
</script>

<style scoped>
.article-container {
  background-color: white;
  padding: 0px 15px;
}
.vhtml {
  font-size: 60%;
  text-align: left;
}
.vhtml img {
  max-width: 100%;
}
</style>
