<template>
  <div class="layout-container" :style="'background-image:url('+ bgri +');'">
    <div v-show="path !== 'My'"><notice-bar /></div>
    <div v-show="path !== 'My' && path !== 'Article'"><search-bar /></div>
    <!-- 子路由出口 -->
    <router-view />
    <!-- /子路由出口 -->

    <!-- 标签导航栏 -->
    <!--
      route: 开启路由模式
     -->
    <van-tabbar v-model="active" route>
      <van-tabbar-item to="/Home" @click="to('/Home')">
        <span>首页</span>
        <template #icon="props">
          <img :src="props.active ? icon.active : icon.inactive">
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/Rank" @click="to('/Rank')">
        <span>爆文榜</span>
        <template #icon="props">
          <img :src="props.active ? icon.active : icon.inactive">
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/Specials" @click="to('/Specials')">
        <span>神秘学</span>
        <template #icon="props">
          <img :src="props.active ? icon.active : icon.inactive">
        </template>
      </van-tabbar-item>
      <van-tabbar-item badge="3" to="/My" @click="to('/My')">
        <span>我的</span>
        <template #icon="props">
          <img :src="props.active ? icon.active : icon.inactive">
        </template>
      </van-tabbar-item>
    </van-tabbar>
    <!-- /标签导航栏 -->
  </div>
</template>

<script>
import NoticeBar from '@/components/app/notice'
import SearchBar from '@/components/app/search'
import bgri from '@/assets/images/app/bgri.jpg'

export default {
  name: 'LayoutIndex',
  components: { SearchBar, NoticeBar },
  props: {},
  data() {
    return {
      bgri: bgri,
      path: '',
      tabIndex: true,
      searchBgr: '#00000060',
      isFixed: false,
      scrollTimeout: null, // 用于存储setTimeout返回的ID
      offsetTop: 0,
      active: '/Home', // 默认高亮首页
      icon: {
        active: 'https://img01.yzcdn.cn/vant/user-active.png',
        inactive: 'https://img01.yzcdn.cn/vant/user-inactive.png'
      }
    }
  },
  watch: {
    $route(route) {
      this.path = route.name
    }
  },
  mounted() {
    this.path = this.$route.name
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
