// imports required for server
import { uniqueNamesGenerator, colors, names } from "unique-names-generator";
import express from "express";
import http from "http";

// import the socket.io library
import { Server } from "socket.io";

// initializing the servers: HTTP as well as Web Socket
const app = express();
const server = http.createServer(app);
const io = new Server(server);


const chatHistory = [];

io.on("connection", function callback (socket) {
  const username = getUniqueUsername();
  console.log('${username} connected');
  socket.emit("receive-messages", {
    chatHistory: getAllMessages(),
    username,
  }); 

  socket.on("post-message", function receiveMessage(data) {
    const { message } = data || { message: "" };
    console.log(message);
    chatHistory.push({
      username,
      message,
    });

    io.emit("receive-messages", {
      chatHistory: getAllMessages(),
    });
  });

  socket.on("disconnect", function () {
    console.log('${username} disconnected');
  });
});

app.use(express.static(process.cwd() + "/frontend"));

app.get("/", (req, res) => {
  return res.sendFile(process.cwd() + "/frontend/index.html");
});

server.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});

function getAllMessages() {
  return Array.from(chatHistory).reverse();
}

function getUniqueUsername() {
  return uniqueNamesGenerator({
    dictionaries: [names, colors],
    length: 2,
    style: "capital",
    separator: " ",
  });
}




 
