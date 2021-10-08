import https from "https";
import cors from "cors";
import { Server } from "socket.io";
import { port } from "./config";
import fs from "fs";

const privateKey  = fs.readFileSync(__dirname +  '/ssl/key.key', 'utf8');
const certificate = fs.readFileSync(__dirname +  '/ssl/crt.crt', 'utf8');

const server = https.createServer({
  key: privateKey,
  cert: certificate
});
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

server.listen(port, () => {
  console.log("⚡️ Started server on port " + port);
});

let roomFull = false;
io.on("connection", (socket) => {
  console.log("Connection established");
  socket.on("authorization", (mode, password) => {
    console.log("Authorization attempt");
    console.log("Mode: ", mode);
    console.log("Password: ", password);
    if (mode === "client") {
      if (roomFull) {
        socket.emit("error", "The room is full");
        return socket.disconnect();
      }

      roomFull = true;
      socket.emit("joined", "client");
      socket.join("client");
      io.to("host").emit("user", "connected");

      socket.on('disconnect', () => {
        roomFull = false;
        io.to("host").emit("user", "disconnected");
      })
    }

    if (mode === "host") {
      if (password !== "password")
        return socket.emit("error", "The password is wrong");

      if(roomFull) io.to("host").emit("user", "connected");
      else io.to("host").emit("user", "disconnected");

      socket.emit("joined", "host");
      socket.join("host");
    }
  });

  socket.on("data", (data) => {
    if (socket.rooms.has("client")) {
      console.log(data);
      io.to("host").emit("data", data);
    }
  });

  socket.on("skipAhead", (skip) => {
    if (socket.rooms.has("client")) {
      console.log("hej" + skip);
      io.to("host").emit("skipAhead", skip);
    }
  })

  socket.on("grantedGyro", (bool) => {
    if (socket.rooms.has("client")) {
      console.log("yay granted gyro")
      io.to("host").emit("grantedGyro", bool);
    }
  })
});

io.of("client").on("data", (data) => {
  console.log(data);
});

io.of("client").on("skipAhead", (skip) => {
  console.log("hejsan" + skip);
});

io.of("client").on("grantedGyro", (bool) => {
  console.log("yay granted gyro")
})