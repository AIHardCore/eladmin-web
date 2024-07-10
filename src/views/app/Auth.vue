<template>
  <router-view />
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
      this.$router.push('/Home')
    }
  },
  methods: {
    async login() {
      const data = {
        code: this.code
      }
      crudLogin.login(data).then(res => {
        setAppToken(res.token, true)
        this.$router.push('/Home')
      }).catch(() => {})
    }
  }
}
</script>
