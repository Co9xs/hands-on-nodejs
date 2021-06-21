const { extname } = require("path")
const { readdir, readFile, writeFile, unlink } = require("fs").promises

exports.fetchAll = async () => {
  const files = (await readdir(__dirname))
  .filter(file => extname(file) === ".json")
  return Promise.all(
    files.map(file => readFile(`${__dirname}/${file}`, 'utf8').then(JSON.parse))
  )
}

exports.fetchByCompleted = completed => exports.fetchAll()
.then(all => all.filter(todo => todo.completed === completed))

exports.create = todo => writeFile(`${__dirname}/${todo.id}.json`, JSON.stringify(todo))

exports.update = async (id, update) => {
  const fileName = `${__dirname}/${id}.json`
  return readFile(fileName, 'utf8').then(
    content => {
      const todo = {
        ...JSON.parse(content),
        ...update
      }
      return writeFile(fileName, JSON.stringify(todo)).then(() => todo)
    },
    err => err.code === 'ENOENT' ? null : Promise.reject(err)
  )
}

exports.remove = id => unlink(`${__dirname}/${id}.json`)
  .then(
    () => id,
    err => err.code == 'ENOENT' ? null : Promise.reject(err)
  )