<template>
  <div class="rank-container">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-card
        v-for="item in list"
        :key="item"
        style="background: rgba(0, 0, 0, 0);"
        :title="546566"
        desc="描述信息"
        thumb="https://img01.yzcdn.cn/vant/ipad.jpeg"
      />
    </van-list>
  </div>
</template>

<script>
export default {
  name: 'ResultPage',
  props: {},
  data() {
    return {
      indexList: [],
      list: [
      ],
      showSearch: false,
      loading: false,
      finished: false,
      refreshing: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.$store.state.path = this.$route.path
  },
  methods: {
    changeType(data) {
    }
  }
}
</script>

<style scoped>
</style>
