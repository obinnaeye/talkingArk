import 'dotenv/config'
import express from "express";
import config from "config";
import swaggerUi from "swagger-ui-express";
import { Server } from "socket.io";
import { createServer } from 'http' ;
import log from "./logger";
import connect from "./db/connect";
import routes from "./routes";
import deserializeAttendee from "./middleware/deserializeUser";
import * as swggerDoc from "../swagger.json";
import { harperSaveMessage } from './harperSaveMessage';
import { harperGetMessages } from './harperGetMessage';
import cors from 'cors';

const port = Number(process.env.PORT) || config.get("port") as number;
const host = config.get("host") as string;
const app = express();
const allowedOrigins = ['http://localhost:3000', 'https://ark-chat.onrender.com'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};
app.use(cors(options));

app.use(deserializeAttendee);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swggerDoc)
);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const CHAT_BOT = 'ChatBot';
let allUsers: any[] = [];
io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.on('join_room', (data) => {
    const { username, room } = data;
    harperGetMessages(room)!
      .then((last100Messages) => {
        socket.emit('last_100_messages', last100Messages);
      })
      .catch((err) => console.log(err));
    socket.join(room);
    let __createdtime__ = Date.now();
    socket.to(room).emit('receive_message', {
      message: `${username} has joined the chat room`,
      username: CHAT_BOT,
      __createdtime__,
    });
    socket.emit('receive_message', {
      message: `Welcome ${username}`,
      username: CHAT_BOT,
      __createdtime__,
    });
    allUsers.push({ id: socket.id, username, room });
    const chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit('chatroom_users', chatRoomUsers);
    socket.emit('chatroom_users', chatRoomUsers);
  });
  socket.on('send_message', (data) => {
    const { message, username, room, __createdtime__ } = data;
    io.in(room).emit('receive_message', data);
    harperSaveMessage(message, username, room, __createdtime__)!
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  });
});


server.listen(port, () => {
  log.info(`Server listing at http://${host}:${port}`);

  connect();

  routes(app);
});
