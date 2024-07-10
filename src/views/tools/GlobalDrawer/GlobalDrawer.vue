<template>
  <el-drawer
    destroy-on-close
    :title="title"
    :visible.sync="isVisible"
    :direction="direction"
    size="35%"
    @close="handleClose"
  >
    <div class="image-gallery">
      <el-image
        v-for="image in images"
        :key="image.realName"
        :src="baseApi+'/file/图片/' + image.realName"
        style="width: 130px; height: 130px; padding: 6px 6px;cursor:pointer;"
        :class="{ img_action : currentImage === image}"
        lazy
        :preview-src-list="preview"
        @click="selectImg(image, baseApi+'/file/图片/' + image.realName, $event)"
      />
    </div>
    <div class="block">
      <el-pagination
        background
        :current-page="currentPage"
        :page-sizes="[20, 40, 60, 80]"
        :page-size="imagesPerPage"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
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
    onClose: Function,
    url: String,
    direction: {
      type: String,
      default: 'rtl',
      'modal-append-to-body': true
    }
  },
  data() {
    return {
      preview: [],
      images: [], // 存储所有图片数据的数组
      currentPage: 1, // 当前页码
      imagesPerPage: 20, // 每页显示的图片数量
      totalPages: 0, // 总页数
      currentImage: { url: this.url }, // 当前全屏显示的图片
      total: null, // 总数
      loading: false, // 加载状态
      currImage: null, // 当前选中的图片
      isVisible: true
    }
  },
  mounted() {
    // 加载图片列表
    this.fetchImages()
    console.log(this.isVisible)
  },
  methods: {
    // 获取图片数据
    fetchImages() {
      this.loading = true
      const data = {
        type: '图片',
        page: this.currentPage - 1,
        size: this.imagesPerPage
      }
      crudFile.find(data).then(res => {
        this.images = res.content // 假设API返回的数据结构包含 images 字段
        this.totalPages = res.totalPage // 假设API还返回了总页数
        this.total = res.totalElements // 假设API还返回了总页数
        this.loading = false
      }).catch(() => { })
    },
    showFullscreen(imageSrc) {
      this.currentImage = imageSrc
    },
    closeFullscreen() {
      this.currentImage = null
    },
    selectImg(image, url, event) {
      this.currentImage = image
      this.currentImage['url'] = url
      this.preview = []
      this.preview.push(url)
      clipboard(url, event)
      this.handleClose()
    },
    copyUrl(data, event) {
      clipboard(data, event)
    },
    handleSizeChange(val) {
      this.imagesPerPage = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchImages()
    },
    handleClose() {
      this.isVisible = false
      this.onClose(this.currentImage) // 触发传入的onClose回调
    }
  }
}
</script>

<style scoped>
.img_action {
  background-color: dodgerblue;
}
</style>
