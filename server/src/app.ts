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

const port = Number(process.env.PORT) || config.get("port") as number;
const host = config.get("host") as string;

const app = express();
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
io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.on('join_room', (data) => {
    const { username, room } = data;
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
  });
});


server.listen(port, () => {
  log.info(`Server listing at http://${host}:${port}`);

  connect();

  routes(app);
});
