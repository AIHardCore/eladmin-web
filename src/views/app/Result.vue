<template>
  <div class="result-container">
    <!-- 文章列表 -->
    <van-list
      v-model="loading"
      class="list"
      :finished="finished"
      offset="50"
      @load="onLoad"
    >
      <template slot="finished">
        <span style="text-align: center;color: black;width: 100%;">没有更多了...</span>
      </template>
      <van-card
        v-for="item in list"
        :key="item.id"
        class="bgr"
        :thumb="item.cover"
        @click="read(item.id)"
      >
        <template #desc>
          <div style="text-align: left;font-size: 17px">
            <br>
            <span class="van-multi-ellipsis--l3">{{ item.title }}</span>
          </div>
        </template>
        <template #footer>
          <div>
            <span style="color: chocolate;font-size: 10px">{{ item.reading }}人</span>
            <span style="font-size: 10px;">已经火速观看</span>
          </div>
          <van-divider dashed :style="{ color: 'black', borderColor: 'black', padding: '0 16px' }" />
        </template>
      </van-card>
    </van-list>
  </div>
</template>
import crudArticle from '@/api/app/article'

<script>
import crudArticle from '@/api/app/article'

export default {
  name: 'ResultPage',
  props: { },
  data() {
    return {
      list: [],
      showSearch: false,
      loading: false,
      finished: false,
      refreshing: false,
      pageData: {
        page: 0,
        size: 20,
        enabled: true,
        title: null,
        sort: ['sort,asc', 'id,desc']
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.path = this.$route.name
    const index = window.location.href.indexOf('?')
    const paramStr = window.location.href.substring(index + 1, window.location.href.length)
    const params = paramStr.split('&')
    params.forEach(element => {
      if (element.indexOf('key') >= 0) {
        this.pageData.title = element.substring(element.indexOf('=') + 1, element.length)
      }
    })
  },
  mounted() {
    this.$store.state.path = this.$route.path
  },
  methods: {
    onLoad() {
      if (this.refreshing) {
        this.list = []
        this.refreshing = false
        this.pageData.page = 0
      }
      // 异步更新数据
      crudArticle.list(this.pageData).then(res => {
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
    read(data) {
      this.$router.push({
        path: '/Article', query: { id: data }
      })
    }
  }
}
</script>

<style scoped>
.result-container {
  min-height: 100vh; /* 设置最小高度为视口的100% */
  overflow-y: auto; /* 如果内容超出屏幕，可以滚动查看 */
}
</style>
