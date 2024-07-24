<template>
  <div class="layout-container">
    <!--    <div :style="'background-image:url('+ bgri +');'" class="main">-->
    <div class="main">
      <!--      <div v-show="this.$store.state.routeName !== 'My' && this.$store.state.routeName !== 'Auth'"><notice-bar /></div>-->
      <div v-show="this.$store.state.routeName !== 'My' && this.$store.state.routeName !== 'Article' && this.$store.state.routeName !== 'Auth'"><search-bar /></div>
      <!-- 子路由出口 -->
      <router-view />
      <!-- /子路由出口 -->
      <!-- 标签导航栏 -->
      <!--
        route: 开启路由模式
       -->
      <van-tabbar v-model="active" route active-color="#6B4400" inactive-color="#cdcdcd" style="height: 80px">
        <!--        <van-tabbar-item badge="3" to="/My">-->
        <van-tabbar-item v-show="false" to="/Auth">
          <span>授权</span>
        </van-tabbar-item>
        <van-tabbar-item v-for="(item,index) of bars" :key="index" :to="item.to" style="background-color: black;line-height:20px">
          <span style="">{{ item.title }}</span>
          <template #icon="props">
            <img :src="props.active ? item.active : item.inactive" style="height: 30px">
          </template>
        </van-tabbar-item>
      </van-tabbar>
      <!-- /标签导航栏 -->
    </div>
    <div style="height: 100px;">
      <p style="height: 5%;width: 100%;text-align: center;font-size: 40%;padding-top: 5px">
        © 2024 修真界 ⋅
        <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank">粤ICP备2024284744号-1</a>
      </p>
    </div>
  </div>
</template>

<script>
import SearchBar from '@/components/app/search'
import bgri from '@/assets/images/app/bgr.webp'

export default {
  name: 'LayoutIndex',
  components: { SearchBar },
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
      active: '/Home', // 默认高亮首页
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
.layout-container {
  background-color: #EDEDED;
  min-height: 100vh; /* 设置最小高度为视口的100% */
  overflow-y: auto; /* 如果内容超出屏幕，可以滚动查看 */
}
.main {
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
  height: 100%;
}
</style>
