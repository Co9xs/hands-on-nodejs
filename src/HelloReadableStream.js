const stream = require("stream");
const fs = require('fs')

class HelloReadableStream extends stream.Readable {
  constructor(options) {
    super(options)
    this.languages = ['JavaScript', 'Python', 'Java', 'C#']
  }

  _read(size) {
    console.log('_read()')
    let language
    while ((language = this.languages.shift())) {
      if (!this.push(`Hello, ${language}!\n`)) {
        console.log('読み込み中断')
        return
      }
    }
    console.log('読み込み完了')
    this.push(null)
  }
}

const helloReadableStream = new HelloReadableStream()
helloReadableStream.on('readable', () => {
  console.log('readable')
  let chunk
  while((chunk = helloReadableStream.read()) !== null) {
    console.log(`chunk: ${chunk.toString()}`)
  }
})
.on('end', () => console.log('end'))