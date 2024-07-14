<template>
  <div class="rank-container">
    <van-row type="flex" justify="center" gutter="3" style="margin: 3px 3px;">
      <van-col span="12"><van-button color="#FF3333" block @click="changeType(0)">人气榜</van-button></van-col>
      <van-col span="12"><van-button color="#3366FF" block @click="changeType(1)">推荐榜</van-button></van-col>
    </van-row>
    <van-index-bar :index-list="indexList" style="margin: 0px 3px; background-color: white; border-radius: 10px;height: 100%;">
      <van-cell v-for="item in list" :key="item.id" style="background: rgba(255, 255, 255, 0.1);">
        <van-row @click="openArticle(item.id)">
          <van-col span="1">
            <van-image :src="item.img" width="10" height="10" fit="contain" />
          </van-col>
          <van-col span="1">
            .
          </van-col>
          <van-col span="20">
            <div class="van-ellipsis">{{ item.text }}</div>
          </van-col>
        </van-row>
      </van-cell>
    </van-index-bar>
  </div>
</template>

<script>
import curdRank from '@/api/app/rank'
import shuzi1 from '@/assets/images/app/shuzi1.png'
import shuzi2 from '@/assets/images/app/shuzi2.png'
import shuzi3 from '@/assets/images/app/shuzi3.png'
import shuzi4 from '@/assets/images/app/shuzi4.png'
import shuzi5 from '@/assets/images/app/shuzi5.png'
import shuzi6 from '@/assets/images/app/shuzi6.png'
import shuzi7 from '@/assets/images/app/shuzi7.png'
import shuzi8 from '@/assets/images/app/shuzi8.png'
import shuzi9 from '@/assets/images/app/shuzi9.png'
import shuzi10 from '@/assets/images/app/shuzi10.png'

export default {
  name: 'RankPage',
  props: {},
  data() {
    return {
      indexList: [],
      list: [],
      images: [
        shuzi1,
        shuzi2,
        shuzi3,
        shuzi4,
        shuzi5,
        shuzi6,
        shuzi7,
        shuzi8,
        shuzi9,
        shuzi10
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getRanks(0)
  },
  methods: {
    getRanks(type) {
      curdRank.page(type).then(res => {
        this.list = []
        res.content.forEach((item, index) => {
          this.list.push({ id: item.article.id, img: this.images[index], text: item.article.title })
        })
      }).catch(() => { })
    },
    changeType(data) {
      this.getRanks(data)
    },
    openArticle(data) {
      this.$router.push({
        path: '/Article', query: { id: data }
      })
    }
  }
}
</script>

<style scoped>
.rank-container {
  min-height: 100vh; /* 设置最小高度为视口的100% */
  overflow-y: auto; /* 如果内容超出屏幕，可以滚动查看 */
}
</style>
