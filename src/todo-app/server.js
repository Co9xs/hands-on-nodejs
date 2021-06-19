const http = require("http")
const todos = [
  {id: 1, title: "ネーム", completed: false},
  {id: 1, title: "ネーム", completed: true},
]

const server = http.createServer((req, res) => {
  if (req.url === "/api/todos") {
    if (req.method === "GET") {
      res.setHeader("Content-Type", "application/json")
      return res.end(JSON.stringify(todos))
    }
    res.statusCode = 405
  } else {
    res.StatusCode = 404
  }
  res.end()
}).listen(3000)