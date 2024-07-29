module.exports = {
  accessKey: '', // required
  secretKey: '', // required
  bucket: 'xzj-site', // required
  bucketDomain: 'https://site.sanchuanwenhua.com', // required
  exclude(path) {
    return /logo.*png/.test(path)
  },
  batch: 10,
  mutilThread: 8,
  root: './dist',
  notFoundPage: 'index.html',
  refresh: true,
  refreshIndexThrottle: 100,
  prefetch: false,
  prefetchSortMax: true
}
