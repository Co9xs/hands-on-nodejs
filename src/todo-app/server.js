const http = require("http")
const app = require("express")

const todos = [
  {id: 1, title: "ネーム", completed: false},
  {id: 1, title: "ネーム", completed: true},
]

app.get("/api/todos", (req, res) => {
  res.json(todos)
})

app.listen(3000)