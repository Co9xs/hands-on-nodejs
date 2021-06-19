const express = require("express")
let todos = [
  {id: 1, title: "ネーム", completed: false},
  {id: 2, title: "下書き", completed: true},
]
const app = express()

app.get("/api/todos", (req, res) => res.json(todos))
app.listen(3000)