const http = require("http")

http.request("http://localhost:3000/api/todos", res => {
  let responseData = ""
  console.log(responseData, res.statusCode)
  res.on("data", chunk => responseData += chunk)
  res.on("end", () => console.log("responseData", JSON.parse(responseData)))
}).end()