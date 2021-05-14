const fs = require('fs')
const crypto = require('crypto')
function copyFileWithStream(src, dest, callback) {
  fs.createReadStream(src)
  .pipe(crypto.createHash('sha256'))
  .pipe(fs.createWriteStream(dest))
  .on('finish', callback)
}

fs.writeFileSync('sample.txt', 'Hello World')
copyFileWithStream('sample.txt', 'dest.txt', () => console.log('copy finished'))