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
      specials: [
        { id: 1, name: '神秘学' },
        { id: 2, name: '神秘学' },
        { id: 3, name: '神秘学' },
        { id: 4, name: '神秘学' },
        { id: 5, name: '神秘学' },
        { id: 6, name: '神秘学' }
      ],
      banners: [
        { img: img }
      ],
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      page: {
        page: 0,
        size: 4,
        sort: ['sort,asc', 'id,desc'],
        sortStr: ''
      }
    }
  },
  mounted() {
    document.title = '修真界'
    this.getBanners()
  },
  methods: {
    onLoad() {
      if (this.refreshing) {
        this.list = []
        this.refreshing = false
        this.page.page = 0
        this.page.sortStr = ''
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
        this.page.sortStr = ''
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
        enabled: true,
        sortStr: ''
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
