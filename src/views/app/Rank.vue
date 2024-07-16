<template>
  <div class="rank-container">
    <div :class="{'fixed-top': isFixed}">
      <van-tabs color="#000000" @click="clickCategorize">
        <van-tab v-for="(item, index) in categorizes" :key="index" title-style="font-weight: 700;font-size: 15px" :title="item.label" />
      </van-tabs>
    </div>
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
        :key="item.article.id"
        class="bgr"
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
  </div>
</template>

<script>
import curdRank from '@/api/app/rank'

export default {
  name: 'RankPage',
  props: {},
  data() {
    return {
      loading: false,
      finished: false,
      refreshing: false,
      isFixed: false,
      scrollTimeout: null, // 用于存储setTimeout返回的ID
      offsetTop: 0,
      categorizes: [],
      list: [],
      pageData: {
        page: 0,
        size: 20,
        enabled: true,
        type: 0,
        sort: ['sort,asc', 'id,desc']
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getTypes()
  },
  mounted() {
    // 计算元素距离顶部的偏移量
    this.offsetTop = this.$refs.scrollContainer.offsetTop
    // 添加滚动事件监听
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    // 移除滚动事件监听
    window.removeEventListener('scroll', this.debouncedHandleScroll)
    // 清除可能还在等待的防抖函数
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout)
    }
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
        if (res.content.length === 0) {
          this.finished = true
        }
        for (let i = 0; i < res.content.length; i++) {
          this.list.push(res.content[i])
        }
        // 加载状态结束
        this.loading = false
        this.pageData.page++
      }).catch(() => { })
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
      this.pageData.type = name
      this.refreshing = true
      this.onLoad()
    },
    handleScroll() {
      const scrollTop = window.pageYOffset
      console.log(scrollTop)
      if (scrollTop > this.offsetTop) {
        // 当页面向下滚动超过元素距离顶部的偏移量时，开始固定位置
        this.isFixed = true
      } else {
        // 当页面向上滚动并且未超过偏移量时，取消固定位置
        this.isFixed = false
      }
    },
    // 防抖处理函数
    debouncedHandleScroll() {
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout) // 清除上一次的防抖
      }
      // 设置新的防抖
      this.scrollTimeout = setTimeout(this.handleScroll, 200) // 200ms后执行handleScroll
    }
  }
}
</script>

<style scoped>
.bgr {
  background: rgba(0, 0, 0, 0);
}

.fixed-top {
  position: fixed;
  top: 50px;
  left: 0;
  width: 100%;
  z-index: 1000; /* 确保元素在顶层 */
}

.rank-container {
  min-height: 100vh; /* 设置最小高度为视口的100% */
  overflow-y: auto; /* 如果内容超出屏幕，可以滚动查看 */
}
</style>
