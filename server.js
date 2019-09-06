const express = require('express')
const projectRoute = require("./Routes/projectRoute")
const server = express()

server.use(express.json())

function logger(req, res, next) {
    console.log(`DATE: ${new Date().toISOString()} | METHOD: ${req.method} | URL: ${req.url}`)
    next()
}

server.use(logger)
server.use("/projects", projectRoute)

server.get("/", (req, res) => {
    res.send(`<h1> SPRINT CHALLENGE </h1>`)
})

module.exports = server