<template>
  <div ref="scrollContainer" :class="{'fixed-top': isFixed}">
    <form action="onSearch">
      <van-search
        v-model="searchText"
        show-action
        left-icon=""
        placeholder="阿斯顿发射点"
        :background="searchBgr"
        @clear="onClear"
        @search="onSearch"
        @cancel="onCancel"
      >
        <template #action>
          <div style="font-size: 13px; background-color: white;" @click="onSearch">搜索</div>
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
      searchBgr: '#00000060',
      isFixed: false,
      scrollTimeout: null, // 用于存储setTimeout返回的ID
      offsetTop: 0
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
  beforeDestroy() {
    // 移除滚动事件监听
    window.removeEventListener('scroll', this.debouncedHandleScroll)
    // 清除可能还在等待的防抖函数
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout)
    }
  },
  methods: {
    onSearch(val) {
      this.$router.push({
        path: '/Result', query: { key: this.searchText }
      })
    },
    onClear(val) {
      this.searchText = null
    },
    onCancel(val) {
      this.searchText = null
    },
    handleScroll() {
      const scrollTop = window.pageYOffset
      if (scrollTop >= this.offsetTop) {
        // 当页面向下滚动超过元素距离顶部的偏移量时，开始固定位置
        this.isFixed = true
        this.searchBgr = 'rgba(0, 0, 0, 0.5)'
      } else {
        // 当页面向上滚动并且未超过偏移量时，取消固定位置
        this.isFixed = false
        this.searchBgr = '#00000060'
      }
    },
    // 防抖处理函数
    debouncedHandleScroll() {
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout) // 清除上一次的防抖
      }
      // 设置新的防抖
      this.scrollTimeout = setTimeout(this.handleScroll, 200) // 200ms后执行handleScroll
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
  background-color: #00000060;
  border: 5px solid #ffffff;
  border-radius: 10px 0px 0px 10px ;
}
/* 更改搜索框按钮边框和颜色 */
::v-deep .van-search__action {
  background-color: #ffffff;
  border: 5px solid #ffffff;
  border-radius: 0px 10px 10px 0px ;
}
/* 更改搜索框边距 */
::v-deep .van-search--show-action {
  padding-left: 2px;
  padding-right: 2px;
}
::v-deep .van-field__control {
  color: white;
}
</style>
