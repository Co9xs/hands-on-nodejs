function parseJSONAsync (json) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(JSON.parse(json))
      } catch(e) {
        reject(e)
      }
    }, 1000)
  })
}

const cache = {}
function parseJSONAsyncWithCache(json) {
  let cached = cache[json]
  if (!cached) {
    cached = parseJSONAsync(json)
    cache[json] = cached
  }
  return cached
}

parseJSONAsyncWithCache('{"message": "Hello", "to": "World"}')
.then(result => console.log('1回目の結果', result))
.then(() => {
  const promise = parseJSONAsyncWithCache('{"message": "Hello", "to": "World"}')
  console.log('2回目の呼び出し完了')
  return promise
})
.then(result => console.log('2回目の結果', result))
console.log('1回目の呼び出し完了')

async function asyncSum(promiseArray) {
  let sum = 0
  const arr = await Promise.allSettled(promiseArray)
  for (const e of arr) {
    if (e.status === 'fulfilled') {
      sum += e.value
    }
  }
  return sum
}

asyncSum([1,2,3,4].map(e => e % 2 === 0 ? Promise.resolve(e) : Promise.reject(new Error('エラー'))))
.then(console.log)

async function asyncSum2(promiseArray) {
  let sum = 0
  const arr = await Promise.all(promiseArray.map(e => e.catch(() => 0)))
  for (const e of arr) {
    sum += e
  }
  return sum
}

asyncSum2([1,2,3,4].map(e => e % 2 === 0 ? Promise.resolve(e) : Promise.reject(new Error('エラー'))))
.then(console.log)

