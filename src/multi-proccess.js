const {fork, setupMaster} = require('cluster')

console.log('メインプロセス:', process.pid)

setupMaster({exec: `${__dirname}/web-app`})

const cpuCount = require('os').cpus().length
for (let i = 0; i < cpuCount; i++) {
  const sub = fork()
  console.log('サブプロセス:',sub.process.pid)
}