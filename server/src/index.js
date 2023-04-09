import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import setupRoomControler from './modules/room/controller.js';
import setupRtcControler from './modules/rtc/controller.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  setupRoomControler(io, socket);
  setupRtcControler(io, socket);
});

httpServer.listen(PORT, () => console.log(`[info] Server start on port ${PORT}`));
