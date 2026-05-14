import { IncomingMessage, Server as TServer, ServerResponse } from "http";
import { Server } from "socket.io";
import { SocketHandlers } from "./handlers";

export function connectSocket(
  server: TServer<typeof IncomingMessage, typeof ServerResponse>
) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", SocketHandlers);
}
