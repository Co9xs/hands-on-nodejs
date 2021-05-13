function parseJSONAsync (json, callback) {
  setTimeout(() => {
    try {
      callback(null, JSON.parse(json))
    } catch (error) {
      callback(error)
    }
  }, 1000)
}

const cache = {}
function parseJSONAsyncWithCache(json, callback) {
  const cached = cache[json]
  if (cached) {
    // キャッシュがある場合でも非同期にコールバックを実行する
    setTimeout(() => callback(cached.error, cached.result), 0)
    return 
  }
  parseJSONAsync(json, (error, result) => {
    cache[json] = {error, result}
    callback(error, result)
  })
}

parseJSONAsyncWithCache(
  '{"message": "Hello", "to": "World"}',
  (error, result) => {
    console.log('1回目の結果', error, result)
    // コールバック内で2回目を実行
    parseJSONAsyncWithCache(
      '{"message": "Hello", "to": "World"}',
      (error, result) => {
        console.log('2回めの結果', error, result)
      }
    )
    console.log('2回目の呼び出し終了')
  }
)
console.log('1回目の呼び出し終了')