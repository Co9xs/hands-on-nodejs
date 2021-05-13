function parseJSONAsync(json) {
  // Promiseインスタンスを返す(この時点ではpending)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // fulfilledになる
        resolve(JSON.parse(json))
      } catch (e) {
        // rejectedになる
        reject(e)
      }
    }, 1000)
  })
}

const toBeFulfilled = parseJSONAsync('{"foo": 1}')
const toBeRejected = parseJSONAsync('不正なJSON')
console.log('************ Pomise生成直後 *****************')
console.log(toBeFulfilled)
console.log(toBeRejected)
setTimeout(() => {
  console.log('************ 1秒後 *****************')
  console.log(toBeFulfilled)
  console.log(toBeRejected)
}, 1000)