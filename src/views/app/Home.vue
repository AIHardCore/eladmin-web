<template>
  <div class="home" style="overflow:hidden">
    <!-- 轮播图 -->
    <van-swipe :autoplay="3000">
      <van-swipe-item v-for="(item, index) in banners" :key="index" stop-propagation="false" @click="openSpecial(item.special)">
        <van-image lazy-load :src="item.img" width="100%" height="250px" fit="fill" />
      </van-swipe-item>
    </van-swipe>
    <!-- /轮播图 -->
    <!-- 分类列表 -->
    <van-divider dashed />
    <!-- /分类列表 -->
    <!-- 文章列表 -->
    <div>
      <van-pull-refresh v-model="refreshing" :disabled="refDisabled" @refresh="onRefresh">
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
      </van-pull-refresh>
      <!-- /文章列表 -->
    </div>
  </div>
</template>

<script>
import crudArticle from '@/api/app/article'
import crudBanner from '@/api/app/banner'
import img from '@/assets/images/app/default_img.png'
import { mapGetters } from 'vuex'

export default {
  name: 'HomePage',
  data() {
    return {
      refDisabled: false,
      code: null,
      banners: [
        { img: img }
      ],
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      pageData: {
        page: 0,
        size: 20,
        enabled: true,
        sort: ['sort,asc', 'id,desc']
      }
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi',
      'baseApi'
    ])
  },
  mounted() {
    this.getBanners()
    // 添加滚动事件监听
    window.addEventListener('scroll', this.debouncedHandleScroll)
  },
  created() {
    document.title = '修真界'
    this.checkVersion()
  },
  methods: {
    checkVersion() {
      this.path = this.$route.name
      const VUE_APP_VERSION = require('../../../package.json').version
      const vers = window.localStorage.getItem('appVersion')
      if (VUE_APP_VERSION !== vers) {
        localStorage.clear()
        window.localStorage.setItem('appVersion', VUE_APP_VERSION)
        location.reload()
      }
    },
    beforeDestroy() {
      // 移除滚动事件监听
      window.removeEventListener('scroll', this.debouncedHandleScroll)
      // 清除可能还在等待的防抖函数
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout)
      }
    },
    handleScroll() {
      const scrollTop = document.documentElement.scrollTop // 滚动高度
      if (scrollTop === 0) {
        this.refDisabled = false
      } else {
        this.refDisabled = true
      }
    },
    // 防抖处理函数
    debouncedHandleScroll() {
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout) // 清除上一次的防抖
      }
      // 设置新的防抖
      this.scrollTimeout = setTimeout(this.handleScroll, 100) // 200ms后执行handleScroll
    },
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
    onRefresh() {
      // 清空列表数据
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.onLoad()
    },
    getBanners() {
      const pageData = {
        page: 0,
        size: 9999,
        sort: ['sort,asc'],
        enabled: true
      }
      crudBanner.list(pageData).then(res => {
        this.banners = res.content
      }).catch(() => { })
    },
    openSpecial(data) {
      this.$router.push({
        path: '/SpecialInfo', query: { id: data }
      })
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

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}
</style>
