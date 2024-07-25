<template>
  <div class="main" />
</template>

<script>
import crudLogin from '@/api/app/login'
import { setAppToken } from '@/utils/auth'

export default {
  name: 'AuthPage',
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
      location.href = window.location.protocol + '//' + window.location.host + '/#/Home'
    }
  },
  methods: {
    login() {
      const data = {
        code: this.code
      }
      crudLogin.login(data).then(res => {
        setAppToken(res.token, true)
        location.href = window.location.protocol + '//' + window.location.host + '/#/Home'
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
</style>
