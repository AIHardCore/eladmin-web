<template>
  <div class="container" style="overflow: hidden">
    <div ref="scrollContainer" :class="{'fixed-top': isFixed}">
      <van-tabs color="#000000" @click="clickCategorize">
        <van-tab v-for="(item, index) in categorizes" :key="index" title-style="font-weight: 700;font-size: 15px" :title="item.label" />
      </van-tabs>
    </div>
    <!-- 文章列表 -->
    <van-list
      v-model="loading"
      class="list"
      :finished="finished"
      offset="100"
      @load="onLoad"
    >
      <template slot="finished">
        <span style="text-align: center;color: black;width: 100%;">没有更多了...</span>
      </template>
      <van-card
        v-for="(item,index) in list"
        :key="index"
        class="list_card"
        lazy-load
        :thumb="item.article.cover"
        @click="read(item.article.id)"
      >
        <template #desc>
          <div style="text-align: left;font-size: 17px">
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
    <!-- /文章列表 -->
  </div>
</template>

<script>
import curdRank from '@/api/app/rank'

export default {
  name: 'RankPage',
  props: {},
  data() {
    return {
      isFixed: false,
      scrollTimeout: null, // 用于存储setTimeout返回的ID
      offsetTop: 0,
      categorizes: [],
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      pageData: {
        page: 0,
        size: 20,
        enabled: true,
        type: 0,
        sort: ['sort,asc', 'id,desc']
      }
    }
  },
  watch: {
    isFixed(val) {
      this.isFixed = val
    }
  },
  created() {
    // 添加滚动事件监听
    window.addEventListener('scroll', this.handleScroll)
    this.getTypes()
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
      curdRank.list(this.pageData).then(res => {
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
    },
    getTypes() {
      curdRank.types().then(res => {
        this.categorizes = res
      }).catch(() => { })
    },
    clickCategorize(name, title) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth' // 可选，平滑滚动
      })
      this.pageData.type = name
      this.refreshing = true
      this.finished = false
      this.onLoad()
    },
    handleScroll() {
      debugger
      const scrollTop = window.pageYOffset
      if (scrollTop > this.offsetTop) {
        // 当页面向下滚动超过元素距离顶部的偏移量时，开始固定位置
        this.isFixed = true
      } else {
        // 当页面向上滚动并且未超过偏移量时，取消固定位置
        this.isFixed = false
      }
    }
  }
}
</script>

<style scoped>
.fixed-top {
  position: fixed;
  top: 46px;
  left: 0;
  width: 100%;
  z-index: 1000; /* 确保元素在顶层 */
}

.list_card {
  background: rgba(0, 0, 0, 0);
}

</style>
