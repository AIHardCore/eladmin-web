<template>
  <div class="main">
    <van-dialog v-model="show" title="登录中..." :show-cancel-button="false" :show-confirm-button="false" />
  </div>
</template>

<script>
import crudLogin from '@/api/app/login'
import { setAppToken } from '@/utils/auth'
import store from '@/store'

export default {
  name: 'AuthPage',
  data() {
    return {
      show: true
    }
  },
  created() {
    this.path = this.$route.name
    const index = window.location.href.indexOf('?')
    const paramStr = window.location.href.substring(index + 1, window.location.href.length)
    const params = paramStr.split('&')
    params.forEach(element => {
      if (element.indexOf('code') >= 0) {
        this.code = element.substring(element.indexOf('=') + 1, element.length)
      }
    })
    if (this.code) {
      this.login()
    } else {
      this.$router.push({
        path: '/'
      })
    }
  },
  methods: {
    login() {
      const data = {
        code: this.code
      }
      crudLogin.login(data).then(res => {
        setAppToken(res.token, true)
        store.dispatch('app/jump', false)
        this.$router.push({
          path: '/'
        })
      }).catch(() => {})
    }
  }
}
</script>
<style scoped>
.main {
  height: 100vh;
  overflow: auto !important;
  min-height: 100vh; /* 设置最小高度为视口的100% */
  overflow-y: auto; /* 如果内容超出屏幕，可以滚动查看 */
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  text-align: center;
  width: 200px;
  height: 150px;
  line-height: 50px;
  background-color: #fff;
}
</style>
