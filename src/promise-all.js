// 複数の非同期処理を逐次実行する必要がない場合(順番に意味がない場合)はPromise.allのほうが早い
function asyncFunc() {
  return new Promise(resolve => setTimeout(resolve, 1000))
}

const { performance } = require('perf_hooks');
const start = performance.now()

asyncFunc()
.then(asyncFunc)
.then(asyncFunc)
.then(asyncFunc)
.then(() => console.log('逐次実行所要時間', performance.now() - start))

Promise.all([
  asyncFunc(),
  asyncFunc(),
  asyncFunc(),
  asyncFunc(),
])
.then(() => console.log('並行処理実行時間', performance.now() - start))