<template>
  <el-drawer
    :title="title"
    :visible.sync="isVisible"
    :direction="direction"
    size="35%"
  >
    <div class="image-gallery">
      <el-image
        v-for="image in images"
        :key="image.realName"
        :src="baseApi+'/file/图片/' + image.realName"
        style="width: 100px; height: 100px; padding-left: 10px"
        lazy
        @click="selectImg(image.baseApi+'/file/图片/' + image.realName)"
      />
      <div class="pagination">
        <el-button :disabled="currentPage === 1" @click="prevPage">Prev</el-button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <el-button :disabled="currentPage === totalPages" @click="nextPage">Next</el-button>
      </div>

      <div v-if="currentImage" class="fullscreen-image" @click="closeFullscreen">
        <img :src="currentImage" alt="Fullscreen Image" @click.stop="closeFullscreen">
      </div>
    </div>
  </el-drawer>
</template>

<script>

import clipboard from '@/utils/clipboard'
import crudFile from '@/api/tools/localStorage'

export default {
  props: {
    title: String,
    baseApi: String,
    direction: {
      type: String,
      default: 'rtl',
      'modal-append-to-body': true
    }
  },
  data() {
    return {
      images: [], // 存储所有图片数据的数组
      currentPage: 1, // 当前页码
      imagesPerPage: 32, // 每页显示的图片数量
      totalPages: 0, // 总页数
      currentImage: null, // 当前全屏显示的图片
      loading: false, // 加载状态
      isVisible: false,
      currImage: null // 当前选中的图片
    }
  },
  mounted() {
    // 加载图片列表
    this.fetchImages(1)
  },
  methods: {
    // 获取图片数据
    fetchImages(page) {
      this.loading = true
      const data = {
        type: '图片',
        page: page,
        size: this.imagesPerPage
      }
      crudFile.find(data).then(res => {
        this.images = res.content // 假设API返回的数据结构包含 images 字段
        this.totalPages = res.totalPage // 假设API还返回了总页数
        this.loading = false
      }).catch(() => { })
    },
    showFullscreen(imageSrc) {
      this.currentImage = imageSrc
    },
    closeFullscreen() {
      this.currentImage = null
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.fetchImages(this.currentPage)
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.fetchImages(this.currentPage)
      }
    },
    selectImg(data) {
      this.currentImage = data
    },
    copyUrl(data, event) {
      clipboard(data, event)
    }
  }
}
</script>
