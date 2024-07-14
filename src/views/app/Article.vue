<template>
  <div id="article" class="article-container">
    <div>
      <van-image lazy-load :src="article.cover" width="100%" height="250px" fit="fill" />
    </div>
    <div class="vhtml">
      <div>
        <div v-html="article.body ? article.body : article.preview" />
      </div>
    </div>
    <div v-show="!article.body" style="height: 150px">
      <div style="text-align: left;color: red;font-size: 15px;">
        <span>进入修真界，了解更多深度、稀缺、硬核内容，每周更新</span>
      </div>
      <div>
        <van-button color="red" block to="/My">立即进入”修真界“</van-button>
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
  watch: {
  },
  created() {},
  mounted() {
    this.$emit('to', this.$route.path)
    Watermark.set({ text: '道友李三川', time: null })
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
  min-height: 100vh; /* 设置最小高度为视口的100% */
  overflow-y: auto; /* 如果内容超出屏幕，可以滚动查看 */
}
.vhtml {
  font-size: 60%;
  text-align: left;
}
.vhtml >>> img {
  max-width: 100%;
}
</style>
