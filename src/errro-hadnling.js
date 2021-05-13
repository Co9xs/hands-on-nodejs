// try-catchでエラーをキャッチできる
function parseJSONSync(json) {
  try {
    return JSON.parse(json)
  } catch (error) {
    console.log(error)
  }
}

// callback内のエラーはキャッチできない
function parseJSONSyncCallback(json, callback) {
  try {
    setTimeout(() => {
      callback(JSON.parse(json))
    }, 1000)
  } catch (error) {
    console.error(error)
    callback({})
  }
}

// nodejsの規約に沿ったパターン(callbackの引数にerrorを渡す)
function parseJSONAsync (json, callback) {
  setTimeout(() => {
    try {
      callback(null, JSON.parse(json))
    } catch (error) {
      callback(error)
    }
  }, 1000)
}