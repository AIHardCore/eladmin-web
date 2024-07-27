<template>
  <div class="home" style="overflow:hidden">
    <!-- 分类列表 -->
    <van-divider dashed />
    <!-- /分类列表 -->
    <!-- 文章列表 -->
    <div>
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
          class="list_card"
          lazy-load
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
      <!-- /文章列表 -->
    </div>
  </div>
</template>

<script>
import crudArticle from '@/api/app/article'

export default {
  name: 'HomePage',
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      pageData: {
        page: 0,
        size: 20,
        enabled: true,
        title: this.$route.query.key,
        sort: ['sort,asc', 'id,desc']
      }
    }
  },
  mounted() {
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
        for (let i = 0; i < res.content.length; i++) {
          this.list.push(res.content[i])
        }
        // 加载状态结束
        this.loading = false
        if (this.list.length >= res.totalElements) {
          this.finished = true
        }
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
.home {
  height: 100vh;
  overflow: auto !important;
  min-height: 100vh; /* 设置最小高度为视口的100% */
  overflow-y: auto; /* 如果内容超出屏幕，可以滚动查看 */
}

.list {
}
.list_card {
  background: rgba(0, 0, 0, 0);
}

</style>
