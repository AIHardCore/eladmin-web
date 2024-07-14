<template>
  <div class="special-container">
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
          v-for="item in special.articles"
          :key="item.id"
          class="bgr"
          :thumb="item.cover"
          lazy-load
          @click="read(item.id)"
        >
          <template #desc>
            <div style="text-align: left;font-size: 15px">
              <br>
              <span class="van-multi-ellipsis--l3" style="color: white;">{{ item.title }}</span>
            </div>
          </template>
          <template #footer>
            <div>
              <span style="color: chocolate;font-size: 10px">{{ item.reading }}万人</span>
              <span style="font-size: 10px;color: white;">已经火速观看</span>
            </div>
            <van-divider dashed />
          </template>
        </van-card>
      </van-list>
    </div>
  </div>
</template>

<script>
import defaultImg from '@/assets/images/app/default_img.png'

export default {
  name: 'SpecialInfoPage',
  props: {},
  data() {
    return {
      id: this.$route.query.id,
      loading: false,
      finished: false,
      special: {
        cover: defaultImg,
        articles: []
      }
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
      // 加载状态结束
      this.loading = false
      this.finished = true
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
.special-container {
  padding: 0px 15px;
  min-height: 100vh; /* 设置最小高度为视口的100% */
  overflow-y: auto; /* 如果内容超出屏幕，可以滚动查看 */
}
.bgr {
  background: rgba(0, 0, 0, 0);
}
</style>
