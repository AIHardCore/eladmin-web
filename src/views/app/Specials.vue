<template>
  <div class="special-container">
    <ul>
      <li v-for="item of list" :key="item.id">
        <div @click="openSpecial(item.id)">
          <div>
            <van-image :src="item.cover" width="100%" height="250px" fit="fill" />
          </div>
          <div class="special_name">
            <span>【{{ item.name }}系列】</span>
          </div>
          <div class="special_desc van-multi-ellipsis--l2">
            <span>{{ item.desc }}</span>
          </div>
          <div>
            <van-divider dashed />
          </div>
        </div>
      </li>
      <li />
    </ul>
  </div>
</template>

<script>
import crudSpecial from '@/api/app/special'

export default {
  name: 'SpecialPage',
  props: {},
  data() {
    return {
      list: []
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getAll()
  },
  methods: {
    getAll() {
      crudSpecial.list(this.id).then(res => {
        this.list = res
      }).catch(() => { })
    },
    openSpecial(data) {
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].id === data) {
          this.$store.state.special = this.list[i]
          break
        }
      }
      this.$router.push({
        path: '/SpecialInfo', query: { id: data }
      })
    }
  }
}
</script>

<style scoped>
.special-container {
  padding:5px 15px;
  min-height: 100vh; /* 设置最小高度为视口的100% */
  overflow-y: auto; /* 如果内容超出屏幕，可以滚动查看 */
}
.special_name {
  text-align: left;
  font-size: 20px;
  padding: 10px 0px;
}

.special_desc {
  text-align: left;
  font-size: 15px;
}
</style>
