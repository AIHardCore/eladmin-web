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
      <van-tabbar v-model="active" route active-color="#6B4400" inactive-color="#cdcdcd">
        <!--        <van-tabbar-item badge="3" to="/My">-->
        <van-tabbar-item v-for="(item,index) of bars" :key="index" :to="item.to">
          <span>{{ item.title }}</span>
          <template #icon="props">
            <img :src="props.active ? item.active : item.inactive">
          </template>
        </van-tabbar-item>
      </van-tabbar>
      <!-- /标签导航栏 -->
    </div>
    <div style="height: 80px;background-color: white">
      <p style="background:none;height: 5%;width: 100%;text-align: center;font-size: 40%;margin-bottom: 0px">
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
      bars: [
        {
          title: '道学',
          to: '/Home',
          active: require('../../assets/images/app/tabbar/taiji-active.png'),
          inactive: require('../../assets/images/app/tabbar/taiji.png')
        },
        {
          title: '古科学',
          to: '/Rank',
          active: require('../../assets/images/app/tabbar/wodexiuhang-active.png'),
          inactive: require('../../assets/images/app/tabbar/wodexiuhang.png')
        },
        {
          title: '内丹学',
          to: '/Specials',
          active: require('../../assets/images/app/tabbar/zuogang-active.png'),
          inactive: require('../../assets/images/app/tabbar/zuogang.png')
        },
        {
          title: '我的',
          to: '/My',
          active: require('../../assets/images/app/tabbar/user-active.png'),
          inactive: require('../../assets/images/app/tabbar/user.png')
        }
      ]
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
