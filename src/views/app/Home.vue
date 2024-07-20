<template>
  <div class="home">
    <!-- 轮播图 -->
    <van-swipe :autoplay="3000">
      <van-swipe-item v-for="(item, index) in banners" :key="index" stop-propagation="false" @click="openSpecial(item.special)">
        <van-image :src="item.img" width="100%" height="250px" fit="fill" />
      </van-swipe-item>
    </van-swipe>
    <!-- /轮播图 -->
    <!-- 分类列表 -->
    <van-divider dashed />
    <!-- /分类列表 -->
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
        class="list_card"
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
</template>

<script>
import crudArticle from '@/api/app/article'
import crudBanner from '@/api/app/banner'
import img from '@/assets/images/app/default_img.png'
import { removeAppToken, setAppToken, getAppToken } from '@/utils/auth'
import crudLogin from '@/api/app/login'
import { mapGetters } from 'vuex'

export default {
  name: 'HomePage',
  data() {
    return {
      banners: [
        { img: img }
      ],
      created: false,
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
    const VUE_APP_VERSION = require('../../../package.json').version
    const vers = window.localStorage.getItem('appVersion')
    if (VUE_APP_VERSION !== vers) {
      localStorage.clear()
      window.localStorage.setItem('appVersion', VUE_APP_VERSION)
      location.reload()
    }
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
      this.beginLoadData()
    }
  },
  methods: {
    login() {
      const data = {
        code: this.code
      }
      console.log('开始登录...code=' + this.code)
      removeAppToken()
      crudLogin.login(data).then(res => {
        setAppToken(res.token, true)
        location.href = window.location.protocol + '//' + window.location.host
        this.beginLoadData()
      }).catch(() => {})
    },
    onLoad() {
      if (!this.created) return
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
    beginLoadData() {
      this.getBanners()
      this.created = true
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
