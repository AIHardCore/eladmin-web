<template>
  <div class="layout-container">
    <div :style="'background-image:url('+ bgri +');'">
      <div v-show="this.$store.state.routeName !== 'My' && this.$store.state.routeName !== 'Auth'"><notice-bar /></div>
      <div v-show="this.$store.state.routeName !== 'My' && this.$store.state.routeName !== 'Article' && this.$store.state.routeName !== 'Auth'"><search-bar /></div>
      <!-- 子路由出口 -->
      <router-view />
      <!-- /子路由出口 -->
      <!-- 标签导航栏 -->
      <!--
        route: 开启路由模式
       -->
      <van-tabbar v-model="active" route>
        <van-tabbar-item to="/Home">
          <span>道学</span>
          <template #icon="props">
            <img :src="props.active ? icon.active : icon.inactive">
          </template>
        </van-tabbar-item>
        <van-tabbar-item to="/Rank">
          <span>古科学</span>
          <template #icon="props">
            <img :src="props.active ? icon.active : icon.inactive">
          </template>
        </van-tabbar-item>
        <van-tabbar-item to="/Specials">
          <span>内丹学</span>
          <template #icon="props">
            <img :src="props.active ? icon.active : icon.inactive">
          </template>
        </van-tabbar-item>
        <van-tabbar-item badge="3" to="/My">
          <span>我的</span>
          <template #icon="props">
            <img :src="props.active ? icon.active : icon.inactive">
          </template>
        </van-tabbar-item>
      </van-tabbar>
      <!-- /标签导航栏 -->
    </div>
    <div style="height: 80px;background-color: white">
      <p style="background:none;height: 5%;width: 100%;text-align: center;font-size: 40%;">
        © 2024 修真界 ⋅
        <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">粤ICP备2024280196</a>
      </p>
    </div>
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
      code: null,
      bgri: bgri,
      tabIndex: true,
      searchBgr: '#00000060',
      isFixed: false,
      scrollTimeout: null, // 用于存储setTimeout返回的ID
      offsetTop: 0,
      active: '/Auth', // 默认高亮首页
      icon: {
        active: 'https://img01.yzcdn.cn/vant/user-active.png',
        inactive: 'https://img01.yzcdn.cn/vant/user-inactive.png'
      }
    }
  },
  watch: {
    $route(route) {
      this.$store.state.routeName = route.name
    }
  },
  created() {
    this.$store.state.routeName = this.$route.name
  }
}
</script>

<style scoped>
</style>
