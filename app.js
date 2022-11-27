
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require('path');

const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
io.on("connection", (socket) => {
  console.log("connection");
  
  socket.on("chat_message", ({ message, userName }) => {
    console.log("bradcast event to other clients!", message)
    io.emit("chat_update", { message, userName });
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

const {PORT = 5000} = process.env
server.listen(PORT, (err) => {
  if(err){
    console.error(err)
    process.exit(1)
  }
  console.log(`listening on port ${PORT}`);
});

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static("build"));

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
