import router from '../router/routers'

/* 水印配置 */
// 声明
const watermark = {}
// 水印配置
const setWatermark = (str) => {
  const id = '1.23452384164.123412415'
  // 移除水印 判断
  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id))
  }
  // 创建画布
  const createCanvas = document.createElement('canvas')
  // 设置canvas画布大小
  createCanvas.width = 120 // 宽度
  createCanvas.height = 130 // 高度

  // 创建Context2D对象作为2D渲染的上下文。
  const Context2D = createCanvas.getContext('2d')
  /* 水印样式调整配置 */
  Context2D.rotate(-20 * Math.PI / 100) // 水印旋转角度
  Context2D.font = '20px Vedana' // 水印文字大小
  Context2D.fillStyle = '#cccccc' // 水印颜色 HEX格式,可使用red 或者rgb格式
  Context2D.textAlign = 'center' // 水印水平位置
  Context2D.textBaseline = 'Middle' // 水印垂直位置
  Context2D.fillText(str, createCanvas.width / 3, createCanvas.height / 2)

  // 创建元素
  const createDiv = document.createElement('div')
  createDiv.id = id
  // 水印默认设置
  createDiv.style.pointerEvents = 'none' // 水印层事件穿透 让水印不阻止交互事件
  createDiv.style.top = '30px' // 水印顶部距离
  createDiv.style.left = '0px' // 水印左侧距离
  createDiv.style.opacity = '0.15' // 水印透明度
  createDiv.style.position = 'fixed' // 水印定位
  createDiv.style.zIndex = '100000' // 水印样式优先显示
  createDiv.style.width = document.documentElement.clientWidth + 'px' // 水印宽度
  createDiv.style.height = document.documentElement.clientHeight - 80 + 'px' // 水印高度
  createDiv.style.background = 'url(' + createCanvas.toDataURL('image/png') + ') left top repeat' // 水印显示(关键代码)
  document.getElementById('article').appendChild(createDiv) // 在指定元素节点的最后一个子节点之后添加节点
  return id
}

// 此方法只允许调用一次
watermark.set = (data) => {
  const id = setWatermark(data.text)
  // 设置间隔
  data.time = setInterval(() => {
    if (router.app._route.path !== '/Article') {
      clearTimeout(data.time)
      return
    }
    if (document.getElementById(id) === null) {
      this.id = setWatermark(data.text)
    }
  }, 1000)
  // 改变大小时执行
  window.onresize = () => {
    setWatermark(data.text)
  }
}

export default watermark
