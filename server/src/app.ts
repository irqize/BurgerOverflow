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
  socket.on("authorization", (mode, password) => {
    console.log('-------------------------');
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
      console.log('Authorized as client');

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
      console.log('Authorized as host');
    }
  });

  socket.on("data", (data) => {
    if (socket.rooms.has("client")) {
      io.to("host").emit("data", data);
    }
  });

  socket.on("skipAhead", (skip) => {
    if (socket.rooms.has("client")) {
      io.to("host").emit("skipAhead", skip);
    }
  });

  socket.on('dismiss', () => {
    if (socket.rooms.has("client")) {
      io.to("host").emit("dismiss");
    }
  })

  socket.on('dismiss available', product => {
    if (socket.rooms.has("host")) {
      console.log(product)
      io.to("client").emit("dismiss available", product);
    }
  })

  socket.on("grantedGyro", (bool) => {
    if (socket.rooms.has("client")) {
      io.to("host").emit("grantedGyro", bool);
    }
  })

  socket.on("doneOnboarding", (bool) => {
    if(bool == true) {
      if (socket.rooms.has("host")) {
        io.to("client").emit("doneOnboarding", bool)
      }
    }
  })

  socket.on("endGame", () => {
    if (socket.rooms.has("client"))
    {io.to("host").emit("endGame");}
  })

  socket.on("finishScore", finishScore => {
    if (socket.rooms.has("host")) {
      io.to("client").emit("finishScore", finishScore)
    }
  })

});