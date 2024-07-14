<template>
  <div class="home">
    <van-overlay :show="show" @click="show = false">
      <div class="wrapper" @click.stop>
        <van-loading type="spinner" color="#0094ff" />
      </div>
    </van-overlay>
    <!-- 轮播图 -->
    <van-swipe :autoplay="3000">
      <van-swipe-item v-for="(item, index) in banners" :key="index" stop-propagation="false" @click="openSpecial(item.special)">
        <van-image lazy-load :src="item.img" width="100%" height="250px" fit="fill" />
      </van-swipe-item>
    </van-swipe>
    <!-- /轮播图 -->
    <!-- 分类列表 -->
    <van-tabs swipeable sticky color="white" background="rgba(0, 0, 0, 0)" @click="clickCategorize">
      <van-tab v-for="(item, index) in categorizes" :key="index" :title="item" title-style="color:white;" />
    </van-tabs>
    <van-divider dashed />
    <!-- /分类列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- 文章列表 -->
      <van-list
        v-model="loading"
        class="list"
        :finished="finished"
        offset="50"
        @load="onLoad"
      >
        <template slot="finished">
          <span style="text-align: center;color: white;width: 100%;">没有更多了...</span>
        </template>
        <van-card
          v-for="item in list"
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
              <span style="color: chocolate;font-size: 10px">{{ item.reading }}人</span>
              <span style="font-size: 10px;color: white;">已经火速观看</span>
            </div>
            <van-divider dashed />
          </template>
        </van-card>
      </van-list>
    </van-pull-refresh>
    <!-- /文章列表 -->
  </div>
</template>

<script>
import crudArticle from '@/api/app/article'
import crudBanner from '@/api/app/banner'
import img from '@/assets/images/app/default_img.png'
import { removeAppToken, setAppToken, getAppToken } from '@/utils/auth'
import crudLogin from '@/api/app/login'

export default {
  name: 'HomePage',
  data() {
    return {
      i: 0,
      show: true,
      categorizes: [
        '观星（天）',
        '风水（地）',
        '测算（人）'
      ],
      banners: [
        { img: img }
      ],
      list: [],
      loading: false,
      finished: true,
      refreshing: false,
      page: {
        page: 0,
        size: 4,
        sort: ['sort,asc', 'id,desc']
      }
    }
  },
  mounted() {
    document.title = '修真界'
  },
  created() {
    this.path = this.$route.name
    const index = window.location.href.indexOf('?')
    const paramStr = window.location.href.substring(index + 1, window.location.href.length)
    const params = paramStr.split('&')
    params.forEach(element => {
      if (element.indexOf('code') >= 0) {
        this.code = element.substring(element.indexOf('=') + 1, element.length)
      }
    })
    if (this.code) {
      this.login()
    } else if (!getAppToken()) {
      crudLogin.getAuthUrl().then(res => {
        window.open(res, '_self')
      }).catch(() => {})
    } else {
      this.getBanners()
      this.finished = false
    }
  },
  methods: {
    login() {
      const data = {
        code: this.code
      }
      removeAppToken()
      crudLogin.login(data).then(res => {
        setAppToken(res.token, true)
        location.href = 'http://' + window.location.host + '/#/Home'
      }).catch(() => {})
    },
    onLoad() {
      if (this.refreshing) {
        this.list = []
        this.refreshing = false
        this.page.page = 0
      }
      // 异步更新数据
      crudArticle.list(this.page).then(res => {
        if (res.content.length === 0) {
          this.finished = true
        }
        for (let i = 0; i < res.content.length; i++) {
          this.list.push(res.content[i])
        }
        // 加载状态结束
        this.loading = false
        this.show = false
        this.page.page++
      }).catch(() => { })
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.show = true
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
    },
    clickCategorize(data) {
      console.log(data)
    }
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh; /* 设置最小高度为视口的100% */
  overflow-y: auto; /* 如果内容超出屏幕，可以滚动查看 */
}

.list {
}
.bgr {
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
