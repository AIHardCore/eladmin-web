import router from '../router/routers'
/* 水印配置 */
// 声明
const watermark = {}

/**
 *
 * @param {要设置的水印的内容} text
 * @param {需要设置水印的容器} container
 */
const setWatermark = (text, container, options) => {
  const id = '1.23452384164.123412415'
  if (container === undefined) {
    return
  }
  const res = {
    fontColor: '#a1a2a5',
    fontSize: 25,
    offsetX: 0,
    offsetY: 0,
    debug: false,
    rows: 2,
    height: 100,
    bgc: '#8EA0E0'
  }

  Object.assign(res, options)

  // 查看页面上有没有，如果有则删除
  if (document.getElementById(id) !== null) {
    const childelement = document.getElementById(id)
    childelement.parentNode.removeChild(childelement)
  }

  const containerWidth = container.offsetWidth // 获取父容器宽
  const containerHeight = container.offsetHeight // 获取父容器高
  container.style.position = 'relative' // 设置布局为相对布局

  // 创建canvas元素(先制作一块背景图)
  const can = document.createElement('canvas')
  can.width = containerWidth / res.rows // 设置每一块的宽度
  can.height = res.height // 高度
  const ctx = can.getContext('2d') // 获取canvas画布
  const textWidth = ctx.measureText(text).width

  if (res.debug) {
    ctx.fillStyle = res.bgc // 设置字体的颜色
    // 根据计算出的字体大小调整填充文本的位置
    ctx.fillRect(0, 0, containerWidth, containerHeight)// 绘制文字
    ctx.beginPath()
    ctx.rect(0, 0, can.width, can.height)
    ctx.strokeStyle = 'black' // 边框颜色
    ctx.lineWidth = 2 // 边框宽度
    ctx.stroke()
  }

  ctx.beginPath()
  ctx.textAlign = 'left' // 文本对齐方式
  ctx.textBaseline = 'Middle' // 文本基线
  ctx.font = res.size + `px Arial`
  ctx.rotate(-20 * Math.PI / 180) // 逆时针旋转π/9
  ctx.fillStyle = res.color
  ctx.fillText(text, can.width / res.rows - textWidth + res.offsetX, can.height + res.offsetY, containerWidth)// 绘制文字

  // 创建一个div元素
  const div = document.createElement('div')
  div.id = id // 设置id
  div.style.pointerEvents = 'none' // 取消所有事件
  div.style.top = '0px'
  div.style.left = '0px'
  div.style.position = 'absolute'
  div.style.width = containerWidth + 'px'
  div.style.height = containerHeight + 'px'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  container.appendChild(div) // 追加到页面

  return id
}

// 该方法只允许调用一次
watermark.set = (text, container, options) => {
  let id = setWatermark(text, container, options)
  let timer = null
  let timer2 = null
  timer = setInterval(() => {
    if (router.app._route.path !== '/Article') {
      window.clearInterval(timer)
      window.clearInterval(timer2)
      return
    }
    if (document.getElementById(id) === null) {
      id = setWatermark(text, container, options)
    }
  }, 500)
  timer2 = setInterval(() => {
    setWatermark(text, container, options)
  }, 3000)
  // 监听页面大小的变化
  window.onresize = () => {
    setWatermark(text, container, options)
  }
}

export default watermark
