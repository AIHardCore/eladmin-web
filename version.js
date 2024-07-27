const fs = require('fs')
const path = './package.json'

function getPackageJson() {
  return JSON.parse(fs.readFileSync(path))
}

try {
  const packageJson = getPackageJson()
  const version = packageJson.version
  // 去除前缀 v
  const arr = version.split('.').map(item => {
    const num = Number(item)
    if (isNaN(num)) {
      throw new Error(`Invalid version number part: ${item}`)
    }
    return num
  })

  if (arr[2] < 9) {
    arr[2] += 1
  } else if (arr[1] < 9) {
    arr[1] += 1
    arr[2] = 0
  } else {
    arr[0] += 1
    arr[1] = 0
    arr[2] = 0
  }

  const newVersion = arr.join('.')
  packageJson.version = newVersion

  fs.writeFileSync(path, JSON.stringify(packageJson, null, 2))
  console.log(`Version updated to ${newVersion}`)
} catch (error) {
  console.error('Failed to update package.json:', error)
  process.exit(1)
}
