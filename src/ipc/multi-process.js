'use strict'
const {fork, setupMaster} = require('cluster')

console.log('メイン', process.pid)

setupMaster({exec: `${__dirname}/web-app`})

const cpuCount = require('os').cpus().length
for (let i = 0; i < cpuCount; i++) {
  const sub = fork()
  console.log('サブ', sub.process.pid)
  sub.send(3000)
  sub.on('message',({pid, response}) => {
    console.log(process.pid), `${pid}が${response}を返します`
  })
}