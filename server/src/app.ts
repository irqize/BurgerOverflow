import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { port } from "./config";
import fs from 'fs';

// var privateKey  = fs.readFileSync(__dirname +  '/ssl/key.key', 'utf8');
// var certificate = fs.readFileSync(__dirname +  '/ssl/crt.crt', 'utf8');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.json({
    error: false,
  });
});

server.listen(port, () => {
  console.log("⚡️ Started server on port " + port);
});

const roomFull = false;
io.on("connection", socket => {
  console.log('Connection established')
  socket.on("authorization", (mode, password) => {
    console.log('Authorization attempt');
    console.log('Mode: ', mode);
    console.log('Password: ', password);
    if (mode === "client") {
      if (roomFull) return socket.emit('error', 'The room is full');

      socket.emit('joined', 'client')
      socket.join('client');
    }

    if (mode === "host") {
      if (password !== 'password') return socket.emit('error', 'The password is wrong');

      socket.emit('joined', 'host')
      socket.join('host');
    }
  });

  socket.on('data', data => {
    if(socket.rooms.has('client')) {
      console.log(data)
      io.to('host').emit('data', data);
    }
  })
});

io.of('client').on('data', (data) => {
  console.log(data);
})