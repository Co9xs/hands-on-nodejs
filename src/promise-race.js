// Promise.race()
// 一つでも解決されるとほかを待たずにその状態になる

function wait(time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

// 最初にfulfilledになる場合
const fulfilledFirst = Promise.race([
  wait(10).then(() => 1),
  wait(30).then(() => 'foo'),
  wait(20).then(() => Promise.reject(new Error('エラー'))),
])
setTimeout(() => {
  console.log(fulfilledFirst)
}, 1000)

// 最初にrejectedになる場合
const rejectedFirst = Promise.race([
  wait(20).then(() => 1),
  wait(30).then(() => 'foo'),
  wait(10).then(() => Promise.reject(new Error('エラー'))),
])
setTimeout(() => {
  console.log(rejectedFirst)
}, 1000)

// Promiseインスタンス以外が含まれる場合
const containsNonPromise = Promise.race([
  wait(20).then(() => 1),
  'foo',
  wait(10).then(() => Promise.reject(new Error('エラー'))),
])
setTimeout(() => {
  console.log(containsNonPromise)
}, 1000)


// 実装例 
// 引数に渡される処理がtimeoutより早く完了しないとエラーになる
function withTimeout(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('timeout error')), timeout)
    })
  ])
}
