const fs = require('fs')
const archiver = require('archiver')

// 输出ZIP文件的路径
const output = fs.createWriteStream('./dist.zip')

// 创建一个zip归档实例
const archive = archiver('zip', {
  zlib: { level: 9 } // 设置压缩级别
})

// 监听所有警告
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn(err)
  } else {
    throw err
  }
})

// 监听错误
archive.on('error', function(err) {
  throw err
})

// 管道归档数据到文件
archive.pipe(output)

// 压缩dist目录中的所有文件
archive.directory('./dist/', false) // false 表示不包含目录自身，只包含目录中的内容

// 归档完成后，完成并关闭文件流
archive.finalize()
