<template>
  <div ref="scrollContainer" :class="{'fixed-top': isFixed}">
    <form action="onSearch">
      <van-search
        v-model="searchText"
        show-action
        left-icon=""
        placeholder=""
        :background="searchBgr"
        @clear="onClear"
        @search="onSearch"
        @cancel="onCancel"
      >
        <template #action>
          <div style="font-size: 13px; background-color: black;color: white" @click="onSearch">搜索</div>
        </template>
      </van-search>
    </form>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  components: {},
  props: {},
  data() {
    return {
      searchText: null,
      searchBgr: '#EDEDED',
      isFixed: false,
      scrollTimeout: null, // 用于存储setTimeout返回的ID
      offsetTop: 0,
      pageData: {
        page: 1,
        size: 20,
        title: ''
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // 计算元素距离顶部的偏移量
    this.offsetTop = this.$refs.scrollContainer.offsetTop
    // 添加滚动事件监听
    window.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    onSearch(val) {
      if (this.searchText) {
        this.$router.push({
          path: '/Result', query: { key: this.searchText }
        })
      }
    },
    onClear(val) {
      this.searchText = null
    },
    onCancel(val) {
      this.searchText = null
    },
    handleScroll() {
      const scrollTop = window.pageYOffset
      if (scrollTop > this.offsetTop) {
        // 当页面向下滚动超过元素距离顶部的偏移量时，开始固定位置
        this.isFixed = true
        this.searchBgr = 'rgba(0, 0, 0, 0.5)'
      } else {
        // 当页面向上滚动并且未超过偏移量时，取消固定位置
        this.isFixed = false
        this.searchBgr = '#00000060'
      }
    }
  }
}
</script>

<style scoped>
.fixed-top {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* 确保元素在顶层 */
}

/* 更改搜索框内部颜色 */
::v-deep .van-search__content {
  background-color: #EDEDED;
  border: 5px solid black;
}
/* 更改搜索框按钮边框和颜色 */
::v-deep .van-search__action {
  background-color: black;
  border: 5px solid black;
}
/* 更改搜索框边距 */
::v-deep .van-search--show-action {
  padding-left: 2px;
  padding-right: 2px;
}
::v-deep .van-field__control {
  color: black;
}
.van-search {
 padding: 1px 1px;
}
</style>
