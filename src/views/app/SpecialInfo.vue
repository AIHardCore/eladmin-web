<template>
  <div class=" container">
    <div>
      <van-image lazy-load :src="special.cover" width="100%" height="250px" fit="fill" />
    </div>
    <div style="margin-top: 30px;">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        offset="50"
        @load="onLoad"
      >
        <van-card
          v-for="item in articleSpecials"
          :key="item.article.id"
          class="bgr"
          :thumb="item.article.cover"
          lazy-load
          @click="read(item.article.id)"
        >
          <template #desc>
            <div style="text-align: left;font-size: 15px">
              <br>
              <span class="van-multi-ellipsis--l3">{{ item.article.title }}</span>
            </div>
          </template>
          <template #footer>
            <div>
              <span style="color: chocolate;font-size: 10px">{{ item.article.reading }}人</span>
              <span style="font-size: 10px;">已经火速观看</span>
            </div>
            <van-divider dashed :style="{ color: 'black', borderColor: 'black', padding: '0 16px' }" />
          </template>
        </van-card>
      </van-list>
    </div>
  </div>
</template>

<script>
import defaultImg from '@/assets/images/app/default_img.png'
import crudSpecial from '@/api/app/special'
import crudArticleSpecials from '@/api/app/articlesSpecials'
import { List, Card, Divider } from 'vant'

export default {
  name: 'SpecialInfoPage',
  components: {
    [List.name]: List,
    [Card.name]: Card,
    [Divider.name]: Divider
  },
  props: {},
  data() {
    return {
      id: this.$route.query.id,
      loading: false,
      finished: false,
      special: {
        cover: defaultImg
      },
      articleSpecials: []
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // this.onLoad()
  },
  methods: {
    onLoad() {
      this.special = this.$store.state.special
      if (!this.special) {
        this.loadSpecial()
      }
      if (this.id) {
        this.loadArticleSpecials()
      }
      // 加载状态结束
      this.loading = false
      this.finished = true
    },
    loadSpecial() {
      crudSpecial.detail(this.id).then(res => {
        this.special = res
      }).catch(() => {})
    },
    loadArticleSpecials() {
      const params = {
        specialId: this.id
      }
      crudArticleSpecials.all(params).then(res => {
        this.articleSpecials = res
      }).catch(() => {})
    },
    read(data) {
      this.$router.push({
        path: '/Article', query: { id: data }
      })
    }
  }
}
</script>

<style scoped>
.bgr {
  background: rgba(0, 0, 0, 0);
}
</style>
