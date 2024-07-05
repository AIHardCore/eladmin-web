<template>
  <div>
    <van-notice-bar background="#ffffff" color="#000000" :scrollable="false" style="height: 30px;line-height: 30px;">
      <template #left-icon>
        <van-image :src="img.url" width="30px" height="30px" />
      </template>
      <van-swipe
        vertical
        class="notice-swipe"
        :autoplay="3000"
        :show-indicators="false"
      >
        <van-swipe-item v-for="msg of msgs" :key="msg.id" class="notice-swipe" style="font-size: 12px;text-align: left;">
          <span style="margin-left: 10px;">{{ msg.text }}</span>
        </van-swipe-item>
      </van-swipe>
    </van-notice-bar>
  </div>
</template>

<script>
import laba from '@/assets/images/app/laba.png'

export default {
  name: 'NoticeBar',
  data() {
    return {
      img: { url: laba },
      msgs: [
        { id: 1, text: '内容1' },
        { id: 2, text: '内容内容内容内容2' },
        { id: 3, text: '内容内容3' },
        { id: 4, text: '内容4' },
        { id: 5, text: '内容内容5' },
        { id: 6, text: '内容6' }
      ]
    }
  }
}
</script>

<style scoped>
.notice-swipe {
  height: 30px;
  line-height: 30px;
}
</style>
